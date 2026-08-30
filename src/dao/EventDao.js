import Event from '../models/Event.js';

class EventDao {
    async create(eventData) {
        try {
            const event = new Event(eventData);
            return await event.save();
        } catch (error) {
            throw new Error(`Error al crear evento: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Event.findById(id)
                .populate('organizer', 'first_name last_name email');
        } catch (error) {
            throw new Error(`Error al buscar evento: ${error.message}`);
        }
    }

    async findAll(query = {}, options = {}) {
        try {
            const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
            const events = await Event.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('organizer', 'first_name last_name email');
            
            const total = await Event.countDocuments(query);
            
            return {
                data: events,
                total,
                limit: parseInt(limit),
                skip: parseInt(skip)
            };
        } catch (error) {
            throw new Error(`Error al buscar eventos: ${error.message}`);
        }
    }

    async update(id, updateData) {
        try {
            // Verificar si el evento existe
            const event = await Event.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            // Verificar si puede ser modificado
            if (!event.canBeModified()) {
                throw new Error('El evento no puede ser modificado porque está cancelado o finalizado');
            }

            // Actualizar
            const updatedEvent = await Event.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            ).populate('organizer', 'first_name last_name email');

            return updatedEvent;
        } catch (error) {
            throw new Error(`Error al actualizar evento: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            // No eliminamos físicamente, solo cambiamos estado
            return await this.update(id, { status: 'cancelled', isActive: false });
        } catch (error) {
            throw new Error(`Error al eliminar evento: ${error.message}`);
        }
    }

    async cancel(id) {
        try {
            const event = await Event.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            if (event.status === 'cancelled') {
                throw new Error('El evento ya está cancelado');
            }

            if (event.status === 'finished') {
                throw new Error('No se puede cancelar un evento finalizado');
            }

            event.status = 'cancelled';
            event.isActive = false;
            await event.save();

            return event.populate('organizer', 'first_name last_name email');
        } catch (error) {
            throw new Error(`Error al cancelar evento: ${error.message}`);
        }
    }

    async getWithFilters(filters = {}) {
        try {
            return await Event.getEventsWithFilters(filters);
        } catch (error) {
            throw new Error(`Error al obtener eventos con filtros: ${error.message}`);
        }
    }

    async getUpcomingEvents() {
        try {
            const today = new Date();
            return await Event.find({
                date: { $gte: today },
                status: 'published',
                isActive: true
            })
            .sort({ date: 1 })
            .populate('organizer', 'first_name last_name email');
        } catch (error) {
            throw new Error(`Error al obtener eventos próximos: ${error.message}`);
        }
    }

    async getByOrganizer(organizerId) {
        try {
            return await Event.find({ organizer: organizerId })
                .sort({ date: -1 })
                .populate('organizer', 'first_name last_name email');
        } catch (error) {
            throw new Error(`Error al obtener eventos del organizador: ${error.message}`);
        }
    }

    async updateRegisteredCount(id, increment = 1) {
        try {
            const event = await Event.findById(id);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            const newCount = event.registeredCount + increment;
            if (newCount > event.capacity) {
                throw new Error('Capacidad excedida');
            }

            event.registeredCount = newCount;
            await event.save();
            return event;
        } catch (error) {
            throw new Error(`Error al actualizar contador de registrados: ${error.message}`);
        }
    }
}

export default new EventDao();