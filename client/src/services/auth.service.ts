import { api } from "@/lib/api";
import type { AppRole } from "@/types";

export interface LoginAdminRequest {
  identifier: string;
  password: string;
}

export interface LoginAdminResponse {
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      matricule: string;
      isAdmin: boolean;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  matricule?: string;
  role: AppRole;
  isAdmin?: boolean;
  formationId?: string;
  // Extended profile data (loaded after login)
  formationsResponsable?: Formation[];
  cours?: Cours[];
}

export interface Formation {
  id: string;
  nom: string;
  description: string;
  cours?: Cours[];
  etudiants?: Etudiant[];
}

export interface Cours {
  id: string;
  nom: string;
  description: string;
  coefficient: number;
  semestre: string;
  formationId: string;
  Formation?: Formation;
}

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numeroCarteEtudiant: string;
}

export const authService = {
  loginAdmin: async (data: LoginAdminRequest): Promise<LoginAdminResponse> => {
    return api.post<LoginAdminResponse>("/api/auth/admin/login", data);
  },

  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setUser: (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    return api.get<{ success: boolean; data: User }>("/api/administration/me");
  },
};
