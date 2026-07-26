import EventService from '../services/eventService.js';

class EventController {
  async getAllEvents(req, res) {
    try {
      const { category, isActive, limit = 10, skip = 0 } = req.query;
      
      const filter = {};
      if (category) filter.category = category;
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      
      const events = await EventService.getAllEvents(filter, {
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
      
      res.status(200).json({
        status: 'success',
        payload: events,
        count: events.length,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      
      res.status(200).json({
        status: 'success',
        payload: event,
      });
    } catch (error) {
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          status: 'error',
          message: error.message,
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async createEvent(req, res) {
    try {
      const eventData = req.body;
      const newEvent = await EventService.createEvent(eventData);
      
      res.status(201).json({
        status: 'success',
        payload: newEvent,
        message: 'Evento creado exitosamente',
      });
    } catch (error) {
      if (error.message.includes('fecha') || error.message.includes('capacidad')) {
        return res.status(400).json({
          status: 'error',
          message: error.message,
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedEvent = await EventService.updateEvent(id, updateData);
      
      res.status(200).json({
        status: 'success',
        payload: updatedEvent,
        message: 'Evento actualizado exitosamente',
      });
    } catch (error) {
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          status: 'error',
          message: error.message,
        });
      }
      
      if (error.message.includes('fecha') || error.message.includes('capacidad')) {
        return res.status(400).json({
          status: 'error',
          message: error.message,
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Evento eliminado exitosamente',
      });
    } catch (error) {
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          status: 'error',
          message: error.message,
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getUpcomingEvents(req, res) {
    try {
      const events = await EventService.getUpcomingEvents();
      
      res.status(200).json({
        status: 'success',
        payload: events,
        count: events.length,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getEventsByCategory(req, res) {
    try {
      const { category } = req.params;
      const events = await EventService.getEventsByCategory(category);
      
      res.status(200).json({
        status: 'success',
        payload: events,
        count: events.length,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export default new EventController();