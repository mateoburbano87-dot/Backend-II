/**
 * Middleware de autenticación con Passport
 * Responde 401 si no hay sesión válida
 * Responde 403 si hay sesión pero sin permisos (en authorize)
 */

import passport from 'passport';

/**
 * Middleware de autenticación principal
 * Usa la estrategia jwt de Passport
 * Responde 401 si no está autenticado
 */
export const auth = async (req, res, next) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                console.error('Error en auth:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error interno del servidor'
                });
            }

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'No autenticado'
                });
            }

            // Guardar usuario en req.user
            req.user = {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            };

            next();
        })(req, res, next);
    } catch (error) {
        console.error('Error en auth:', error);
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        });
    }
};

/**
 * Middleware de autenticación para rutas que requieren admin
 * Primero autentica, luego verifica rol admin
 */
export const authAdmin = async (req, res, next) => {
    auth(req, res, (err) => {
        if (err) return next(err);
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Se requiere rol de administrador'
            });
        }
        next();
    });
};

/**
 * Middleware de autenticación para rutas que requieren organizer o admin
 */
export const authOrganizer = async (req, res, next) => {
    auth(req, res, (err) => {
        if (err) return next(err);
        
        if (!['organizer', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Se requiere ser organizador o administrador'
            });
        }
        next();
    });
};

export default {
    auth,
    authAdmin,
    authOrganizer
};