
import { Router } from 'express';
import EventController from '../controllers/eventController.js';
import TicketController from '../controllers/ticketController.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize, isAdmin } from '../middlewares/authorize.middleware.js';

const router = Router();

// Públicas
router.get('/', EventController.getAllEvents);
router.get('/upcoming', EventController.getUpcomingEvents);
router.get('/organizer/:organizerId', EventController.getEventsByOrganizer);
router.get('/:eid/availability', TicketController.checkAvailability);

// Tickets del evento - POST anidado (usuario autenticado)
router.post(
    '/:eid/tickets',
    auth,
    TicketController.createTicketForEvent
);

// Tickets del evento - GET (solo organizer dueño o admin)
router.get(
    '/:eid/tickets',
    auth,
    authorize(['organizer', 'admin']),
    TicketController.getTicketsByEvent
);

// CRUD de eventos - solo organizer o admin
router.post('/', auth, authorize(['organizer', 'admin']), EventController.createEvent);

// PATCH status (draft/published/cancelled/finished)
router.patch(
    '/:id/status',
    auth,
    authorize(['organizer', 'admin']),
    EventController.updateEventStatus
);

// PUT actualizar evento completo
router.put(
    '/:id',
    auth,
    authorize(['organizer', 'admin']),
    EventController.updateEvent
);

// Cancelar evento
router.patch(
    '/:id/cancel',
    auth,
    authorize(['organizer', 'admin']),
    EventController.cancelEvent
);

// Detalle (debe ir al final para no chocar con rutas anteriores)
router.get('/:id', EventController.getEventById);

// Solo admin
router.delete('/:id', auth, isAdmin, EventController.cancelEvent);

export default router;