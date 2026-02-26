import { z } from "zod";

export default class EtudiantSchema {
  constructor() {
    // Étape 1 : signup init
    this.signupInitSchema = z.object({
      nom: z.string().min(2),
      prenom: z.string().min(2),
      email: z.string().email(),
      formationId: z.string().uuid(),
      dateNaissance: z.string(), // ISO string
    });

    // Étape 2 : verification OTP
    this.verifyOtpSchema = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    });

    // Étape 3 : définir mot de passe
    this.setPasswordSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    });

    // Login
    this.loginSchema = z.object({
      login: z.string(), // email ou numeroCarteEtudiant
      password: z.string().min(6),
    });

    // Schéma de mise à jour d'un étudiant
    this.updateSchema = z.object({
      nom: z.string().min(2).optional(),
      prenom: z.string().min(2).optional(),
      email: z.string().email().optional(),
      dateNaissance: z.string().optional(),
      formationId: z.string().uuid().optional(),
    });
  }
}
