import config from '../config/config.js';

export const getUsuarios = () =>
    new Promise((resolve, reject) => {
        const consulta = "SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE 1=1";
        config
            .execute(consulta)
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });

export const getUsuario = (identifier) =>
    new Promise((resolve, reject) => {
        const consulta = "SELECT * FROM user_service.users where email = ?";
        config
            .execute(consulta, [identifier])
            .then((resultados) => {
                if (resultados.length > 0) {
                    resolve(resultados[0]);
                } else {
                    reject({ message: "Usuario no encontrado" });
                }
            })
            .catch((error) => reject(error));
    });

export const getUsuarioAuth = (email) =>
    new Promise((resolve, reject) => {
        const consulta = "SELECT id, email, password, first_name, last_name FROM users WHERE email = ?";
        config
            .execute(consulta, [email])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });

export const postUsuario = (email, password, first_name, last_name, phone) =>
    new Promise((resolve, reject) => {
        const consulta = "CALL RegisterUser(?, ?, ?, ?, ?)";
        config
            .execute(consulta, [email, password, first_name, last_name, phone])
            .then((resultados) => {
                if (resultados[0] && resultados[0][0]) {
                    resolve(resultados[0][0]);
                } else {
                    reject({ message: "No se pudo crear el usuario" });
                }
            })
            .catch((error) => reject(error));
    });

export const deleteUsuario = (id) =>
    new Promise((resolve, reject) => {
        const consulta = "DELETE FROM users WHERE id = ?";
        config
            .execute(consulta, [id])
            .then((resultados) => {
                if (resultados.affectedRows > 0) {
                    resolve({ message: "Usuario eliminado exitosamente" });
                } else {
                    reject({ message: "Usuario no encontrado" });
                }
            })
            .catch((error) => reject(error));
    });

export const getUsuarioProfile = (userId) =>
    new Promise((resolve, reject) => {
        const consulta = "CALL GetUserProfile(?)";
        config
            .execute(consulta, [userId])
            .then((resultados) => resolve(resultados))
            .catch((error) => reject(error));
    });

export const addUsuarioAddress = (userId, street, city, state, postal_code) =>
    new Promise((resolve, reject) => {
        const consulta = "CALL AddUserAddress(?, ?, ?, ?, ?)";
        config
            .execute(consulta, [userId, street, city, state, postal_code])
            .then((resultados) => resolve(resultados[0][0]))
            .catch((error) => reject(error));
    });