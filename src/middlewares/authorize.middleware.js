
import AppError from '../utils/AppError.js';

export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(AppError.unauthorized('No autenticado'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(AppError.forbidden('No tenés permisos para realizar esta acción'));
        }

        next();
    };
};

export const isAdmin = (req, res, next) => {
    if (!req.user) return next(AppError.unauthorized('No autenticado'));
    if (req.user.role !== 'admin') {
        return next(AppError.forbidden('Se requiere rol de administrador'));
    }
    next();
};

export const isOrganizerOrAdmin = (req, res, next) => {
    if (!req.user) return next(AppError.unauthorized('No autenticado'));
    if (!['organizer', 'admin'].includes(req.user.role)) {
        return next(AppError.forbidden('Se requiere ser organizador o administrador'));
    }
    next();
};

export default { authorize, isAdmin, isOrganizerOrAdmin };