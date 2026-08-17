/**
 * Rutas de Sesión
 */

import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';
import { auth } from '../middlewares/auth.middleware.js';
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  preventRoleManipulation,
  normalizeEmail,
  validateLoginFields,
} from '../middlewares/validationMiddleware.js';

const router = Router();

/**
 * POST /api/sessions/register - Registro de usuario
 * Usa la estrategia register de Passport
 * Las validaciones previas se mantienen para mayor seguridad
 */
router.post(
  '/register',
  validateRequiredFields(['first_name', 'last_name', 'email', 'password']),
  validateEmail,
  validatePassword,
  preventRoleManipulation,
  normalizeEmail,
  SessionController.register
);

/**
 * POST /api/sessions/login - Login de usuario
 * Usa la estrategia login de Passport
 */
router.post(
  '/login',
  validateLoginFields,
  SessionController.login
);

/**
 * GET /api/sessions/current - Obtener usuario autenticado
 * Protegida con el middleware auth de Passport
 */
router.get(
  '/current',
  auth,
  SessionController.getCurrentUser
);

/**
 * POST /api/sessions/logout - Cerrar sesión
 * No requiere autenticación
 */
router.post(
  '/logout',
  SessionController.logout
);

/**
 * POST /api/sessions/validate - Validar token
 * Para debugging
 */
router.post(
  '/validate',
  SessionController.validateToken
);

export default router;