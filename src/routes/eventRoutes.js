import { Router } from 'express';
import EventController from '../controllers/eventController.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize, isAdmin } from '../middlewares/authorize.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', EventController.getAllEvents);
router.get('/upcoming', EventController.getUpcomingEvents);
router.get('/:id', EventController.getEventById);
router.get('/organizer/:organizerId', EventController.getEventsByOrganizer);

// Rutas protegidas - solo organizer o admin
router.post(
    '/',
    auth,
    authorize(['organizer', 'admin']),
    EventController.createEvent
);

// Actualizar evento - solo organizer propietario o admin
router.put(
    '/:id',
    auth,
    authorize(['organizer', 'admin']),
    EventController.updateEvent
);

// Cancelar evento - solo organizer propietario o admin
router.patch(
    '/:id/cancel',
    auth,
    authorize(['organizer', 'admin']),
    EventController.cancelEvent
);

// Eliminar evento - solo admin
router.delete(
    '/:id',
    auth,
    isAdmin,
    EventController.cancelEvent // Reutilizamos cancelar en lugar de eliminar
);

export default router;