import { PasswordService } from "../../security/password.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthSchemas } from "./auth.schema.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { JwtService } from "../../security/jwt.js";
import redisClient from "../../config/redis.js";
import emailService from "../../utils/email.service.js";
import crypto from "crypto";

export class AuthService {
  constructor() {
    this.repository = new AuthRepository();
    this.jwtService = new JwtService();
    this.passwordService = new PasswordService();
  }

  async loginAdmin(data) {
    const { identifier, password } = AuthSchemas.adminLogin.parse(data);

    const admin = await this.repository.findAdminByEmailOrMatricule(identifier);
    if (!admin) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const isValid = await this.passwordService.compare(
      password,
      admin.password,
    );
    if (!isValid) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const payload = {
      userId: admin.id,
      role: "administration",
      isAdmin: admin.isAdmin,
    };

    return {
      success: true,
      message: "Connexion administrateur réussie",
      data: {
        admin: {
          id: admin.id,
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          matricule: admin.matricule,
          isAdmin: admin.isAdmin,
        },
        tokens: {
          accessToken: this.jwtService.generateAccessToken(payload),
          refreshToken: this.jwtService.generateRefreshToken(payload),
        },
      },
    };
  }

  async forgotPassword(email) {
    console.log("🔐 Forgot password service called with email:", email);
    
    // Trouver admin par email
    const admin = await this.repository.findAdminByEmailOrMatricule(email);
    console.log("👤 Admin found:", admin ? "Yes" : "No");
    
    if (!admin) {
      console.log("⚠️ No admin found for email, returning success for security");
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return { success: true, message: "Si l'email existe, un code de réinitialisation a été envoyé" };
    }

    // Générer un mot de passe temporaire (code à 6 chiffres)
    const temporaryPassword = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    console.log("🔑 Generated temporary password code:", temporaryPassword);

    // Hacher le mot de passe temporaire
    const hashedPassword = await this.passwordService.hash(temporaryPassword);
    console.log("🔒 Temporary password hashed successfully");

    // Mettre à jour le mot de passe de l'administrateur
    await this.repository.updatePassword(admin.id, hashedPassword);
    console.log("✅ Temporary password updated successfully");

    // Envoyer email avec le mot de passe/code temporaire
    try {
      console.log("📧 Sending temporary password code email...");
      await emailService.sendTemporaryPasswordCode(
        admin.email,
        admin.prenom,
        admin.nom,
        temporaryPassword
      );
      console.log("✅ Temporary password code email sent successfully");
    } catch (err) {
      console.error("❌ Email sending error:", err);
      throw new AppError("Erreur lors de l'envoi de l'email", 500);
    }

    return { success: true, message: "Code de réinitialisation envoyé à votre email" };
  }

  async resetPassword(token, newPassword) {
    // Verify token from Redis
    const storedData = await redisClient.get(`reset_token:${token}`);
    
    if (!storedData) {
      throw new AppError("Lien de réinitialisation invalide ou expiré", 400);
    }

    const parsedData = JSON.parse(storedData);
    
    if (Date.now() > parsedData.expiresAt) {
      await redisClient.del(`reset_token:${token}`);
      throw new AppError("Lien de réinitialisation expiré", 400);
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await this.passwordService.hash(newPassword);

    // Mettre à jour le mot de passe de l'administrateur
    await this.repository.updatePassword(parsedData.userId, hashedPassword);

    // Delete the token from Redis
    await redisClient.del(`reset_token:${token}`);

    return { success: true, message: "Mot de passe réinitialisé avec succès" };
  }
}
