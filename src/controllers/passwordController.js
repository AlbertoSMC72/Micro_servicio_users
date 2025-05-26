export const recoverPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email es requerido'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        const resultado = await recoverPasswordService(email);
        
        res.status(200).json({
            success: true,
            message: 'Si el correo está registrado, recibirás las instrucciones de recuperación'
        });
    } catch (error) {
        console.error('Error en recuperación:', error);
        
        // Por seguridad, no revelar si el email existe o no
        res.status(200).json({
            success: true,
            message: 'Si el correo está registrado, recibirás las instrucciones de recuperación'
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token y nueva contraseña son requeridos'
            });
        }

        // Validar fortaleza de contraseña
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const resultado = await resetPasswordService(token, newPassword);
        
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en reset:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};