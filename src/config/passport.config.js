import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserRepository from '../repositories/userRepository.js';
import BcryptHelper from '../utils/bcryptHelper.js';
import ValidationHelper from '../utils/validationHelper.js';
import JwtHelper from '../utils/jwt.js';


passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name } = req.body;

        // 1. Validar campos requeridos
        if (!first_name || !last_name) {
          return done(null, false, { 
            message: 'Campos requeridos faltantes: first_name, last_name' 
          });
        }

        // 2. Validar formato de email
        if (!ValidationHelper.validateEmailFormat(email)) {
          return done(null, false, { 
            message: 'Formato de email inválido' 
          });
        }

        // 3. Validar longitud de contraseña
        if (!ValidationHelper.validatePasswordLength(password, 6)) {
          return done(null, false, { 
            message: 'La contraseña debe tener al menos 6 caracteres' 
          });
        }

        // 4. Normalizar email
        const normalizedEmail = ValidationHelper.normalizeEmail(email);

        // 5. Verificar si el email ya existe
        const emailExists = await UserRepository.findEmailExists(normalizedEmail);
        if (emailExists) {
          return done(null, false, { 
            message: 'El email ya está registrado' 
          });
        }

        // 6. Hashear la contraseña
        const hashedPassword = await BcryptHelper.hashPassword(password);

        // 7. Crear el usuario
        const userData = {
          first_name,
          last_name,
          email: normalizedEmail,
          password: hashedPassword,
          role: 'user',
        };

        const user = await UserRepository.create(userData);

        // 8. Devolver usuario sin contraseña
        return done(null, user);
      } catch (error) {
        console.error('Error en estrategia register:', error);
        return done(error);
      }
    }
  )
);


passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        // 1. Normalizar email
        const normalizedEmail = ValidationHelper.normalizeEmail(email);

        // 2. Buscar usuario por email
        const user = await UserRepository.findByEmail(normalizedEmail);

        // 3. Si no existe usuario, responder con mensaje genérico
        if (!user) {
          return done(null, false, { 
            message: 'Credenciales inválidas' 
          });
        }

        // 4. Verificar contraseña
        const isPasswordValid = await BcryptHelper.comparePassword(
          password,
          user.password
        );

        // 5. Si la contraseña no coincide, mensaje genérico
        if (!isPasswordValid) {
          return done(null, false, { 
            message: 'Credenciales inválidas' 
          });
        }

        // 6. Actualizar fecha de último login
        await UserRepository.update(user._id, { lastLogin: new Date() });

        // 7. Devolver usuario autenticado
        return done(null, user);
      } catch (error) {
        console.error('Error en estrategia login:', error);
        return done(error);
      }
    }
  )
);


passport.use(
  'jwt',
  new LocalStrategy(
    {
      usernameField: 'token', 
      passwordField: 'token',
      session: false,
      passReqToCallback: true,
    },
    async (req, token, _, done) => {
      try {
        // 1. Extraer token de la cookie
        const tokenFromCookie = req.cookies?.currentUser;

        if (!tokenFromCookie) {
          return done(null, false, { 
            message: 'No autenticado' 
          });
        }

        // 2. Verificar el token
        const decoded = JwtHelper.verifyToken(tokenFromCookie);

        if (!decoded) {
          return done(null, false, { 
            message: 'Token inválido' 
          });
        }

        // 3. Buscar usuario en la base de datos
        const user = await UserRepository.findById(decoded.id);

        if (!user) {
          return done(null, false, { 
            message: 'Usuario no encontrado' 
          });
        }

        // 4. Devolver usuario autenticado
        return done(null, user);
      } catch (error) {
        if (error.message === 'Token expirado' || error.message === 'Token inválido') {
          return done(null, false, { 
            message: 'No autenticado' 
          });
        }
        console.error('Error en estrategia jwt:', error);
        return done(error);
      }
    }
  )
);


passport.use(
  'jwt-header',
  new LocalStrategy(
    {
      usernameField: 'token',
      passwordField: 'token',
      session: false,
      passReqToCallback: true,
    },
    async (req, token, _, done) => {
      try {
        // Extraer token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return done(null, false, { 
            message: 'Token no proporcionado' 
          });
        }

        const tokenFromHeader = authHeader.substring(7);
        const decoded = JwtHelper.verifyToken(tokenFromHeader);

        if (!decoded) {
          return done(null, false, { 
            message: 'Token inválido' 
          });
        }

        const user = await UserRepository.findById(decoded.id);
        if (!user) {
          return done(null, false, { 
            message: 'Usuario no encontrado' 
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;