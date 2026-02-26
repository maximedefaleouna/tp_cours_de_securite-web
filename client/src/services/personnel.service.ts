import { api } from "@/lib/api";
import type { Personnel } from "@/types";

// Re-export for convenience
export type { Personnel };

export interface CreatePersonnelRequest {
  nom: string;
  prenom: string;
  email: string;
  isAdmin: boolean;
}

export interface UpdatePersonnelRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  isAdmin?: boolean;
}

export const personnelService = {
  getAll: async (): Promise<{ success: boolean; data: Personnel[] }> => {
    return api.get<{ success: boolean; data: Personnel[] }>("/api/administration");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Personnel }> => {
    return api.get<{ success: boolean; data: Personnel }>(`/api/administration/${id}`);
  },

  create: async (data: CreatePersonnelRequest): Promise<{ success: boolean; data: Personnel; message: string }> => {
    return api.post<{ success: boolean; data: Personnel; message: string }>("/api/administration", data);
  },

  update: async (id: string, data: UpdatePersonnelRequest): Promise<{ success: boolean; data: Personnel }> => {
    return api.put<{ success: boolean; data: Personnel }>(`/api/administration/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/administration/${id}`);
  },
};
