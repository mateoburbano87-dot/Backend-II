
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres'],
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: {
            values: ['conference', 'workshop', 'seminar', 'webinar', 'networking', 'other'],
            message: 'Categoría inválida'
        }
    },
    date: {
        type: Date,
        required: [true, 'La fecha es requerida'],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'La fecha del evento debe ser futura'
        }
    },
    location: {
        type: String,
        required: [true, 'La ubicación es requerida'],
        trim: true,
        minlength: [3, 'La ubicación debe tener al menos 3 caracteres']
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es requerida'],
        min: [1, 'La capacidad debe ser al menos 1'],
        max: [10000, 'La capacidad no puede exceder 10000']
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'cancelled', 'finished'],
            message: 'Estado inválido. Debe ser: draft, published, cancelled, finished'
        },
        default: 'draft'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El organizador es requerido']
    },
    registeredCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text' });

// Método para verificar si el evento puede ser modificado
eventSchema.methods.canBeModified = function () {
    return this.status !== 'cancelled' && this.status !== 'finished';
};

// Método para verificar propiedad
eventSchema.methods.isOwnedBy = function (userId) {
    return this.organizer.toString() === userId.toString();
};

const Event = mongoose.model('Event', eventSchema);

export default Event;