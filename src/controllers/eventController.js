import EventService from '../services/eventService.js';

class EventController {
    /**
     * Obtener todos los eventos con filtros
     * GET /api/events
     */
    async getAllEvents(req, res) {
        try {
            const { 
                status, 
                category, 
                location, 
                dateFrom, 
                dateTo,
                page = 1,
                limit = 10,
                sort = 'date'
            } = req.query;

            const events = await EventService.getEvents({
                status,
                category,
                location,
                dateFrom,
                dateTo,
                page,
                limit,
                sort
            });

            res.status(200).json({
                status: 'success',
                payload: events
            });
        } catch (error) {
            console.error('Error en getAllEvents:', error);
            
            if (error.message.includes('Estado inválido') || error.message.includes('Categoría inválida')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener evento por ID
     * GET /api/events/:id
     */
    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await EventService.getEventById(id);
            
            res.status(200).json({
                status: 'success',
                payload: event
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }
            
            console.error('Error en getEventById:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Crear nuevo evento
     * POST /api/events - Solo organizer o admin
     */
    async createEvent(req, res) {
        try {
            // El organizador se asigna desde req.user
            const eventData = {
                ...req.body,
                organizer: req.user.id
            };
            
            const newEvent = await EventService.createEvent(eventData);
            
            res.status(201).json({
                status: 'success',
                payload: newEvent,
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            // Errores de validación
            if (error.message.includes('fecha') || 
                error.message.includes('capacidad') || 
                error.message.includes('precio') ||
                error.message.includes('Campos requeridos')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
            
            console.error('Error en createEvent:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Actualizar evento
     * PUT /api/events/:id - Solo organizer propietario o admin
     */
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
            
            const updatedEvent = await EventService.updateEvent(
                id, 
                updateData, 
                userId, 
                userRole
            );
            
            res.status(200).json({
                status: 'success',
                payload: updatedEvent,
                message: 'Evento actualizado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }
            
            if (error.message.includes('No tenés permisos') || 
                error.message.includes('No se puede modificar') ||
                error.message.includes('No se puede publicar') ||
                error.message.includes('Ya está cancelado')) {
                return res.status(403).json({
                    status: 'error',
                    message: error.message
                });
            }
            
            if (error.message.includes('fecha') || error.message.includes('capacidad')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
            
            console.error('Error en updateEvent:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Cancelar evento
     * PATCH /api/events/:id/cancel - Solo organizer propietario o admin
     */
    async cancelEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            
            const cancelledEvent = await EventService.cancelEvent(id, userId, userRole);
            
            res.status(200).json({
                status: 'success',
                payload: cancelledEvent,
                message: 'Evento cancelado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }
            
            if (error.message.includes('No tenés permisos') || 
                error.message.includes('Ya está cancelado') ||
                error.message.includes('No se puede cancelar')) {
                return res.status(403).json({
                    status: 'error',
                    message: error.message
                });
            }
            
            console.error('Error en cancelEvent:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener eventos próximos
     * GET /api/events/upcoming
     */
    async getUpcomingEvents(req, res) {
        try {
            const events = await EventService.getUpcomingEvents();
            
            res.status(200).json({
                status: 'success',
                payload: events,
                count: events.length
            });
        } catch (error) {
            console.error('Error en getUpcomingEvents:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener eventos de un organizador
     * GET /api/events/organizer/:organizerId
     */
    async getEventsByOrganizer(req, res) {
        try {
            const { organizerId } = req.params;
            const events = await EventService.getEventsByOrganizer(organizerId);
            
            res.status(200).json({
                status: 'success',
                payload: events,
                count: events.length
            });
        } catch (error) {
            console.error('Error en getEventsByOrganizer:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new EventController();