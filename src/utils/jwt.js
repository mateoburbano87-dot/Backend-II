import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Clase utilitaria para manejar JWT (JSON Web Tokens)
 * Encargada de generar, verificar y decodificar tokens
 */
class JwtHelper {
  /**
   * Genera un nuevo JWT con el payload proporcionado
   * @param {Object} payload - Datos a incluir en el token (id, email, role)
   * @returns {string} - Token JWT generado
   */
  static generateToken(payload) {
    try {
      const secret = process.env.JWT_SECRET;
      const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
      
      if (!secret) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno');
      }
      
      // Generar el token con expiración configurable
      const token = jwt.sign(payload, secret, { expiresIn });
      return token;
    } catch (error) {
      throw new Error(`Error al generar token: ${error.message}`);
    }
  }

  /**
   * Verifica y decodifica un JWT
   * @param {string} token - Token JWT a verificar
   * @returns {Object} - Payload decodificado del token
   */
  static verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET;
      
      if (!secret) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno');
      }
      
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      // Manejar diferentes tipos de errores de JWT
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      }
      throw new Error(`Error al verificar token: ${error.message}`);
    }
  }

  /**
   * Decodifica un JWT sin verificar (útil para debugging)
   * @param {string} token - Token JWT a decodificar
   * @returns {Object} - Payload decodificado (sin verificar)
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error(`Error al decodificar token: ${error.message}`);
    }
  }

  /**
   * Extrae el token de la cookie o del header Authorization
   * @param {Object} req - Objeto request de Express
   * @returns {string|null} - Token encontrado o null
   */
  static extractToken(req) {
    // Intentar obtener de la cookie primero
    const tokenFromCookie = req.cookies?.currentUser;
    if (tokenFromCookie) {
      return tokenFromCookie;
    }

    // Si no está en la cookie, intentar del header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Remover "Bearer "
    }

    return null;
  }

  /**
   * Obtiene el payload del token de la cookie o header
   * @param {Object} req - Objeto request de Express
   * @returns {Object} - Payload del token
   */
  static getPayloadFromRequest(req) {
    const token = this.extractToken(req);
    if (!token) {
      throw new Error('No se encontró token');
    }
    return this.verifyToken(token);
  }
}

export default JwtHelper;