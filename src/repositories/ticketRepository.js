
import TicketDao from '../dao/TicketDao.js';

class TicketRepository {
    async create(data) {
        return await TicketDao.create(data);
    }

    async findById(id) {
        return await TicketDao.findById(id);
    }

    async findByUser(userId) {
        return await TicketDao.findByUser(userId);
    }

    async findByEvent(eventId) {
        return await TicketDao.findByEvent(eventId);
    }

    async findByUserAndEvent(userId, eventId) {
        return await TicketDao.findByUserAndEvent(userId, eventId);
    }

    async update(id, data) {
        return await TicketDao.update(id, data);
    }

    async cancel(id) {
        return await TicketDao.cancel(id);
    }

    async countActiveTickets(eventId) {
        return await TicketDao.countActiveTickets(eventId);
    }

    async countOccupiedSpots(eventId) {
        return await TicketDao.countOccupiedSpots(eventId);
    }

    async hasActiveTicket(userId, eventId) {
        return await TicketDao.hasActiveTicket(userId, eventId);
    }
}

export default new TicketRepository();