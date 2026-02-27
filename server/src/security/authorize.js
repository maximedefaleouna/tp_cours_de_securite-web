import prisma from "../config/prismaClient.js";

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
   * Pour le rôle 'resp_formation', vérifie aussi si l'utilisateur gère des formations
   */
  hasRoles(roles = []) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      // Admin always has access
      if (req.user.isAdmin) {
        return next();
      }

      // Check if role matches directly
      if (roles.includes(req.user.role)) {
        return next();
      }

      // Special case: if 'resp_formation' is allowed, check if user manages any formations
      if (roles.includes('resp_formation') && req.user.role === 'administration') {
        const formationResponsable = await prisma.formationResponsable.findFirst({
          where: { responsableId: req.user.userId },
        });
        if (formationResponsable) {
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      });
    };
  }

  /**
   * Vérifie si l'utilisateur est responsable d'une formation
   */
  isResponsableFormation() {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      // Admin can access everything
      if (req.user.isAdmin) {
        return next();
      }

      const formationId = req.params.formationId || req.body.formationId;
      
      if (!formationId) {
        return res.status(400).json({
          success: false,
          message: "ID de formation requis",
        });
      }

      const formationResponsable = await prisma.formationResponsable.findFirst({
        where: {
          responsableId: req.user.userId,
          formationId: formationId,
        },
      });

      if (!formationResponsable) {
        return res.status(403).json({
          success: false,
          message: "Vous n'êtes pas responsable de cette formation",
        });
      }

      next();
    };
  }

  /**
   * Vérifie si l'utilisateur est responsable d'une formation OU professeur du cours
   */
  canAccessCours() {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      // Admin can access everything
      if (req.user.isAdmin) {
        return next();
      }

      const coursId = req.params.id || req.params.coursId || req.body.coursId;
      
      if (!coursId) {
        return res.status(400).json({
          success: false,
          message: "ID de cours requis",
        });
      }

      const cours = await prisma.cours.findUnique({
        where: { id: coursId },
      });

      if (!cours) {
        return res.status(404).json({
          success: false,
          message: "Cours non trouvé",
        });
      }

      // Check if user is professor of this course
      if (cours.professeurId === req.user.userId) {
        return next();
      }

      // Check if user is responsable of the formation
      const formationResponsable = await prisma.formationResponsable.findFirst({
        where: {
          responsableId: req.user.userId,
          formationId: cours.formationId,
        },
      });

      if (formationResponsable) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Accès refusé à ce cours",
      });
    };
  }

  /**
   * Vérifie si l'utilisateur peut gérer les notes d'un étudiant
   */
  canManageNotes() {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      // Admin can access everything
      if (req.user.isAdmin) {
        return next();
      }

      const { etudiantId, coursId } = req.body;
      const targetCoursId = coursId || req.params.coursId;

      if (!targetCoursId) {
        return res.status(400).json({
          success: false,
          message: "ID de cours requis",
        });
      }

      const cours = await prisma.cours.findUnique({
        where: { id: targetCoursId },
      });

      if (!cours) {
        return res.status(404).json({
          success: false,
          message: "Cours non trouvé",
        });
      }

      // Check if user is professor of this course
      if (cours.professeurId === req.user.userId) {
        return next();
      }

      // Check if user is responsable of the formation
      const formationResponsable = await prisma.formationResponsable.findFirst({
        where: {
          responsableId: req.user.userId,
          formationId: cours.formationId,
        },
      });

      if (formationResponsable) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez pas gérer les notes pour ce cours",
      });
    };
  }
}

export default new Autorisation();
