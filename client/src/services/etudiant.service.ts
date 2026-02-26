import { api } from "@/lib/api";
import type { Etudiant, Formation } from "@/types";

// Re-export for convenience
export type { Etudiant };

export interface SignupInitRequest {
  nom: string;
  prenom: string;
  email: string;
  formationId: string;
  dateNaissance: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface SetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginEtudiantRequest {
  login: string;
  password: string;
}

export interface CreateEtudiantRequest {
  nom: string;
  prenom: string;
  email: string;
  formationId: string;
  dateNaissance: string;
}

export interface UpdateEtudiantRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  formationId?: string;
  dateNaissance?: string;
}

export const etudiantService = {
  // Inscription étapes
  signupInit: async (data: SignupInitRequest): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>("/api/etudiants/signup-init", data);
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>("/api/etudiants/verify-otp", data);
  },

  setPassword: async (data: SetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>("/api/etudiants/set-password", data);
  },

  // Authentification
  login: async (data: LoginEtudiantRequest): Promise<{ success: boolean; data: { token: string } }> => {
    return api.post<{ success: boolean; data: { token: string } }>("/api/etudiants/login", data);
  },

  // CRUD
  getAll: async (): Promise<{ success: boolean; data: Etudiant[] }> => {
    return api.get<{ success: boolean; data: Etudiant[] }>("/api/etudiants");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Etudiant }> => {
    return api.get<{ success: boolean; data: Etudiant }>(`/api/etudiants/id/${id}`);
  },

  create: async (data: CreateEtudiantRequest): Promise<{ success: boolean; data: Etudiant }> => {
    return api.post<{ success: boolean; data: Etudiant }>("/api/etudiants", data);
  },

  update: async (id: string, data: UpdateEtudiantRequest): Promise<{ success: boolean; data: Etudiant }> => {
    return api.put<{ success: boolean; data: Etudiant }>(`/api/etudiants/${id}`, data);
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`/api/etudiants/delete/${id}`);
  },
};
