import { PasswordService } from "../../security/password.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthSchemas } from "./auth.schema.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { JwtService } from "../../security/jwt.js";

export class AuthService {
  constructor() {
    this.repository = new AuthRepository();
    this.jwtService = new JwtService();
    this.passwordService = new PasswordService();
  }

  async loginAdmin(data) {
    const { identifier, password } = AuthSchemas.adminLogin.parse(data);

    const admin = await this.repository.findAdminByEmailOrMatricule(identifier);
    if (!admin) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const isValid = await this.passwordService.compare(
      password,
      admin.password,
    );
    if (!isValid) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const payload = {
      userId: admin.id,
      role: "administration",
      isAdmin: admin.isAdmin,
    };

    return {
      success: true,
      message: "Connexion administrateur réussie",
      data: {
        admin: {
          id: admin.id,
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          matricule: admin.matricule,
          isAdmin: admin.isAdmin,
        },
        tokens: {
          accessToken: this.jwtService.generateAccessToken(payload),
          refreshToken: this.jwtService.generateRefreshToken(payload),
        },
      },
    };
  }
}
