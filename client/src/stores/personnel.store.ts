import { create } from "zustand";
import { personnelService, Personnel, CreatePersonnelRequest, UpdatePersonnelRequest } from "@/services/personnel.service";
import { ApiError } from "@/lib/api";

interface PersonnelState {
  personnel: Personnel[];
  currentPersonnel: Personnel | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPersonnel: () => Promise<void>;
  fetchPersonnelForSelection: () => Promise<void>;
  fetchPersonnelById: (id: string) => Promise<void>;
  createPersonnel: (data: CreatePersonnelRequest) => Promise<boolean>;
  updatePersonnel: (id: string, data: UpdatePersonnelRequest) => Promise<boolean>;
  deletePersonnel: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentPersonnel: () => void;
}

export const usePersonnelStore = create<PersonnelState>((set, get) => ({
  personnel: [],
  currentPersonnel: null,
  isLoading: false,
  error: null,

  fetchPersonnel: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await personnelService.getAll();
      if (response.success) {
        set({ personnel: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement du personnel", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement du personnel";
      set({ error: message, isLoading: false });
    }
  },

  fetchPersonnelForSelection: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await personnelService.getAllForSelection();
      if (response.success) {
        set({ personnel: response.data, isLoading: false });
      } else {
        set({ error: "Erreur lors du chargement du personnel", isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement du personnel";
      set({ error: message, isLoading: false });
    }
  },

  fetchPersonnelById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await personnelService.getById(id);
      if (response.success) {
        set({ currentPersonnel: response.data, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erreur lors du chargement";
      set({ error: message, isLoading: false });
    }
  },

  createPersonnel: async (data: CreatePersonnelRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await personnelService.create(data);
      if (response.success) {
        set((state) => ({
          personnel: [...state.personnel, response.data],
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

  updatePersonnel: async (id: string, data: UpdatePersonnelRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await personnelService.update(id, data);
      if (response.success) {
        set((state) => ({
          personnel: state.personnel.map((p) => (p.id === id ? response.data : p)),
          currentPersonnel: state.currentPersonnel?.id === id ? response.data : state.currentPersonnel,
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

  deletePersonnel: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await personnelService.delete(id);
      set((state) => ({
        personnel: state.personnel.filter((p) => p.id !== id),
        currentPersonnel: state.currentPersonnel?.id === id ? null : state.currentPersonnel,
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
  clearCurrentPersonnel: () => set({ currentPersonnel: null }),
}));
