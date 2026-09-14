
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class JwtHelper {
    /**
     * Genera un token JWT
     */
    static generateToken(payload) {
        try {
            const secret = process.env.JWT_SECRET;
            const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

            if (!secret) {
                throw new Error('JWT_SECRET no está definido en las variables de entorno');
            }

            return jwt.sign(payload, secret, { expiresIn });
        } catch (error) {
            throw new Error(`Error al generar token: ${error.message}`);
        }
    }

    /**
     * Verifica y decodifica un token JWT
     */
    static verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET no está definido en las variables de entorno');
            }

            return jwt.verify(token, secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            }
            throw new Error(`Error al verificar token: ${error.message}`);
        }
    }

    /**
     * Decodifica un token sin verificar (útil para debugging)
     */
    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error(`Error al decodificar token: ${error.message}`);
        }
    }

    /**
     * Extrae el token de la cookie o del header Authorization
     */
    static extractToken(req) {
        const tokenFromCookie = req.cookies?.currentUser;
        if (tokenFromCookie) return tokenFromCookie;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        return null;
    }
}

export default JwtHelper;