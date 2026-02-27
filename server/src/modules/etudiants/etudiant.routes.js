import express from "express";
import EtudiantController from "./etudiant.controller.js";
import EtudiantSchema from "./etudiant.schema.js";
import { ValidationService } from "../../middlewares/validation.middleware.js";
import { authLimiter } from "../../security/rateLimit.js";
import authMiddleware from "../../security/auth.js";
import autorisation from "../../security/authorize.js";

/**
 * @swagger
 * tags:
 *   - name: Etudiants
 *     description: Authentification et inscription des étudiants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupInitInput:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - formationId
 *         - dateNaissance
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de famille.
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           description: Prénom.
 *           example: "Jean"
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'étudiant.
 *           example: "jean.dupont@example.com"
 *         formationId:
 *           type: string
 *           format: uuid
 *           description: Identifiant UUID de la formation.
 *           example: "2a4f4f8c-f556-4b6c-8cbb-2f9bd87b7df1"
 *         dateNaissance:
 *           type: string
 *           format: date
 *           description: Date de naissance (au format ISO).
 *           example: "2002-05-19"
 *     VerifyOtpInput:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'étudiant.
 *           example: "jean.dupont@example.com"
 *         otp:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           description: Code OTP reçu par email
 *           example: "123456"
 *     SetPasswordInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'étudiant.
 *           example: "jean.dupont@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Nouveau mot de passe
 *           example: "MyStrongPassword123!"
 *         confirmPassword:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Confirmation du mot de passe
 *           example: "MyStrongPassword123!"
 *     LoginInput:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           description: Email ou numéro de carte étudiant
 *           example: "jean.dupont@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Mot de passe de l'étudiant.
 *           example: "MyStrongPassword123!"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Jeton JWT d'authentification
 *     Etudiant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "ecf306f6-4bdb-4f2a-bdb7-047833deba1c"
 *         nom:
 *           type: string
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           example: "Jean"
 *         email:
 *           type: string
 *           example: "jean.dupont@example.com"
 *         numeroCarteEtudiant:
 *           type: string
 *           example: "123456789"
 *         formationId:
 *           type: string
 *           example: "2a4f4f8c-f556-4b6c-8cbb-2f9bd87b7df1"
 *         dateNaissance:
 *           type: string
 *           format: date
 *           example: "2002-05-19"
 *         Formation:
 *           $ref: '#/components/schemas/Formation'
 *         notes:
 *           type: array
 *           items: {}
 */

export default class EtudiantRoutes {
  constructor() {
    this.router = express.Router();

    this.controller = new EtudiantController();
    this.schema = new EtudiantSchema();
    this.validateSignupInit = new ValidationService(
      this.schema.signupInitSchema,
    ).validateRequest;

    this.validateVerifyOtp = new ValidationService(
      this.schema.verifyOtpSchema,
    ).validateRequest;

    this.validateSetPassword = new ValidationService(
      this.schema.setPasswordSchema,
    ).validateRequest;

    this.validateLogin = new ValidationService(
      this.schema.loginSchema,
    ).validateRequest;

    this.validateUpdate = this.schema.updateSchema
      ? new ValidationService(this.schema.updateSchema).validateRequest
      : (req, res, next) => next();

    this._initRoutes();
  }

  _initRoutes() {
    /**
     * @swagger
     * /api/etudiants/signup-init:
     *   post:
     *     summary: Démarre l'inscription d'un étudiant (envoi OTP)
     *     tags: [Etudiants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupInitInput'
     *     responses:
     *       200:
     *         description: OTP envoyé à l'email fourni.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "OTP envoyé"
     *       400:
     *         description: Données invalides ou étudiant déjà inscrit.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    this.router.post(
      "/signup-init",
      this.validateSignupInit,
      this.controller.signupInit,
    );

    /**
     * @swagger
     * /api/etudiants/verify-otp:
     *   post:
     *     summary: Vérifie le code OTP envoyé par email
     *     tags: [Etudiants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VerifyOtpInput'
     *     responses:
     *       200:
     *         description: OTP vérifié avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "OTP vérifié"
     *       400:
     *         description: OTP invalide ou expiré.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    this.router.post(
      "/verify-otp",
      this.validateVerifyOtp,
      this.controller.verifyOtp,
    );

    /**
     * @swagger
     * /api/etudiants/set-password:
     *   post:
     *     summary: Définit le mot de passe après vérification de l'OTP
     *     tags: [Etudiants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SetPasswordInput'
     *     responses:
     *       200:
     *         description: Mot de passe défini avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *       400:
     *         description: Informations invalides ou OTP incorrect.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    this.router.post(
      "/set-password",
      this.validateSetPassword,
      this.controller.setPassword,
    );

    /**
     * @swagger
     * /api/etudiants:
     *   post:
     *     summary: Création directe d'un nouvel étudiant (admin ou batch)
     *     tags: [Etudiants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupInitInput'
     *     responses:
     *       201:
     *         description: Étudiant créé avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Etudiant'
     *       400:
     *         description: Étudiant déjà existant ou données invalides.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    // Moved to protected routes section

    /**
     * @swagger
     * /api/etudiants:
     *   get:
     *     summary: Récupère la liste de tous les étudiants non supprimés
     *     tags: [Etudiants]
     *     responses:
     *       200:
     *         description: Liste des étudiants.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Etudiant'
     */
    // Moved to protected routes section

    /**
     * @swagger
     * /api/etudiants/id/{id}:
     *   get:
     *     summary: Récupère un étudiant par son ID
     *     tags: [Etudiants]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de l'étudiant
     *     responses:
     *       200:
     *         description: Détails de l'étudiant.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/Etudiant'
     *       404:
     *         description: Étudiant non trouvé.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Étudiant non trouvé
     */
    // Moved to protected routes section

    /**
     * @swagger
     * /api/etudiants/{id}:
     *   put:
     *     summary: Met à jour un étudiant par son ID
     *     tags: [Etudiants]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de l'étudiant
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupInitInput'
     *     responses:
     *       200:
     *         description: Étudiant mis à jour avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Etudiant'
     *       400:
     *         description: Erreur de validation ou de mise à jour.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    // Moved to protected routes section

    /**
     * @swagger
     * /api/etudiants/delete/{id}:
     *   delete:
     *     summary: Effectue un soft-delete d'un étudiant
     *     tags: [Etudiants]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de l'étudiant
     *     responses:
     *       200:
     *         description: Étudiant supprimé avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Étudiant supprimé
     *       400:
     *         description: Erreur lors de la suppression.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     */
    // Moved to protected routes section

    /**
     * @swagger
     * /api/etudiants/login:
     *   post:
     *     summary: Authentifie un étudiant (email ou numéro carte + mot de passe)
     *     tags: [Etudiants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginInput'
     *     responses:
     *       200:
     *         description: Authentification réussie. Retourne un token.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       401:
     *         description: Informations de connexion invalides.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Mot de passe ou login incorrect"
     */
    this.router.post("/login", authLimiter, this.validateLogin, this.controller.login);

    // Protected routes - require authentication
    this.router.use(authMiddleware);

    // Get current etudiant profile
    this.router.get("/me", this.controller.getMe);

    // Change password - any authenticated etudiant can change their own password
    this.router.put("/change-password", this.controller.changePassword);

    // CRUD routes - require admin or responsable role
    this.router.post("/", autorisation.hasRoles(['admin', 'resp_formation']), this.validateSignupInit, this.controller.createEtudiant);
    this.router.get("/", autorisation.hasRoles(['admin', 'resp_formation']), this.controller.getAllEtudiants);
    this.router.get("/id/:id", autorisation.hasRoles(['admin', 'resp_formation']), this.controller.getEtudiantById);
    this.router.put("/:id", autorisation.hasRoles(['admin', 'resp_formation']), this.validateUpdate, this.controller.updateEtudiant);
    this.router.delete("/delete/:id", autorisation.hasRoles(['admin', 'resp_formation']), this.controller.deleteEtudiant);
  }

  getRouter() {
    return this.router;
  }
}
