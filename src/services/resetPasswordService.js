import bcrypt from 'bcrypt';

export const validateResetToken = (token) => {
    return new Promise((resolve, reject) => {
        const consulta = `
            SELECT prt.*, u.email, u.first_name 
            FROM password_reset_tokens prt
            JOIN users u ON prt.user_id = u.id
            WHERE prt.token = ? 
            AND prt.expires_at > NOW() 
            AND prt.used = FALSE
        `;
        config
            .execute(consulta, [token])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });
};

export const resetPasswordService = async (token, newPassword) => {
    try {
        // Validar token
        const tokenData = await validateResetToken(token);
        
        if (!tokenData[0] || tokenData[0].length === 0) {
            throw new Error('Token inválido o expirado');
        }

        const tokenInfo = tokenData[0][0];
        
        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar contraseña del usuario
        await updateUserPassword(tokenInfo.user_id, hashedPassword);
        
        // Marcar token como usado
        await markTokenAsUsed(token);
        
        return { 
            message: 'Contraseña actualizada exitosamente',
            success: true 
        };
    } catch (error) {
        throw new Error(`Error al resetear contraseña: ${error.message}`);
    }
};

export const updateUserPassword = (userId, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const consulta = "UPDATE users SET password = ? WHERE id = ?";
        config
            .execute(consulta, [hashedPassword, userId])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });
};

export const markTokenAsUsed = (token) => {
    return new Promise((resolve, reject) => {
        const consulta = "UPDATE password_reset_tokens SET used = TRUE WHERE token = ?";
        config
            .execute(consulta, [token])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });
};