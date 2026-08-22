/**
 * Controlador de Eventos
 * Gestiona creación, lectura, actualización y eliminación de eventos
 * Incluye validaciones de propiedad para organizer
 */

import EventService from '../services/eventService.js';

class EventController {
    /**
     * Obtener todos los eventos
     * GET /api/events - Público
     */
    async getAllEvents(req, res) {
        try {
            const { category, isActive, limit = 10, skip = 0 } = req.query;
            
            const filter = {};
            if (category) filter.category = category;
            if (isActive !== undefined) filter.isActive = isActive === 'true';
            
            const events = await EventService.getAllEvents(filter, {
                limit: parseInt(limit),
                skip: parseInt(skip)
            });
            
            res.status(200).json({
                status: 'success',
                payload: events,
                count: events.length
            });
        } catch (error) {
            console.error('Error en getAllEvents:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener evento por ID
     * GET /api/events/:id - Público
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
                    message: error.message
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
            // El organizador se obtiene del usuario autenticado
            const eventData = {
                ...req.body,
                organizer: req.user.id // Usar el ID del usuario autenticado
            };
            
            const newEvent = await EventService.createEvent(eventData);
            
            res.status(201).json({
                status: 'success',
                payload: newEvent,
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            if (error.message.includes('fecha') || error.message.includes('capacidad')) {
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
            
            // Verificar propiedad del evento
            const event = await EventService.getEventById(id);
            
            // Si el usuario es organizer, verificar que sea el propietario
            if (req.user.role === 'organizer' && req.user.id !== event.organizer._id.toString()) {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tenés permisos para modificar este evento'
                });
            }
            
            // Si es user, no puede modificar
            if (req.user.role === 'user') {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tenés permisos para realizar esta acción'
                });
            }
            
            // Admin puede modificar cualquier evento
            const updatedEvent = await EventService.updateEvent(id, updateData);
            
            res.status(200).json({
                status: 'success',
                payload: updatedEvent,
                message: 'Evento actualizado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
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
     * Eliminar evento
     * DELETE /api/events/:id - Solo admin
     */
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar que el usuario sea admin (ya está en el middleware)
            await EventService.deleteEvent(id);
            
            res.status(200).json({
                status: 'success',
                message: 'Evento eliminado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: error.message
                });
            }
            
            console.error('Error en deleteEvent:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener eventos próximos
     * GET /api/events/upcoming - Público
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
     * Obtener eventos por categoría
     * GET /api/events/category/:category - Público
     */
    async getEventsByCategory(req, res) {
        try {
            const { category } = req.params;
            const events = await EventService.getEventsByCategory(category);
            
            res.status(200).json({
                status: 'success',
                payload: events,
                count: events.length
            });
        } catch (error) {
            console.error('Error en getEventsByCategory:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new EventController();