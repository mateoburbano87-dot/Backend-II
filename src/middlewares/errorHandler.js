
import AppError from '../utils/AppError.js';

const errorHandler = (err, req, res, next) => {
    // Errores de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            message: 'Error de validación',
            errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'campo';
        return res.status(409).json({
            status: 'error',
            message: `El ${field} ya está registrado`
        });
    }

    // Errores operacionales (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Error no controlado
    console.error('Error no controlado:', err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};

export default errorHandler;