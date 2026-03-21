import rateLimit from "express-rate-limit";

// Limiteur de débit général pour l'API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur de débit strict pour les endpoints d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre
  message: {
    success: false,
    message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne pas compter les connexions réussies
});

// Limiteur de débit pour les opérations sensibles
export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limite chaque IP à 10 opérations sensibles par heure
  message: {
    success: false,
    message: "Trop d'opérations sensibles, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;
