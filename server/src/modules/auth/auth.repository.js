import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  async findAdminByEmailOrMatricule(identifier) {
    return prisma.administration.findFirst({
      where: {
        OR: [{ email: identifier }, { matricule: identifier }],
      },
    });
  }

  async updatePassword(adminId, newPassword) {
    return prisma.administration.update({
      where: { id: adminId },
      data: { password: newPassword },
    });
  }

  async disconnect() {
    await prisma.$disconnect();
  }
}
