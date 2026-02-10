import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class AuthRepository {
  async findAdminByEmailOrMatricule(identifier) {
    return prisma.administration.findFirst({
      where: {
        OR: [{ email: identifier }, { matricule: identifier }],
      },
    });
  }

  async disconnect() {
    await prisma.$disconnect();
  }
}
