import bcrypt from 'bcryptjs';

class BcryptHelper {
  /**
   * Hashea una contraseña usando bcrypt
   @param {string} password - Contraseña en texto plano
   @param {number} saltRounds - Número de rondas de sal por defecto 10
   @returns {Promise<string>} - Contraseña hasheada
   */ 
  static async hashPassword(password, saltRounds = 10) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error al hashear la contraseña: ${error.message}`);
    }
  }

  /**
   * Compara una contraseña en texto plano con su hash
   @param {string} password - Contraseña en texto plano
   @param {string} hashedPassword - Contraseña hasheada
   @returns {Promise<boolean>} - true si coinciden, false si no
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