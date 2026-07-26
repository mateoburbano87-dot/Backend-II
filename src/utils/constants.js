// Constantes para la aplicación

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
};

export const CATEGORIES = {
  CONFERENCE: 'conference',
  WORKSHOP: 'workshop',
  SEMINAR: 'seminar',
  WEBINAR: 'webinar',
  NETWORKING: 'networking',
  OTHER: 'other',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export const MESSAGES = {
  SERVER_ACTIVE: 'Servidor activo',
  EVENT_NOT_FOUND: 'Evento no encontrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
};

export default {
  ROLES,
  CATEGORIES,
  HTTP_STATUS,
  MESSAGES,
};