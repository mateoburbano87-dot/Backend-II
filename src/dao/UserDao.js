import User from '../models/User.js';
import ValidationHelper from '../utils/validationHelper.js';

class UserDao {
  async create(userData) {
    try {
      // Normalizar email antes de crear
      if (userData.email) {
        userData.email = ValidationHelper.normalizeEmail(userData.email);
      }
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      // Devolver usuario sin contraseña
      return savedUser.sanitize();
    } catch (error) {
      // Manejar error de duplicado de email
      if (error.code === 11000) {
        throw new Error('El email ya está registrado');
      }
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const user = await User.findById(id).select('-password -__v');
      return user;
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const normalizedEmail = ValidationHelper.normalizeEmail(email);
      return await User.findOne({ email: normalizedEmail });
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async findEmailExists(email) {
    try {
      const normalizedEmail = ValidationHelper.normalizeEmail(email);
      return await User.emailExists(normalizedEmail);
    } catch (error) {
      throw new Error(`Error al verificar email: ${error.message}`);
    }
  }

  async findAll(filter = {}) {
    try {
      return await User.find(filter).select('-password -__v');
    } catch (error) {
      throw new Error(`Error al buscar usuarios: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      // Si se actualiza email, normalizarlo
      if (updateData.email) {
        updateData.email = ValidationHelper.normalizeEmail(updateData.email);
      }
      
      const user = await User.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).select('-password -__v');
      
      return user;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

export default new UserDao();