import express from "express";
import authMiddleware from "../../security/auth.js";
import autorisation from "../../security/authorize.js";
import CoursSchema from "./cours.schema.js";
import CoursRepository from "./cours.repository.js";
import CoursService from "./cours.service.js";
import CoursController from "./cours.controller.js";
import prisma from "../../config/prismaClient.js";

/**
 * @swagger
 * tags:
 *   - name: Cours
 *     description: API pour gérer les cours (gestion, accès et modification)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cours:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du cours (UUID)
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         nom:
 *           type: string
 *           description: Nom du cours
 *           example: "Programmation"
 *         description:
 *           type: string
 *           description: Description du cours
 *           example: "Cours de programmation avancée"
 *         formationId:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de la formation liée
 *           example: "123e4567-e89b-12d3-a456-426614174111"
 *         professeurId:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du professeur en charge du cours
 *           example: "789e1234-e89b-12d3-a456-426614174222"
 *         coefficient:
 *           type: number
 *           description: Coefficient du cours
 *           example: 3
 *         semestre:
 *           type: string
 *           enum: [S1, S2]
 *           description: Semestre d'enseignement (S1 ou S2)
 *           example: "S1"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du cours
 *           example: "2021-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *           example: "2021-01-10T00:00:00.000Z"
 *     CoursInput:
 *       type: object
 *       required:
 *         - nom
 *         - description
 *         - formationId
 *         - professeurId
 *         - coefficient
 *         - semestre
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du cours
 *           example: "Programmation"
 *         description:
 *           type: string
 *           description: Description du cours
 *           example: "Cours de programmation avancée"
 *         formationId:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de la formation liée
 *           example: "123e4567-e89b-12d3-a456-426614174111"
 *         professeurId:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du professeur en charge du cours
 *           example: "789e1234-e89b-12d3-a456-426614174222"
 *         coefficient:
 *           type: number
 *           description: Coefficient du cours
 *           example: 3
 *         semestre:
 *           type: string
 *           enum: [S1, S2]
 *           description: Semestre d'enseignement (S1 ou S2)
 *           example: "S1"
 */

export default class CoursRoutes {
  constructor() {
    this.router = express.Router();

    const schema = new CoursSchema();
    const repo = new CoursRepository(prisma);
    const service = new CoursService(repo);
    const controller = new CoursController(service, schema);

    // Auth JWT
    this.router.use(authMiddleware);

    /**
     * @swagger
     * /api/cours:
     *   post:
     *     summary: Créer un nouveau cours (admin uniquement)
     *     tags: [Cours]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CoursInput'
     *     responses:
     *       201:
     *         description: Cours créé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cours'
     *       400:
     *         description: Données invalides
     *       401:
     *         description: Authentification requise ou jeton invalide
     *       403:
     *         description: Accès refusé (admin requis)
     */
    this.router.post("/", autorisation.isAdmin(), controller.create);

    /**
     * @swagger
     * /api/cours:
     *   get:
     *     summary: Obtenir la liste de tous les cours (admin uniquement)
     *     tags: [Cours]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste de tous les cours
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Cours'
     *       401:
     *         description: Authentification requise ou jeton invalide
     *       403:
     *         description: Accès refusé (admin requis)
     */
    this.router.get("/", autorisation.isAdmin(), controller.getAll);

    /**
     * @swagger
     * /api/cours/{id}:
     *   get:
     *     summary: Obtenir un cours par son identifiant (admin uniquement)
     *     tags: [Cours]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant du cours (UUID)
     *     responses:
     *       200:
     *         description: Détails du cours trouvé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cours'
     *       404:
     *         description: Cours non trouvé
     *       401:
     *         description: Authentification requise ou jeton invalide
     *       403:
     *         description: Accès refusé (admin requis)
     */
    this.router.get("/:id", autorisation.isAdmin(), controller.getById);

    /**
     * @swagger
     * /api/cours/{id}:
     *   put:
     *     summary: Mettre à jour un cours (admin uniquement)
     *     tags: [Cours]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant du cours à mettre à jour (UUID)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CoursInput'
     *     responses:
     *       200:
     *         description: Cours mis à jour avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cours'
     *       400:
     *         description: Données invalides
     *       404:
     *         description: Cours non trouvé
     *       401:
     *         description: Authentification requise ou jeton invalide
     *       403:
     *         description: Accès refusé (admin requis)
     */
    this.router.put("/:id", autorisation.isAdmin(), controller.update);

    /**
     * @swagger
     * /api/cours/{id}:
     *   delete:
     *     summary: Supprimer un cours (admin uniquement)
     *     tags: [Cours]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant du cours à supprimer (UUID)
     *     responses:
     *       204:
     *         description: Cours supprimé avec succès (aucun contenu)
     *       404:
     *         description: Cours non trouvé
     *       401:
     *         description: Authentification requise ou jeton invalide
     *       403:
     *         description: Accès refusé (admin requis)
     */
    this.router.delete("/:id", autorisation.isAdmin(), controller.delete);

    /**
     * @swagger
     * /api/cours/formation/{formationId}:
     *   get:
     *     summary: Obtenir la liste des cours d'une formation spécifique
     *     tags: [Cours]
     *     parameters:
     *       - in: path
     *         name: formationId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Identifiant de la formation (UUID)
     *     responses:
     *       200:
     *         description: Liste des cours de la formation
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Cours'
     *       404:
     *         description: Formation ou cours non trouvé(s)
     */
    this.router.get("/formation/:formationId", controller.getByFormation);
  }

  getRouter() {
    return this.router;
  }
}
