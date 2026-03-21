import { AppError } from "../../middlewares/error.middleware.js";
import { PasswordService } from "../../security/password.js";
import { JwtService } from "../../security/jwt.js";
import redisClient from "../../config/redis.js";
import EtudiantRepository from "./etudiant.repository.js";
import emailService from "../../utils/email.service.js";
import crypto from "crypto";

export default class EtudiantService {
  constructor() {
    this.repo = new EtudiantRepository();
    this.passwordService = new PasswordService();
    this.jwtService = new JwtService();
    this.redis = redisClient.getClient();
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateNumeroCarte() {
    const year = new Date().getFullYear();
    const lastEtudiant = await this.repo.prisma.etudiant.findFirst({
      orderBy: { createdAt: "desc" },
    });
    let counter = 1;
    if (lastEtudiant) {
      const lastNum = parseInt(lastEtudiant.numeroCarteEtudiant.slice(-4));
      counter = lastNum + 1;
    }
    return `ETU${year}${counter.toString().padStart(4, "0")}`;
  }

  async signupInit(data) {
    const existingEtudiant = await this.repo.findByEmail(data.email);
    console.log(
      "Résultat de findByEmail pour",
      data.email,
      ":",
      existingEtudiant,
    );

    if (existingEtudiant) {
      throw new AppError("Email déjà utilisé", 400);
    }

    // Vérifier que la formation existe
    const formation = await this.repo.prisma.formation.findUnique({
      where: { id: data.formationId },
    });

    if (!formation) {
      throw new AppError("Formation inexistante", 400);
    }

    // Générer OTP et le numéro de carte étudiant unique
    const otp = this.generateOtp();
    const numeroCarte = await this.generateNumeroCarte();

    // Payload temporaire à stocker dans Redis pour la suite de l'inscription
    const payload = {
      ...data,
      otp,
      otpVerified: false,
      numeroCarteEtudiant: numeroCarte,
    };

    try {
      await this.redis.setEx(
        `signup:${data.email}`,
        600, // expire dans 10 minutes
        JSON.stringify(payload),
      );
    } catch (err) {
      throw new AppError("Erreur lors de l'enregistrement temporaire", 500);
    }

    // Envoyer OTP via email
    await emailService.sendOTP(data.email, data.prenom, data.nom, otp);

    return {
      message: "OTP envoyé à votre email",
      numeroCarteEtudiant: numeroCarte,
    };
  }

  // Étape 2 : vérifier OTP
  async verifyOtp(email, otp) {
    const data = await this.redis.get(`signup:${email}`);
    if (!data) throw new AppError("Demande expirée ou introuvable", 400);

    const parsed = JSON.parse(data);
    if (parsed.otp !== otp) throw new AppError("OTP invalide", 400);

    parsed.otpVerified = true;
    await this.redis.setEx(`signup:${email}`, 600, JSON.stringify(parsed));

    return { message: "OTP vérifié" };
  }

  // Étape 3 : définir mot de passe et créer utilisateur
  async setPassword(email, password, confirmPassword) {
    const data = await this.redis.get(`signup:${email}`);
    if (!data) throw new AppError("Demande expirée", 400);

    const parsed = JSON.parse(data);
    if (!parsed.otpVerified) throw new AppError("Email non vérifié", 403);

    if (password !== confirmPassword)
      throw new AppError("Les mots de passe ne correspondent pas", 400);

    const hashed = await this.passwordService.hash(password);

    let user;
    try {
      user = await this.repo.create({
        nom: parsed.nom,
        prenom: parsed.prenom,
        email: parsed.email,
        numeroCarteEtudiant: parsed.numeroCarteEtudiant,
        formationId: parsed.formationId,
        dateNaissance: new Date(parsed.dateNaissance),
        password: hashed,
      });
    } catch (err) {
      console.log(err);
      throw new AppError("Erreur lors de la création de l'utilisateur", 500);
    }

    await this.redis.del(`signup:${email}`);

    return user;
  }

  // Opérations CRUD pour Etudiant

  // Create a new etudiant (mot de passe généré aléatoirement)
  async createEtudiant(data) {
    // Vérifie si un étudiant existe déjà avec cet email ou numéro de carte
    const existingByEmail = await this.repo.findByEmail(data.email);
    if (existingByEmail) {
      throw new AppError("Un étudiant avec cet email existe déjà", 400);
    }
    // Génère un numéro de carte étudiant unique
    const numeroCarte = await this.generateNumeroCarte();
    data.numeroCarteEtudiant = numeroCarte;

    // Générer un mot de passe temporaire aléatoire
    const tempPassword = crypto.randomBytes(4).toString("hex").toUpperCase();
    data.password = await this.passwordService.hash(tempPassword);

    // Vérifier et reformater la date de naissance si elle est présente
    if (data.dateNaissance) {
      // On accepte soit un objet Date, soit une string de type ISO, soit d'autres formats courants (dd/mm/yyyy, etc.)
      let dateObj;
      if (data.dateNaissance instanceof Date) {
        dateObj = data.dateNaissance;
      } else if (typeof data.dateNaissance === "string") {
        // Try parsing ISO or yyyy-mm-dd
        // If format dd/mm/yyyy, convert
        const isoMatch = /^\d{4}-\d{2}-\d{2}/.test(data.dateNaissance);
        const frMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(data.dateNaissance);
        if (isoMatch) {
          dateObj = new Date(data.dateNaissance);
        } else if (frMatch) {
          // transform dd/mm/yyyy to yyyy-mm-dd
          const [day, month, year] = data.dateNaissance.split("/");
          dateObj = new Date(`${year}-${month}-${day}`);
        } else {
          // fallback
          dateObj = new Date(data.dateNaissance);
        }
      }
      if (!dateObj || isNaN(dateObj.getTime())) {
        throw new AppError(
          "Format de date de naissance invalide. Utilisez ISO (YYYY-MM-DD) ou JJ/MM/AAAA.",
          400,
        );
      }
      data.dateNaissance = dateObj;
    }

    const etudiant = await this.repo.create(data);

    // Envoyer email avec les identifiants
    await emailService.sendStudentCredentials(
      data.email,
      data.prenom,
      data.nom,
      numeroCarte,
      tempPassword
    );

    return etudiant;
  }

  // Get all etudiants (non supprimés)
  async getAllEtudiants() {
    try {
      const etudiants = await this.repo.findAll();
      return etudiants;
    } catch (err) {
      throw new AppError("Erreur lors de la récupération des étudiants", 500);
    }
  }

  // Get etudiant by ID
  async getEtudiantById(id) {
    try {
      const etudiant = await this.repo.findById(id);
      if (!etudiant) throw new AppError("Étudiant non trouvé", 404);
      return etudiant;
    } catch (err) {
      throw err;
    }
  }

  // Update etudiant
  async updateEtudiant(id, data) {
    // Vérifier que l'étudiant existe avant la mise à jour
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError("Étudiant non trouvé", 404);

    // Vérifier que l'email n'est pas déjà utilisé par un autre étudiant
    if (data.email) {
      const etudiantAvecEmail = await this.repo.findByEmail(data.email);
      if (etudiantAvecEmail && etudiantAvecEmail.id !== id) {
        throw new AppError(
          "Cet email est déjà utilisé par un autre étudiant.",
          400,
        );
      }
    }

    // Gérer la date de naissance si fournie (supporte ISO et FR: dd/mm/yyyy)
    if (data.dateNaissance) {
      let dateObj;
      const isoMatch = /^\d{4}-\d{2}-\d{2}/.test(data.dateNaissance);
      const frMatch = /^\d{2}\/\d{2}\/\d{4}$/.test(data.dateNaissance);
      if (isoMatch) {
        dateObj = new Date(data.dateNaissance);
      } else if (frMatch) {
        const [day, month, year] = data.dateNaissance.split("/");
        dateObj = new Date(`${year}-${month}-${day}`);
      } else {
        dateObj = new Date(data.dateNaissance);
      }
      if (!dateObj || isNaN(dateObj.getTime())) {
        throw new AppError(
          "Format de date de naissance invalide. Utilisez ISO (YYYY-MM-DD) ou JJ/MM/AAAA.",
          400,
        );
      }
      data.dateNaissance = dateObj;
    }

    // Prevent updating password via generic update
    if ("password" in data) delete data.password;
    const updated = await this.repo.update(id, data);

    // Vérification post-update si nécessaire
    if (!updated)
      throw new AppError("Échec de la mise à jour : étudiant non trouvé", 404);

    return updated;
  }

  // Soft-delete etudiant
  async deleteEtudiant(id) {
    try {
      // Vérifier que l'étudiant existe avant la suppression
      const existing = await this.repo.findById(id);
      if (!existing) throw new AppError("Étudiant non trouvé", 404);

      const deleted = await this.repo.softDelete(id);

      // Vérifier que la suppression a bien été effectuée si besoin
      if (!deleted)
        throw new AppError(
          "Échec de la suppression : étudiant non trouvé",
          404,
        );

      return deleted;
    } catch (err) {
      throw new AppError("Erreur lors de la suppression de l'étudiant", 500);
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const etudiant = await this.repo.findById(userId);
    if (!etudiant) throw new AppError("Étudiant introuvable", 404);

    const isValid = await this.passwordService.compare(
      oldPassword,
      etudiant.password,
    );

    if (!isValid) throw new AppError("Ancien mot de passe incorrect", 400);

    const hashed = await this.passwordService.hash(newPassword);

    return this.repo.update(userId, { password: hashed });
  }

  async getMe(userId) {
    const etudiant = await this.repo.findById(userId);
    if (!etudiant) throw new AppError("Étudiant introuvable", 404);
    return etudiant;
  }

  async login(login, password) {
    // Trouver étudiant par email ou numeroCarteEtudiant
    const etudiant = await this.repo.findByLogin(login);
    if (!etudiant) throw new AppError("Identifiants incorrects", 401);

    // Vérifier le mot de passe
    const isValid = await this.passwordService.compare(password, etudiant.password);
    if (!isValid) throw new AppError("Identifiants incorrects", 401);

    // Retourner le token JWT
    return this.jwtService.generateAccessToken({ 
      userId: etudiant.id, 
      email: etudiant.email, 
      role: 'etudiant' 
    });
  }

  async loginWithTokens(login, password) {
    // Trouver étudiant par email ou numeroCarteEtudiant
    const etudiant = await this.repo.findByLogin(login);
    if (!etudiant) throw new AppError("Identifiants incorrects", 401);

    // Vérifier le mot de passe
    const isValid = await this.passwordService.compare(password, etudiant.password);
    if (!isValid) throw new AppError("Identifiants incorrects", 401);

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken({ 
      userId: etudiant.id, 
      email: etudiant.email, 
      role: 'etudiant' 
    });
    
    const refreshToken = this.jwtService.generateRefreshToken({ 
      userId: etudiant.id, 
      email: etudiant.email, 
      role: 'etudiant' 
    });

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      etudiant: {
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        numeroCarteEtudiant: etudiant.numeroCarteEtudiant,
      }
    };
  }

  // Forgot password for etudiants
  async forgotPassword(email) {
    console.log("🔐 Etudiant forgot password service called with email:", email);
    
    // Find etudiant by email
    const etudiant = await this.repo.findByEmail(email);
    console.log("👤 Etudiant found:", etudiant ? "Yes" : "No");
    
    if (!etudiant) {
      console.log("⚠️ No etudiant found for email, returning success for security");
      // Don't reveal if email exists or not for security reasons
      return { success: true, message: "Si l'email existe, un code de réinitialisation a été envoyé" };
    }

    // Generate a temporary password (6-digit code)
    const temporaryPassword = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    console.log("🔑 Generated temporary password code:", temporaryPassword);

    // Hash the temporary password
    const hashedPassword = await this.passwordService.hash(temporaryPassword);
    console.log("🔒 Temporary password hashed successfully");

    // Update the etudiant's password
    const updated = await this.repo.update(etudiant.id, { password: hashedPassword });
    console.log("✅ Temporary password updated successfully");

    // Send email with the temporary password/code
    try {
      console.log("📧 Sending temporary password code email to etudiant...");
      await emailService.sendTemporaryPasswordCode(
        etudiant.email,
        etudiant.prenom,
        etudiant.nom,
        temporaryPassword
      );
      console.log("✅ Temporary password code email sent successfully to etudiant");
    } catch (err) {
      console.error("❌ Email sending error:", err);
      throw new AppError("Erreur lors de l'envoi de l'email", 500);
    }

    return { success: true, message: "Code de réinitialisation envoyé à votre email" };
  }

  // Reset password for etudiants - DEPRECATED since we now send new passwords directly
  async resetPassword(token, newPassword) {
    throw new AppError("Cette fonctionnalité n'est plus disponible. Un nouveau mot de passe est généré automatiquement et envoyé par email.", 400);
  }
}
