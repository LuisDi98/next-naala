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

        // 📌 Procesar imágenes como PDFs desde `public/`
        for (const imgPath of listaAnexosRadio) {
            console.log(`📌 Insertando páginas desde PDF: ${imgPath}.pdf`);

            try {
                // 📌 Construir la ruta absoluta del archivo en el sistema de archivos
                const pdfImgPath = path.join(process.cwd(), 'public', imgPath + '.pdf');
                console.log("pdfImgPath de public es: ", pdfImgPath);

                // 📌 Leer el archivo directamente en el servidor
                const imgPdfBytes = await fs.readFile(pdfImgPath);
                const imgPdf = await PDFDocument.load(imgPdfBytes);

                // 📌 Copiar páginas al documento final
                const copiedPages = await pdfDoc.copyPages(imgPdf, imgPdf.getPageIndices());
                copiedPages.forEach((page) => pdfDoc.addPage(page));

                console.log(`✅ Páginas insertadas desde: ${pdfImgPath}`);
            } catch (error) {
                console.error(`❌ Error insertando páginas desde ${imgPath}.pdf:`, error);
            }
        }
        

        // 📌 Procesar imágenes PNG
        for (const imgPath of processedCheckboxImages) {
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
            page.setHeight(newHeight+50);
            page.drawImage(image, {
                x: (pageWidth - newWidth) / 2,
                y: 25,
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
            html: `
                <p>Estimado cliente,</p>
                <p>Reciba un cordial saludo de parte de todo el equipo de Urbania.</p>
                <p>Por este medio, le compartimos el documento donde podrá revisar y firmar su contrato de personalización.</p>
                <p><strong>Importante:</strong> Si el contrato no se encuentra firmado de manera digital o escaneado con firma de puño y letra, no se podrá proceder con la personalización de su hogar Además, recordar no responder a este correo pues no se obtendrá respuesta.</p>
                <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
                <p style="font-size: 16px; font-weight: 500; text-align: center;">
                Favor enviar la transferencia a la siguiente cuenta en dolares:
                </p>
                <div style="border: 1px solid #ccc; border-radius: 10px; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; background-color: #f9f9f9;">
                <span style="color: #007bff;">IBAN: CR21010200009317285965</span> <br>
                <span style="color: #007bff;">BAC: 931728596</span>
                </div>
                <p style="font-size: 16px; font-weight: 500; text-align: center; margin-top: 15px;">
                Y envíe el comprobante al correo:
                </p>
                <p style="font-size: 18px; font-weight: bold; text-align: center; color: #28a745;">
                <a href="mailto:lcastro@urbania.cr" style="text-decoration: none; color: #28a745;">
                    mfernandez@urbania.cr
                <p style="font-size: 18px; font-weight: bold; text-align: center; color: #28a745;">
                <a href="mailto:clientes@urbania.cr" style="text-decoration: none; color: #28a745;">
                    clientes@urbania.cr
                </a>
                </p>
                <p>Si tiene alguna consulta o requiere asistencia, no dude en ponerse en contacto a:</p>
                </a>
                <p style="font-size: 18px; font-weight: bold; text-align: center; color: #007bff;">
                <a href="mailto:personalizaciones@urbania.cr" style="text-decoration: none; color: #007bff;">
                    personalizaciones@urbania.cr
                </a>
                </p>
                <p><strong>Atentamente,</strong></p>
                <p><strong>Equipo Urbania,<strong></p>
                <img src="cid:urbania_signature" alt="Urbania Signature" style="width: auto; height: auto;" />
            `,
            attachments: [
                { filename: `Contrato-${propietario}.pdf`, path: finalPdfPath },
                { filename: 'UrbaniaSignature.jpg', path: path.join(process.cwd(), 'public', 'UrbaniaSignature.png'), cid: 'urbania_signature' },
            ],
        };

        await sendEmail(emailContent);
        await sendEmail({ ...emailContent, to: "personalizaciones@urbania.cr" });

        
        const sanitizedFileName = encodeURIComponent(`Contrato-${propietario}.pdf`).replace(/%20/g, '_');
        console.log(`📄 Nombre del archivo sanitizado: ${sanitizedFileName}`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);
        console.log("📩 Enviando el archivo directamente en la respuesta...");
        const pdfStream = fs.createReadStream(finalPdfPath);
        pdfStream.pipe(res);

    } catch (error: any) {
        console.error("❌ Error generando contrato:", error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message || error });
    }
}
