import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport.config.js'; // Importar configuración de Passport
import eventRoutes from './routes/eventRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/database.js';

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicializar Passport
app.use(passport.initialize());

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor activo',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Rutas de la API
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);

// Manejador de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
  });
});

export default app;