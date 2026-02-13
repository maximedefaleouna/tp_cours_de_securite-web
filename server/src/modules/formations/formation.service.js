import FormationRepository from './formation.repository.js';
import { AppError } from '../../middlewares/error.middleware.js';

export default class FormationService {
  constructor() {
    this.repo = new FormationRepository();
  }

  /**
   * Créer une nouvelle formation
   * @param {Object} data
   */
  async createFormation(data) {
    if (!data.nom) throw new AppError('Le nom de la formation est requis', 400);
    try {
      return await this.repo.create(data);
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  /**
   * Récupérer toutes les formations non supprimées
   */
  async getAllFormations() {
    try {
      return await this.repo.findAll();
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  /**
   * Récupérer une formation par ID
   * @param {string} id
   */
  async getFormationById(id) {
    const formation = await this.repo.findById(id);
    if (!formation) throw new AppError('Formation non trouvée', 404);
    return formation;
  }

  /**
   * Mettre à jour une formation
   * @param {string} id
   * @param {Object} data
   */
  async updateFormation(id, data) {
    await this.getFormationById(id); // vérification existence
    try {
      return await this.repo.update(id, data);
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  /**
   * Supprimer une formation (soft delete)
   * @param {string} id
   * @param {string} updatedById
   */
  async deleteFormation(id, updatedById) {
    await this.getFormationById(id); // vérification existence
    try {
      return await this.repo.softDelete(id, updatedById);
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }
}
