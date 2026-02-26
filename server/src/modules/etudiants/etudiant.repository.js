import prisma from "../../config/prismaClient.js";

export default class EtudiantRepository {
  constructor() {
    this.prisma = prisma;
  }

  create(data) {
    console.log(data);
    return this.prisma.etudiant.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        numeroCarteEtudiant: data.numeroCarteEtudiant,
        formationId: data.formationId,
        dateNaissance: data.dateNaissance,
        password: data.password,

        // Ajoute ici d'autres champs requis si besoin
      },
    });
  }

  findByEmail(email) {
    return this.prisma.etudiant.findUnique({ where: { email } });
  }

  findByNumero(numero) {
    return this.prisma.etudiant.findUnique({
      where: { numeroCarteEtudiant: numero },
    });
  }

  findByLogin(login) {
    return this.prisma.etudiant.findFirst({
      where: {
        OR: [{ email: login }, { numeroCarteEtudiant: login }],
      },
    });
  }

  findAll() {
    return this.prisma.etudiant.findMany({
      where: { isDeleted: false },
      include: { Formation: true },
    });
  }

  findById(id) {
    return this.prisma.etudiant.findUnique({
      where: { id },
      include: { Formation: true, notes: true },
    });
  }

  update(id, data) {
    return this.prisma.etudiant.update({
      where: { id },
      data,
    });
  }

  softDelete(id) {
    return this.prisma.etudiant.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
