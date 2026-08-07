import ValidationHelper from '../utils/validationHelper.js';

/**
 * Middleware para validar campos requeridos en el body
 * @param {Array} requiredFields - Lista de campos requeridos
 * @returns {Function} - Middleware de Express
 */
export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const validation = ValidationHelper.validateRequiredFields(req.body, requiredFields);
    
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: `Campos requeridos faltantes: ${validation.missingFields.join(', ')}`,
      });
    }
    
    next();
  };
};

/**
 * Middleware para validar formato de email
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !ValidationHelper.validateEmailFormat(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Formato de email inválido',
    });
  }
  
  next();
};

/**
 * Middleware para validar longitud de contraseña
 */
export const validatePassword = (req, res, next) => {
  const { password } = req.body;
  const minLength = 6;
  
  if (password && !ValidationHelper.validatePasswordLength(password, minLength)) {
    return res.status(400).json({
      status: 'error',
      message: `La contraseña debe tener al menos ${minLength} caracteres`,
    });
  }
  
  next();
};

/**
 * Middleware para prevenir manipulación del rol
 */
export const preventRoleManipulation = (req, res, next) => {
  if (req.body.role) {
    // Eliminar el rol del body para prevenir manipulación
    delete req.body.role;
  }
  next();
};

/**
 * Middleware para normalizar email
 */
export const normalizeEmail = (req, res, next) => {
  if (req.body.email) {
    req.body.email = ValidationHelper.normalizeEmail(req.body.email);
  }
  next();
};

/**
 * Middleware para validar campos de login
 */
export const validateLoginFields = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email y contraseña son requeridos',
    });
  }
  
  next();
};