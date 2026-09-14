
import User from '../models/User.js';

class UserDao {
    async findById(id) {
        return await User.findById(id);
    }

    async findOne(filter) {
        return await User.findOne(filter);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async count(filter = {}) {
        return await User.countDocuments(filter);
    }

    async exists(filter) {
        const result = await User.exists(filter);
        return !!result;
    }

    async findAll(filter = {}) {
        return await User.find(filter).select('-password -__v');
    }
}

export default new UserDao();