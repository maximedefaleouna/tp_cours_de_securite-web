import { AppError } from "../../middlewares/error.middleware.js";

export default class AdministrationController {
  constructor(service, schema) {
    this.service = service;
    this.schema = schema;
  }

  create = async (req, res) => {
    try {
      const data = this.schema.createSchema.parse(req.body);
      const admin = await this.service.createAdministration(
        data,
        req.user.userId,
      );
      res.status(201).json({ success: true, data: admin });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  getAll = async (req, res) => {
    const data = await this.service.getAll();
    res.json({ success: true, data });
  };

  getById = async (req, res) => {
    try {
      const data = await this.service.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  update = async (req, res) => {
    try {
      const data = this.schema.updateSchema.parse(req.body);
      const updated = await this.service.update(
        req.params.id,
        data,
        req.user.id,
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  delete = async (req, res) => {
    await this.service.delete(req.params.id);
    res.json({ success: true, message: "Supprimé avec succès" });
  };

  changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } =
        this.schema.changePasswordSchema.parse(req.body);
      await this.service.changePassword(
        req.user.userId,
        oldPassword,
        newPassword,
      );
      res.json({ success: true, message: "Mot de passe modifié" });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  getMe = async (req, res) => {
    try {
      const data = await this.service.getMe(req.user.userId);
      res.json({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };
}
