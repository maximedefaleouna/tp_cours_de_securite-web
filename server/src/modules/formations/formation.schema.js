// src/formations/formation.schema.js
import { z } from "zod";

export default class FormationSchema {
  constructor() {
    // Schema pour création
    this.createSchema = z.object({
      nom: z.string().min(1, "Nom requis"),
      description: z.string(),
    });

    // Schema pour mise à jour
    this.updateSchema = z.object({
      nom: z.string().optional(),
      description: z.string().optional(),
    });
  }

  validateCreate(data) {
    return this.createSchema.parse(data);
  }

  validateUpdate(data) {
    return this.updateSchema.parse(data);
  }
}
