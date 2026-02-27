import { AuthService } from "./auth.service.js";
import { AppError } from "../../middlewares/error.middleware.js"; // <-- import ajouté

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.loginAdmin = this.loginAdmin.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
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

  async forgotPassword(req, res) {
    try {
      console.log("🔧 Forgot password request received:", req.body);
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }
      
      console.log("📧 Processing forgot password for email:", email);
      const result = await this.authService.forgotPassword(email);
      console.log("✅ Forgot password service result:", result);
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      if (err instanceof AppError) {
        return err.handleResponse(res);
      }
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword(token, newPassword);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return err.handleResponse(res);
      }
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export { AuthController };
