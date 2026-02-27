import { api } from "@/lib/api";
import type { Note } from "@/types";

// Re-export for convenience
export type { Note };

export interface CreateNoteRequest {
  etudiantId: string;
  coursId: string;
  valeur: number;
  documentUrl?: string;
  document?: File;
}

export interface UpdateNoteRequest {
  etudiantId?: string;
  coursId?: string;
  valeur?: number;
  documentUrl?: string;
}

export const notesService = {
  getAll: async (): Promise<{ success: boolean; data: Note[] }> => {
    return api.get<{ success: boolean; data: Note[] }>("/api/notes");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Note }> => {
    return api.get<{ success: boolean; data: Note }>(`/api/notes/${id}`);
  },

  getByCours: async (coursId: string): Promise<{ success: boolean; data: Note[] }> => {
    return api.get<{ success: boolean; data: Note[] }>(`/api/notes/cours/${coursId}`);
  },

  create: async (data: CreateNoteRequest): Promise<{ success: boolean; data: Note; message?: string }> => {
    // If there's a file, use FormData
    if (data.document) {
      const formData = new FormData();
      formData.append('etudiantId', data.etudiantId);
      formData.append('coursId', data.coursId);
      formData.append('valeur', data.valeur.toString());
      formData.append('document', data.document);
      
      return api.post<{ success: boolean; data: Note; message?: string }>("/api/notes", formData);
    }
    
    return api.post<{ success: boolean; data: Note; message?: string }>("/api/notes", data);
  },

  update: async (id: string, data: UpdateNoteRequest): Promise<{ success: boolean; data: Note }> => {
    return api.put<{ success: boolean; data: Note }>(`/api/notes/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/notes/${id}`);
  },
};

