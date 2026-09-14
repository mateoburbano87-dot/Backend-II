
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;