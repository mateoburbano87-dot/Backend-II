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