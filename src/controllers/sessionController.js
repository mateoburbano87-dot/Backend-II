/**
 * Maneja registro, login, logout y usuario actual
 */

import passport from 'passport';
import SessionService from '../services/sessionService.js';
import JwtHelper from '../utils/jwt.js';

class SessionController {
  /**
   * Registra un nuevo usuario usando Passport
   * POST /api/sessions/register
   */
  async register(req, res, next) {
    try {
      // Delegar en la estrategia register de Passport
      passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
          console.error('Error en registro:', err);
          return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
          });
        }

        // Si hay errores de validación
        if (!user) {
          const errorMessages = [
            'Campos requeridos faltantes',
            'Formato de email inválido',
            'La contraseña debe tener al menos 6 caracteres',
            'El email ya está registrado',
          ];

          // Verificar si el error es de validación
          if (info && errorMessages.some(msg => info.message.includes(msg))) {
            return res.status(400).json({
              status: 'error',
              message: info.message,
            });
          }

          // Error de email duplicado
          if (info && info.message === 'El email ya está registrado') {
            return res.status(409).json({
              status: 'error',
              message: info.message,
            });
          }

          // Otros errores
          return res.status(400).json({
            status: 'error',
            message: info?.message || 'Error en registro',
          });
        }

        // Usuario creado exitosamente
        res.status(201).json({
          status: 'success',
          payload: user,
          message: 'Usuario registrado exitosamente',
        });
      })(req, res, next);
    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Inicia sesión usando Passport
   * POST /api/sessions/login
   */
  async login(req, res, next) {
    try {
      // Delegar en la estrategia login de Passport
      passport.authenticate('login', { session: false }, async (err, user, info) => {
        if (err) {
          console.error('Error en login:', err);
          return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
          });
        }

        // Credenciales inválidas
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'Credenciales inválidas',
          });
        }

        // Generar JWT (el controller genera el token, no la estrategia)
        const payload = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };

        const token = JwtHelper.generateToken(payload);

        // Configurar cookie HTTP Only
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('currentUser', token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          maxAge: 3600000, // 1 hora
          path: '/',
        });

        // Respuesta exitosa
        res.status(200).json({
          status: 'success',
          message: 'Login correcto',
          user: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
          },
        });
      })(req, res, next);
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Obtiene el usuario autenticado
   * GET /api/sessions/current (protegida con auth middleware)
   */
  async getCurrentUser(req, res) {
    try {
      // req.user ya está disponible gracias al middleware auth
      const user = req.user;

      res.status(200).json({
        status: 'success',
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error('Error en current user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Cierra sesión y elimina la cookie
   * POST /api/sessions/logout
   */
  async logout(req, res) {
    try {
      // Eliminar la cookie
      res.clearCookie('currentUser', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Valida un token (para debugging)
   * POST /api/sessions/validate
   */
  async validateToken(req, res) {
    try {
      const token = req.cookies?.currentUser;

      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'No se encontró token en la cookie',
        });
      }

      const decoded = JwtHelper.verifyToken(token);

      res.status(200).json({
        status: 'success',
        payload: decoded,
        message: 'Token válido',
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message || 'Token inválido',
      });
    }
  }
}

export default new SessionController();