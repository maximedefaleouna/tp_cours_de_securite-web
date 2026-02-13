import { z } from "zod";

export default class AdministrationSchema {
  constructor() {
    this.createSchema = z.object({
      nom: z.string().min(2),
      prenom: z.string().min(2),
      email: z.string().email(),
      isAdmin: z.boolean().optional(),
    });

    this.updateSchema = z.object({
      nom: z.string().min(2).optional(),
      prenom: z.string().min(2).optional(),
      email: z.string().email().optional(),
      isAdmin: z.boolean().optional(),
    });

    this.changePasswordSchema = z.object({
      oldPassword: z.string().min(4),
      newPassword: z.string().min(4),
    });
  }
}
