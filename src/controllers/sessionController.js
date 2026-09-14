/**
 * Controlador de Sesiones
 * Solo coordina request/response. Usa DTO para filtrar respuestas.
 */

import passport from 'passport';
import JwtHelper from '../utils/jwt.js';
import UserDto from '../dto/UserDto.js';
import AppError from '../utils/AppError.js';

class SessionController {
    async register(req, res, next) {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                const message = info?.message || 'Error en registro';
                // 409 para email duplicado, 400 para el resto
                if (message === 'El email ya está registrado') {
                    return next(AppError.conflict(message));
                }
                return next(AppError.badRequest(message));
            }

            res.status(201).json({
                status: 'success',
                payload: UserDto.toResponse(user),
                message: 'Usuario registrado exitosamente'
            });
        })(req, res, next);
    }

    async login(req, res, next) {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                return next(AppError.unauthorized('Credenciales inválidas'));
            }

            const token = JwtHelper.generateToken({
                id: user._id.toString(),
                email: user.email,
                role: user.role
            });

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('currentUser', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: 3600000,
                path: '/'
            });

            res.status(200).json({
                status: 'success',
                message: 'Login correcto',
                user: UserDto.toResponse(user)
            });
        })(req, res, next);
    }

    async getCurrentUser(req, res, next) {
        try {
            // req.user ya viene desde el middleware auth
            res.status(200).json({
                status: 'success',
                payload: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('currentUser', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            res.status(200).json({
                status: 'success',
                message: 'Sesión cerrada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req, res, next) {
        try {
            const token = req.cookies?.currentUser;
            if (!token) return next(AppError.badRequest('No se encontró token en la cookie'));

            const decoded = JwtHelper.verifyToken(token);
            res.status(200).json({
                status: 'success',
                payload: decoded,
                message: 'Token válido'
            });
        } catch (error) {
            next(AppError.unauthorized(error.message || 'Token inválido'));
        }
    }
}

export default new SessionController();