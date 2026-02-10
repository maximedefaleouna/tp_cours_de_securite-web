import { AuthService } from "./auth.service.js";
import { AppError } from "../../middlewares/error.middleware.js"; // <-- import ajouté

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.loginAdmin = this.loginAdmin.bind(this);
  }

  /**
   * POST /admin/login
   */
  async loginAdmin(req, res) {
    try {
      const result = await this.authService.loginAdmin(req.body);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return err.handleResponse(res); // AppError gère la réponse
      }
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export { AuthController };
