import EventRepository from '../repositories/eventRepository.js';

class EventService {
  async createEvent(eventData) {
    try {
      // Validaciones de negocio
      if (eventData.date < new Date()) {
        throw new Error('La fecha del evento debe ser futura');
      }
      
      if (eventData.registeredCount > eventData.capacity) {
        throw new Error('El número de registrados no puede exceder la capacidad');
      }

      return await EventRepository.create(eventData);
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  async getEventById(id) {
    try {
      const event = await EventRepository.findById(id);
      if (!event) {
        throw new Error('Evento no encontrado');
      }
      return event;
    } catch (error) {
      throw new Error(`Error getting event: ${error.message}`);
    }
  }

  async getAllEvents(filter = {}, options = {}) {
    try {
      return await EventRepository.findAll(filter, options);
    } catch (error) {
      throw new Error(`Error getting events: ${error.message}`);
    }
  }

  async updateEvent(id, updateData) {
    try {
      const existingEvent = await EventRepository.findById(id);
      if (!existingEvent) {
        throw new Error('Evento no encontrado');
      }

      // Validaciones de negocio
      if (updateData.date && updateData.date < new Date()) {
        throw new Error('La fecha del evento debe ser futura');
      }

      if (updateData.capacity && updateData.capacity < existingEvent.registeredCount) {
        throw new Error('La nueva capacidad no puede ser menor que el número de registrados');
      }

      return await EventRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  async deleteEvent(id) {
    try {
      const event = await EventRepository.findById(id);
      if (!event) {
        throw new Error('Evento no encontrado');
      }
      
      return await EventRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  async getUpcomingEvents() {
    try {
      return await EventRepository.findUpcomingEvents();
    } catch (error) {
      throw new Error(`Error getting upcoming events: ${error.message}`);
    }
  }

  async getEventsByCategory(category) {
    try {
      return await EventRepository.findByCategory(category);
    } catch (error) {
      throw new Error(`Error getting events by category: ${error.message}`);
    }
  }
}

export default new EventService();