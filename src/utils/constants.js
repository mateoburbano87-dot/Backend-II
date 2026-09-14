
export const ROLES = {
    USER: 'user',
    ORGANIZER: 'organizer',
    ADMIN: 'admin'
};

export const EVENT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    CANCELLED: 'cancelled',
    FINISHED: 'finished'
};

export const TICKET_STATUS = {
    CONFIRMED: 'confirmed',
    PENDING: 'pending',
    CANCELLED: 'cancelled'
};

export const CATEGORIES = {
    CONFERENCE: 'conference',
    WORKSHOP: 'workshop',
    SEMINAR: 'seminar',
    WEBINAR: 'webinar',
    NETWORKING: 'networking',
    OTHER: 'other'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
};

export const MESSAGES = {
    SERVER_ACTIVE: 'Servidor activo',
    EVENT_NOT_FOUND: 'Evento no encontrado',
    USER_NOT_FOUND: 'Usuario no encontrado',
    TICKET_NOT_FOUND: 'Ticket no encontrado',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    UNAUTHORIZED: 'No autenticado',
    FORBIDDEN: 'No tenés permisos para realizar esta acción',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado'
};

export default {
    ROLES,
    EVENT_STATUS,
    TICKET_STATUS,
    CATEGORIES,
    HTTP_STATUS,
    MESSAGES
};