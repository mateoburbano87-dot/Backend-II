import SessionService from '../services/sessionService.js';

class SessionController {
  /**
   * Registra un nuevo usuario
   * POST /api/sessions/register
   */
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

  /**
   * Inicia sesión de usuario
   * POST /api/sessions/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Intentar autenticar al usuario
      const { token, user } = await SessionService.login({ email, password });
      
      // Configurar la cookie con el JWT
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('currentUser', token, {
        httpOnly: true, // No accesible desde JavaScript del cliente
        secure: isProduction, // Solo HTTPS en producción
        sameSite: 'lax', // Protección CSRF
        maxAge: 3600000, // 1 hora en milisegundos
        path: '/', // Disponible en toda la aplicación
      });
      
      // Respuesta exitosa (no incluir el token en el body)
      res.status(200).json({
        status: 'success',
        message: 'Login correcto',
        user: user, // Incluir datos del usuario (sin contraseña)
      });
    } catch (error) {
      // Manejar errores de autenticación
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({
          status: 'error',
          message: 'Credenciales inválidas',
        });
      }
      
      // Error general del servidor
      console.error('Error en login:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Obtiene el usuario autenticado actual
   * GET /api/sessions/current (Protegida por auth middleware)
   */
  async getCurrentUser(req, res) {
    try {
      // req.user es establecido por el middleware auth
      const userId = req.user.id;
      
      // Obtener datos del usuario
      const user = await SessionService.getCurrentUser(userId);
      
      res.status(200).json({
        status: 'success',
        payload: {
          id: user._id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado',
        });
      }
      
      console.error('Error en current user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Cierra sesión de usuario
   * POST /api/sessions/logout
   */
  async logout(req, res) {
    try {
      // Obtener token de la cookie
      const token = req.cookies?.currentUser;
      
      // Llamar al servicio de logout
      await SessionService.logout(token);
      
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
      
      const decoded = await SessionService.validateToken(token);
      
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