import { User } from '../models/user.model.js';
import { sendEmail } from '../utils/email.js';

export const recoverPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        // Verificar si el usuario existe
        const user = await User.find
            ({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const token = user.generateRecoveryToken();
        await user.save();

        const emailContent = `
            <h1>Recuperación de contraseña</h1>
            <p>Haga clic en el siguiente enlace para recuperar su contraseña:</p>
        `;
        await sendEmail({
            to: email,
            subject: 'Recuperación de contraseña',
            html: emailContent,
        });
        return res.status(200).json({ message: 'Correo de recuperación enviado' });
    }
    catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}