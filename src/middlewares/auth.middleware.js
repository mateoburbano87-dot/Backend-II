

import passport from 'passport';
import AppError from '../utils/AppError.js';

export const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err);

        if (!user) {
            return next(AppError.unauthorized('No autenticado'));
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name
        };

        next();
    })(req, res, next);
};

export default { auth };