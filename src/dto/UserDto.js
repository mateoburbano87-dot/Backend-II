
class UserDto {
    /**
     * Convierte un usuario (o subdocumento poblado) en un DTO seguro
     */
    static toResponse(user) {
        if (!user) return null;

        return {
            id: user._id?.toString() || user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
    }

    /**
     * DTO reducido para populate (evita datos sensibles)
     */
    static toMinimal(user) {
        if (!user) return null;

        return {
            id: user._id?.toString() || user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        };
    }

    /**
     * Convierte un array de usuarios
     */
    static toResponseList(users) {
        if (!Array.isArray(users)) return [];
        return users.map(user => this.toResponse(user));
    }
}

export default UserDto;