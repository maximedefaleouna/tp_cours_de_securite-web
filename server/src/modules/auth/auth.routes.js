import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthSchemas } from "./auth.schema.js";
import { ValidationService } from "../../middlewares/validation.middleware.js";
import { authLimiter } from "../../security/rateLimit.js";

export class AuthRoutes {
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    const adminLoginValidator = new ValidationService(AuthSchemas.adminLogin);
    

    /**
     * @openapi
     * /api/auth/admin/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Connexion administrateur
     *     description: Permet à un administrateur de se connecter et d'obtenir des tokens JWT.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               identifier:
     *                 type: string
     *                 description: Peut être l'email ou le matricule de l'administrateur
     *                 example: admin@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: StrongPassword123
     *     responses:
     *       200:
     *         description: Authentification réussie, retourne des tokens JWT.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     admin:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                         nom:
     *                           type: string
     *                         prenom:
     *                           type: string
     *                         email:
     *                           type: string
     *                         matricule:
     *                           type: string
     *                         isAdmin:
     *                           type: boolean
     *                     tokens:
     *                       type: object
     *                       properties:
     *                         accessToken:
     *                           type: string
     *                         refreshToken:
     *                           type: string
     *       400:
     *         description: Requête invalide (erreur de validation ou credentials invalides).
     */
    this.router.post(
      "/admin/login",
      authLimiter,
      adminLoginValidator.validateRequest,
      this.authController.loginAdmin,
    );

    // Forgot password routes
    this.router.post(
      "/admin/forgot-password",
      this.authController.forgotPassword,
    );

    // Deprecated: Reset password route - now handled by forgot password generating new password
    // this.router.post(
    //   "/admin/reset-password",
    //   this.authController.resetPassword,
    // );
  }

  getRouter() {
    return this.router;
  }
}
