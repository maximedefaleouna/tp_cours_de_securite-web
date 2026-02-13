export default class NoteRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.note.create({
      data,
      include: {
        Etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
          },
        },
        Cours: {
          include: {
            professeur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                matricule: true,
              },
            },
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async findAll() {
    return this.prisma.note.findMany({
      where: { isDeleted: false },
      include: {
        Etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
          },
        },
        Cours: {
          include: {
            professeur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                matricule: true,
              },
            },
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.note.findUnique({
      where: { id },
      include: {
        Etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
          },
        },
        Cours: {
          include: {
            professeur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                matricule: true,
              },
            },
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.note.update({
      where: { id },
      data,
      include: {
        Etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
          },
        },
        Cours: {
          include: {
            professeur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                matricule: true,
              },
            },
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async softDelete(id) {
    return this.prisma.note.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async findByCours(coursId) {
    return this.prisma.note.findMany({
      where: { coursId, isDeleted: false },
      include: {
        Etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            matricule: true,
          },
        },
        Cours: {
          include: {
            professeur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                matricule: true,
              },
            },
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }
}
