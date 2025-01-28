import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import CloudConvert from 'cloudconvert';

/**
 * Convierte un archivo DOCX a PDF utilizando CloudConvert.
 * @param inputPath - Ruta del archivo DOCX de entrada.
 * @param outputPath - Ruta donde se guardará el PDF generado.
 */
export const convertDocxToPdf = async (inputPath: string, outputPath: string): Promise<void> => {
    const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY || '');
    if (!fs.existsSync(inputPath)) {
        throw new Error(`El archivo de entrada no existe: ${inputPath}`);
    }
    try {
        const job = await cloudConvert.jobs.create({
            tasks: {
                "import-my-file": {
                    operation: "import/upload",
                },
                "convert-my-file": {
                    operation: "convert",
                    input: "import-my-file",
                    output_format: "pdf",
                },
                "export-my-file": {
                    operation: "export/url",
                    input: "convert-my-file",
                },
            },
        });
        const uploadTask = job.tasks.find((task) => task.name === 'import-my-file');
        if (!uploadTask || !uploadTask.result || !uploadTask.result.form) {
            throw new Error('Error al obtener las instrucciones de carga para CloudConvert');
        }
        const { url, parameters } = uploadTask.result.form;
        const formData = new FormData();
        Object.keys(parameters).forEach((key) => {
            formData.append(key, parameters[key]);
        });
        formData.append('file', fs.createReadStream(inputPath), inputPath);
        formData.append('file', fs.createReadStream(inputPath));
        await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        const completedJob = await cloudConvert.jobs.wait(job.id);
        const exportTask = completedJob.tasks.find((task) => task.name === 'export-my-file');
        if (!exportTask || !exportTask.result || !exportTask.result.files || exportTask.result.files.length === 0) {
            throw new Error('Error al obtener la URL del archivo convertido');
        }
        const fileUrl = exportTask.result.files[0].url;
        if (!fileUrl) {
            throw new Error('La URL del archivo convertido es indefinida');
        }
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            throw new Error('Error al descargar el archivo convertido desde CloudConvert');
        }
        const pdfBuffer = Buffer.from(response.data);
        fs.writeFileSync(outputPath, pdfBuffer);
    } catch (error) {
        console.error('Error durante la conversión:', error);
        throw error;
    }
};
