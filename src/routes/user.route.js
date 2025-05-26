import { 
    getUsuariosController, 
    getUsuarioController, 
    postUsuarioController,  
    deleteUsuarioController,
    loginController,
    getProfileController,
    addAddressController,
    recoverPasswordController,
    resetPasswordController
} from '../controllers/user.controller.js';
import { Router } from 'express';
import { verifyJWT } from '../middlewares/http/auth.middleware.js';

const userRouter = Router();

// Rutas públicas
userRouter.post('/register', postUsuarioController);
userRouter.post('/login', loginController);
userRouter.get('/', getUsuariosController);

// IMPORTANTE: Primero las rutas específicas
userRouter.get('/profile/me', verifyJWT, getProfileController);
userRouter.post('/profile/address', verifyJWT, addAddressController);

// DESPUÉS las rutas con parámetros genéricos
userRouter.get('/:identifier', getUsuarioController);
userRouter.delete('/:id', verifyJWT, deleteUsuarioController);

//recuperar contraseña
userRouter.post('/recover', recoverPasswordController);
userRouter.post('/reset-password', resetPasswordController);

export default userRouter;