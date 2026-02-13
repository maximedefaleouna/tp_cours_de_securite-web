import FormationService from "./formation.service.js";
import FormationSchema from "./formation.schema.js";
import { AppError } from "../../middlewares/error.middleware.js";

const service = new FormationService();
const schema = new FormationSchema();

export default class FormationController {
  // Créer une formation
  static async create(req, res) {
    try {
      let data = schema.validateCreate({
        ...req.body,
      });

      data = {
        ...data,
        createdById: req.user.userId,
        updatedById: req.user.userId,
      };

      const formation = await service.createFormation(data);
      res.status(201).json({ success: true, data: formation });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Récupérer toutes les formations
  static async getAll(req, res) {
    try {
      const formations = await service.getAllFormations();
      res.json({ success: true, data: formations });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Récupérer une formation par ID
  static async getById(req, res) {
    try {
      const formation = await service.getFormationById(req.params.id);
      res.json({ success: true, data: formation });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Mettre à jour une formation
  static async update(req, res) {
    try {
      const data = schema.validateUpdate({
        ...req.body,
        updatedById: req.user.id,
      });
      const formation = await service.updateFormation(req.params.id, data);
      res.json({ success: true, data: formation });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Supprimer une formation (soft delete)
  static async delete(req, res) {
    try {
      await service.deleteFormation(req.params.id, req.user.id);
      res
        .status(204)
        .json({ success: true, message: "formation supprimé avec succes" });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }
}
