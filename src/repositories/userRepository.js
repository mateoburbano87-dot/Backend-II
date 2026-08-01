import UserDao from '../dao/UserDao.js';
import ValidationHelper from '../utils/validationHelper.js';

class UserRepository {
  async create(data) {
    // Validar que no se pueda asignar un rol no permitido
    if (data.role && !['user', 'organizer', 'admin'].includes(data.role)) {
      throw new Error('Rol inválido');
    }
    return await UserDao.create(data);
  }

  async findById(id) {
    return await UserDao.findById(id);
  }

  async findByEmail(email) {
    return await UserDao.findByEmail(email);
  }

  async findEmailExists(email) {
    return await UserDao.findEmailExists(email);
  }

  async findAll(filter = {}) {
    return await UserDao.findAll(filter);
  }

  async update(id, data) {
    // Validar que no se pueda actualizar a un rol no permitido
    if (data.role && !['user', 'organizer', 'admin'].includes(data.role)) {
      throw new Error('Rol inválido');
    }
    return await UserDao.update(id, data);
  }

  async delete(id) {
    return await UserDao.delete(id);
  }

  async findActiveUsers() {
    return await UserDao.findAll({ isActive: true });
  }

  async findUsersByRole(role) {
    if (!['user', 'organizer', 'admin'].includes(role)) {
      throw new Error('Rol inválido');
    }
    return await UserDao.findAll({ role });
  }
}

export default new UserRepository();