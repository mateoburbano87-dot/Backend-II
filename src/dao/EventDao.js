
import Event from '../models/Event.js';

class EventDao {
    async findById(id) {
        return await Event.findById(id).populate('organizer', 'first_name last_name email');
    }

    async findOne(filter) {
        return await Event.findOne(filter);
    }

    async create(eventData) {
        const event = new Event(eventData);
        return await event.save();
    }

    async update(id, updateData) {
        return await Event.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('organizer', 'first_name last_name email');
    }

    async delete(id) {
        return await Event.findByIdAndDelete(id);
    }

    async count(filter = {}) {
        return await Event.countDocuments(filter);
    }

    async find(filter = {}, options = {}) {
        const { skip = 0, limit = 10, sort = { date: 1 } } = options;
        return await Event.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('organizer', 'first_name last_name email');
    }

    async findUpcoming() {
        const today = new Date();
        return await Event.find({
            date: { $gte: today },
            status: 'published',
            isActive: true
        })
            .sort({ date: 1 })
            .populate('organizer', 'first_name last_name email');
    }

    async findByOrganizer(organizerId) {
        return await Event.find({ organizer: organizerId })
            .sort({ date: -1 })
            .populate('organizer', 'first_name last_name email');
    }

    async incrementRegisteredCount(id, increment) {
        return await Event.findByIdAndUpdate(
            id,
            { $inc: { registeredCount: increment } },
            { new: true }
        );
    }
}

export default new EventDao();