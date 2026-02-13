import express from "express";
import authMiddleware from "../../security/auth.js";
import autorisation from "../../security/authorize.js";
import CoursSchema from "./cours.schema.js";
import CoursRepository from "./cours.repository.js";
import CoursService from "./cours.service.js";
import CoursController from "./cours.controller.js";
import prisma from "../../config/prismaClient.js";

export default class CoursRoutes {
  constructor() {
    this.router = express.Router();

    const schema = new CoursSchema();
    const repo = new CoursRepository(prisma);
    const service = new CoursService(repo);
    const controller = new CoursController(service, schema);

    // Auth JWT
    this.router.use(authMiddleware);

    // CRUD Cours (admin only)
    this.router.post("/", autorisation.isAdmin(), controller.create);
    this.router.get("/", autorisation.isAdmin(), controller.getAll);
    this.router.get("/:id", autorisation.isAdmin(), controller.getById);
    this.router.put("/:id", autorisation.isAdmin(), controller.update);
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    // Liste des cours d'une formation
    this.router.get("/formation/:formationId", controller.getByFormation);
  }

  getRouter() {
    return this.router;
  }
}
