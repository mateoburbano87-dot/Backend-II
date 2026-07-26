import SessionService from '../services/sessionService.js';

class SessionController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
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

  async register(req, res) {
    try {
      const userData = req.body;
      
      // Validaciones básicas
      const requiredFields = ['firstName', 'lastName', 'email', 'password'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
        });
      }
      
      const result = await SessionService.register(userData);
      
      res.status(201).json({
        status: 'success',
        payload: result,
        message: 'Registro en desarrollo',
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