import jwt from "jsonwebtoken";

class JwtService {
  constructor() {
    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("JWT secrets are missing");
    }

    this.accessSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    this.accessExpiresIn = process.env.JWT_EXPIRES_IN || "1h";
    this.refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch {
      return null;
    }
  }
}

export { JwtService };
