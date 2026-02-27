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

  async getAccessibleCours(userId) {
    // Get courses where user is professor
    const coursAsProfesseur = await this.repo.findByProfesseur(userId);
    
    // Get formations where user is responsable
    const formationsResponsable = await this.repo.prisma.formationResponsable.findMany({
      where: { responsableId: userId },
      select: { formationId: true },
    });
    
    const formationIds = formationsResponsable.map(fr => fr.formationId);
    
    // Get courses from those formations
    const coursFromFormations = formationIds.length > 0
      ? await this.repo.findByFormationIds(formationIds)
      : [];
    
    // Merge and remove duplicates
    const allCoursMap = new Map();
    [...coursAsProfesseur, ...coursFromFormations].forEach(c => {
      allCoursMap.set(c.id, c);
    });
    
    return Array.from(allCoursMap.values());
  }
}
