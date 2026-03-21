import bcrypt from "bcryptjs";

export class PasswordService {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
    // Affiche le hash de "123456" à l'appel de la classe
  
  }

  /**
   * Hash un mot de passe
   * @param {string} plainPassword
   * @returns {Promise<string>} hashed password
   */
  async hash(plainPassword) {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Compare un mot de passe en clair avec un hash
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>} true si valide
   */
  async compare(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Vérifie si le mot de passe respecte certaines règles
   * @param {string} password
   * @returns {boolean}
   */
  validate(password) {
    return (
      typeof password === "string" &&
      password.length >= 4 &&
      password.length <= 255
    );
  }

  /**
   * Génère un mot de passe aléatoire
   * @param {number} length
   * @returns {string} mot de passe aléatoire
   */
  generateRandomPassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}