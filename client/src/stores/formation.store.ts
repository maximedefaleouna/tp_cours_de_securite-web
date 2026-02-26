import { create } from "zustand";
import { formationService, Formation, CreateFormationRequest, UpdateFormationRequest } from "@/services/formation.service";
import { ApiError } from "@/lib/api";

interface FormationState {
  formations: Formation[];
  currentFormation: Formation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFormations: () => Promise<void>;
  fetchFormationById: (id: string) => Promise<void>;
  createFormation: (data: CreateFormationRequest) => Promise<boolean>;
  updateFormation: (id: string, data: UpdateFormationRequest) => Promise<boolean>;
  deleteFormation: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentFormation: () => void;
}

export const useFormationStore = create<FormationState>((set, get) => ({
  formations: [],
  currentFormation: null,
  isLoading: false,
  error: null,

  fetchFormations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await formationService.getAll();
      if (response.success) {
        set({ formations: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement des formations", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement des formations";
      set({ error: message, isLoading: false });
    }
  },

  fetchFormationById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await formationService.getById(id);
      if (response.success) {
        set({ currentFormation: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement de la formation";
      set({ error: message, isLoading: false });
    }
  },

  createFormation: async (data: CreateFormationRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await formationService.create(data);
      if (response.success) {
        set((state) => ({
          formations: [...state.formations, response.data],
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

  updateFormation: async (id: string, data: UpdateFormationRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await formationService.update(id, data);
      if (response.success) {
        set((state) => ({
          formations: state.formations.map((f) => (f.id === id ? response.data : f)),
          currentFormation: state.currentFormation?.id === id ? response.data : state.currentFormation,
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

  deleteFormation: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await formationService.delete(id);
      set((state) => ({
        formations: state.formations.filter((f) => f.id !== id),
        currentFormation: state.currentFormation?.id === id ? null : state.currentFormation,
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
  clearCurrentFormation: () => set({ currentFormation: null }),
}));
