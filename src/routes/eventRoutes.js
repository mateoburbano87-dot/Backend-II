import { Router } from 'express';
import EventController from '../controllers/eventController.js';
import { auth, authAdmin } from '../middlewares/auth.middleware.js';
import { authorize, isAdmin } from '../middlewares/authorize.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', EventController.getAllEvents);
router.get('/upcoming', EventController.getUpcomingEvents);
router.get('/category/:category', EventController.getEventsByCategory);
router.get('/:id', EventController.getEventById);

// Rutas protegidas - solo organizer o admin
router.post(
    '/',
    auth, // Primero autenticar
    authorize(['organizer', 'admin']), // Luego autorizar
    EventController.createEvent
);

// Actualizar evento - solo organizer propietario o admin
router.put(
    '/:id',
    auth,
    authorize(['organizer', 'admin']),
    EventController.updateEvent
);

// Eliminar evento - solo admin
router.delete(
    '/:id',
    auth,
    isAdmin, // Solo admin puede eliminar
    EventController.deleteEvent
);

export default router;