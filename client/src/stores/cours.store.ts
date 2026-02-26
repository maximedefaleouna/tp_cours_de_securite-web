import { create } from "zustand";
import { coursService, Cours, CreateCoursRequest, UpdateCoursRequest } from "@/services/cours.service";
import { ApiError } from "@/lib/api";

interface CoursState {
  cours: Cours[];
  currentCours: Cours | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCours: () => Promise<void>;
  fetchCoursByFormation: (formationId: string) => Promise<void>;
  fetchCoursById: (id: string) => Promise<void>;
  createCours: (data: CreateCoursRequest) => Promise<boolean>;
  updateCours: (id: string, data: UpdateCoursRequest) => Promise<boolean>;
  deleteCours: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentCours: () => void;
}

export const useCoursStore = create<CoursState>((set, get) => ({
  cours: [],
  currentCours: null,
  isLoading: false,
  error: null,

  fetchCours: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursService.getAll();
      if (response.success) {
        set({ cours: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement des cours", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement des cours";
      set({ error: message, isLoading: false });
    }
  },

  fetchCoursByFormation: async (formationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursService.getByFormation(formationId);
      if (response.success) {
        set({ cours: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  fetchCoursById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursService.getById(id);
      if (response.success) {
        set({ currentCours: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  createCours: async (data: CreateCoursRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursService.create(data);
      if (response.success) {
        set((state) => ({
          cours: [...state.cours, response.data],
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

  updateCours: async (id: string, data: UpdateCoursRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursService.update(id, data);
      if (response.success) {
        set((state) => ({
          cours: state.cours.map((c) => (c.id === id ? response.data : c)),
          currentCours: state.currentCours?.id === id ? response.data : state.currentCours,
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

  deleteCours: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await coursService.delete(id);
      set((state) => ({
        cours: state.cours.filter((c) => c.id !== id),
        currentCours: state.currentCours?.id === id ? null : state.currentCours,
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
  clearCurrentCours: () => set({ currentCours: null }),
}));
