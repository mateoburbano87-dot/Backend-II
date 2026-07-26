import Event from '../models/Event.js';

class EventDao {
  async create(eventData) {
    try {
      const event = new Event(eventData);
      return await event.save();
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Event.findById(id).populate('organizer', 'firstName lastName email');
    } catch (error) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  async findAll(filter = {}, options = {}) {
    try {
      const { limit = 10, skip = 0, sort = { date: 1 } } = options;
      return await Event.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('organizer', 'firstName lastName email');
    } catch (error) {
      throw new Error(`Error finding events: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await Event.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('organizer', 'firstName lastName email');
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Event.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  async updateRegisteredCount(id, increment = 1) {
    try {
      return await Event.findByIdAndUpdate(
        id,
        { $inc: { registeredCount: increment } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating registered count: ${error.message}`);
    }
  }

  async findByCategory(category) {
    try {
      return await Event.find({ category, isActive: true })
        .sort({ date: 1 })
        .populate('organizer', 'firstName lastName email');
    } catch (error) {
      throw new Error(`Error finding events by category: ${error.message}`);
    }
  }
}

export default new EventDao();