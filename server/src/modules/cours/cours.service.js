import { AppError } from "../../middlewares/error.middleware.js";

export default class CoursService {
  constructor(repository) {
    this.repo = repository;
  }

  async createCours(data, currentUserId) {
    // Vérifier que la formation existe
    const formationExists = await this.repo.prisma.formation.findUnique({
      where: { id: data.formationId },
    });
    if (!formationExists) {
      throw new AppError("La formation spécifiée n'existe pas", 400);
    }

    // Vérifier que le professeur existe
    const professeurExists = await this.repo.prisma.administration.findUnique({
      where: { id: data.professeurId },
    });
    if (!professeurExists) {
      throw new AppError("Le professeur spécifié n'existe pas", 400);
    }

    // Création sécurisée du cours
    return this.repo.create({
      ...data,
      createdById: currentUserId,
      updatedById: currentUserId,
    });
  }

  async getAllCours() {
    return this.repo.findAll();
  }

  async getCoursById(id) {
    const cours = await this.repo.findById(id);
    if (!cours) throw new AppError("Cours introuvable", 404);
    return cours;
  }

  async updateCours(id, data, currentUserId) {
    return this.repo.update(id, { ...data, updatedById: currentUserId });
  }

  async deleteCours(id) {
    return this.repo.softDelete(id);
  }

  async getCoursByFormation(formationId) {
    return this.repo.findByFormation(formationId);
  }
}
