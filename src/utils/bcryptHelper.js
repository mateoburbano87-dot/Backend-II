
import bcrypt from 'bcryptjs';

class BcryptHelper {
    /**
     * Hashea una contraseña
     */
    static async hashPassword(password, saltRounds = 10) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error(`Error al hashear la contraseña: ${error.message}`);
        }
    }

    /**
     * Compara una contraseña con su hash
     */
    static async comparePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error(`Error al comparar contraseñas: ${error.message}`);
        }
    }
}

export default BcryptHelper;