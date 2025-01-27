import fs from 'fs-extra';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { sendEmail } from '@/lib/sendEmail';
import { convertDocxToPdf } from '@/lib/docxToPDF';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        console.log("Generando el docx...");
        const { selectedOptions, clientEmail, fecha, finca, modelo, propietario, proyecto } = req.body;

        if (!selectedOptions || !clientEmail || !fecha || !finca || !modelo || !propietario) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        
        const templatePath = path.join(process.cwd(), 'public', 'Naala_contrato.docx');
        const tempDir = path.join(process.cwd(), 'public', 'temp');
        console.log("templatePath:", templatePath);
        console.log("tempDir:", tempDir);
        console.log("contractFileName:", `${proyecto}-${propietario}-Contrato-Personalizacion.docx`);
        console.log("pdfFileName:", `${proyecto}-${propietario}-Contrato-Personalizacion.pdf`);
        
        console.log("Checkpoint 1");
        
        await fs.ensureDir(tempDir);
        console.log("Checkpoint 2");
        const contractFileName = `${propietario}-Contrato.docx`;
        console.log("Checkpoint 3");
        const pdfFileName = `${propietario}-Contrato.pdf`;
        console.log("Checkpoint 4");
        const filePath = path.join(tempDir, contractFileName);
        console.log("Checkpoint 5");
        const pdfPath = path.join(tempDir, pdfFileName);
        console.log("Checkpoint 6");

        const content = await fs.readFile(templatePath, 'binary');
        console.log("Checkpoint 7");
        const zip = new PizZip(content);
        console.log("Checkpoint 8");
        const doc = new Docxtemplater(zip);
        console.log("Checkpoint 9");
        

        const modificaciones = Object.entries(selectedOptions as { [key: string]: any[] }).map(([key, options]) => ({
            pregunta: key,
            opciones: options.map((option) => ({
                nombre: option.name,
                precio: `$${option.price.toFixed(2)}`,
            })),
        }));

        const total = modificaciones
            .reduce((acc, item) => {
                const subtotal = item.opciones.reduce((sum, option) => sum + parseFloat(option.precio.replace('$', '')), 0);
                return acc + subtotal;
            }, 0)
            .toFixed(2);

        doc.setData({
            fecha,
            finca,
            modelo,
            propietario,
            modificaciones,
            total,
        });
        console.log("Checkpoint 10");
        doc.render();
        console.log("Checkpoint 11");
        await fs.writeFile(filePath, doc.getZip().generate({ type: 'nodebuffer' }));
        console.log("Convertir de docx a pdf");
        // Convertir DOCX a PDF
        await convertDocxToPdf(filePath, pdfPath);

        // Enviar correo con el archivo adjunto
        const emailContent = {
            to: clientEmail,
            subject: `Acceso a su contrato de personalización. FF ${finca}, Proyecto: ${proyecto}`,
            html: `
                <p>Estimado cliente,</p>
                <p>Adjunto encontrará su contrato de personalización.</p>
                <p><strong>Atentamente,<br>Equipo Urbania</strong></p>
                <img src="cid:urbania_signature" alt="Urbania Signature" style="width: auto; height: auto;" />
            `,
            attachments: [
                { filename: pdfFileName, path: pdfPath },
                { filename: 'UrbaniaSignature.jpg', path: path.join(process.cwd(), 'public', 'UrbaniaSignature.png'), cid: 'urbania_signature' },
            ],
        };

        await sendEmail(emailContent);
        emailContent.to = "info@urbania-custom.com";
        await sendEmail(emailContent);

        // Generar la URL de descarga del PDF
        const pdfUrl = `src/temp/${pdfFileName}`;

        // Enviar respuesta con la URL del archivo
        return res.status(200).json({ message: 'Contrato generado exitosamente', filePath: pdfUrl });

        // Opción: eliminar el archivo después de un tiempo usando setTimeout para que el usuario pueda descargarlo
        setTimeout(async () => {
            await fs.unlink(filePath);
            await fs.unlink(pdfPath);
            console.log(`Archivos eliminados: ${filePath} y ${pdfPath}`);
        }, 1000 * 60 * 10); // Eliminar después de 10 minutos

    } catch (error: any) {
        console.error("Error generando contrato:", error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message || error,
        });
    }
}
