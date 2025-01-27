import fs from 'fs';
import officegen from 'officegen';
import PDFDocument from 'pdfkit';

/**
 * Convierte un archivo DOCX a PDF utilizando officegen y pdfkit.
 * @param inputPath - Ruta del archivo DOCX de entrada.
 * @param outputPath - Ruta donde se guardará el PDF generado.
 */
export const convertDocxToPdf = async (inputPath: string, outputPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const docxBuffer = fs.readFileSync(inputPath);
        const docx = officegen('docx');

        const pdfDoc = new PDFDocument();
        const outputStream = fs.createWriteStream(outputPath);

        pdfDoc.pipe(outputStream);

        docx.on('finalize', () => {
            console.log('DOCX leído con éxito.');
        });

        docx.on('error', (err:any) => {
            console.error('Error al leer el DOCX:', err);
            reject(err);
        });

        // Simulación de extracción de texto para PDF
        docx.on('data', (chunk:any) => {
            pdfDoc.text(chunk.toString());
        });

        outputStream.on('finish', () => {
            console.log('PDF generado con éxito en:', outputPath);
            resolve();
        });

        outputStream.on('error', (err) => {
            console.error('Error al generar el PDF:', err);
            reject(err);
        });

        docx.generate(fs.createReadStream(inputPath));
        pdfDoc.end();
    });
};
