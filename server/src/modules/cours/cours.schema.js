import { z } from "zod";

export default class CoursSchema {
  constructor() {
    this.createSchema = z.object({
      nom: z.string().min(2),
      description: z.string().optional(),
      formationId: z.string().uuid(),
      professeurId: z.string().uuid(),
      coefficient: z.number().int().positive(),
      semestre: z.enum(["S1", "S2"]),
    });

    this.updateSchema = z.object({
      nom: z.string().min(2).optional(),
      description: z.string().optional(),
      formationId: z.string().uuid().optional(),
      professeurId: z.string().uuid().optional(),
      coefficient: z.number().int().positive().optional(),
      semestre: z.enum(["S1", "S2"]).optional(),
    });
  }
}
