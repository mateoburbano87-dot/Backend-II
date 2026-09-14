/**
 * Servicio de Sesión
 * Consume repositories
 */

import UserRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';

class SessionService {
    async getCurrentUser(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw AppError.notFound('Usuario no encontrado');
        }
        return user;
    }

    async logout() {
        return { message: 'Sesión cerrada exitosamente' };
    }
}

export default new SessionService();