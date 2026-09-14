
import UserDao from '../dao/UserDao.js';
import ValidationHelper from '../utils/validationHelper.js';

class UserRepository {
    async findById(id) {
        return await UserDao.findById(id);
    }

    async findByEmail(email) {
        const normalizedEmail = ValidationHelper.normalizeEmail(email);
        return await UserDao.findByEmail(normalizedEmail);
    }

    async emailExists(email) {
        const normalizedEmail = ValidationHelper.normalizeEmail(email);
        return await UserDao.exists({ email: normalizedEmail });
    }

    async create(userData) {
        return await UserDao.create(userData);
    }

    async update(id, updateData) {
        return await UserDao.update(id, updateData);
    }

    async delete(id) {
        return await UserDao.delete(id);
    }

    async findActiveUsers() {
        return await UserDao.findAll({ isActive: true });
    }

    async findUsersByRole(role) {
        return await UserDao.findAll({ role });
    }

    async count() {
        return await UserDao.count();
    }
}

export default new UserRepository();