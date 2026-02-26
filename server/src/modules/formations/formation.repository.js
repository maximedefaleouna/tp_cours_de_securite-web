import prisma from "../../config/prismaClient.js";

export default class FormationRepository {
  constructor() {
    this.prisma = prisma;
  }

  // Crée une formation ET lie à un seul responsable via FormationResponsable
  async create(data) {
    return this.prisma.formation.create({
      data: {
        nom: data.nom,
        description: data.description,
        createdById: data.createdById,
        updatedById: data.updatedById,
        formationResponsables: data.responsableId
          ? {
              create: {
                responsableId: data.responsableId,
                createdById: data.createdById,
                updatedById: data.createdById,
              },
            }
          : undefined,
      },
      include: {
        formationResponsables: true, // On ne fait pas de include avec 'responsable', seulement le lien intermédiaire
      },
    });
  }

  async findAll() {
    return this.prisma.formation.findMany({
      where: { isDeleted: false },
      include: {
        cours: true,
        formationResponsables: {
          select: {
            id: true,
            responsableId: true,
            formationId: true,
            Responsable: {
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
        },
        etudiants: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.formation.findFirst({
      where: { id, isDeleted: false },
      include: {
        cours: true,
        formationResponsables: {
          select: {
            id: true,
            responsableId: true,
            formationId: true,
            Responsable: {
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
        },
        etudiants: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {
      nom: data.nom,
      description: data.description,
      updatedById: data.updatedById,
    };

    // Si responsable à mettre à jour, on supprime l'ancien et lie le nouveau
    if (data.responsableId) {
      updateData.formationResponsables = {
        deleteMany: {}, // remove any existing responsible
        create: {
          responsableId: data.responsableId,
          createdById: data.updatedById,
          updatedById: data.updatedById,
        },
      };
    }

    return this.prisma.formation.update({
      where: { id },
      data: updateData,
      include: {
        cours: true,
        formationResponsables: {
          select: {
            id: true,
            responsableId: true,
            formationId: true,
            Responsable: {
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
        },
        etudiants: true,
      },
    });
  }

  async softDelete(id, updatedById) {
    return this.prisma.formation.update({
      where: { id },
      data: { isDeleted: true, updatedById },
    });
  }
}
