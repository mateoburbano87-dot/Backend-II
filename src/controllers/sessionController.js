import SessionService from '../services/sessionService.js';
import ValidationHelper from '../utils/validationHelper.js';

class SessionController {
  async register(req, res) {
    try {
      const userData = req.body;
      
      // Intentar registrar el usuario
      const result = await SessionService.register(userData);
      
      // Respuesta exitosa (201 Created)
      res.status(201).json({
        status: 'success',
        payload: result,
        message: 'Usuario registrado exitosamente',
      });
    } catch (error) {
      // Manejar diferentes tipos de errores
      const errorMessages = [
        'Campos requeridos faltantes',
        'Formato de email inválido',
        'La contraseña debe tener al menos 6 caracteres',
        'El email ya está registrado',
        'Rol inválido',
      ];
      
      // Verificar si el error es de validación (400 Bad Request)
      if (errorMessages.some(msg => error.message.includes(msg))) {
        return res.status(400).json({
          status: 'error',
          message: error.message,
        });
      }
      
      // Error de email duplicado (409 Conflict)
      if (error.message === 'El email ya está registrado') {
        return res.status(409).json({
          status: 'error',
          message: 'El email ya está registrado',
        });
      }
      
      // Error general del servidor (500)
      console.error('Error en registro:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar campos requeridos para login
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email y contraseña son requeridos',
        });
      }
      
      const result = await SessionService.login({ email, password });
      
      res.status(200).json({
        status: 'success',
        payload: result,
        message: 'Login en desarrollo',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'Token no proporcionado',
        });
      }
      
      const result = await SessionService.logout(token);
      
      res.status(200).json({
        status: 'success',
        payload: result,
        message: 'Logout en desarrollo',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async validateToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'Token no proporcionado',
        });
      }
      
      const result = await SessionService.validateToken(token);
      
      res.status(200).json({
        status: 'success',
        payload: result,
        message: 'Validación en desarrollo',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export default new SessionController();