import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  preventRoleManipulation,
  normalizeEmail,
} from '../middlewares/validationMiddleware.js';

const router = Router();

// POST /api/sessions/register - Registrar usuario
router.post(
  '/register',
  validateRequiredFields(['first_name', 'last_name', 'email', 'password']),
  validateEmail,
  validatePassword,
  preventRoleManipulation,
  normalizeEmail,
  SessionController.register
);

// POST /api/sessions/login - Login de usuario
router.post('/login', SessionController.login);

// POST /api/sessions/logout - Logout de usuario
router.post('/logout', SessionController.logout);

// POST /api/sessions/validate - Validar token
router.post('/validate', SessionController.validateToken);

export default router;