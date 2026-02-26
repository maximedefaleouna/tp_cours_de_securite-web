import { AppError } from "../../middlewares/error.middleware.js";
import { PasswordService } from "../../security/password.js";
import emailService from "../../utils/email.service.js";
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

    // Generate a random temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex").toUpperCase();
    const hashedPassword = await this.passwordService.hash(tempPassword);

    const personnel = await this.repo.create({
      ...data,
      matricule,
      password: hashedPassword,
      createdById: currentUserId,
      updatedById: currentUserId,
    });

    // Send email with credentials
    await emailService.sendPersonnelCredentials(
      data.email,
      data.prenom,
      data.nom,
      matricule,
      tempPassword,
      data.isAdmin || false
    );

    return personnel;
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

  async getMe(userId) {
    console.log("DEBUG getMe: userId =", userId);
    const admin = await this.repo.findById(userId);
    if (!admin) throw new AppError("Utilisateur introuvable", 404);

    // Get formations where this user is responsable
    const formationsResponsable = await this.repo.findFormationsByResponsable(userId);
    console.log("DEBUG getMe: formationsResponsable =", formationsResponsable.length);

    // Get courses taught by this professor
    const coursAsProfesseur = await this.repo.findCoursByProfesseur(userId);
    console.log("DEBUG getMe: coursAsProfesseur =", coursAsProfesseur.length);

    // Get all courses from formations where this user is responsable
    const formationIds = formationsResponsable.map(f => f.id);
    console.log("DEBUG getMe: formationIds =", formationIds);
    const coursFromFormations = formationIds.length > 0
      ? await this.repo.findCoursByFormationIds(formationIds)
      : [];
    console.log("DEBUG getMe: coursFromFormations =", coursFromFormations.length);

    // Merge courses (as professor + from managed formations) and remove duplicates
    const allCoursMap = new Map();
    [...coursAsProfesseur, ...coursFromFormations].forEach(c => {
      allCoursMap.set(c.id, c);
    });
    const cours = Array.from(allCoursMap.values());
    console.log("DEBUG getMe: total cours =", cours.length);

    return {
      ...admin,
      formationsResponsable,
      cours,
    };
  }
}
