import express, { json } from "express";

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
    this.app.get("/", (req, res) => {
      res.send("Backend Groupe 2 - TP Sécurité Web");
    });

    this.app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
