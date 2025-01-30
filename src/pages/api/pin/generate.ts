import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import Pin from "@/lib/models/Pin";
import { sendEmail } from "@/lib/sendEmail";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { proyecto, modelo, nombre, finca, cedula, telefono, correo } = req.body;

  if (!proyecto || !modelo || !nombre || !finca || !cedula || !telefono || !correo) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await connectToDatabase();

    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // Genera un PIN de 6 dígitos
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas desde ahora

    const newPin = await Pin.create({
      proyecto,
      modelo,
      nombre,
      finca,
      cedula,
      telefono,
      correo,
      pin,
      expiresAt,
    });
    console.log("Pin", pin);
    

    const emailContent = {
      to: correo,
      subject: "Acceso a la personalización de su hogar",
      html: `
        <p>Estimado cliente,</p>
        <p>Reciba un cordial saludo de parte de todo el equipo de Urbania.</p>
        <p>Por este medio, le compartimos el enlace de acceso a la plataforma de personalización de su hogar:</p>
        <p><a href="https://urbania-custom.com/pin" target="_blank">Acceder a la personalización</a></p>
        <p>Para ingresar, el sistema le solicitará el siguiente PIN: <strong>${pin}</strong></p>
        <p>Tenga en cuenta que este PIN es de único uso y tiene una vigencia de 48 horas a partir de la recepción de este correo.</p>
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

    //await sendEmail(emailContent);
    //await sendEmail({ ...emailContent, to: process.env.CORPORATE_EMAIL! });

    return res.status(201).json({ message: "PIN generado exitosamente", pin });
  } catch (error) {
    console.error("Error generando PIN:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
