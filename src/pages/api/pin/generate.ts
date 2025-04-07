// src/pages/api/pin/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { sendEmail } from "@/lib/sendEmail";
import path from "path";

function generarPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generarPinUnico(maxIntentos = 10): Promise<string> {
  let pin: string;
  for (let i = 0; i < maxIntentos; i++) {
    pin = generarPin();
    // Verifica si el PIN ya existe
    const existe = await prisma.pin.findUnique({ where: { pin } });
    if (!existe) {
      return pin;
    }
  }
  throw new Error("No se pudo generar un PIN único tras varios intentos");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=> req.body in /api/pin/generate', req.body);

  
  // Solo se aceptan métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  
  // Verifica que exista un body
  if (!req.body) {
    return res.status(400).json({ error: 'No se envió información en el body' });
  }
  
  // Desestructuramos el body y validamos los campos necesarios
  const { proyecto, modelo, nombre, finca, cedula, telefono, correo } = req.body;

  if (!proyecto || !modelo || !nombre || !finca || !cedula || !telefono || !correo) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {

    const pinUnico = await generarPinUnico();
    const expiresAt = new Date(Date.now() + 720 * 60 * 60 * 1000); // 48 horas desde ahora

    // Intentamos crear el registro en la base de datos
    const newPin = await prisma.pin.create({
      data: {

        proyecto,
        modelo,
        nombre,
        finca,
        cedula,
        telefono,
        correo,
        pin: pinUnico,
        expiresAt,
        used: false,
      },
    });

    console.log('=> newPin:', newPin);
    

    const emailContent = {
      to: correo,
      subject: "Acceso a la personalización de su hogar",
      html: `
        <p>Estimado cliente,</p>
        <p>Reciba un cordial saludo de parte de todo el equipo de Urbania.</p>
        <p>Por este medio, le compartimos el enlace de acceso a la plataforma de personalización de su hogar:</p>
        <p><a href="https://urbania-custom.com/pin" target="_blank">Acceder a la personalización</a></p>
        <p>Para ingresar, el sistema le solicitará el siguiente PIN: <strong>${newPin.pin}</strong></p>
        <p>Tenga en cuenta que este PIN es de único uso y tiene una vigencia de 24 horas a partir de la recepción de este correo.</p>
        <p>Si tiene alguna consulta o requiere asistencia, no dude en ponerse en contacto con nosotros.</p>
        <p>Atentamente,<br>Equipo Urbania</p>
        <br />
        <a href="mailto:personalizaciones@urbania.cr" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Contactar Soporte
        </a>
        <br />
        <img src="cid:urbania_signature" alt="Urbania Signature" style="width: auto; height: auto;" />
        
      `, attachments: [
          { filename: 'UrbaniaSignature.jpg', path: path.join(process.cwd(), 'public', 'UrbaniaSignature.png'), cid: 'urbania_signature' },
        ],
    };

    await sendEmail(emailContent);
    await sendEmail({ ...emailContent, to: process.env.CORPORATE_EMAIL! });

    return res.status(201).json(newPin);
  } catch (error: any) {
    console.error('Error en /api/pin/generate:', error);
    return res.status(500).json({ error: 'Error al crear el PIN' });
  }
}
