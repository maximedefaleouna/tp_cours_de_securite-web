import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
console.log("Création du premier admin...");

async function main() {
  const email = "admin@gmail.com";
  const matricule = "ADMIN001";
  const password = "123456";

  // Vérifier si le premier admin existe déjà
  const existingAdmin = await prisma.administration.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Le premier admin existe déjà !");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.administration.create({
    data: {
      nom: "Systeme",
      prenom: "Admin",
      email,
      matricule,
      password: hashedPassword,
      isAdmin: true, // super admin
    },
  });

  console.log("Premier admin créé :", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
