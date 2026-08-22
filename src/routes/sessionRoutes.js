import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
    validateRequiredFields,
    validateEmail,
    validatePassword,
    preventRoleManipulation,
    normalizeEmail,
    validateLoginFields
} from '../middlewares/validationMiddleware.js';

const router = Router();

// Registro - público
router.post(
    '/register',
    validateRequiredFields(['first_name', 'last_name', 'email', 'password']),
    validateEmail,
    validatePassword,
    preventRoleManipulation,
    normalizeEmail,
    SessionController.register
);

// Login - público
router.post(
    '/login',
    validateLoginFields,
    SessionController.login
);

// Usuario actual - solo autenticados
router.get(
    '/current',
    auth, // 401 si no autenticado
    SessionController.getCurrentUser
);

// Logout - público (elimina cookie)
router.post(
    '/logout',
    SessionController.logout
);

// Ruta administrativa de prueba - solo admin
router.get(
    '/admin/test',
    auth,
    authorize(['admin']), // 403 si no es admin
    (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Ruta administrativa accesible',
            user: req.user
        });
    }
);

// Ruta de organizador de prueba - solo organizer o admin
router.get(
    '/organizer/test',
    auth,
    authorize(['organizer', 'admin']),
    (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Ruta de organizador accesible',
            user: req.user
        });
    }
);

// Validar token - público (debug)
router.post(
    '/validate',
    SessionController.validateToken
);

export default router;