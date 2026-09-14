
import TicketDao from '../dao/TicketDao.js';

class TicketRepository {
    async findById(id) {
        return await TicketDao.findById(id);
    }

    async create(data) {
        return await TicketDao.create(data);
    }

    async update(id, data) {
        return await TicketDao.update(id, data);
    }

    async cancelTicket(id) {
        return await TicketDao.update(id, {
            status: 'cancelled',
            cancelledAt: new Date()
        });
    }

    async findByUser(userId) {
        return await TicketDao.findByUser(userId);
    }

    async findByEvent(eventId) {
        return await TicketDao.findByEvent(eventId);
    }

    async findByUserAndEvent(userId, eventId) {
        return await TicketDao.findOne({ user: userId, event: eventId });
    }

    async hasActiveTicket(userId, eventId) {
        return await TicketDao.exists({
            user: userId,
            event: eventId,
            status: { $in: ['confirmed', 'pending'] }
        });
    }

    async countActiveTickets(eventId) {
        return await TicketDao.count({
            event: eventId,
            status: { $in: ['confirmed', 'pending'] }
        });
    }

    async countOccupiedSpots(eventId) {
        return await TicketDao.sumQuantity({
            event: eventId,
            status: { $in: ['confirmed', 'pending'] }
        });
    }

    async reservationCodeExists(code) {
        return await TicketDao.exists({ reservationCode: code });
    }
}

export default new TicketRepository();