
import { Router } from 'express';
import TicketController from '../controllers/ticketController.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.use(auth);

router.post('/', TicketController.createTicket);
router.get('/my-tickets', TicketController.getMyTickets);
router.get('/availability/:eid', TicketController.checkAvailability);
router.get('/event/:eid', authorize(['organizer', 'admin']), TicketController.getTicketsByEvent);
router.delete('/:id', TicketController.cancelTicket);

export default router;