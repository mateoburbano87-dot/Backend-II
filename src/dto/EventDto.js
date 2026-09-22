
import UserDto from './UserDto.js';

class EventDto {
    /**
     * Convierte un evento en un DTO seguro
     */
    static toResponse(event) {
        if (!event) return null;

        const dto = {
            id: event._id?.toString() || event.id,
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date,
            location: event.location,
            capacity: event.capacity,
            price: event.price,
            status: event.status,
            registeredCount: event.registeredCount,
            tags: event.tags || [],
            image: event.image,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
        };

        // Si organizer fue poblado, devolver DTO reducido (sin password)
        if (event.organizer) {
            if (typeof event.organizer === 'object' && event.organizer.email) {
                dto.organizer = UserDto.toMinimal(event.organizer);
            } else {
                dto.organizer = event.organizer.toString();
            }
        }

        return dto;
    }

    /**
     * Convierte un array de eventos
     */
    static toResponseList(events) {
        if (!Array.isArray(events)) return [];
        return events.map(event => this.toResponse(event));
    }
}

export default EventDto;