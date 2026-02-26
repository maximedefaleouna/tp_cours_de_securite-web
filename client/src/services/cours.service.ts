import { api } from "@/lib/api";
import type { Cours } from "@/types";

// Re-export for convenience
export type { Cours };

export interface CreateCoursRequest {
  nom: string;
  description: string;
  formationId: string;
  professeurId: string;
  coefficient: number;
  semestre: "S1" | "S2";
}

export interface UpdateCoursRequest {
  nom?: string;
  description?: string;
  formationId?: string;
  professeurId?: string;
  coefficient?: number;
  semestre?: "S1" | "S2";
}

export const coursService = {
  getAll: async (): Promise<{ success: boolean; data: Cours[] }> => {
    return api.get<{ success: boolean; data: Cours[] }>("/api/cours");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Cours }> => {
    return api.get<{ success: boolean; data: Cours }>(`/api/cours/${id}`);
  },

  getByFormation: async (formationId: string): Promise<{ success: boolean; data: Cours[] }> => {
    return api.get<{ success: boolean; data: Cours[] }>(`/api/cours/formation/${formationId}`);
  },

  create: async (data: CreateCoursRequest): Promise<{ success: boolean; data: Cours; message?: string }> => {
    return api.post<{ success: boolean; data: Cours; message?: string }>("/api/cours", data);
  },

  update: async (id: string, data: UpdateCoursRequest): Promise<{ success: boolean; data: Cours }> => {
    return api.put<{ success: boolean; data: Cours }>(`/api/cours/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/cours/${id}`);
  },
};
