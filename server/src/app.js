import express, { json } from "express";
import { AuthRoutes } from "./modules/auth/auth.routes.js";

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
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
