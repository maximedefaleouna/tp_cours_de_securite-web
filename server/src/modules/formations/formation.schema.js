// src/formations/formation.schema.js
import { z } from "zod";

export default class FormationSchema {
  constructor() {
    // Schema pour création
    this.createSchema = z.object({
      nom: z.string().min(1, "Nom requis"),
      description: z.string(),
      responsableId: z
        .string()
        .uuid({ message: "ResponsableId requis au format UUID" }),
    });

    // Schema pour mise à jour
    this.updateSchema = z.object({
      nom: z.string().optional(),
      description: z.string().optional(),
      responsableId: z
        .string()
        .uuid({ message: "ResponsableId requis au format UUID" })
        .optional(),
      updatedById: z.string().uuid().optional(),
    });
  }

  validateCreate(data) {
    return this.createSchema.parse(data);
  }

  validateUpdate(data) {
    return this.updateSchema.parse(data);
  }
}
