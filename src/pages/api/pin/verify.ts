import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: "El PIN es requerido" });
    }

    try {
      const isValid = pin === "123456"; // Lógica de validación simulada
      if (isValid) {
        res.status(200).json({ valid: true, message: "PIN válido" });
      } else {
        res.status(400).json({ valid: false, message: "PIN inválido" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al verificar el PIN" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
