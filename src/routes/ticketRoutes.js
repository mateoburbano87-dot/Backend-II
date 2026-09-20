
import { Router } from 'express';
import TicketController from '../controllers/ticketController.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.use(auth);

// POST /api/tickets (compatibilidad)
router.post('/', TicketController.createTicket);

// Mis tickets
router.get('/my-tickets', TicketController.getMyTickets);

// Disponibilidad
router.get('/availability/:eid', TicketController.checkAvailability);

// Tickets de un evento (organizer/admin)
router.get('/event/:eid', authorize(['organizer', 'admin']), TicketController.getTicketsByEvent);

// PATCH cancelar (según el documento)
router.patch('/:tid/cancel', TicketController.cancelTicket);

// DELETE (compatibilidad)
router.delete('/:id', TicketController.cancelTicket);

export default router;