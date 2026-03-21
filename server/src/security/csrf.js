import crypto from 'crypto';

/**
 * Service de protection CSRF (Cross-Site Request Forgery)
 * Génère et valide les tokens CSRF pour sécuriser les requêtes
 */
export class CsrfService {
  constructor() {
    // Taille du token en octets (32 octets = 64 caractères hex)
    this.tokenLength = 32;
    
    // Durée de vie du token en millisecondes (1 heure par défaut)
    this.tokenExpiration = parseInt(process.env.CSRF_TOKEN_EXPIRATION) || 3600000;
    
    // Stockage des tokens (en production, utiliser Redis ou une base de données)
    this.tokens = new Map();
  }

  /**
   * Génère un token CSRF cryptographiquement sécurisé
   * @returns {string} Token CSRF en format hexadécimal
   */
  generateToken() {
    return crypto.randomBytes(this.tokenLength).toString('hex');
  }

  /**
   * Crée un nouveau token CSRF et le stocke
   * @param {string} userId - Identifiant de l'utilisateur
   * @returns {Object} Objet contenant le token et son expiration
   */
  createToken(userId) {
    const token = this.generateToken();
    const expiresAt = Date.now() + this.tokenExpiration;

    // Stocker le token avec ses métadonnées
    if (!this.tokens.has(userId)) {
      this.tokens.set(userId, []);
    }

    this.tokens.get(userId).push({
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    // Nettoyer les anciens tokens (garder seulement les 5 plus récents)
    const userTokens = this.tokens.get(userId);
    if (userTokens.length > 5) {
      userTokens.shift();
    }

    return {
      token,
      expiresAt,
    };
  }

  /**
   * Valide un token CSRF
   * @param {string} userId - Identifiant de l'utilisateur
   * @param {string} token - Token à valider
   * @returns {boolean} true si le token est valide
   */
  validateToken(userId, token) {
    if (!userId || !token) {
      return false;
    }

    const userTokens = this.tokens.get(userId);
    if (!userTokens) {
      return false;
    }

    const currentTime = Date.now();

    // Trouver le token dans la liste
    const tokenIndex = userTokens.findIndex(t => t.token === token);
    
    if (tokenIndex === -1) {
      return false;
    }

    const tokenData = userTokens[tokenIndex];

    // Vérifier si le token est expiré
    if (currentTime > tokenData.expiresAt) {
      // Supprimer le token expiré
      userTokens.splice(tokenIndex, 1);
      return false;
    }

    return true;
  }

  /**
   * Supprime un token spécifique
   * @param {string} userId - Identifiant de l'utilisateur
   * @param {string} token - Token à supprimer
   * @returns {boolean} true si supprimé avec succès
   */
  removeToken(userId, token) {
    if (!userId || !this.tokens.has(userId)) {
      return false;
    }

    const userTokens = this.tokens.get(userId);
    const tokenIndex = userTokens.findIndex(t => t.token === token);

    if (tokenIndex !== -1) {
      userTokens.splice(tokenIndex, 1);
      return true;
    }

    return false;
  }

  /**
   * Supprime tous les tokens d'un utilisateur (déconnexion)
   * @param {string} userId - Identifiant de l'utilisateur
   * @returns {boolean} true si supprimé avec succès
   */
  removeAllUserTokens(userId) {
    return this.tokens.delete(userId);
  }

  /**
   * Nettoie les tokens expirés pour tous les utilisateurs
   * À appeler périodiquement pour éviter l'accumulation
   */
  cleanupExpiredTokens() {
    const currentTime = Date.now();

    for (const [userId, tokens] of this.tokens.entries()) {
      const validTokens = tokens.filter(t => currentTime <= t.expiresAt);
      
      if (validTokens.length === 0) {
        this.tokens.delete(userId);
      } else {
        this.tokens.set(userId, validTokens);
      }
    }
  }

  /**
   * Middleware Express pour valider les tokens CSRF
   * À utiliser sur les routes sensibles (POST, PUT, DELETE)
   */
  middleware() {
    return (req, res, next) => {
      // Ignorer les méthodes GET, HEAD, OPTIONS
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
      }

      // Récupérer le token de l'en-tête ou du corps de la requête
      const csrfToken = req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;

      // Récupérer l'ID utilisateur depuis la session ou JWT
      const userId = req.user?.userId || req.session?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        });
      }

      if (!csrfToken) {
        return res.status(403).json({
          success: false,
          message: 'Token CSRF manquant',
        });
      }

      // Valider le token
      if (!this.validateToken(userId, csrfToken)) {
        return res.status(403).json({
          success: false,
          message: 'Token CSRF invalide ou expiré',
        });
      }

      // Token valide, continuer
      next();
    };
  }
}

// Export d'une instance singleton
export const csrfService = new CsrfService();

// Nettoyage automatique des tokens expirés toutes les heures
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    csrfService.cleanupExpiredTokens();
  }, 3600000); // 1 heure
}