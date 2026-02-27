export default class CoursRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.cours.create({
      data,
      include: {
        Formation: true,
        professeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        notes: true,
      },
    });
  }

  async findAll() {
    return this.prisma.cours.findMany({
      where: { isDeleted: false },
      include: {
        Formation: true,
        professeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        notes: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.cours.findUnique({
      where: { id },
      include: {
        Formation: true,
        professeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        notes: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.cours.update({ where: { id }, data });
  }

  async softDelete(id) {
    return this.prisma.cours.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async findByFormation(formationId) {
    return this.prisma.cours.findMany({
      where: { formationId, isDeleted: false },
    });
  }

  async findByProfesseur(professeurId) {
    return this.prisma.cours.findMany({
      where: { professeurId, isDeleted: false },
      include: {
        Formation: true,
        professeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
            isAdmin: true,
          },
        },
      },
    });
  }

  async findByFormationIds(formationIds) {
    return this.prisma.cours.findMany({
      where: {
        formationId: { in: formationIds },
        isDeleted: false,
      },
      include: {
        Formation: true,
        professeur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
            isAdmin: true,
          },
        },
      },
    });
  }
}
