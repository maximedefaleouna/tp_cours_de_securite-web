import express from "express";
import authMiddleware from "../../security/auth.js";
import autorisation from "../../security/authorize.js";
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

    // CRUD Note (admin seulement)
    this.router.post("/", autorisation.isAdmin(), controller.create);
    this.router.get("/", autorisation.isAdmin(), controller.getAll);
    this.router.get("/:id", autorisation.isAdmin(), controller.getById);
    this.router.put("/:id", autorisation.isAdmin(), controller.update);
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    // Liste des notes d'un cours
    this.router.get("/cours/:coursId", controller.getByCours);
  }

  getRouter() {
    return this.router;
  }
}
