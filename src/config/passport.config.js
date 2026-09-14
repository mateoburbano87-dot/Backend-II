
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserRepository from '../repositories/userRepository.js';
import BcryptHelper from '../utils/bcryptHelper.js';
import ValidationHelper from '../utils/validationHelper.js';
import JwtHelper from '../utils/jwt.js';

/**
 * Estrategia de Registro
 */
passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
        },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name } = req.body;

                if (!first_name || !last_name) {
                    return done(null, false, {
                        message: 'Campos requeridos faltantes: first_name, last_name'
                    });
                }

                if (!ValidationHelper.validateEmailFormat(email)) {
                    return done(null, false, { message: 'Formato de email inválido' });
                }

                if (!ValidationHelper.validatePasswordLength(password, 6)) {
                    return done(null, false, {
                        message: 'La contraseña debe tener al menos 6 caracteres'
                    });
                }

                const normalizedEmail = ValidationHelper.normalizeEmail(email);

                const emailExists = await UserRepository.emailExists(normalizedEmail);
                if (emailExists) {
                    return done(null, false, { message: 'El email ya está registrado' });
                }

                const hashedPassword = await BcryptHelper.hashPassword(password);

                const user = await UserRepository.create({
                    first_name,
                    last_name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: 'user'
                });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

/**
 * Estrategia de Login
 */
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        async (email, password, done) => {
            try {
                const normalizedEmail = ValidationHelper.normalizeEmail(email);
                const user = await UserRepository.findByEmail(normalizedEmail);

                if (!user) {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }

                const isValid = await BcryptHelper.comparePassword(password, user.password);
                if (!isValid) {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }

                await UserRepository.update(user._id, { lastLogin: new Date() });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

/**
 * Estrategia JWT desde cookie
 */
passport.use(
    'jwt',
    new LocalStrategy(
        {
            usernameField: 'token',
            passwordField: 'token',
            session: false,
            passReqToCallback: true
        },
        async (req, _token, _password, done) => {
            try {
                const tokenFromCookie = req.cookies?.currentUser;
                if (!tokenFromCookie) {
                    return done(null, false, { message: 'No autenticado' });
                }

                let decoded;
                try {
                    decoded = JwtHelper.verifyToken(tokenFromCookie);
                } catch (error) {
                    return done(null, false, { message: 'No autenticado' });
                }

                const user = await UserRepository.findById(decoded.id);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialización (compatibilidad con sesiones si se implementan)
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