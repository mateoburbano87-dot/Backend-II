import JwtHelper from '../utils/jwt.js';

/**
 * Middleware de autenticación para proteger rutas
 * Verifica la presencia y validez del JWT
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
export const auth = async (req, res, next) => {
  try {
    // Extraer token de la cookie o header
    const token = JwtHelper.extractToken(req);
    
    // Si no hay token, responder con 401
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado - Token no proporcionado',
      });
    }

    // Verificar y decodificar el token
    const decoded = JwtHelper.verifyToken(token);
    
    // Guardar la información del usuario en req.user para uso posterior
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Manejar errores de token
    let message = 'No autenticado';
    
    if (error.message === 'Token expirado') {
      message = 'Sesión expirada - Inicie sesión nuevamente';
    } else if (error.message === 'Token inválido') {
      message = 'Token inválido';
    }
    
    return res.status(401).json({
      status: 'error',
      message,
    });
  }
};

/**
 * Middleware para verificar roles (opcional, para futuras entregas)
 * @param {Array} allowedRoles - Lista de roles permitidos
 * @returns {Function} - Middleware de Express
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Verificar que req.user exista (debe pasar por auth primero)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado',
      });
    }

    // Verificar si el rol del usuario está permitido
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No autorizado - Rol insuficiente',
      });
    }

    next();
  };
};

/**
 * Middleware opcional para logging de autenticación
 */
export const authLogger = (req, res, next) => {
  if (req.user) {
    console.log(`[Auth] Usuario autenticado: ${req.user.email} (${req.user.role})`);
  } else {
    console.log('[Auth] Usuario no autenticado');
  }
  next();
};