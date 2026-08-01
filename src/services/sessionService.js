import UserRepository from '../repositories/userRepository.js';
import BcryptHelper from '../utils/bcryptHelper.js';
import ValidationHelper from '../utils/validationHelper.js';

class SessionService {
  async register(userData) {
    try {
      // 1. Validar campos requeridos
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      const validation = ValidationHelper.validateRequiredFields(userData, requiredFields);
      
      if (!validation.isValid) {
        throw new Error(`Campos requeridos faltantes: ${validation.missingFields.join(', ')}`);
      }

      // 2. Validar formato de email
      if (!ValidationHelper.validateEmailFormat(userData.email)) {
        throw new Error('Formato de email inválido');
      }

      // 3. Validar longitud de contraseña
      if (!ValidationHelper.validatePasswordLength(userData.password, 6)) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // 4. Normalizar email
      const normalizedEmail = ValidationHelper.normalizeEmail(userData.email);
      
      // 5. Verificar si el email ya existe
      const emailExists = await UserRepository.findEmailExists(normalizedEmail);
      if (emailExists) {
        throw new Error('El email ya está registrado');
      }

      // 6. Hashear la contraseña usando bcrypt
      const hashedPassword = await BcryptHelper.hashPassword(userData.password);

      // 7. Crear el usuario en la base de datos
      const userToCreate = {
        ...userData,
        email: normalizedEmail,
        password: hashedPassword,
        // Eliminar cualquier intento de manipular el rol
        role: 'user', // Forzar rol por defecto
      };

      const createdUser = await UserRepository.create(userToCreate);
      
      // El repository ya devuelve el usuario sin contraseña
      return createdUser;
    } catch (error) {
      // Re-lanzar el error para que sea manejado por el controlador
      throw error;
    }
  }

  async login(credentials) {
    try {
      // Por ahora solo retorna un mensaje de que está en desarrollo
      return {
        message: 'Login en desarrollo',
        credentials: {
          email: credentials.email,
          // No mostrar la contraseña
        }
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async logout(token) {
    try {
      return {
        message: 'Logout en desarrollo',
      };
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  }

  async validateToken(token) {
    try {
      return {
        message: 'Validación de token en desarrollo',
      };
    } catch (error) {
      throw new Error(`Error en validación de token: ${error.message}`);
    }
  }
}

export default new SessionService();