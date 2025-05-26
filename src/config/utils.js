import crypto from 'crypto';

export const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const getTokenExpiration = () => {
    // Token válido por 1 hora
    const now = new Date();
    return new Date(now.getTime() + 60 * 60 * 1000);
};