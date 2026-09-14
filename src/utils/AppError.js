
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new AppError(message, 400);
    }

    static unauthorized(message = 'No autenticado') {
        return new AppError(message, 401);
    }

    static forbidden(message = 'No tenés permisos para realizar esta acción') {
        return new AppError(message, 403);
    }

    static notFound(message = 'Recurso no encontrado') {
        return new AppError(message, 404);
    }

    static conflict(message = 'Conflicto con el recurso') {
        return new AppError(message, 409);
    }

    static internal(message = 'Error interno del servidor') {
        return new AppError(message, 500);
    }
}

export default AppError;