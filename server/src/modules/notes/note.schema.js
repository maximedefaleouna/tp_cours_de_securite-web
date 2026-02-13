import { z } from "zod";

export default class NoteSchema {
  constructor() {
    this.createSchema = z.object({
      etudiantId: z.string().uuid(),
      coursId: z.string().uuid(),
      valeur: z.number(),
      documentUrl: z.string().url().optional(),
    });

    this.updateSchema = z.object({
      valeur: z.number().optional(),
      documentUrl: z.string().url().optional(),
    });
  }
}
