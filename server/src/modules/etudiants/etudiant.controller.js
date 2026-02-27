import { AppError } from "../../middlewares/error.middleware.js";
import EtudiantService from "./etudiant.service.js";
import EtudiantSchema from "./etudiant.schema.js";

export default class EtudiantController {
  constructor() {
    this.service = new EtudiantService();
    this.schema = new EtudiantSchema();

    // Bind all controller methods to instance
    this.signupInit = this.signupInit.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.login = this.login.bind(this);
    this.createEtudiant = this.createEtudiant.bind(this);
    this.getAllEtudiants = this.getAllEtudiants.bind(this);
    this.getEtudiantById = this.getEtudiantById.bind(this);
    this.updateEtudiant = this.updateEtudiant.bind(this);
    this.deleteEtudiant = this.deleteEtudiant.bind(this);
    this.getMe = this.getMe.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async signupInit(req, res) {
    try {
      const data = this.schema.signupInitSchema.parse(req.body);

      const result = await this.service.signupInit(data);
      console.log("Signup init result:", result);
      res.json({ success: true, data: result });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = this.schema.verifyOtpSchema.parse(req.body);
      const result = await this.service.verifyOtp(email, otp);
      res.json({ success: true, data: result });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false });
    }
  }

  async setPassword(req, res) {
    try {
      const { email, password, confirmPassword } =
        this.schema.setPasswordSchema.parse(req.body);
      const user = await this.service.setPassword(
        email,
        password,
        confirmPassword,
      );

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false });
    }
  }

  // CRUD Controllers pour Etudiant

  // Création d'un étudiant (création directe, non utilisée lors d'inscription guidée)
  async createEtudiant(req, res) {
    try {
      const data = this.schema.signupInitSchema
        ? this.schema.signupInitSchema.parse(req.body)
        : req.body; // fallback

      const etudiant = await this.service.createEtudiant(data);
      res.status(201).json({ success: true, data: etudiant });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Récupérer tous les étudiants
  async getAllEtudiants(req, res) {
    try {
      const etudiants = await this.service.getAllEtudiants();

      res.json({ success: true, data: etudiants });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Récupérer un étudiant par ID
  async getEtudiantById(req, res) {
    try {
      const { id } = req.params;
      const etudiant = await this.service.getEtudiantById(id);
      res.json({ success: true, data: etudiant });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // Mettre à jour un étudiant par ID
  async updateEtudiant(req, res) {
    try {
      const { id } = req.params;
      const data = this.schema.updateSchema
        ? this.schema.updateSchema.parse(req.body)
        : req.body; // fallback
      const etudiant = await this.service.updateEtudiant(id, data);
      res.json({ success: true, data: etudiant });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Supprimer un étudiant (soft-delete)
  async deleteEtudiant(req, res) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteEtudiant(id);
      res.json({ success: true, data: result });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Authentification étudiant (login)
  async login(req, res) {
    try {
      const { login, password } = this.schema.loginSchema.parse(req.body);
      const result = await this.service.loginWithTokens(login, password);
      res.json({ success: true, data: result });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(401).json({ success: false, message: err.message });
    }
  }

  // Change password for etudiant
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await this.service.changePassword(req.user.userId, oldPassword, newPassword);
      res.json({ success: true, message: "Mot de passe modifié avec succès" });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Get current etudiant profile
  async getMe(req, res) {
    try {
      const etudiant = await this.service.getMe(req.user.userId);
      res.json({ success: true, data: etudiant });
    } catch (err) {
      if (err instanceof AppError) return err.handleResponse(res);
      res.status(500).json({ success: false, message: "Erreur interne" });
    }
  }

  // Forgot password for etudiants
  async forgotPassword(req, res) {
    try {
      console.log("🔧 Etudiant forgot password request received:", req.body);
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }
      
      console.log("📧 Processing etudiant forgot password for email:", email);
      const result = await this.service.forgotPassword(email);
      console.log("✅ Etudiant forgot password service result:", result);
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Etudiant forgot password error:", err);
      if (err instanceof AppError) {
        return err.handleResponse(res);
      }
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  // Reset password for etudiants - DEPRECATED
  async resetPassword(req, res) {
    return res.status(400).json({
      success: false,
      message: "Cette fonctionnalité n'est plus disponible. Un nouveau mot de passe est généré automatiquement et envoyé par email."
    });
  }
}
