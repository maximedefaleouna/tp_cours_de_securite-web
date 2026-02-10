export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Envoie directement la réponse HTTP via Express
   * @param {import("express").Response} res
   */
  handleResponse(res) {
    const payload = {
      success: false,
      message: this.message,
    };
    if (this.details) payload.details = this.details;
    res.status(this.statusCode).json(payload);
  }
}
