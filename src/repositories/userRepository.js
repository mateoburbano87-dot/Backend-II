import UserDao from '../dao/UserDao.js';

class UserRepository {
  async create(data) {
    return await UserDao.create(data);
  }

  async findById(id) {
    return await UserDao.findById(id);
  }

  async findByEmail(email) {
    return await UserDao.findByEmail(email);
  }

  async findAll(filter = {}) {
    return await UserDao.findAll(filter);
  }

  async update(id, data) {
    return await UserDao.update(id, data);
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
}

export default new UserRepository();