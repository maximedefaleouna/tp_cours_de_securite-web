class Autorisation {
  /**
   * Vérifie que l'utilisateur est authentifié
   */
  isAuthenticated() {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }
      next();
    };
  }

  /**
   * Vérifie que l'utilisateur est admin
   */
  isAdmin() {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      next();
    };
  }

  /**
   * Vérifie un rôle précis
   */
  hasRole(role) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `Accès réservé au rôle : ${role}`,
        });
      }

      next();
    };
  }

  /**
   * Vérifie plusieurs rôles
   */
  hasRoles(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé",
        });
      }

      next();
    };
  }
}

export default new Autorisation();
