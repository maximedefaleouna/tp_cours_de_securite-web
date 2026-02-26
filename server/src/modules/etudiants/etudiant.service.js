import { AppError } from "../../middlewares/error.middleware.js";
import { PasswordService } from "../../security/password.js";
import { JwtService } from "../../security/jwt.js";
import redisClient from "../../config/redis.js";
import EtudiantRepository from "./etudiant.repository.js";

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
    console.log(data);

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
    console.log(otp);
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

    // L'envoi réel de l'OTP par email doit être ajouté ici si ce n'est pas déjà fait ailleurs

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
    console.log(data);
    if (!data) throw new AppError("Demande expirée", 400);

    const parsed = JSON.parse(data);
    if (!parsed.otpVerified) throw new AppError("Email non vérifié", 403);

    if (password !== confirmPassword)
      throw new AppError("Les mots de passe ne correspondent pas", 400);

    const hashed = await this.passwordService.hash(password);

    console.log(hashed);

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

    // affiche une fonction qui fait somme

    console.log(user);

    await this.redis.del(`signup:${email}`);

    return user;
  }

  // CRUD operations for Etudiant

  // Create a new etudiant (mot de passe par défaut : 123456)
  async createEtudiant(data) {
    // Vérifie si un étudiant existe déjà avec cet email ou numéro de carte
    const existingByEmail = await this.repo.findByEmail(data.email);
    if (existingByEmail) {
      throw new AppError("Un étudiant avec cet email existe déjà", 400);
    }
    // Génère un numéro de carte aléatoire (8 chiffres)
    function genererNumeroCarte() {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    }
    // Si aucun numéro fourni ou déjà existant, en générer un unique
    let numeroCarte;
    if (data.numeroCarteEtudiant) {
      const existingByNumero = await this.repo.findByNumero(
        data.numeroCarteEtudiant,
      );
      if (existingByNumero) {
        throw new AppError(
          "Un étudiant avec ce numéro de carte existe déjà",
          400,
        );
      }
      numeroCarte = data.numeroCarteEtudiant;
    } else {
      let tries = 0;
      let existe = true;
      // Boucle pour garantir unicité (évite collision)
      while (existe && tries < 10) {
        numeroCarte = genererNumeroCarte();
        // eslint-disable-next-line no-await-in-loop
        existe = await this.repo.findByNumero(numeroCarte);
        tries += 1;
      }
      if (existe) {
        throw new AppError(
          "Impossible de générer un numéro de carte unique. Réessayez.",
          500,
        );
      }
      data.numeroCarteEtudiant = numeroCarte;
    }

    // Si aucun mot de passe fourni, utiliser "123456" par défaut
    const motDePasse = data.password ? data.password : "123456";
    data.password = await this.passwordService.hash(motDePasse);

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
    return etudiant;
  }

  // Get all etudiants (non supprimés)
  async getAllEtudiants() {
    try {
      const etudiants = await this.repo.findAll();
      console.log(etudiants);
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
      console.log(err);
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
      console.log(err);
      throw new AppError("Erreur lors de la suppression de l'étudiant", 500);
    }
  }
}
