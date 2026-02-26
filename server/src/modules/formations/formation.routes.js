import express from "express";
import FormationController from "./formation.controller.js";
import FormationSchema from "./formation.schema.js";
import { ValidationService } from "../../middlewares/validation.middleware.js";
import authMiddleware from "../../security/auth.js";

/**
 * @swagger
 * tags:
 *   - name: Formations
 *     description: API pour gérer les formations (CRUD).
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Formation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de la formation (UUID).
 *           example: "e0b8c71c-7c58-4eeb-8f29-2e4d92b0a1b3"
 *         nom:
 *           type: string
 *           description: Nom de la formation.
 *           example: "Licence Informatique"
 *         description:
 *           type: string
 *           description: Description de la formation.
 *           example: "Une formation axée sur les fondamentaux de l'informatique."
 *         responsableId:
 *           type: string
 *           format: uuid
 *           description: Identifiant du responsable lié à la formation.
 *           example: "48aef077-23e1-4afb-bf97-d6d9ebb5435c"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la formation.
 *           example: "2023-12-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification.
 *           example: "2023-12-10T09:12:00.000Z"
 *     FormationCreateInput:
 *       type: object
 *       required:
 *         - nom
 *         - description
 *         - responsableId
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la formation.
 *           example: "Licence Informatique"
 *         description:
 *           type: string
 *           description: Description de la formation.
 *           example: "Une formation axée sur les fondamentaux de l'informatique."
 *         responsableId:
 *           type: string
 *           format: uuid
 *           description: Identifiant du responsable lié à la formation.
 *           example: "48aef077-23e1-4afb-bf97-d6d9ebb5435c"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Erreur lors de l'opération demandée.
 */

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

    /**
     * @swagger
     * /api/formation:
     *   post:
     *     summary: Créer une nouvelle formation
     *     tags: [Formations]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FormationCreateInput'
     *           example:
     *             nom: "Licence Informatique"
     *             description: "Une formation axée sur les fondamentaux de l'informatique."
     *             responsableId: "48aef077-23e1-4afb-bf97-d6d9ebb5435c"
     *     responses:
     *       201:
     *         description: Formation créée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Formation'
     *       400:
     *         description: Données invalides
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Authentification requise ou jeton invalide
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.post("/", this.validateCreate, FormationController.create);

    /**
     * @swagger
     * /api/formation:
     *   get:
     *     summary: Lister toutes les formations
     *     tags: [Formations]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste de toutes les formations
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Formation'
     *       401:
     *         description: Authentification requise ou jeton invalide
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.get("/", FormationController.getAll);

    /**
     * @swagger
     * /api/formation/{id}:
     *   get:
     *     summary: Obtenir une formation par son identifiant
     *     tags: [Formations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant de la formation (UUID)
     *     responses:
     *       200:
     *         description: Détails de la formation trouvée
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Formation'
     *       404:
     *         description: Formation non trouvée
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Authentification requise ou jeton invalide
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.get("/:id", FormationController.getById);

    /**
     * @swagger
     * /api/formation/{id}:
     *   put:
     *     summary: Mettre à jour une formation
     *     tags: [Formations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant de la formation (UUID) à mettre à jour
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FormationCreateInput'
     *           example:
     *             nom: "Nouvelle Licence Informatique"
     *             description: "Mise à jour de la description."
     *             responsableId: "48aef077-23e1-4afb-bf97-d6d9ebb5435c"
     *     responses:
     *       200:
     *         description: Formation mise à jour avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Formation'
     *       400:
     *         description: Données invalides
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Authentification requise ou jeton invalide
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Formation non trouvée
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.put("/:id", this.validateUpdate, FormationController.update);

    /**
     * @swagger
     * /api/formation/{id}:
     *   delete:
     *     summary: Supprimer une formation
     *     tags: [Formations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant de la formation (UUID) à supprimer
     *     responses:
     *       204:
     *         description: Formation supprimée avec succès (aucun contenu)
     *       401:
     *         description: Authentification requise ou jeton invalide
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Formation non trouvée
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.delete("/:id", FormationController.delete);
  }

  getRouter() {
    return this.router;
  }
}
