import nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (mailOptions: MailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false,
    auth: {
      user: "info@urbania-custom.com",
      pass: "UrbaniaInfo2025!!",
    },
    /*
    logger: true, // Habilitar logs detallados
    debug: true, // Habilitar modo debug
    */
  });

  const fullMailOptions = {
    from: process.env.CORPORATE_EMAIL,
    ...mailOptions,
  };

  try {
    await transporter.sendMail(fullMailOptions);
    console.log(`Correo enviado exitosamente a: ${mailOptions.to}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw new Error('No se pudo enviar el correo.');
  }
};
