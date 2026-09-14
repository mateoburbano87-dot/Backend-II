
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';

import './config/passport.config.js';
import eventRoutes from './routes/eventRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/database.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Servidor activo',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tickets', ticketRoutes);

// Middleware centralizado de errores (debe ir al final)
app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

export default app;