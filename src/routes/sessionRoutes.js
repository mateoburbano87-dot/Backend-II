import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';

const router = Router();

// POST /api/sessions/register - Registrar usuario
router.post('/register', SessionController.register);

// POST /api/sessions/login - Login de usuario
router.post('/login', SessionController.login);

// POST /api/sessions/logout - Logout de usuario
router.post('/logout', SessionController.logout);

// POST /api/sessions/validate - Validar token
router.post('/validate', SessionController.validateToken);

export default router;