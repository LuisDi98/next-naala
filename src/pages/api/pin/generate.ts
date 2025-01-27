import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { proyecto, finca, modelo, nombre, cedula, telefono, correo } = req.body;

    if (!proyecto || !finca || !modelo || !nombre || !cedula || !telefono || !correo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
      // Aquí iría la lógica para generar el PIN
      res.status(200).json({ pin: "123456", message: "PIN generado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al generar el PIN" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
