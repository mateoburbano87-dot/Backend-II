import EventRepository from '../repositories/eventRepository.js';

class EventService {
    /**
     * Crea un nuevo evento
     * Valida reglas de negocio
     */
    async createEvent(eventData) {
        try {
            // Validar que la fecha sea futura
            if (eventData.date < new Date()) {
                throw new Error('La fecha del evento debe ser futura');
            }

            // Validar capacidad
            if (eventData.capacity <= 0) {
                throw new Error('La capacidad debe ser mayor a 0');
            }

            // Validar precio
            if (eventData.price < 0) {
                throw new Error('El precio no puede ser negativo');
            }

            // Validar campos requeridos
            const requiredFields = ['title', 'description', 'category', 'date', 'location', 'capacity', 'price'];
            const missingFields = requiredFields.filter(field => !eventData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
            }

            // El organizer se asigna desde req.user, no debe venir del body
            if (eventData.organizer && typeof eventData.organizer === 'string') {
                // Si viene del body, lo ignoramos y usamos el de req.user
                delete eventData.organizer;
            }

            // Crear evento
            return await EventRepository.create(eventData);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene evento por ID
     */
    async getEventById(id) {
        try {
            const event = await EventRepository.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }
            return event;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene eventos con filtros y paginación
     */
    async getEvents(filters = {}) {
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
            } = filters;

            // Validar que los filtros sean válidos
            if (status && !['draft', 'published', 'cancelled', 'finished'].includes(status)) {
                throw new Error('Estado inválido');
            }

            if (category && !['conference', 'workshop', 'seminar', 'webinar', 'networking', 'other'].includes(category)) {
                throw new Error('Categoría inválida');
            }

            // Construir query
            const query = {};
            if (status) query.status = status;
            if (category) query.category = category;
            if (location) query.location = { $regex: location, $options: 'i' };
            if (dateFrom || dateTo) {
                query.date = {};
                if (dateFrom) query.date.$gte = new Date(dateFrom);
                if (dateTo) query.date.$lte = new Date(dateTo);
            }

            // Obtener eventos
            const result = await EventRepository.getWithFilters({
                ...query,
                page: parseInt(page),
                limit: parseInt(limit),
                sort
            });

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualiza un evento
     * Validaciones de negocio y permisos
     */
    async updateEvent(id, updateData, userId, userRole) {
        try {
            // 1. Verificar que el evento exista
            const event = await EventRepository.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            // 2. Verificar si el evento puede ser modificado
            if (event.status === 'cancelled') {
                throw new Error('No se puede modificar un evento cancelado');
            }

            if (event.status === 'finished') {
                throw new Error('No se puede modificar un evento finalizado');
            }

            // 3. Verificar permisos: organizer solo sus eventos, admin cualquier
            if (userRole === 'organizer' && !event.isOwnedBy(userId)) {
                throw new Error('No tenés permisos para modificar este evento');
            }

            if (userRole === 'user') {
                throw new Error('No tenés permisos para modificar eventos');
            }

            // 4. Validaciones de negocio
            if (updateData.date) {
                const newDate = new Date(updateData.date);
                if (newDate < new Date()) {
                    throw new Error('La fecha del evento debe ser futura');
                }
            }

            // 5. Si se intenta publicar, validar fecha
            if (updateData.status === 'published') {
                if (event.date < new Date()) {
                    throw new Error('No se puede publicar un evento con fecha pasada');
                }
                if (event.status === 'cancelled') {
                    throw new Error('No se puede publicar un evento cancelado');
                }
                if (event.status === 'finished') {
                    throw new Error('No se puede publicar un evento finalizado');
                }
            }

            // 6. Si se intenta cancelar
            if (updateData.status === 'cancelled') {
                if (event.status === 'cancelled') {
                    throw new Error('El evento ya está cancelado');
                }
                if (event.status === 'finished') {
                    throw new Error('No se puede cancelar un evento finalizado');
                }
            }

            // 7. Actualizar
            const updatedEvent = await EventRepository.update(id, updateData);
            return updatedEvent;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Cancela un evento
     */
    async cancelEvent(id, userId, userRole) {
        try {
            // 1. Verificar que el evento exista
            const event = await EventRepository.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            // 2. Verificar permisos
            if (userRole === 'organizer' && !event.isOwnedBy(userId)) {
                throw new Error('No tenés permisos para cancelar este evento');
            }

            if (userRole === 'user') {
                throw new Error('No tenés permisos para cancelar eventos');
            }

            // 3. Cancelar
            const cancelledEvent = await EventRepository.cancel(id);
            return cancelledEvent;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene eventos próximos
     */
    async getUpcomingEvents() {
        try {
            return await EventRepository.getUpcomingEvents();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene eventos de un organizador
     */
    async getEventsByOrganizer(organizerId) {
        try {
            return await EventRepository.getByOrganizer(organizerId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new EventService();