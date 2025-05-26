import z from 'zod';

const users = z.object({
    id: z.string().uuid({
        message: "El ID debe ser un UUID válido"
    }).optional(),
    email: z.string({
        invalid_type_error: "El email debe ser una cadena de texto"
    }).email({
        message: "Debe ser un email válido"
    }),
    password: z.string({
        invalid_type_error: "La contraseña debe ser una cadena de texto"
    }).min(6, {
        message: "La contraseña debe tener al menos 6 caracteres"
    }),
    first_name: z.string({
        invalid_type_error: "El nombre debe ser una cadena de texto"
    }).min(1, "El nombre es requerido"),
    last_name: z.string({
        invalid_type_error: "El apellido debe ser una cadena de texto"
    }).min(1, "El apellido es requerido"),
    phone: z.string().optional()
});

const userAddress = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    street: z.string().min(1, "La calle es requerida"),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "El estado es requerido"),
    postal_code: z.string().min(1, "El código postal es requerido")
});

export function validacionUsuario(usuario) {
    return users.safeParse(usuario);
}

export function validacionUsuarioParcial(usuario) {
    return users.partial().safeParse(usuario);
}

export function validacionDireccion(direccion) {
    return userAddress.safeParse(direccion);
}