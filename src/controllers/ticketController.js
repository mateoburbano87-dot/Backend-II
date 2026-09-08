
import TicketService from '../services/ticketService.js';

class TicketController {
    /**
     * Crear ticket (inscripción a evento)
     * POST /api/tickets
     */
    async createTicket(req, res) {
        try {
            const { eventId, quantity = 1 } = req.body;
            const userId = req.user.id;

            // Validar campos requeridos
            if (!eventId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El ID del evento es requerido'
                });
            }

            const ticket = await TicketService.createTicket(userId, eventId, quantity);

            res.status(201).json({
                status: 'success',
                payload: ticket,
                message: 'Inscripción confirmada exitosamente'
            });
        } catch (error) {
            // Errores de validación
            if (error.message.includes('Evento no encontrado')) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }

            if (error.message.includes('No hay cupos disponibles')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            if (error.message.includes('Ya tienes una inscripción activa')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            if (error.message.includes('La cantidad debe ser mayor a 0')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            if (error.message.includes('El evento no está disponible para inscripciones')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('Error en createTicket:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener mis tickets
     * GET /api/tickets/my-tickets
     */
    async getMyTickets(req, res) {
        try {
            const userId = req.user.id;
            const tickets = await TicketService.getTicketsByUser(userId);

            res.status(200).json({
                status: 'success',
                payload: tickets,
                count: tickets.length
            });
        } catch (error) {
            console.error('Error en getMyTickets:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Cancelar ticket
     * DELETE /api/tickets/:id
     */
    async cancelTicket(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const cancelledTicket = await TicketService.cancelTicket(id, userId, userRole);

            res.status(200).json({
                status: 'success',
                payload: cancelledTicket,
                message: 'Ticket cancelado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Ticket no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket no encontrado'
                });
            }

            if (error.message.includes('No tenés permisos')) {
                return res.status(403).json({
                    status: 'error',
                    message: error.message
                });
            }

            if (error.message.includes('El ticket ya está cancelado')) {
                return res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('Error en cancelTicket:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener tickets de un evento (solo organizador/admin)
     * GET /api/events/:eid/tickets
     */
    async getTicketsByEvent(req, res) {
        try {
            const { eid } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const tickets = await TicketService.getTicketsByEvent(eid, userId, userRole);

            res.status(200).json({
                status: 'success',
                payload: tickets,
                count: tickets.length
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }

            if (error.message.includes('No tenés permisos')) {
                return res.status(403).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('Error en getTicketsByEvent:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Verificar disponibilidad de cupos
     * GET /api/events/:eid/availability
     */
    async checkAvailability(req, res) {
        try {
            const { eid } = req.params;
            const availability = await TicketService.checkAvailability(eid);

            res.status(200).json({
                status: 'success',
                payload: availability
            });
        } catch (error) {
            if (error.message === 'Evento no encontrado') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Evento no encontrado'
                });
            }

            console.error('Error en checkAvailability:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new TicketController();