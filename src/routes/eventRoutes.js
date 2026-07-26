import { Router } from 'express';
import EventController from '../controllers/eventController.js';

const router = Router();

// GET /api/events - Obtener todos los eventos
router.get('/', EventController.getAllEvents);

// GET /api/events/upcoming - Obtener eventos próximos
router.get('/upcoming', EventController.getUpcomingEvents);

// GET /api/events/category/:category - Obtener eventos por categoría
router.get('/category/:category', EventController.getEventsByCategory);

// GET /api/events/:id - Obtener evento por ID
router.get('/:id', EventController.getEventById);

// POST /api/events - Crear nuevo evento
router.post('/', EventController.createEvent);

// PUT /api/events/:id - Actualizar evento
router.put('/:id', EventController.updateEvent);

// DELETE /api/events/:id - Eliminar evento
router.delete('/:id', EventController.deleteEvent);

export default router;