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
        const { selectedOptions, clientEmail, fecha, finca, modelo, propietario, proyecto } = req.body;
        if (!selectedOptions || !clientEmail || !fecha || !finca || !modelo || !propietario) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        const templatePath = path.join(process.cwd(), 'public', 'Naala_contrato.docx');
        const tempDir = '/tmp';        
        await fs.ensureDir(tempDir);
        const contractFileName = `${propietario}-Contrato.docx`;
        const pdfFileName = `${propietario}-Contrato.pdf`;
        const filePath = path.join(tempDir, contractFileName);
        const pdfPath = path.join(tempDir, pdfFileName);
        console.log("DEBUG PDF: pdfPath: ", pdfPath);
        const content = await fs.readFile(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);
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
        doc.render();
        await fs.writeFile(filePath, doc.getZip().generate({ type: 'nodebuffer' }));
        await convertDocxToPdf(filePath, pdfPath);
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
        return res.status(200).json({ message: 'Contrato generado exitosamente', filePath: pdfFileName });
    } catch (error: any) {
        console.error("Error generando contrato:", error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message || error,
        });
    }
}
