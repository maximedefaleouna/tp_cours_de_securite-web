export default class AdministrationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.administration.create({ data });
  }

  async findAll() {
    return this.prisma.administration.findMany({ where: { isDeleted: false } });
  }

  async findById(id) {
    return this.prisma.administration.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return this.prisma.administration.findUnique({ where: { email } });
  }

  async findByMatricule(matricule) {
    return this.prisma.administration.findUnique({ where: { matricule } });
  }

  async update(id, data) {
    return this.prisma.administration.update({ where: { id }, data });
  }

  async softDelete(id) {
    return this.prisma.administration.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async findFormationsByResponsable(responsableId) {
    return this.prisma.formation.findMany({
      where: {
        isDeleted: false,
        formationResponsables: {
          some: {
            responsableId,
          },
        },
      },
      include: {
        cours: true,
        etudiants: true,
      },
    });
  }

  async findCoursByProfesseur(professeurId) {
    return this.prisma.cours.findMany({
      where: {
        isDeleted: false,
        professeurId,
      },
      include: {
        Formation: true,
      },
    });
  }

  async findCoursByFormationIds(formationIds) {
    return this.prisma.cours.findMany({
      where: {
        isDeleted: false,
        formationId: {
          in: formationIds,
        },
      },
      include: {
        Formation: true,
      },
    });
  }
}
