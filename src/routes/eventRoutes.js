
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
router.get('/:id', EventController.getEventById);

// Protegidas - organizer o admin
router.post('/', auth, authorize(['organizer', 'admin']), EventController.createEvent);
router.put('/:id', auth, authorize(['organizer', 'admin']), EventController.updateEvent);
router.patch('/:id/cancel', auth, authorize(['organizer', 'admin']), EventController.cancelEvent);

// Tickets de un evento - organizer o admin
router.get('/:eid/tickets', auth, authorize(['organizer', 'admin']), TicketController.getTicketsByEvent);

// Solo admin
router.delete('/:id', auth, isAdmin, EventController.cancelEvent);

export default router;