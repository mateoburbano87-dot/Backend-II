import EventDao from '../dao/EventDao.js';

class EventRepository {
    async create(data) {
        return await EventDao.create(data);
    }

    async findById(id) {
        return await EventDao.findById(id);
    }

    async findAll(query = {}, options = {}) {
        return await EventDao.findAll(query, options);
    }

    async update(id, data) {
        return await EventDao.update(id, data);
    }

    async cancel(id) {
        return await EventDao.cancel(id);
    }

    async getWithFilters(filters = {}) {
        return await EventDao.getWithFilters(filters);
    }

    async getUpcomingEvents() {
        return await EventDao.getUpcomingEvents();
    }

    async getByOrganizer(organizerId) {
        return await EventDao.getByOrganizer(organizerId);
    }

    async updateRegisteredCount(id, increment) {
        return await EventDao.updateRegisteredCount(id, increment);
    }
}

export default new EventRepository();