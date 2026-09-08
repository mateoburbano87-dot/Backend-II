/**
 * Modelo de Ticket (Inscripción)
 * Representa la inscripción de un usuario a un evento
 * Usa referencias a User y Event (sin embebidos)
 */

import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'El evento es requerido']
    },
    status: {
        type: String,
        enum: {
            values: ['confirmed', 'pending', 'cancelled'],
            message: 'Estado inválido. Debe ser: confirmed, pending, cancelled'
        },
        default: 'confirmed'
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [1, 'La cantidad debe ser al menos 1'],
        max: [10, 'No puedes reservar más de 10 entradas']
    },
    reservationCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cancelledAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
ticketSchema.index({ user: 1, event: 1 });
ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ reservationCode: 1 });

// Método para verificar si el ticket está activo
ticketSchema.methods.isActive = function() {
    return this.status === 'confirmed' || this.status === 'pending';
};

// Método para verificar si el ticket está cancelado
ticketSchema.methods.isCancelled = function() {
    return this.status === 'cancelled';
};

// Método para cancelar ticket
ticketSchema.methods.cancel = function() {
    if (this.status === 'cancelled') {
        throw new Error('El ticket ya está cancelado');
    }
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    return this.save();
};

// Método estático para generar código de reserva
ticketSchema.statics.generateReservationCode = function() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

// Método estático para verificar si el usuario ya tiene ticket activo
ticketSchema.statics.hasActiveTicket = async function(userId, eventId) {
    const ticket = await this.findOne({
        user: userId,
        event: eventId,
        status: { $in: ['confirmed', 'pending'] }
    });
    return !!ticket;
};

// Método estático para contar cupos ocupados
ticketSchema.statics.countOccupiedSpots = async function(eventId) {
    const result = await this.aggregate([
        {
            $match: {
                event: eventId,
                status: { $in: ['confirmed', 'pending'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$quantity' }
            }
        }
    ]);
    return result.length > 0 ? result[0].total : 0;
};

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;