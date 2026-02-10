export class ValidationService {
  constructor(schema) {
    if (!schema) {
      throw new Error("Un schema Zod est requis pour la validation");
    }
    this.schema = schema;
  }

  // Middleware pour Express
  validateRequest = (req, res, next) => {
    try {
      req.body = this.schema.parse(req.body);
      next();
    } catch (err) {
      const errors = err.errors
        ? err.errors.map((e) => ({ field: e.path[0], message: e.message }))
        : [{ message: "Données invalides" }];
      return res.status(400).json({ success: false, errors });
    }
  };
}
