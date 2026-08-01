import mongoose from 'mongoose';
import ValidationHelper from '../utils/validationHelper.js';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres'],
  },
  last_name: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder los 50 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'organizer', 'admin'],
      message: 'Rol inválido. Debe ser: user, organizer o admin',
    },
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  // Configuración para que toJSON elimine campos sensibles
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

// Middleware pre-save para normalizar email antes de guardar
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = ValidationHelper.normalizeEmail(this.email);
  }
  this.updatedAt = Date.now();
  next();
});

// Método para sanitizar datos del usuario (eliminar password)
userSchema.methods.sanitize = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Método estático para verificar si email existe
userSchema.statics.emailExists = async function(email) {
  const normalizedEmail = ValidationHelper.normalizeEmail(email);
  const user = await this.findOne({ email: normalizedEmail });
  return !!user;
};

const User = mongoose.model('User', userSchema);

export default User;