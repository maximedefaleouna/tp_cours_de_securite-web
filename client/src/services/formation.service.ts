import { api } from "@/lib/api";
import type { Formation } from "@/types";

// Re-export for convenience
export type { Formation };

export interface CreateFormationRequest {
  nom: string;
  description: string;
  responsableId: string;
}

export interface UpdateFormationRequest {
  nom?: string;
  description?: string;
  responsableId?: string;
}

export const formationService = {
  getAll: async (): Promise<{ success: boolean; data: Formation[] }> => {
    return api.get<{ success: boolean; data: Formation[] }>("/api/formation");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Formation }> => {
    return api.get<{ success: boolean; data: Formation }>(`/api/formation/${id}`);
  },

  create: async (data: CreateFormationRequest): Promise<{ success: boolean; data: Formation; message?: string }> => {
    return api.post<{ success: boolean; data: Formation; message?: string }>("/api/formation", data);
  },

  update: async (id: string, data: UpdateFormationRequest): Promise<{ success: boolean; data: Formation }> => {
    return api.put<{ success: boolean; data: Formation }>(`/api/formation/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/formation/${id}`);
  },
};
