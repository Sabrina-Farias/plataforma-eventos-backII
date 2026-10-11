import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_PORT === 465,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
});

export const sendTicketConfirmationEmail = async ({ to, userName, eventTitle, eventDate, reservationCode, quantity }) => {
    try {
        if (!env.MAIL_USER || !env.MAIL_PASS) {
            return;
        }

        const mailOptions = {
            from: env.MAIL_FROM,
            to,
            subject: `Confirmación de inscripción: ${eventTitle}`,
            html: `
                <h2>¡Hola, ${userName}!</h2>
                <p>Tu inscripción ha sido confirmada con éxito.</p>
                <ul>
                    <li><strong>Evento:</strong> ${eventTitle}</li>
                    <li><strong>Fecha:</strong> ${new Date(eventDate).toLocaleDateString()}</li>
                    <li><strong>Código de reserva:</strong> ${reservationCode}</li>
                    <li><strong>Cantidad de entradas:</strong> ${quantity}</li>
                </ul>
                <p>Presentá este código al momento de ingresar.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar email de confirmación:", error.message);
    }
};
