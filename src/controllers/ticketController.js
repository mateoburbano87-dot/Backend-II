/**
 * Controlador de Tickets
 * Solo coordina request/response. Usa DTO.
 */

import TicketService from '../services/ticketService.js';
import TicketDto from '../dto/TicketDto.js';
import AppError from '../utils/AppError.js';

class TicketController {
    async createTicket(req, res, next) {
        try {
            const { eventId, quantity = 1 } = req.body;
            if (!eventId) {
                return next(AppError.badRequest('El ID del evento es requerido'));
            }

            const ticket = await TicketService.createTicket(req.user.id, eventId, quantity);

            res.status(201).json({
                status: 'success',
                payload: TicketDto.toResponse(ticket),
                message: 'Inscripción confirmada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyTickets(req, res, next) {
        try {
            const tickets = await TicketService.getTicketsByUser(req.user.id);
            res.status(200).json({
                status: 'success',
                payload: TicketDto.toResponseList(tickets)
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelTicket(req, res, next) {
        try {
            const cancelled = await TicketService.cancelTicket(
                req.params.id,
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: 'success',
                payload: TicketDto.toResponse(cancelled),
                message: 'Ticket cancelado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async getTicketsByEvent(req, res, next) {
        try {
            const tickets = await TicketService.getTicketsByEvent(
                req.params.eid,
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: 'success',
                payload: TicketDto.toResponseList(tickets)
            });
        } catch (error) {
            next(error);
        }
    }

    async checkAvailability(req, res, next) {
        try {
            const availability = await TicketService.checkAvailability(req.params.eid);
            res.status(200).json({
                status: 'success',
                payload: availability
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TicketController();