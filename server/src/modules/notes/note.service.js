import { AppError } from "../../middlewares/error.middleware.js";

export default class NoteService {
  constructor(repository) {
    this.repo = repository;
  }

  async createNote(data, currentUserId) {
    // Vérifier que l'étudiant existe
    const etudiantExists = await this.repo.prisma.etudiant.findUnique({
      where: { id: data.etudiantId },
    });
    if (!etudiantExists) throw new AppError("Étudiant inexistant", 400);

    // Vérifier que le cours existe
    const coursExists = await this.repo.prisma.cours.findUnique({
      where: { id: data.coursId },
    });
    if (!coursExists) throw new AppError("Cours inexistant", 400);

    return this.repo.create({
      ...data,
      createdById: currentUserId,
      updatedById: currentUserId,
    });
  }

  async getAllNotes() {
    return this.repo.findAll();
  }

  async getNoteById(id) {
    const note = await this.repo.findById(id);
    if (!note) throw new AppError("Note introuvable", 404);
    return note;
  }

  async updateNote(id, data, currentUserId) {
    return this.repo.update(id, { ...data, updatedById: currentUserId });
  }

  async deleteNote(id) {
    return this.repo.softDelete(id);
  }

  async getNotesByCours(coursId) {
    return this.repo.findByCours(coursId);
  }
}
