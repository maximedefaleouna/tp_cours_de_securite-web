import prisma from "../../config/prismaClient.js";

export default class FormationRepository {
  constructor() {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.formation.create({
      data: {
        nom: data.nom,
        description: data.description,
        createdBy: {
          connect: { id: data.createdById },
        },
        updatedBy: {
          connect: { id: data.updatedById },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.formation.findMany({
      where: { isDeleted: false },
      include: {
        cours: true,
        formationResponsables: true,
        etudiants: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.formation.findFirst({
      where: { id, isDeleted: false },
      include: {
        cours: true,
        formationResponsables: true,
        etudiants: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.formation.update({ where: { id }, data });
  }

  async softDelete(id, updatedById) {
    return this.prisma.formation.update({
      where: { id },
      data: { isDeleted: true, updatedById },
    });
  }
}
