import UserRepository from '../repositories/userRepository.js';
import BcryptHelper from '../utils/bcryptHelper.js';
import ValidationHelper from '../utils/validationHelper.js';
import JwtHelper from '../utils/jwt.js';

class SessionService {
  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Object} - Usuario creado (sin contraseña)
   */
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
        role: 'user', // Forzar rol por defecto por seguridad
      };

      const createdUser = await UserRepository.create(userToCreate);
      
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Autentica un usuario y genera un JWT
   * @param {Object} credentials - Credenciales del usuario (email, password)
   * @returns {Object} - Token JWT y datos del usuario
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // 1. Normalizar email para buscar
      const normalizedEmail = ValidationHelper.normalizeEmail(email);

      // 2. Buscar usuario por email
      const user = await UserRepository.findByEmail(normalizedEmail);
      
      // 3. Si no existe usuario, responder con mensaje genérico por seguridad
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // 4. Verificar contraseña usando bcrypt
      const isPasswordValid = await BcryptHelper.comparePassword(password, user.password);
      
      // 5. Si la contraseña no coincide, responder con mensaje genérico
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // 6. Generar JWT con datos del usuario
      const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };
      
      const token = JwtHelper.generateToken(payload);

      // 7. Actualizar fecha de último login
      await UserRepository.update(user._id, { lastLogin: new Date() });

      // 8. Devolver token y datos del usuario (sin contraseña)
      return {
        token,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene el usuario actual a partir del ID
   * @param {string} userId - ID del usuario
   * @returns {Object} - Datos del usuario (sin contraseña)
   */
  async getCurrentUser(userId) {
    try {
      const user = await UserRepository.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Cierra la sesión del usuario (solo lógica, no hace nada con el token)
   * @param {string} token - Token a invalidar (opcional)
   * @returns {Object} - Mensaje de confirmación
   */
  async logout(token) {
    try {
      // En una implementación real, aquí se podría agregar el token a una blacklist
      // Por ahora solo devolvemos confirmación
      return {
        message: 'Sesión cerrada exitosamente',
      };
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  }

  /**
   * Valida un token JWT
   * @param {string} token - Token a validar
   * @returns {Object} - Payload del token
   */
  async validateToken(token) {
    try {
      const decoded = JwtHelper.verifyToken(token);
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}

export default new SessionService();