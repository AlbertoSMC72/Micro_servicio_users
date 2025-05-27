import {
    getUsuariosService,
    getUsuarioService,
    postUsuarioService,
    deleteUsuarioService,
    authenticateUserService,
    getUserProfileService,
    addUserAddressService,
} from '../services/users.service.js';

import {resetPasswordService} from '../services/resetPasswordService.js';
import { recoverPasswordService } from '../services/recoverPasswordService.js';


export const getUsuariosController = async (req, res) => {
    try {
        const usuarios = await getUsuariosService();
        res.status(200).json({
            success: true,
            data: usuarios,
            count: usuarios.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUsuarioController = async (req, res) => {
    try {
        const { identifier } = req.params; // Puede ser email o UUID
        const usuario = await getUsuarioService(identifier);
        
        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const postUsuarioController = async (req, res) => {
    try {
        const usuario = req.body;
        const resultado = await postUsuarioService(usuario);
        
        res.status(201).json({
            success: true,
            data: resultado,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message.includes('ya está registrado') ? 409 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/* export const putUsuarioController = async (req, res) => {
    try {
        const { identifier } = req.params;
        const usuario = req.body;
        const resultado = await putUsuarioService(usuario, identifier);
        
        res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};*/

export const deleteUsuarioController = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await deleteUsuarioService(id);
        
        res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        const resultado = await authenticateUserService(email, password);
        
        res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export const getProfileController = async (req, res) => {
    try {
        const userId = req.user?.id; // Del middleware de auth
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const profile = await getUserProfileService(userId);
        
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addAddressController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const direccion = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const resultado = await addUserAddressService(userId, direccion);
        
        res.status(201).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

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

        await recoverPasswordService(email);
        
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

