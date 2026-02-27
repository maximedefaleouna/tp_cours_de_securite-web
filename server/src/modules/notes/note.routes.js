import express from "express";
import authMiddleware from "../../security/auth.js";
import autorisation from "../../security/authorize.js";
import { uploadNote } from "../../security/upload.js";
import NoteSchema from "./note.schema.js";
import NoteRepository from "./note.repository.js";
import NoteService from "./note.service.js";
import NoteController from "./note.controller.js";
import prisma from "../../config/prismaClient.js";

export default class NoteRoutes {
  constructor() {
    this.router = express.Router();

    const schema = new NoteSchema();
    const repo = new NoteRepository(prisma);
    const service = new NoteService(repo);
    const controller = new NoteController(service, schema);

    this.router.use(authMiddleware);

    // CRUD Note (admin, responsable de formation, ou professeur du cours)
    this.router.post("/", uploadNote.single('document'), autorisation.canManageNotes(), controller.create);
    this.router.get("/", autorisation.hasRoles(['admin', 'resp_formation', 'professeur']), controller.getAll);
    this.router.get("/:id", autorisation.canManageNotes(), controller.getById);
    this.router.put("/:id", autorisation.canManageNotes(), controller.update);
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    // Liste des notes d'un cours (accessible au professeur du cours ou responsable de la formation)
    this.router.get("/cours/:coursId", autorisation.canAccessCours(), controller.getByCours);
  }

  getRouter() {
    return this.router;
  }
}
