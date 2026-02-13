import { AppError } from "../../middlewares/error.middleware.js";

export default class CoursController {
  constructor(service, schema) {
    this.service = service;
    this.schema = schema;
  }

  create = async (req, res) => {
    try {
      const data = this.schema.createSchema.parse(req.body);
      console.log(data);
      const cours = await this.service.createCours(data, req.user.userId);

      res.status(201).json({ success: true, data: cours });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  getAll = async (req, res) => {
    const data = await this.service.getAllCours();
    res.json({ success: true, data });
  };

  getById = async (req, res) => {
    try {
      const data = await this.service.getCoursById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  update = async (req, res) => {
    try {
      const data = this.schema.updateSchema.parse(req.body);
      const updated = await this.service.updateCours(
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
    await this.service.deleteCours(req.params.id);
    res.json({ success: true, message: "Cours supprimé" });
  };

  getByFormation = async (req, res) => {
    const data = await this.service.getCoursByFormation(req.params.formationId);
    res.json({ success: true, data });
  };
}
