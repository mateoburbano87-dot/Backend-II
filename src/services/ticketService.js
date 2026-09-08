
import TicketRepository from '../repositories/ticketRepository.js';
import EventRepository from '../repositories/eventRepository.js';
import UserRepository from '../repositories/userRepository.js';
import Ticket from '../models/Ticket.js';
import EmailService from './emailService.js';

class TicketService {
    /**
     * Crea un nuevo ticket (inscripción)
     * Con todas las validaciones de negocio
     */
    async createTicket(userId, eventId, quantity = 1) {
        try {
            // 1. Verificar que el evento existe
            const event = await EventRepository.findById(eventId);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            // 2. Verificar que el evento está publicado
            if (event.status !== 'published') {
                throw new Error('El evento no está disponible para inscripciones');
            }

            // 3. Verificar que el evento no está cancelado
            if (event.status === 'cancelled') {
                throw new Error('El evento ha sido cancelado');
            }

            // 4. Verificar que el evento no está finalizado
            if (event.status === 'finished') {
                throw new Error('El evento ya ha finalizado');
            }

            // 5. Verificar que la fecha del evento no ha pasado
            if (new Date(event.date) < new Date()) {
                throw new Error('La fecha del evento ya pasó');
            }

            // 6. Verificar cantidad válida
            if (!quantity || quantity < 1) {
                throw new Error('La cantidad debe ser mayor a 0');
            }

            if (quantity > 10) {
                throw new Error('No puedes reservar más de 10 entradas');
            }

            // 7. Verificar cupos disponibles
            const occupiedSpots = await TicketRepository.countOccupiedSpots(eventId);
            const availableSpots = event.capacity - occupiedSpots;

            if (availableSpots < quantity) {
                throw new Error(`No hay cupos disponibles. Solo quedan ${availableSpots} cupos`);
            }

            // 8. Verificar que el usuario no tenga ya un ticket activo
            const hasActiveTicket = await TicketRepository.hasActiveTicket(userId, eventId);
            if (hasActiveTicket) {
                throw new Error('Ya tienes una inscripción activa para este evento');
            }

            // 9. Verificar que el usuario existe
            const user = await UserRepository.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // 10. Generar código de reserva único
            let reservationCode;
            let isUnique = false;
            while (!isUnique) {
                reservationCode = Ticket.generateReservationCode();
                const existing = await TicketRepository.findByUserAndEvent(userId, eventId);
                if (!existing) {
                    isUnique = true;
                }
            }

            // 11. Crear el ticket
            const ticketData = {
                user: userId,
                event: eventId,
                quantity,
                reservationCode,
                status: 'confirmed'
            };

            const ticket = await TicketRepository.create(ticketData);

            // 12. Actualizar contador de registrados en el evento
            const updatedEvent = await EventRepository.updateRegisteredCount(eventId, quantity);

            // 13. Enviar email de confirmación
            try {
                await EmailService.sendConfirmationEmail(user, event, ticket);
            } catch (emailError) {
                console.error('Error al enviar email:', emailError);
                // No falla la inscripción si el email falla
            }

            // 14. Devolver ticket con datos poblados
            return await TicketRepository.findById(ticket._id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Cancela un ticket
     * Libera cupos automáticamente
     */
    async cancelTicket(ticketId, userId, userRole) {
        try {
            // 1. Verificar que el ticket existe
            const ticket = await TicketRepository.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            // 2. Verificar que el ticket no esté cancelado
            if (ticket.status === 'cancelled') {
                throw new Error('El ticket ya está cancelado');
            }

            // 3. Verificar permisos: solo el propietario o admin
            if (userRole !== 'admin' && ticket.user._id.toString() !== userId) {
                throw new Error('No tenés permisos para cancelar este ticket');
            }

            // 4. Verificar que el evento no esté finalizado
            const event = await EventRepository.findById(ticket.event._id);
            if (event.status === 'finished') {
                throw new Error('No se puede cancelar un ticket de un evento finalizado');
            }

            // 5. Cancelar el ticket
            const cancelledTicket = await TicketRepository.cancel(ticketId);

            // 6. Liberar cupo (actualizar contador)
            await EventRepository.updateRegisteredCount(ticket.event._id, -ticket.quantity);

            return cancelledTicket;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene tickets de un usuario
     */
    async getTicketsByUser(userId) {
        try {
            return await TicketRepository.findByUser(userId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene tickets de un evento (solo para organizador/admin)
     */
    async getTicketsByEvent(eventId, userId, userRole) {
        try {
            // 1. Verificar que el evento existe
            const event = await EventRepository.findById(eventId);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            // 2. Verificar permisos: solo organizador del evento o admin
            if (userRole === 'organizer' && event.organizer.toString() !== userId) {
                throw new Error('No tenés permisos para ver los tickets de este evento');
            }

            if (userRole === 'user') {
                throw new Error('No tenés permisos para ver los tickets de este evento');
            }

            return await TicketRepository.findByEvent(eventId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Verifica disponibilidad de cupos
     */
    async checkAvailability(eventId) {
        try {
            const event = await EventRepository.findById(eventId);
            if (!event) {
                throw new Error('Evento no encontrado');
            }

            const occupiedSpots = await TicketRepository.countOccupiedSpots(eventId);
            const availableSpots = event.capacity - occupiedSpots;

            return {
                eventId,
                capacity: event.capacity,
                occupied: occupiedSpots,
                available: availableSpots,
                isFull: availableSpots <= 0
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new TicketService();