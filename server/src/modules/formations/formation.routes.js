import express from "express";
import FormationController from "./formation.controller.js";
import FormationSchema from "./formation.schema.js";
import { ValidationService } from "../../middlewares/validation.middleware.js";
import authMiddleware from "../../security/auth.js";

export default class FormationRoutes {
  constructor() {
    this.router = express.Router();
    this.schema = new FormationSchema();

    // Middlewares de validation
    this.validateCreate = new ValidationService(
      this.schema.createSchema,
    ).validateRequest;
    this.validateUpdate = new ValidationService(
      this.schema.updateSchema,
    ).validateRequest;

    this._initRoutes();
  }

  _initRoutes() {
    this.router.use(authMiddleware);

    // CRUD Formation
    this.router.post("/", this.validateCreate, FormationController.create);
    this.router.get("/", FormationController.getAll);
    this.router.get("/:id", FormationController.getById);
    this.router.put("/:id", this.validateUpdate, FormationController.update);
    this.router.delete("/:id", FormationController.delete);
  }

  getRouter() {
    return this.router;
  }
}
