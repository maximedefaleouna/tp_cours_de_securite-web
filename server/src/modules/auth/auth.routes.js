import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthSchemas } from "./auth.schema.js";
import { ValidationService } from "../../middlewares/validation.middleware.js";

export class AuthRoutes {
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    const adminLoginValidator = new ValidationService(AuthSchemas.adminLogin);

    this.router.post(
      "/admin/login",
      adminLoginValidator.validateRequest,
      this.authController.loginAdmin,
    );
  }

  getRouter() {
    return this.router;
  }
}
