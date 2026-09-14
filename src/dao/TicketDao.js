
import Ticket from '../models/Ticket.js';

class TicketDao {
    async findById(id) {
        return await Ticket.findById(id)
            .populate('user', 'first_name last_name email')
            .populate('event', 'title date location status capacity price');
    }

    async findOne(filter) {
        return await Ticket.findOne(filter);
    }

    async find(filter = {}, options = {}) {
        const { sort = { createdAt: -1 } } = options;
        return await Ticket.find(filter)
            .sort(sort)
            .populate('user', 'first_name last_name email')
            .populate('event', 'title date location status capacity price');
    }

    async findByUser(userId) {
        return await Ticket.find({ user: userId })
            .populate('event', 'title date location status price')
            .sort({ createdAt: -1 });
    }

    async findByEvent(eventId) {
        return await Ticket.find({ event: eventId })
            .populate('user', 'first_name last_name email')
            .sort({ createdAt: -1 });
    }

    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async update(id, updateData) {
        return await Ticket.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
    }

    async count(filter = {}) {
        return await Ticket.countDocuments(filter);
    }

    async sumQuantity(filter = {}) {
        const result = await Ticket.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }

    async exists(filter) {
        const result = await Ticket.exists(filter);
        return !!result;
    }
}

export default new TicketDao();