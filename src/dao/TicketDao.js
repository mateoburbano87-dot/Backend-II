
class TicketDto {
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

        // User: solo ID si no está poblado, o DTO minimal si lo está
        if (ticket.user) {
            if (typeof ticket.user === 'object' && ticket.user.email) {
                dto.user = ticket.user._id?.toString();
            } else {
                dto.user = ticket.user.toString();
            }
        }

        // Event: solo ID si no está poblado, o info básica si lo está
        if (ticket.event) {
            if (typeof ticket.event === 'object' && ticket.event.title) {
                dto.event = ticket.event._id?.toString();
                dto.eventDetails = {
                    id: ticket.event._id?.toString(),
                    title: ticket.event.title,
                    date: ticket.event.date,
                    location: ticket.event.location,
                    status: ticket.event.status
                };
            } else {
                dto.event = ticket.event.toString();
            }
        }

        return dto;
    }

    static toResponseList(tickets) {
        if (!Array.isArray(tickets)) return [];
        return tickets.map(ticket => this.toResponse(ticket));
    }
}

export default TicketDto;