import EventDao from '../dao/EventDao.js';

class EventRepository {
  async create(data) {
    return await EventDao.create(data);
  }

  async findById(id) {
    return await EventDao.findById(id);
  }

  async findAll(filter = {}, options = {}) {
    return await EventDao.findAll(filter, options);
  }

  async update(id, data) {
    return await EventDao.update(id, data);
  }

  async delete(id) {
    return await EventDao.delete(id);
  }

  async updateRegisteredCount(id, increment) {
    return await EventDao.updateRegisteredCount(id, increment);
  }

  async findByCategory(category) {
    return await EventDao.findByCategory(category);
  }

  async findActiveEvents() {
    return await EventDao.findAll({ isActive: true });
  }

  async findUpcomingEvents() {
    const today = new Date();
    return await EventDao.findAll(
      { date: { $gte: today }, isActive: true },
      { sort: { date: 1 } }
    );
  }
}

export default new EventRepository();