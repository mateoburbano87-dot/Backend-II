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
            validator: function(value) {
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

// Índices para mejorar el rendimiento de las consultas
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text' });

// Middleware pre-save para validar estado
eventSchema.pre('save', function(next) {
    // No permitir publicar eventos con fecha pasada
    if (this.status === 'published' && this.date < new Date()) {
        return next(new Error('No se puede publicar un evento con fecha pasada'));
    }
    next();
});

// Método para verificar si el evento puede ser modificado
eventSchema.methods.canBeModified = function() {
    return this.status !== 'cancelled' && this.status !== 'finished';
};

// Método para cancelar evento
eventSchema.methods.cancel = function() {
    if (this.status === 'cancelled') {
        throw new Error('El evento ya está cancelado');
    }
    if (this.status === 'finished') {
        throw new Error('No se puede cancelar un evento finalizado');
    }
    this.status = 'cancelled';
    return this.save();
};

// Método para publicar evento
eventSchema.methods.publish = function() {
    if (this.status === 'cancelled') {
        throw new Error('No se puede publicar un evento cancelado');
    }
    if (this.status === 'finished') {
        throw new Error('No se puede publicar un evento finalizado');
    }
    if (this.date < new Date()) {
        throw new Error('No se puede publicar un evento con fecha pasada');
    }
    this.status = 'published';
    return this.save();
};

// Método para finalizar evento
eventSchema.methods.finish = function() {
    if (this.status === 'cancelled') {
        throw new Error('No se puede finalizar un evento cancelado');
    }
    this.status = 'finished';
    return this.save();
};

// Método para verificar propiedad
eventSchema.methods.isOwnedBy = function(userId) {
    return this.organizer.toString() === userId.toString();
};

// Método estático para obtener eventos con filtros
eventSchema.statics.getEventsWithFilters = async function(filters = {}, options = {}) {
    const { 
        status, 
        category, 
        location, 
        dateFrom, 
        dateTo,
        page = 1,
        limit = 10,
        sort = 'date'
    } = filters;

    // Construir query
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Opciones de paginación
    const skip = (page - 1) * limit;

    // Ordenamiento
    const sortOptions = {};
    if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
            if (field.startsWith('-')) {
                sortOptions[field.substring(1)] = -1;
            } else {
                sortOptions[field] = 1;
            }
        });
    }

    // Ejecutar consulta
    const [data, total] = await Promise.all([
        this.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('organizer', 'first_name last_name email'),
        this.countDocuments(query)
    ]);

    return {
        data,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
    };
};

const Event = mongoose.model('Event', eventSchema);

export default Event;