#  Event Platform Backend

API REST de la **Plataforma de Eventos e Inscripciones** desarrollada con Node.js, Express, MongoDB y Mongoose. Arquitectura profesional en capas (DAO → Repository → Service → Controller → DTO).

##  Tecnologías

| Tecnología | Uso |
|------------|-----|
| Node.js | Runtime |
| Express.js | Framework web |
| MongoDB + Mongoose | Base de datos |
| Passport.js | Autenticación (estrategias) |
| JWT | Tokens de sesión |
| bcryptjs | Hash de contraseñas |
| Nodemailer | Envío de emails |
| cookie-parser | Manejo de cookies |
| dotenv | Variables de entorno |

# Variables de Entorno

Variable	Descripción	Ejemplo
PORT	Puerto del servidor	3000
NODE_ENV	Entorno	development
MONGO_URL	URL de MongoDB	mongodb://localhost:27017/event-platform
JWT_SECRET	Secreto para JWT	cambio-en-produccion
JWT_EXPIRES_IN	Expiración del token	1h
CORS_ORIGIN	Origen permitido	http://localhost:3000
MAIL_HOST	Host SMTP	smtp.mailtrap.io
MAIL_PORT	Puerto SMTP	2525
MAIL_USER	Usuario SMTP	tu_usuario
MAIL_PASS	Contraseña SMTP	tu_password
MAIL_FROM	Remitente de emails	"Eventos no-reply@x.com"
FRONTEND_URL	URL del frontend	http://localhost:3000

# Roles y Autorización

Roles
Rol	Descripción
user	Ver eventos, inscribirse, ver sus tickets
organizer	Crear y gestionar sus propios eventos
admin	Gestionar todo

# Matriz de Permisos

Acción	user	organizer	admin
Ver eventos	✅	✅	✅
Inscribirse a eventos	✅	✅	✅
Ver sus tickets	✅	✅	✅
Cancelar su ticket	✅	✅	✅
Crear evento	❌	✅	✅
Editar evento propio	❌	✅	✅
Editar evento ajeno	❌	❌	✅
Cancelar evento propio	❌	✅	✅
Cancelar evento ajeno	❌	❌	✅
Ver tickets de un evento	❌	✅ (solo suyos)	✅
Eliminar evento	❌	❌	✅

# Códigos HTTP

Código	Significado
200	OK
201	Creado
400	Datos inválidos
401	No autenticado
403	Sin permisos
404	No encontrado
409	Conflicto (ej: email/ticket duplicado)
500	Error interno

# Rutas de la API

Health Check

Método	Ruta	Descripción
GET	/api/health	Verificar estado del servidor

# Sesiones

Método	Ruta	Auth	Descripción
POST	/api/sessions/register	No	Registrar usuario
POST	/api/sessions/login	No	Iniciar sesión (setea cookie)
GET	/api/sessions/current	Sí	Usuario autenticado
POST	/api/sessions/logout	No	Cerrar sesión
GET	/api/sessions/admin/test	admin	Ruta de prueba
GET	/api/sessions/organizer/test	organizer/admin	Ruta de prueba

# Eventos

Método	Ruta	Auth	Descripción
GET	/api/events	No	Listar con filtros y paginación
GET	/api/events/upcoming	No	Eventos próximos
GET	/api/events/organizer/:organizerId	No	Eventos por organizador
GET	/api/events/:id	No	Detalle de evento
GET	/api/events/:eid/availability	No	Cupos disponibles
POST	/api/events	organizer/admin	Crear evento
PUT	/api/events/:id	organizer/admin	Actualizar evento
PATCH	/api/events/:id/cancel	organizer/admin	Cancelar evento
GET	/api/events/:eid/tickets	organizer/admin	Tickets del evento
DELETE	/api/events/:id	admin	Eliminar evento

# Tickets

Método	Ruta	Auth	Descripción
POST	/api/tickets	Sí	Inscribirse a un evento
GET	/api/tickets/my-tickets	Sí	Mis inscripciones
DELETE	/api/tickets/:id	Sí	Cancelar mi ticket
GET	/api/tickets/availability/:eid	Sí	Disponibilidad
GET	/api/tickets/event/:eid	organizer/admin	Tickets del evento
