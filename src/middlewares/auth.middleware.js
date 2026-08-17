/**
 * Middleware de autenticación usando Passport.js
 */

import passport from 'passport';
import UserRepository from '../repositories/userRepository.js';
import JwtHelper from '../utils/jwt.js';

/**
 * Middleware de autenticación con Passport (estrategia jwt)
 * Verifica la cookie y autentica al usuario
 */
export const auth = async (req, res, next) => {
  try {
    // Usar la estrategia JWT de Passport
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Error en auth middleware:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor',
        });
      }

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autenticado',
        });
      }

      // Guardar usuario en req.user
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      next();
    })(req, res, next);
  } catch (error) {
    console.error('Error en auth:', error);
    return res.status(401).json({
      status: 'error',
      message: 'No autenticado',
    });
  }
};

/**
 * Middleware de autenticación con estrategia desde header
 * Para futuros usos con Bearer token
 */
export const authBearer = async (req, res, next) => {
  try {
    passport.authenticate('jwt-header', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor',
        });
      }

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token inválido',
        });
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    })(req, res, next);
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'No autenticado',
    });
  }
};

/**
 * Middleware para verificar roles con Passport
 * Requiere que el usuario esté autenticado primero
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No autorizado - Rol insuficiente',
      });
    }

    next();
  };
};

export default {
  auth,
  authBearer,
  authorize,
};