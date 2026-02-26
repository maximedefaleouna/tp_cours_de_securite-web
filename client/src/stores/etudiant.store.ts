import { create } from "zustand";
import { etudiantService, Etudiant, CreateEtudiantRequest, UpdateEtudiantRequest } from "@/services/etudiant.service";
import { ApiError } from "@/lib/api";

interface EtudiantState {
  etudiants: Etudiant[];
  currentEtudiant: Etudiant | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEtudiants: () => Promise<void>;
  fetchEtudiantById: (id: string) => Promise<void>;
  createEtudiant: (data: CreateEtudiantRequest) => Promise<boolean>;
  updateEtudiant: (id: string, data: UpdateEtudiantRequest) => Promise<boolean>;
  deleteEtudiant: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentEtudiant: () => void;
}

export const useEtudiantStore = create<EtudiantState>((set, get) => ({
  etudiants: [],
  currentEtudiant: null,
  isLoading: false,
  error: null,

  fetchEtudiants: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await etudiantService.getAll();
      if (response.success) {
        set({ etudiants: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement des étudiants", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement des étudiants";
      set({ error: message, isLoading: false });
    }
  },

  fetchEtudiantById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await etudiantService.getById(id);
      if (response.success) {
        set({ currentEtudiant: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  createEtudiant: async (data: CreateEtudiantRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await etudiantService.create(data);
      if (response.success) {
        set((state) => ({
          etudiants: [...state.etudiants, response.data],
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

  updateEtudiant: async (id: string, data: UpdateEtudiantRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await etudiantService.update(id, data);
      if (response.success) {
        set((state) => ({
          etudiants: state.etudiants.map((e) => (e.id === id ? response.data : e)),
          currentEtudiant: state.currentEtudiant?.id === id ? response.data : state.currentEtudiant,
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

  deleteEtudiant: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await etudiantService.delete(id);
      set((state) => ({
        etudiants: state.etudiants.filter((e) => e.id !== id),
        currentEtudiant: state.currentEtudiant?.id === id ? null : state.currentEtudiant,
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
  clearCurrentEtudiant: () => set({ currentEtudiant: null }),
}));
