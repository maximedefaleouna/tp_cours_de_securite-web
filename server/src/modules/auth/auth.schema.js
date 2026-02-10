import { z } from "zod";

export class AuthSchemas {
  static adminLogin = z.object({
    identifier: z.string().min(3, "Email ou matricule requis"),
    password: z.string().min(1, "Le mot de passe est requis"),
  });
}
