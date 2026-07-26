import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [100, 'El título no puede exceder los 100 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres'],
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida'],
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad es requerida'],
    min: [1, 'La capacidad debe ser al menos 1'],
    max: [10000, 'La capacidad no puede exceder 10000'],
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['conference', 'workshop', 'seminar', 'webinar', 'networking', 'other'],
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento de las consultas
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: 'text' });

const Event = mongoose.model('Event', eventSchema);

export default Event;