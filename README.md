## 🔐 Roles y Autorización

### Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `user` | Usuario estándar | Ver eventos, registrarse |
| `organizer` | Organizador de eventos | Crear y gestionar sus eventos |
| `admin` | Administrador del sistema | Gestionar todo, incluyendo usuarios |

### Matriz de Permisos

| Acción | user | organizer | admin |
|--------|------|-----------|-------|
| Ver eventos | ✅ | ✅ | ✅ |
| Ver evento por ID | ✅ | ✅ | ✅ |
| Crear evento | ❌ | ✅ | ✅ |
| Editar evento propio | ❌ | ✅ | ✅ |
| Editar evento ajeno | ❌ | ❌ | ✅ |
| Eliminar evento | ❌ | ❌ | ✅ |
| Ver /current | ✅ | ✅ | ✅ |
| Ruta admin | ❌ | ❌ | ✅ |
| Ruta organizer | ❌ | ✅ | ✅ |

### Códigos de Error

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 401 | No autenticado | No hay cookie/token válido |
| 403 | Sin permisos | Autenticado pero rol no autorizado |

### Rutas Protegidas

| Método | Ruta | Requisito |
|--------|------|-----------|
| GET | `/api/sessions/current` | Autenticado (401 si no) |
| POST | `/api/events` | organizer o admin (403 si user) |
| PUT | `/api/events/:id` | organizer propietario o admin |
| DELETE | `/api/events/:id` | admin |
| GET | `/api/sessions/admin/test` | admin |
| GET | `/api/sessions/organizer/test` | organizer o admin |

