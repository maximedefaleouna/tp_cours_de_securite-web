import { AppError } from "../../middlewares/error.middleware.js";
import { PasswordService } from "../../security/password.js";
import crypto from "crypto";

// Utilitaire pour générer matricule aléatoire
const generateMatricule = (prefix = "ADM", length = 4) => {
  const randomNumber = crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
  return `${prefix}${randomNumber}`;
};

export default class AdministrationService {
  constructor(repository) {
    this.repo = repository;
    this.passwordService = new PasswordService();
  }

  // Génère un matricule unique
  async generateUniqueMatricule() {
    let matricule;
    let exists = true;

    while (exists) {
      matricule = generateMatricule("ADM", 4);
      const existing = await this.repo.findByMatricule(matricule);
      exists = !!existing;
    }

    return matricule;
  }

  async createAdministration(data, currentUserId) {
    const existingEmail = await this.repo.findByEmail(data.email);
    if (existingEmail) throw new AppError("Email déjà utilisé", 400);

    const matricule = await this.generateUniqueMatricule();

    const defaultPassword = "123456"; // mot de passe par défaut
    const hashedPassword = await this.passwordService.hash(defaultPassword);

    return this.repo.create({
      ...data,
      matricule,
      password: hashedPassword,
      createdById: currentUserId,
      updatedById: currentUserId,
    });
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id) {
    const admin = await this.repo.findById(id);
    if (!admin) throw new AppError("Administration introuvable", 404);
    return admin;
  }

  async update(id, data, currentUserId) {
    return this.repo.update(id, { ...data, updatedById: currentUserId });
  }

  async delete(id) {
    return this.repo.softDelete(id);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const admin = await this.repo.findById(userId);
    if (!admin) throw new AppError("Utilisateur introuvable", 404);

    const isValid = await this.passwordService.compare(
      oldPassword,
      admin.password,
    );

    if (!isValid) throw new AppError("Ancien mot de passe incorrect", 400);

    const hashed = await this.passwordService.hash(newPassword);

    return this.repo.update(userId, { password: hashed });
  }
}
