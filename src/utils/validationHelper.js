class ValidationHelper {
  /**
   * Valida que todos los campos requeridos estén presentes
   * @param {Object} data - Objeto con los datos a validar
   * @param {Array} requiredFields - Lista de campos requeridos
   * @returns {Object} - { isValid: boolean, missingFields: Array }
   */
  static validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Valida el formato de un email
   * @param {string} email - Email a validar
   * @returns {boolean} - true si es válido, false si no
   */
  static validateEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  /**
   * Valida la longitud mínima de una contraseña
   * @param {string} password - Contraseña a validar
   * @param {number} minLength - Longitud mínima (default: 6)
   * @returns {boolean} - true si es válida, false si no
   */
  static validatePasswordLength(password, minLength = 6) {
    return password && password.length >= minLength;
  }

  /**
   * Normaliza un email (trim + lowercase)
   * @param {string} email - Email a normalizar
   * @returns {string} - Email normalizado
   */
  static normalizeEmail(email) {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  /**
   * Sanitiza datos eliminando campos no deseados
   * @param {Object} data - Datos a sanitizar
   * @param {Array} fieldsToRemove - Campos a eliminar
   * @returns {Object} - Datos sanitizados
   */
  static sanitizeData(data, fieldsToRemove = ['password']) {
    const sanitized = { ...data };
    fieldsToRemove.forEach(field => {
      delete sanitized[field];
    });
    return sanitized;
  }

  /**
   * Valida que el rol sea permitido
   * @param {string} role - Rol a validar
   * @param {Array} allowedRoles - Roles permitidos
   * @returns {boolean} - true si es válido, false si no
   */
  static validateRole(role, allowedRoles = ['user', 'organizer', 'admin']) {
    return role ? allowedRoles.includes(role) : true;
  }
}

export default ValidationHelper;