/**
 * DTO de Ticket
 * Filtra los datos de tickets/inscripciones en las respuestas
 * Si el evento o el usuario fueron poblados, usa sus DTOs respectivos
 */

import UserDto from './UserDto.js';
import EventDto from './EventDto.js';

class TicketDto {
    /**
     * Convierte un ticket en un DTO seguro
     */
    static toResponse(ticket) {
        if (!ticket) return null;

        const dto = {
            id: ticket._id?.toString() || ticket.id,
            status: ticket.status,
            quantity: ticket.quantity,
            reservationCode: ticket.reservationCode,
            createdAt: ticket.createdAt,
            cancelledAt: ticket.cancelledAt
        };

        // Si user fue poblado (objeto), usar DTO minimal
        if (ticket.user) {
            if (typeof ticket.user === 'object' && ticket.user.email) {
                dto.user = UserDto.toMinimal(ticket.user);
            } else {
                dto.user = ticket.user.toString();
            }
        }

        // Si event fue poblado (objeto), usar DTO reducido
        if (ticket.event) {
            if (typeof ticket.event === 'object' && ticket.event.title) {
                dto.event = {
                    id: ticket.event._id?.toString() || ticket.event.id,
                    title: ticket.event.title,
                    date: ticket.event.date,
                    location: ticket.event.location,
                    status: ticket.event.status,
                    price: ticket.event.price
                };
            } else {
                dto.event = ticket.event.toString();
            }
        }

        return dto;
    }

    /**
     * Convierte un array de tickets
     */
    static toResponseList(tickets) {
        if (!Array.isArray(tickets)) return [];
        return tickets.map(ticket => this.toResponse(ticket));
    }
}

export default TicketDto;