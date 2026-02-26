import { create } from "zustand";
import { notesService, Note, CreateNoteRequest, UpdateNoteRequest } from "@/services/notes.service";
import { ApiError } from "@/lib/api";

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotes: () => Promise<void>;
  fetchNotesByCours: (coursId: string) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (data: CreateNoteRequest) => Promise<boolean>;
  updateNote: (id: string, data: UpdateNoteRequest) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentNote: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesService.getAll();
      if (response.success) {
        set({ notes: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement des notes", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement des notes";
      set({ error: message, isLoading: false });
    }
  },

  fetchNotesByCours: async (coursId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesService.getByCours(coursId);
      if (response.success) {
        set({ notes: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  fetchNoteById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesService.getById(id);
      if (response.success) {
        set({ currentNote: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  createNote: async (data: CreateNoteRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesService.create(data);
      if (response.success) {
        set((state) => ({
          notes: [...state.notes, response.data],
          isLoading: false,
        }));
        return true;
      }
      set({ error: "Erreur lors de la création", isLoading: false });
      return false;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors de la création";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateNote: async (id: string, data: UpdateNoteRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesService.update(id, data);
      if (response.success) {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? response.data : n)),
          currentNote: state.currentNote?.id === id ? response.data : state.currentNote,
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors de la mise à jour";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteNote: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await notesService.delete(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors de la suppression";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentNote: () => set({ currentNote: null }),
}));
