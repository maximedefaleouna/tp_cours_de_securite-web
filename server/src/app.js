import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import redisClient from "./config/redis.js";
import { corsMiddleware } from "./security/cors.js";
import { apiLimiter, authLimiter } from "./security/rateLimit.js";
import { AuthRoutes } from "./modules/auth/auth.routes.js";
import FormationRoutes from "./modules/formations/formation.routes.js";
import AdministrationRoutes from "./modules/administration/administration.routes.js";
import CoursRoutes from "./modules/cours/cours.routes.js";
import NoteRoutes from "./modules/notes/note.routes.js";
import EtudiantRoutes from "./modules/etudiants/etudiant.routes.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this._middlewares();
    this._routes();
    this._swagger();
  }

  _middlewares() {
    // Configuration CORS depuis le dossier security
    this.app.use(corsMiddleware);

    // Limitation de débit générale
    // this.app.use(apiLimiter);

    this.app.use(json());
    
    // Servir les fichiers statiques du répertoire uploads
    this.app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  }

  _swagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  _routes() {
    // Route racine
    this.app.get("/", (req, res) => {
      res.send("Backend Groupe 2 - TP Sécurité Web");
    });

    // Route health
    this.app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // Routes Auth
    const authRoutes = new AuthRoutes();
    this.app.use("/api/auth", authRoutes.getRouter());

    const formationRoutes = new FormationRoutes();
    this.app.use("/api/formation", formationRoutes.getRouter());

    const administrationRoutes = new AdministrationRoutes();
    this.app.use("/api/administration", administrationRoutes.getRouter());

    const coursRoutes = new CoursRoutes();
    this.app.use("/api/cours", coursRoutes.getRouter());

    const noteRoutes = new NoteRoutes();
    this.app.use("/api/notes", noteRoutes.getRouter());

    const etudiantRoutes = new EtudiantRoutes();
    this.app.use("/api/etudiants", etudiantRoutes.getRouter());
  }

  async listen() {
    await redisClient.connect();

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
