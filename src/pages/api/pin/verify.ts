// src/pages/api/pin/verify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { pin } = req.body;
  console.log("Verificando PIN:", pin);

  if (!pin) {
    return res.status(400).json({ message: "El PIN es requerido." });
  }

  try {
    // Buscar el PIN usando findUnique, asumiendo que el campo `pin` es único en tu modelo
    const foundPin = await prisma.pin.findUnique({
      where: { pin },
    });

    if (!foundPin) {
      return res.status(404).json({
        message: "El PIN no existe. Por favor, verifica e intenta de nuevo.",
      });
    }

    if (foundPin.used) {
      return res.status(400).json({
        message: "El PIN ya fue usado. Por favor, contacta a tu asesor de Naala.",
      });
    }

    if (foundPin.expiresAt < new Date()) {
      return res.status(400).json({
        message: "El PIN ha expirado. Por favor, contacta a tu asesor de Naala.",
      });
    }

    // Marcar el PIN como usado
    const updatedPin = await prisma.pin.update({
      where: { id: foundPin.id },
      data: { used: true },
    });

    return res.status(200).json({ message: "El PIN es válido.", pin: updatedPin });
  } catch (error) {
    console.error("Error verificando PIN:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
