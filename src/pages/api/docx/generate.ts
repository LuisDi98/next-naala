import fs from 'fs-extra';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { createCanvas, loadImage } from "canvas";
import { PDFDocument } from 'pdf-lib';
import { sendEmail } from '@/lib/sendEmail';
import { convertDocxToPdf } from '@/lib/docxToPDF';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { selectedOptions, clientEmail, fecha, finca, modelo, propietario, proyecto, listaAnexosRadio, listaAnexosCheckbox } = req.body;

        console.log("📥 Recibiendo anexos en el backend...");
        console.log("📌 Anexos de Radios:", JSON.stringify(listaAnexosRadio, null, 2));
        console.log("📌 Anexos de Checkboxes:", JSON.stringify(listaAnexosCheckbox, null, 2));

        if (!selectedOptions || !clientEmail || !fecha || !finca || !modelo || !propietario) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // **📝 Definir rutas de archivos**
        const templatePath = path.join(process.cwd(), 'public', 'Naala_contrato.docx');
        const tempDir = '/tmp';
        await fs.ensureDir(tempDir);

        const contractFileName = `${propietario}-Contrato.docx`;
        const pdfFileName = `${propietario}-Contrato.pdf`;
        const finalPdfPath = path.join(tempDir, `final_${pdfFileName}`);
        const filePath = path.join(tempDir, contractFileName);
        const pdfPath = path.join(tempDir, pdfFileName);

        console.log("📌 Cargando plantilla DOCX...");
        const content = await fs.readFile(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // **📝 Llenar plantilla con datos**
        console.log("📝 Insertando datos en el contrato...");

        const modificaciones = Object.entries(selectedOptions as { [key: string]: any[] }).map(([key, options]) => ({
            pregunta: key,
            opciones: options.map((option) => ({
                nombre: option.name,
                precio: `$${option.price.toFixed(2)}`,
            })),
        }));

        const total = modificaciones.reduce((acc, item) => {
            const subtotal = item.opciones.reduce((sum, option) => sum + parseFloat(option.precio.replace('$', '')), 0);
            return acc + subtotal;
        }, 0).toFixed(2);

        // ✅ **Depuración antes de inyectar en el DOCX**
        console.log("🔍 Verificando datos antes de setData:");
        console.log(JSON.stringify({ modificaciones, total, fecha, finca, modelo, propietario }, null, 2));

        // **🔹 Inyectar datos en la plantilla DOCX**
        doc.setData({
            fecha,
            finca,
            modelo,
            propietario,
            modificaciones, // 🔹 Nombre corregido para coincidir con `{#modificaciones}`
            total,
        });

        console.log("✅ Datos inyectados correctamente en la plantilla.");

        // **🔹 Renderizar DOCX**
        doc.render();


        await fs.writeFile(filePath, doc.getZip().generate({ type: 'nodebuffer' }));

        console.log("✅ Contrato DOCX generado correctamente:", filePath);

        // **🔹 Convertir DOCX a PDF**
        console.log(`🔹 Convirtiendo DOCX a PDF en: ${pdfPath}`);
        await convertDocxToPdf(filePath, pdfPath);
        console.log("✅ Conversión a PDF completada correctamente.");

        // **🔹 Procesar imágenes de radio buttons**
        console.log("📌 Procesando imágenes para anexos...");
        const processedRadioImages = await Promise.all(listaAnexosRadio.map(async (imageUrl: string, index: number) => {
            const localPath = path.join(tempDir, `radio_${index}.png`);
            const imageBuffer = await fs.readFile(path.join(process.cwd(), 'public', imageUrl));
            await fs.writeFile(localPath, imageBuffer);
            return localPath;
        }));

        // **🔹 Fusionar imágenes de checkboxes**
        const processedCheckboxImages = await Promise.all(listaAnexosCheckbox.map(async (entry: { base: string; overlays: string[] }, index: number) => {
            const baseImagePath = path.join(process.cwd(), 'public', entry.base);
            const overlayImagePaths = entry.overlays.map((overlay: string) => path.join(process.cwd(), 'public', overlay));

            const mergedImagePath = path.join(tempDir, `merged_${index}.png`);
            console.log(`🔹 Fusionando imágenes para checkbox ${index}...`);

            try {
                // **Cargar la imagen base**
                const baseImage = await loadImage(baseImagePath);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");
                ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

                // **Superponer overlays**
                for (const overlayPath of overlayImagePaths) {
                    const overlayImage = await loadImage(overlayPath);
                    ctx.drawImage(overlayImage, 0, 0, baseImage.width, baseImage.height);
                }

                // **Guardar imagen fusionada**
                const buffer = canvas.toBuffer("image/png");
                await fs.writeFile(mergedImagePath, buffer);
                console.log(`✅ Imagen fusionada correctamente en: ${mergedImagePath}`);
                return mergedImagePath;
            } catch (error) {
                console.error(`❌ Error fusionando imágenes para checkbox ${index}:`, error);
                return null;
            }
        }));

        console.log("✅ Todas las imágenes de los checkboxes han sido procesadas correctamente.");

        // **🔹 Agregar imágenes al PDF final**
        console.log("📂 Agregando imágenes al PDF final...");
        const pdfDoc = await PDFDocument.load(await fs.readFile(pdfPath));
        const imagePaths = [...processedRadioImages, ...processedCheckboxImages];

        for (const imgPath of imagePaths) {
            console.log(`📌 Insertando imagen en el PDF: ${imgPath}`);
            const imgBytes = await fs.readFile(imgPath);
            const image = await pdfDoc.embedPng(imgBytes);

            const page = pdfDoc.addPage();
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();

            // **🔹 Escalar imagen correctamente**
            const scaleFactor = Math.min(pageWidth / image.width, pageHeight / image.height) * 0.85;
            const newWidth = image.width * scaleFactor;
            const newHeight = image.height * scaleFactor;

            page.drawImage(image, {
                x: (pageWidth - newWidth) / 2,
                y: (pageHeight - newHeight) / 2,
                width: newWidth,
                height: newHeight,
            });

            console.log(`✅ Imagen insertada en PDF: ${imgPath}`);
        }

        // **Guardar el PDF final**
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(finalPdfPath, pdfBytes);
        console.log("✅ Imágenes incrustadas en el PDF final.");

        // **🔹 Enviar PDF por correo**
        console.log("📩 Enviando contrato por correo...");
        const emailContent = {
            to: clientEmail,
            subject: `Acceso a su contrato de personalización. FF ${finca}, Proyecto: ${proyecto}`,
            html: `<p>Estimado cliente,</p><p>Adjunto encontrará su contrato con los anexos correspondientes.</p>`,
            attachments: [{ filename: `Contrato-${propietario}.pdf`, path: finalPdfPath }],
        };

        // await sendEmail(emailContent);

        console.log("📩 Enviando el archivo directamente en la respuesta...");
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Contrato-${propietario}.pdf"`);

        const pdfStream = fs.createReadStream(finalPdfPath);
        pdfStream.pipe(res);

    } catch (error: any) {
        console.error("❌ Error generando contrato:", error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message || error });
    }
}
