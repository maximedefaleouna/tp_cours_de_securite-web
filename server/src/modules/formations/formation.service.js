import FormationRepository from "./formation.repository.js";
import { AppError } from "../../middlewares/error.middleware.js";

export default class FormationService {
  constructor() {
    this.repo = new FormationRepository();
  }

  /**
   * Crée une nouvelle formation
   * @param {Object} data
   */
  async createFormation(data) {
    if (!data.nom || typeof data.nom !== "string" || !data.nom.trim()) {
      throw new AppError("Le nom de la formation est requis", 400);
    }
    if (!data.description || typeof data.description !== "string") {
      throw new AppError("La description de la formation est requise", 400);
    }
    // Vérification du responsable dans la table administration si renseigné
    if (data.responsableId) {
      // Import `prisma` ici pour interrogation manuelle, ou utiliser un repo si disponible
      const { default: prisma } = await import("../../config/prismaClient.js");
      const admin = await prisma.administration.findUnique({
        where: { id: data.responsableId },
      });
      if (!admin) {
        throw new AppError(
          "Le responsable (administration) spécifié n'existe pas",
          400,
        );
      }
    }
    try {
      const formation = await this.repo.create(data);
      return formation;
    } catch (err) {
      throw new AppError(
        err?.message || "Erreur lors de la création de la formation",
        500,
      );
    }
  }

  /**
   * Récupère toutes les formations non supprimées
   */
  async getAllFormations() {
    try {
      return await this.repo.findAll();
    } catch (err) {
      throw new AppError(
        err?.message || "Erreur lors de la récupération des formations",
        500,
      );
    }
  }

  /**
   * Récupère une formation par ID
   * @param {string} id
   */
  async getFormationById(id) {
    if (!id) throw new AppError("ID requis", 400);
    const formation = await this.repo.findById(id);
    if (!formation) throw new AppError("Formation non trouvée", 404);
    return formation;
  }

  /**
   * Met à jour une formation
   * @param {string} id
   * @param {Object} data
   */
  async updateFormation(id, data) {
    await this.getFormationById(id); // vérification existence
    try {
      const updated = await this.repo.update(id, data);
      if (!updated)
        throw new AppError("Échec de la mise à jour de la formation", 404);
      return updated;
    } catch (err) {
      console.error(err);
      throw new AppError(
        err?.message || "Erreur lors de la mise à jour de la formation",
        500,
      );
    }
  }

  /**
   * Soft delete une formation
   * @param {string} id
   * @param {string} updatedById
   */
  async deleteFormation(id, updatedById) {
    const formation = await this.repo.findById(id);
    if (!formation) {
      throw new AppError("Formation non trouvée", 404);
    }
    if (!updatedById)
      throw new AppError("updatedById est requis pour la suppression", 400);
    try {
      const deleted = await this.repo.softDelete(id, updatedById);
      if (!deleted)
        throw new AppError("Échec de la suppression de la formation", 404);
      return deleted;
    } catch (err) {
      console.log(err)
      throw new AppError(
        err?.message || "Erreur lors de la suppression de la formation",
        500,
      );
    }
  }
}
