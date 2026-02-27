import { AppError } from "../../middlewares/error.middleware.js";

export default class NoteController {
  constructor(service, schema) {
    this.service = service;
    this.schema = schema;
  }

  create = async (req, res) => {
    try {
      // Handle file upload - documentUrl comes from multer
      const documentUrl = req.file ? `/uploads/notes/${req.file.filename}` : undefined;
      
      console.log('DEBUG create note:', { body: req.body, documentUrl, user: req.user });
      
      const data = this.schema.createSchema.parse({
        ...req.body,
        valeur: parseFloat(req.body.valeur),
        documentUrl
      });
      
      console.log('DEBUG parsed data:', data);
      
      const note = await this.service.createNote(data, req.user.userId);
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      console.error('DEBUG create note error:', err);
      res.status(500).json({ success: false, message: err.message || "Erreur interne" });
    }
  };

  getAll = async (req, res) => {
    const data = await this.service.getAllNotes();
    res.json({ success: true, data });
  };

  getById = async (req, res) => {
    try {
      const data = await this.service.getNoteById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  update = async (req, res) => {
    try {
      const data = this.schema.updateSchema.parse(req.body);
      const updated = await this.service.updateNote(
        req.params.id,
        data,
        req.user.userId,
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  };

  delete = async (req, res) => {
    await this.service.deleteNote(req.params.id);
    res.json({ success: true, message: "Note supprimée" });
  };

  getByCours = async (req, res) => {
    const data = await this.service.getNotesByCours(req.params.coursId);
    res.json({ success: true, data });
  };
}
