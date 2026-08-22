
/**
 * Middleware para verificar roles permitidos
 * @param {Array} allowedRoles - Lista de roles permitidos
 * @returns {Function} - Middleware de Express
 */
export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // Verificar que el usuario esté autenticado (req.user debe existir)
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            });
        }

        // Verificar si el rol del usuario está permitido
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para realizar esta acción'
            });
        }

        // Usuario autorizado, continuar
        next();
    };
};

/**
 * Middleware para verificar propiedad de recursos
 * @param {Function} getResourceOwnerId - Función que obtiene el ID del propietario del recurso
 * @returns {Function} - Middleware de Express
 */
export const authorizeResourceOwner = (getResourceOwnerId) => {
    return async (req, res, next) => {
        try {
            // Verificar autenticación primero
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'No autenticado'
                });
            }

            // Si es admin, puede hacer todo
            if (req.user.role === 'admin') {
                return next();
            }

            // Obtener el ID del propietario del recurso
            const ownerId = await getResourceOwnerId(req);

            // Si el usuario es organizer, verificar que sea el propietario
            if (req.user.role === 'organizer') {
                if (req.user.id !== ownerId.toString()) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'No tenés permisos para modificar este recurso'
                    });
                }
                return next();
            }

            // Si es user, no puede modificar nada
            if (req.user.role === 'user') {
                return res.status(403).json({
                    status: 'error',
                    message: 'No tenés permisos para realizar esta acción'
                });
            }

            // Si llegamos aquí, no tiene permisos
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para realizar esta acción'
            });
        } catch (error) {
            console.error('Error en authorizeResourceOwner:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            });
        }
    };
};

/**
 * Middleware para verificar que el usuario sea admin
 * Versión simplificada para rutas administrativas
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Se requiere rol de administrador'
        });
    }

    next();
};

/**
 * Middleware para verificar que el usuario sea organizer o admin
 * Versión simplificada para rutas de eventos
 */
export const isOrganizerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        });
    }

    if (!['organizer', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            message: 'Se requiere ser organizador o administrador'
        });
    }

    next();
};

export default {
    authorize,
    authorizeResourceOwner,
    isAdmin,
    isOrganizerOrAdmin
};