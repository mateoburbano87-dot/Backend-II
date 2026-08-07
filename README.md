
## Descripción del Proyecto

Plataforma de Eventos e Inscripciones - Backend API desarrollada con Node.js y Express, siguiendo una arquitectura por capas con autenticación JWT mediante cookies HTTP Only.

## Características

- ✅ Registro de usuarios con hash de contraseña (bcrypt)
- ✅ Login con JWT almacenado en cookie HTTP Only
- ✅ Ruta protegida `/current` para obtener usuario autenticado
- ✅ Logout con eliminación de cookie
- ✅ Arquitectura por capas (Controller → Service → Repository → DAO → Model)
- ✅ Validación de datos en múltiples niveles
- ✅ Manejo de errores centralizado
- ✅ Variables de entorno para configuración segura

## Tecnologías

| Tecnología | Descripción |
|------------|-------------|
| Node.js | Runtime JavaScript |
| Express.js | Framework web |
| MongoDB | Base de datos NoSQL |
| Mongoose | ODM para MongoDB |
| JWT | Autenticación basada en tokens |
| bcryptjs | Hashing de contraseñas |
| cookie-parser | Manejo de cookies |
| dotenv | Variables de entorno |
| CORS | Cross-Origin Resource Sharing |



