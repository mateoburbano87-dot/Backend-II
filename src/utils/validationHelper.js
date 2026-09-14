
class ValidationHelper {
    /**
     * Valida que todos los campos requeridos estén presentes
     */
    static validateRequiredFields(data, requiredFields) {
        const missingFields = requiredFields.filter(field => {
            const value = data[field];
            return value === undefined || value === null || value === '';
        });

        return {
            isValid: missingFields.length === 0,
            missingFields
        };
    }

    /**
     * Valida el formato de un email
     */
    static validateEmailFormat(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    /**
     * Valida la longitud mínima de una contraseña
     */
    static validatePasswordLength(password, minLength = 6) {
        return password && password.length >= minLength;
    }

    /**
     * Normaliza un email (trim + lowercase)
     */
    static normalizeEmail(email) {
        if (!email) return '';
        return email.trim().toLowerCase();
    }

    /**
     * Sanitiza datos eliminando campos no deseados
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
     */
    static validateRole(role, allowedRoles = ['user', 'organizer', 'admin']) {
        return role ? allowedRoles.includes(role) : true;
    }
}

export default ValidationHelper;