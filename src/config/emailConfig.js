import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail', // o el servicio que uses
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // usar App Password para Gmail
    }
});
