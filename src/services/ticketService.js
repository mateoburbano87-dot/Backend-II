
import TicketRepository from '../repositories/ticketRepository.js';
import EventRepository from '../repositories/eventRepository.js';
import UserRepository from '../repositories/userRepository.js';
import EmailService from './emailService.js';
import AppError from '../utils/AppError.js';

class TicketService {
    async createTicket(userId, eventId, quantity = 1) {
        // Validar cantidad
        if (!quantity || quantity < 1) {
            throw AppError.badRequest('La cantidad debe ser mayor a 0');
        }
        if (quantity > 10) {
            throw AppError.badRequest('No puedes reservar más de 10 entradas');
        }

        // Validar evento
        const event = await EventRepository.findById(eventId);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }

        if (event.status !== 'published') {
            throw AppError.badRequest('El evento no está disponible para inscripciones');
        }
        if (event.status === 'cancelled') {
            throw AppError.badRequest('El evento ha sido cancelado');
        }
        if (event.status === 'finished') {
            throw AppError.badRequest('El evento ya ha finalizado');
        }
        if (new Date(event.date) < new Date()) {
            throw AppError.badRequest('La fecha del evento ya pasó');
        }

        // Validar cupos
        const occupiedSpots = await TicketRepository.countOccupiedSpots(eventId);
        const availableSpots = event.capacity - occupiedSpots;
        if (availableSpots < quantity) {
            throw AppError.conflict(`No hay cupos disponibles. Solo quedan ${availableSpots} cupos`);
        }

        // Validar duplicado
        const hasActiveTicket = await TicketRepository.hasActiveTicket(userId, eventId);
        if (hasActiveTicket) {
            throw AppError.conflict('Ya tienes una inscripción activa para este evento');
        }

        // Validar usuario
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw AppError.notFound('Usuario no encontrado');
        }

        // Generar código único
        const reservationCode = await this._generateUniqueCode();

        // Crear ticket
        const ticket = await TicketRepository.create({
            user: userId,
            event: eventId,
            quantity,
            reservationCode,
            status: 'confirmed'
        });

        // Actualizar contador de registrados
        await EventRepository.incrementRegisteredCount(eventId, quantity);

        // Enviar email (sin interrumpir el flujo si falla)
        try {
            await EmailService.sendConfirmationEmail(user, event, ticket);
        } catch (error) {
            console.error('Error al enviar email de confirmación:', error.message);
        }

        return await TicketRepository.findById(ticket._id);
    }

    async cancelTicket(ticketId, userId, userRole) {
        const ticket = await TicketRepository.findById(ticketId);
        if (!ticket) {
            throw AppError.notFound('Ticket no encontrado');
        }

        if (ticket.status === 'cancelled') {
            throw AppError.conflict('El ticket ya está cancelado');
        }

        // Permisos: solo el propietario o admin
        const ticketUserId = ticket.user._id?.toString() || ticket.user.toString();
        if (userRole !== 'admin' && ticketUserId !== userId.toString()) {
            throw AppError.forbidden('No tenés permisos para cancelar este ticket');
        }

        // Validar que el evento no esté finalizado
        const eventId = ticket.event._id?.toString() || ticket.event.toString();
        const event = await EventRepository.findById(eventId);
        if (event && event.status === 'finished') {
            throw AppError.forbidden('No se puede cancelar un ticket de un evento finalizado');
        }

        // Cancelar ticket
        const cancelledTicket = await TicketRepository.cancelTicket(ticketId);

        // Liberar cupo
        await EventRepository.incrementRegisteredCount(eventId, -ticket.quantity);

        return cancelledTicket;
    }

    async getTicketsByUser(userId) {
        return await TicketRepository.findByUser(userId);
    }

    async getTicketsByEvent(eventId, userId, userRole) {
        const event = await EventRepository.findById(eventId);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }

        if (userRole === 'user') {
            throw AppError.forbidden('No tenés permisos para ver los tickets de este evento');
        }

        if (userRole === 'organizer') {
            const organizerId = event.organizer._id?.toString() || event.organizer.toString();
            if (organizerId !== userId.toString()) {
                throw AppError.forbidden('No tenés permisos para ver los tickets de este evento');
            }
        }

        return await TicketRepository.findByEvent(eventId);
    }

    async checkAvailability(eventId) {
        const event = await EventRepository.findById(eventId);
        if (!event) {
            throw AppError.notFound('Evento no encontrado');
        }

        const occupied = await TicketRepository.countOccupiedSpots(eventId);
        const available = event.capacity - occupied;

        return {
            eventId,
            capacity: event.capacity,
            occupied,
            available,
            isFull: available <= 0
        };
    }

    async _generateUniqueCode() {
        const { default: Ticket } = await import('../models/Ticket.js');
        let code;
        let exists = true;
        let attempts = 0;

        while (exists && attempts < 10) {
            code = Ticket.generateReservationCode();
            exists = await TicketRepository.reservationCodeExists(code);
            attempts++;
        }

        if (exists) {
            throw AppError.internal('No se pudo generar un código de reserva único');
        }

        return code;
    }
}

export default new TicketService();