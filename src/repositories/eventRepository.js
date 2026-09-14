
import EventDao from '../dao/EventDao.js';

class EventRepository {
    async findById(id) {
        return await EventDao.findById(id);
    }

    async create(data) {
        return await EventDao.create(data);
    }

    async update(id, data) {
        return await EventDao.update(id, data);
    }

    async cancel(id) {
        // Cancela un evento cambiando su status
        return await EventDao.update(id, { status: 'cancelled', isActive: false });
    }

    async findPublishedEvents(filters = {}) {
        const query = { status: 'published', isActive: true };

        if (filters.category) query.category = filters.category;
        if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
        if (filters.dateFrom || filters.dateTo) {
            query.date = {};
            if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
            if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
        }

        const skip = (filters.page - 1) * filters.limit;
        const sort = this._buildSort(filters.sort);

        return await EventDao.find(query, { skip, limit: filters.limit, sort });
    }

    async findWithFilters(filters = {}) {
        const query = {};

        if (filters.status) query.status = filters.status;
        if (filters.category) query.category = filters.category;
        if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
        if (filters.dateFrom || filters.dateTo) {
            query.date = {};
            if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
            if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
        }

        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = this._buildSort(filters.sort);

        const [data, total] = await Promise.all([
            EventDao.find(query, { skip, limit, sort }),
            EventDao.count(query)
        ]);

        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }

    async findUpcomingEvents() {
        return await EventDao.findUpcoming();
    }

    async findByOrganizer(organizerId) {
        return await EventDao.findByOrganizer(organizerId);
    }

    async incrementRegisteredCount(id, increment) {
        return await EventDao.incrementRegisteredCount(id, increment);
    }

    async countActive() {
        return await EventDao.count({ isActive: true });
    }

    _buildSort(sortParam) {
        const sort = {};
        if (!sortParam) return { date: 1 };

        sortParam.split(',').forEach(field => {
            if (field.startsWith('-')) {
                sort[field.substring(1)] = -1;
            } else {
                sort[field] = 1;
            }
        });

        return sort;
    }
}

export default new EventRepository();