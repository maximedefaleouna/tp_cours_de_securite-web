import express, { json } from "express";
import { AuthRoutes } from "./modules/auth/auth.routes.js";
import FormationRoutes from "./modules/formations/formation.routes.js";
import AdministrationRoutes from "./modules/administration/administration.routes.js";
import CoursRoutes from "./modules/cours/cours.routes.js";
import NoteRoutes from "./modules/notes/note.routes.js";

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this._middlewares();
    this._routes();
  }

  _middlewares() {
    this.app.use(json());
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
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
