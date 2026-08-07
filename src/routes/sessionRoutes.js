import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  preventRoleManipulation,
  normalizeEmail,
  validateLoginFields,
} from '../middlewares/validationMiddleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Rutas de autenticación y sesión
 * Todas las rutas están bajo /api/sessions
 */

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
router.post(
  '/login',
  validateLoginFields,
  SessionController.login
);

// GET /api/sessions/current - Obtener usuario autenticado (protegida)
router.get(
  '/current',
  auth, // Middleware de autenticación
  SessionController.getCurrentUser
);

// POST /api/sessions/logout - Logout de usuario
router.post(
  '/logout',
  SessionController.logout
);

// POST /api/sessions/validate - Validar token (para debugging)
router.post(
  '/validate',
  SessionController.validateToken
);

export default router;