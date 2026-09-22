
import EventRepository from '../repositories/eventRepository.js';
import AppError from '../utils/AppError.js';

class EventService {
    /**
     * Crear un nuevo evento
     */
    async createEvent(eventData) {
        if (eventData.date < new Date()) {
            throw AppError.badRequest('La fecha del evento debe ser futura');
        }

        if (eventData.capacity <= 0) {
            throw AppError.badRequest('La capacidad debe ser mayor a 0');
        }

        if (eventData.price < 0) {
            throw AppError.badRequest('El precio no puede ser negativo');
        }

        const requiredFields = ['title', 'description', 'category', 'date', 'location', 'capacity', 'price'];
        const missingFields = requiredFields.filter(field => !eventData[field]);
        if (missingFields.length > 0) {
            throw AppError.badRequest(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }

        // No permitir que venga organizer desde el body
        delete eventData.organizer;

        return await EventRepository.create(eventData);
    }

    /**
     * Obtener evento por ID
     */
    async getEventById(id) {
        const event = await EventRepository.findById(id);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }
        return event;
    }

    /**
     * Obtener eventos con filtros y paginación
     */
    async getEvents(filters = {}) {
        const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort = 'date' } = filters;

        if (status && !['draft', 'published', 'cancelled', 'finished'].includes(status)) {
            throw AppError.badRequest('Estado inválido');
        }

        if (category && !['conference', 'workshop', 'seminar', 'webinar', 'networking', 'other'].includes(category)) {
            throw AppError.badRequest('Categoría inválida');
        }

        return await EventRepository.findWithFilters({
            status, category, location, dateFrom, dateTo, page, limit, sort
        });
    }

    /**
     * Actualizar evento
     * Incluye validaciones de status (para PATCH /:id/status)
     */
    async updateEvent(id, updateData, userId, userRole) {
        const event = await EventRepository.findById(id);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }

        if (event.status === 'cancelled') {
            throw AppError.forbidden('No se puede modificar un evento cancelado');
        }

        if (event.status === 'finished') {
            throw AppError.forbidden('No se puede modificar un evento finalizado');
        }

        // Permisos
        if (userRole === 'user') {
            throw AppError.forbidden('No tenés permisos para modificar eventos');
        }

        if (userRole === 'organizer') {
            const organizerId = event.organizer._id?.toString() || event.organizer.toString();
            if (organizerId !== userId.toString()) {
                throw AppError.forbidden('No tenés permisos para modificar este evento');
            }
        }

        // Validaciones de fecha
        if (updateData.date && new Date(updateData.date) < new Date()) {
            throw AppError.badRequest('La fecha del evento debe ser futura');
        }

        // Validaciones de status
        if (updateData.status) {
            const validStatuses = ['draft', 'published', 'cancelled', 'finished'];
            if (!validStatuses.includes(updateData.status)) {
                throw AppError.badRequest('Status inválido');
            }

            if (updateData.status === 'published' && event.date < new Date()) {
                throw AppError.badRequest('No se puede publicar un evento con fecha pasada');
            }

            if (updateData.status === 'cancelled') {
                if (event.status === 'cancelled') {
                    throw AppError.conflict('El evento ya está cancelado');
                }
                if (event.status === 'finished') {
                    throw AppError.forbidden('No se puede cancelar un evento finalizado');
                }
            }
        }

        // No permitir cambiar organizer desde el body
        delete updateData.organizer;

        return await EventRepository.update(id, updateData);
    }

    /**
     * Cancelar evento
     */
    async cancelEvent(id, userId, userRole) {
        const event = await EventRepository.findById(id);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }

        if (userRole === 'user') {
            throw AppError.forbidden('No tenés permisos para cancelar eventos');
        }

        if (userRole === 'organizer') {
            const organizerId = event.organizer._id?.toString() || event.organizer.toString();
            if (organizerId !== userId.toString()) {
                throw AppError.forbidden('No tenés permisos para cancelar este evento');
            }
        }

        if (event.status === 'cancelled') {
            throw AppError.conflict('El evento ya está cancelado');
        }

        if (event.status === 'finished') {
            throw AppError.forbidden('No se puede cancelar un evento finalizado');
        }

        return await EventRepository.cancel(id);
    }

    /**
     * Obtener eventos próximos
     */
    async getUpcomingEvents() {
        return await EventRepository.findUpcomingEvents();
    }

    /**
     * Obtener eventos por organizador
     */
    async getEventsByOrganizer(organizerId) {
        return await EventRepository.findByOrganizer(organizerId);
    }
}

export default new EventService();