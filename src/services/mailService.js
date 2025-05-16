import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailUser,
    pass: config.mailPass
  }
});

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:8080/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Ecommerce CoderHouse`,
    to: email,
    subject: 'Restablecer contraseña',
    html: `
      <h2>Solicitud de restablecimiento de contraseña</h2>
      <p>Hacé clic en el siguiente enlace para restablecer tu contraseña. Este enlace expira en 1 hora:</p>
      <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
    `
  };

  await transporter.sendMail(mailOptions);
};
