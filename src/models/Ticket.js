
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
    }
}, {
    timestamps: true
});

// Índices
ticketSchema.index({ user: 1, event: 1 });
ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ reservationCode: 1 });

// Métodos
ticketSchema.methods.isActive = function () {
    return this.status === 'confirmed' || this.status === 'pending';
};

ticketSchema.methods.isCancelled = function () {
    return this.status === 'cancelled';
};

/**
 * Genera código de reserva con formato EVT-XXXX
 * Ejemplo: EVT-7QK2
 */
ticketSchema.statics.generateReservationCode = function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'EVT-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

ticketSchema.statics.hasActiveTicket = async function (userId, eventId) {
    const ticket = await this.findOne({
        user: userId,
        event: eventId,
        status: { $in: ['confirmed', 'pending'] }
    });
    return !!ticket;
};

ticketSchema.statics.countOccupiedSpots = async function (eventId) {
    const result = await this.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(eventId),
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