import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fileName } = req.query;
    
    if (!fileName || typeof fileName !== "string") {
        return res.status(400).json({ error: "Falta el nombre del archivo." });
    }

    const filePath = path.join('/tmp', fileName); // Asegurar que está en /tmp
    console.log("📂 Intentando servir archivo:", filePath);

    // Verificar si el archivo realmente existe antes de enviarlo
    if (!fs.existsSync(filePath)) {
        console.error(`❌ El archivo no existe en el servidor: ${filePath}`);
        return res.status(404).json({ error: "El archivo no está disponible en el servidor." });
    }

    console.log("✅ Archivo encontrado. Enviando...");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
