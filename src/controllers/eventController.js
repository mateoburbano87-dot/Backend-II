
import EventService from '../services/eventService.js';
import EventDto from '../dto/EventDto.js';

class EventController {
    /**
     * GET /api/events
     * Respuesta con paginación al mismo nivel que status
     */
    async getAllEvents(req, res, next) {
        try {
            const result = await EventService.getEvents(req.query);

            res.status(200).json({
                status: 'success',
                data: EventDto.toResponseList(result.data),
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req, res, next) {
        try {
            const event = await EventService.getEventById(req.params.id);
            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponse(event)
            });
        } catch (error) {
            next(error);
        }
    }

    async createEvent(req, res, next) {
        try {
            const eventData = { ...req.body, organizer: req.user.id };
            const newEvent = await EventService.createEvent(eventData);

            res.status(201).json({
                status: 'success',
                payload: EventDto.toResponse(newEvent),
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req, res, next) {
        try {
            const updatedEvent = await EventService.updateEvent(
                req.params.id,
                req.body,
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponse(updatedEvent),
                message: 'Evento actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/events/:id/status
     * Cambia el status del evento (draft/published/cancelled/finished)
     */
    async updateEventStatus(req, res, next) {
        try {
            const { status } = req.body;
            if (!status) {
                return next(AppError.badRequest('El campo status es requerido'));
            }

            const updatedEvent = await EventService.updateEvent(
                req.params.id,
                { status },
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponse(updatedEvent),
                message: `Evento ${status} exitosamente`
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelEvent(req, res, next) {
        try {
            const cancelledEvent = await EventService.cancelEvent(
                req.params.id,
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponse(cancelledEvent),
                message: 'Evento cancelado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async getUpcomingEvents(req, res, next) {
        try {
            const events = await EventService.getUpcomingEvents();
            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponseList(events)
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventsByOrganizer(req, res, next) {
        try {
            const events = await EventService.getEventsByOrganizer(req.params.organizerId);
            res.status(200).json({
                status: 'success',
                payload: EventDto.toResponseList(events)
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new EventController();