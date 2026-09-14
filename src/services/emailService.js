
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('⚠️ Variables de email no configuradas. El servicio de email no funcionará.');
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
            port: Number(process.env.MAIL_PORT) || 2525,
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        this.fromEmail = process.env.MAIL_FROM || `Plataforma de Eventos <${process.env.MAIL_USER}>`;
    }

    async sendConfirmationEmail(user, event, ticket) {
        try {
            if (!user?.email || !event?.title || !ticket?.reservationCode) {
                throw new Error('Faltan datos necesarios');
            }

            if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
                console.warn('⚠️ Email no configurado. Omitiendo envío.');
                return { status: 'skipped', message: 'Email no enviado' };
            }

            const mailOptions = {
                from: this.fromEmail,
                to: user.email,
                subject: `✅ Confirmación de inscripción - ${event.title}`,
                html: `
                    <h2>¡Inscripción confirmada!</h2>
                    <p>Hola ${user.first_name}, tu inscripción al evento <strong>${event.title}</strong> fue confirmada.</p>
                    <p><strong>Código de reserva:</strong> ${ticket.reservationCode}</p>
                    <p><strong>Cantidad:</strong> ${ticket.quantity}</p>
                    <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                    <p><strong>Ubicación:</strong> ${event.location}</p>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email enviado: ${info.messageId}`);
            return { status: 'sent', messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error al enviar email:', error.message);
            return { status: 'error', message: error.message };
        }
    }

    async sendCancellationEmail(user, event, ticket) {
        try {
            if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
                return { status: 'skipped', message: 'Email no configurado' };
            }

            const mailOptions = {
                from: this.fromEmail,
                to: user.email,
                subject: `❌ Cancelación de inscripción - ${event.title}`,
                html: `
                    <h2>Inscripción cancelada</h2>
                    <p>Hola ${user.first_name}, tu inscripción a <strong>${event.title}</strong> fue cancelada.</p>
                    <p><strong>Código de reserva:</strong> ${ticket.reservationCode}</p>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email de cancelación enviado: ${info.messageId}`);
            return { status: 'sent', messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error:', error.message);
            return { status: 'error', message: error.message };
        }
    }
}

export default new EmailService();