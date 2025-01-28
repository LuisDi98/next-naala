import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { fileName } = req.query;
    if (!fileName) {
        return res.status(400).json({ error: "Falta el nombre del archivo" });
    }

    const tempDir = "/tmp";
    const filePath = path.join(tempDir, fileName as string);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Configurar la respuesta para descargar el archivo
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
