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

    /**
     * @openapi
     * /api/administration:
     *   post:
     *     tags:
     *       - Administration
     *     summary: Créer un administrateur
     *     description: Crée un nouvel administrateur (réservé aux utilisateurs admin).
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AdministrationCreate'
     *     responses:
     *       201:
     *         description: Administrateur créé.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Administration'
     *       400:
     *         description: Requête invalide.
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.post("/", autorisation.isAdmin(), controller.create);

    /**
     * @openapi
     * /api/administration:
     *   get:
     *     tags:
     *       - Administration
     *     summary: Obtenir tous les administrateurs
     *     description: Récupère la liste de tous les administrateurs (réservé aux utilisateurs admin).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des administrateurs.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Administration'
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.get("/", autorisation.isAdmin(), controller.getAll);

    /**
     * @openapi
     * /api/administration/personnel:
     *   get:
     *     tags:
     *       - Administration
     *     summary: Obtenir la liste du personnel (pour sélection professeur)
     *     description: Récupère la liste du personnel pour les responsables de formation.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste du personnel.
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.get("/personnel", autorisation.hasRoles(['admin', 'resp_formation']), controller.getAll);
    
    /**
     * @openapi
     * /api/administration/me:
     *   get:
     *     tags:
     *       - Administration
     *     summary: Obtenir le profil de l'utilisateur connecté
     *     description: Récupère les informations de l'administrateur connecté avec ses cours et formations.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profil de l'utilisateur.
     *       401:
     *         description: Non autorisé.
     */
    this.router.get("/me", controller.getMe);
    
    /**
     * @openapi
     * /api/administration/{id}:
     *   get:
     *     tags:
     *       - Administration
     *     summary: Obtenir un administrateur par ID
     *     description: Récupère les informations d'un administrateur par son ID (réservé aux utilisateurs admin).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'administrateur
     *     responses:
     *       200:
     *         description: Administrateur trouvé.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Administration'
     *       404:
     *         description: Administrateur non trouvé.
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.get("/:id", autorisation.isAdmin(), controller.getById);

    /**
     * @openapi
     * /api/administration/{id}:
     *   put:
     *     tags:
     *       - Administration
     *     summary: Mettre à jour un administrateur
     *     description: Met à jour les informations d’un administrateur par son ID (réservé aux utilisateurs admin).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'administrateur
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AdministrationUpdate'
     *     responses:
     *       200:
     *         description: Administrateur mis à jour.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Administration'
     *       400:
     *         description: Requête invalide.
     *       404:
     *         description: Administrateur non trouvé.
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.put("/:id", autorisation.isAdmin(), controller.update);

    /**
     * @openapi
     * /api/administration/{id}:
     *   delete:
     *     tags:
     *       - Administration
     *     summary: Supprimer un administrateur
     *     description: Supprime un administrateur par son ID (réservé aux utilisateurs admin).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de l'administrateur
     *     responses:
     *       204:
     *         description: Administrateur supprimé.
     *       404:
     *         description: Administrateur non trouvé.
     *       401:
     *         description: Non autorisé.
     *       403:
     *         description: Accès refusé.
     */
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    /**
     * @openapi
     * /api/administration/change-password:
     *   put:
     *     tags:
     *       - Administration
     *     summary: Changer le mot de passe de l'utilisateur connecté
     *     description: Permet à n'importe quel administrateur de changer son mot de passe.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               oldPassword:
     *                 type: string
     *                 description: Ancien mot de passe
     *               newPassword:
     *                 type: string
     *                 description: Nouveau mot de passe
     *             required:
     *               - oldPassword
     *               - newPassword
     *     responses:
     *       200:
     *         description: Mot de passe changé avec succès.
     *       400:
     *         description: Ancien mot de passe incorrect ou données invalides.
     *       401:
     *         description: Non autorisé.
     */
    this.router.put("/change-password", controller.changePassword);
  }

  getRouter() {
    return this.router;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Administration:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           example: "Jean"
 *         email:
 *           type: string
 *           format: email
 *           example: "j.dupont@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AdministrationCreate:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           example: "Jean"
 *         email:
 *           type: string
 *           format: email
 *           example: "j.dupont@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "MotdepasseFort123!"
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - password
 *     AdministrationUpdate:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 *       required: []
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */