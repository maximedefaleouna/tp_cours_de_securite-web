import speakeasy from 'speakeasy';
import crypto from 'crypto';

/**
 * Service d'Authentification à Deux Facteurs (2FA)
 * Gère la génération et validation des codes OTP et secrets TOTP
 */
export class TwoFactorAuthService {
  constructor() {
    // Configuration par défaut
    this.issuer = 'Université de Kara';
    this.algorithm = 'sha1';
    this.digits = 6;
    this.period = 30; // secondes
    this.window = 2; // Fenêtre de validation (tokens avant/après)
    
    // Stockage temporaire des secrets (en production, utiliser une base de données)
    this.userSecrets = new Map();
    
    // Codes de récupération (en production, utiliser une base de données)
    this.recoveryCodes = new Map();
  }

  /**
   * Génère un secret pour l'authentification 2FA
   * @param {string} email - Email de l'utilisateur
   * @returns {Object} Secret et URL QR code
   */
  generateSecret(email) {
    const secret = speakeasy.generateSecret({
      name: `${this.issuer} (${email})`,
      issuer: this.issuer,
      length: 32,
      algorithm: this.algorithm,
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      otpAuthUrl: secret.otpauth_url,
    };
  }

  /**
   * Vérifie un code OTP (Time-based One-Time Password)
   * @param {string} token - Code OTP à vérifier (6 chiffres)
   * @param {string} secret - Secret de l'utilisateur
   * @returns {boolean} true si le token est valide
   */
  verifyToken(token, secret) {
    if (!token || !secret) {
      return false;
    }

    // Vérifier le token avec une fenêtre de temps
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token.toString(),
      window: this.window,
      period: this.period,
      algorithm: this.algorithm,
    });

    return verified;
  }

  /**
   * Génère un code OTP temporaire (pour envoi par email/SMS)
   * @returns {string} Code OTP à 6 chiffres
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Génère des codes de récupération pour l'utilisateur
   * @param {string} userId - Identifiant de l'utilisateur
   * @param {number} count - Nombre de codes à générer (défaut: 10)
   * @returns {Array<string>} Liste des codes de récupération
   */
  generateRecoveryCodes(userId, count = 10) {
    const codes = [];
    
    for (let i = 0; i < count; i++) {
      // Générer un code aléatoire de 8 caractères
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }

    // Stocker les codes hachés pour sécurité
    if (!this.recoveryCodes.has(userId)) {
      this.recoveryCodes.set(userId, []);
    }

    const hashedCodes = codes.map(code => ({
      code: this.hashRecoveryCode(code),
      used: false,
      usedAt: null,
    }));

    this.recoveryCodes.get(userId).push(...hashedCodes);

    return codes;
  }

  /**
   * Hache un code de récupération
   * @param {string} code - Code à hacher
   * @returns {string} Code haché
   */
  hashRecoveryCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Valide et utilise un code de récupération
   * @param {string} userId - Identifiant de l'utilisateur
   * @param {string} code - Code de récupération
   * @returns {boolean} true si le code est valide et utilisé
   */
  useRecoveryCode(userId, code) {
    if (!userId || !code || !this.recoveryCodes.has(userId)) {
      return false;
    }

    const hashedCode = this.hashRecoveryCode(code.toUpperCase());
    const userCodes = this.recoveryCodes.get(userId);

    const codeIndex = userCodes.findIndex(c => c.code === hashedCode && !c.used);

    if (codeIndex === -1) {
      return false;
    }

    // Marquer le code comme utilisé
    userCodes[codeIndex].used = true;
    userCodes[codeIndex].usedAt = Date.now();

    return true;
  }

  /**
   * Active la 2FA pour un utilisateur
   * @param {string} userId - Identifiant de l'utilisateur
   * @param {string} secret - Secret 2FA
   * @returns {boolean} true si activé avec succès
   */
  enable2FA(userId, secret) {
    if (!userId || !secret) {
      return false;
    }

    this.userSecrets.set(userId, {
      secret,
      enabled: true,
      enabledAt: Date.now(),
    });

    return true;
  }

  /**
   * Désactive la 2FA pour un utilisateur
   * @param {string} userId - Identifiant de l'utilisateur
   * @returns {boolean} true si désactivé avec succès
   */
  disable2FA(userId) {
    if (!userId) {
      return false;
    }

    this.userSecrets.delete(userId);
    this.recoveryCodes.delete(userId);

    return true;
  }

  /**
   * Vérifie si un utilisateur a la 2FA activée
   * @param {string} userId - Identifiant de l'utilisateur
   * @returns {boolean} true si la 2FA est activée
   */
  is2FAEnabled(userId) {
    if (!userId || !this.userSecrets.has(userId)) {
      return false;
    }

    return this.userSecrets.get(userId).enabled;
  }

  /**
   * Obtient le secret 2FA d'un utilisateur
   * @param {string} userId - Identifiant de l'utilisateur
   * @returns {string|null} Le secret ou null
   */
  getSecret(userId) {
    if (!userId || !this.userSecrets.has(userId)) {
      return null;
    }

    return this.userSecrets.get(userId).secret;
  }

  /**
   * Génère un URI TOTP pour application d'authentification
   * @param {string} email - Email de l'utilisateur
   * @param {string} secret - Secret 2FA
   * @returns {string} URI TOTP compatible avec Google Authenticator, Authy, etc.
   */
  generateTOTPURI(email, secret) {
    return `otpauth://totp/${encodeURIComponent(this.issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(this.issuer)}&algorithm=${this.algorithm}&digits=${this.digits}&period=${this.period}`;
  }

  /**
   * Middleware Express pour protéger les routes avec 2FA
   * À utiliser sur les routes qui nécessitent une vérification 2FA
   */
  middleware() {
    return (req, res, next) => {
      // Récupérer l'ID utilisateur depuis JWT ou session
      const userId = req.user?.userId || req.session?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        });
      }

      // Vérifier si la 2FA est activée pour cet utilisateur
      if (this.is2FAEnabled(userId)) {
        // Vérifier si l'utilisateur a déjà passé la vérification 2FA dans cette session
        if (!req.session?.twoFactorVerified) {
          return res.status(403).json({
            success: false,
            message: 'Vérification 2FA requise',
            requiresTwoFactor: true,
          });
        }
      }

      // 2FA vérifiée ou non activée, continuer
      next();
    };
  }

  /**
   * Middleware pour forcer la vérification 2FA sur certaines routes
   */
  require2FA() {
    return (req, res, next) => {
      const userId = req.user?.userId || req.session?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        });
      }

      // Si la 2FA est activée mais pas vérifiée
      if (this.is2FAEnabled(userId) && !req.session?.twoFactorVerified) {
        return res.status(403).json({
          success: false,
          message: 'Vérification 2FA obligatoire',
          requiresTwoFactor: true,
        });
      }

      next();
    };
  }

  /**
   * Nettoie les anciennes données (codes de récupération utilisés)
   */
  cleanup() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    for (const [userId, codes] of this.recoveryCodes.entries()) {
      const validCodes = codes.filter(c => !c.used || (c.usedAt && c.usedAt > thirtyDaysAgo));
      
      if (validCodes.length === 0) {
        this.recoveryCodes.delete(userId);
      } else {
        this.recoveryCodes.set(userId, validCodes);
      }
    }
  }
}

// Export d'une instance singleton
export const twoFactorService = new TwoFactorAuthService();

// Nettoyage automatique toutes les 24 heures
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    twoFactorService.cleanup();
  }, 24 * 60 * 60 * 1000); // 24 heures
}