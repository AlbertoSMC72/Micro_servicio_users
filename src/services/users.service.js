import { 
    getUsuarios, 
    getUsuario, 
    getUsuarioAuth,
    postUsuario, 
    deleteUsuario,
    getUsuarioProfile,
    addUsuarioAddress
} from "../repository/users.repocitories.js";
import { 
    validacionUsuario, 
    validacionDireccion 
} from "../validations/users.validation.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = parseInt(process.env.SALT_ROUNDS_BCRYPT) || 10;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export const getUsuariosService = async () => {
    try {
        const usuarios = await getUsuarios();
        return usuarios[0] || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
};

export const getUsuarioService = async (identifier) => {
    try {
        const usuario = await getUsuario(identifier);
        if (!usuario[0] || usuario[0].length === 0) {
            throw new Error('Usuario no encontrado');
        }
        return usuario[0][0];
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};

export const postUsuarioService = async (usuario) => {
    try {
        const validarUsuario = validacionUsuario(usuario);
        if (!validarUsuario.success) {
            throw new Error(`Datos inválidos: ${validarUsuario.error.issues.map(i => i.message).join(', ')}`);
        }

        let { email, password, first_name, last_name, phone } = usuario;
        
        try {
            await getUsuario(email);
            if (usuario[0] && usuario[0].length > 0) {
                throw new Error('El usuario ya está registrado');
            }
        } catch (error) {
            if (!error.message.includes('no encontrado')) {
                throw error;
            }
        }

        // Hash de la contraseña
        password = await bcrypt.hash(password, saltRounds);
        
        const usuarioRes = await postUsuario(email, password, first_name, last_name, phone);
        
        // Remover la contraseña de la respuesta
        delete usuarioRes.password;
        
        return usuarioRes;
    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
};


export const deleteUsuarioService = async (id) => {
    try {
        const resultado = await deleteUsuario(id);
        return resultado;
    } catch (error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
};

export const authenticateUserService = async (email, password) => {
    try {
        const usuario = await getUsuarioAuth(email);
        
        if (!usuario[0] || usuario[0].length === 0) {
            throw new Error('Credenciales inválidas');
        }

        const user = usuario[0][0];
        const passwordValid = await bcrypt.compare(password, user.password);
        
        if (!passwordValid) {
            throw new Error('Credenciales inválidas');
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                name: `${user.first_name} ${user.last_name}`
            },
            jwtSecret,
            { expiresIn: '24h' }
        );

        // Remover contraseña de la respuesta
        delete user.password;

        return {
            user,
            token,
            message: 'Autenticación exitosa'
        };
    } catch (error) {
        throw new Error(`Error de autenticación: ${error.message}`);
    }
};

export const getUserProfileService = async (userId) => {
    try {
        const profile = await getUsuarioProfile(userId);
        return profile[0] || [];
    } catch (error) {
        throw new Error(`Error al obtener perfil: ${error.message}`);
    }
};

export const addUserAddressService = async (userId, direccion) => {
    try {
        const validarDireccion = validacionDireccion({ ...direccion, user_id: userId });
        
        if (!validarDireccion.success) {
            throw new Error(`Datos de dirección inválidos: ${validarDireccion.error.issues.map(i => i.message).join(', ')}`);
        }

        const { street, city, state, postal_code } = direccion;
        const resultado = await addUsuarioAddress(userId, street, city, state, postal_code);
        
        return resultado;
    } catch (error) {
        throw new Error(`Error al agregar dirección: ${error.message}`);
    }
};