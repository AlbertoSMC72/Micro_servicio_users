import { transporter } from '../config/emailConfig.js';
import { generateResetToken, getTokenExpiration } from '../config/utils.js';

export const recoverPasswordService = async (email) => {
    try {
        // Verificar si el usuario existe
        const usuario = await getUsuarioAuth(email);
        
        if (!usuario[0] || usuario[0].length === 0) {
            throw new Error('Email no registrado');
        }

        const user = usuario[0][0];
        
        // Generar token de recuperación
        const resetToken = generateResetToken();
        const expiresAt = getTokenExpiration();
        
        // Guardar token en la base de datos
        await saveResetToken(user.id, resetToken, expiresAt);
        
        // Enviar correo de recuperación
        await sendRecoveryEmail(email, resetToken, user.first_name);
        
        return { 
            message: 'Instrucciones de recuperación enviadas al correo electrónico',
            success: true 
        };
    } catch (error) {
        throw new Error(`Error al recuperar contraseña: ${error.message}`);
    }
};

export const saveResetToken = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        const consulta = `
            INSERT INTO password_reset_tokens (user_id, token, expires_at) 
            VALUES (?, ?, ?)
        `;
        config
            .execute(consulta, [userId, token, expiresAt])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });
};

export const sendRecoveryEmail = async (email, token, firstName) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Recuperación de Contraseña</h2>
                <p>Hola ${firstName},</p>
                <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Recuperar Contraseña
                    </a>
                </div>
                
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                
                <p><strong>Este enlace expirará en 1 hora.</strong></p>
                
                <p>Si no solicitaste esta recuperación, puedes ignorar este correo.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de recuperación enviado a: ${email}`);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('Error al enviar el correo de recuperación');
    }
};