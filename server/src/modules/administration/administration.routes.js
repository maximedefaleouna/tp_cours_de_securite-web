import express from "express";
import authMiddleware from "../../security/auth.js";
import autorisation from "./../../security/authorize.js";
import AdministrationSchema from "./administration.schema.js";
import AdministrationRepository from "./administration.repository.js";
import AdministrationService from "./administration.service.js";
import AdministrationController from "./administration.controller.js";
import prisma from "../../config/prismaClient.js";

export default class AdministrationRoutes {
  constructor() {
    this.router = express.Router();

    const schema = new AdministrationSchema();
    const repo = new AdministrationRepository(prisma);
    const service = new AdministrationService(repo);
    const controller = new AdministrationController(service, schema);

    // Auth JWT
    this.router.use(authMiddleware);

    // CRUD Administration (admin only)
    this.router.post("/", autorisation.isAdmin(), controller.create);
    this.router.get("/", autorisation.isAdmin(), controller.getAll);
    this.router.get("/:id", autorisation.isAdmin(), controller.getById);
    this.router.put("/:id", autorisation.isAdmin(), controller.update);
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    // Changement mot de passe (tout utilisateur)
    this.router.put("/change-password", controller.changePassword);
  }

  getRouter() {
    return this.router;
  }
}
