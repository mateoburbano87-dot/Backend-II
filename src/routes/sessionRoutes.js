/**
 * Rutas de Sesión
 */

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

router.post(
    '/register',
    validateRequiredFields(['first_name', 'last_name', 'email', 'password']),
    validateEmail,
    validatePassword,
    preventRoleManipulation,
    normalizeEmail,
    SessionController.register
);

router.post('/login', validateLoginFields, SessionController.login);
router.get('/current', auth, SessionController.getCurrentUser);
router.post('/logout', SessionController.logout);

// Rutas de prueba de roles
router.get('/admin/test', auth, authorize(['admin']), (req, res) => {
    res.status(200).json({ status: 'success', message: 'Ruta administrativa accesible', user: req.user });
});

router.get('/organizer/test', auth, authorize(['organizer', 'admin']), (req, res) => {
    res.status(200).json({ status: 'success', message: 'Ruta de organizador accesible', user: req.user });
});

router.post('/validate', SessionController.validateToken);

export default router;