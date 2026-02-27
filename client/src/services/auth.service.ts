import { api } from "@/lib/api";
import type { User } from "@/types";

export interface LoginAdminRequest {
  identifier: string;
  password: string;
}

export interface LoginAdminResponse {
  success: boolean;
  message?: string;
  data?: {
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface GetMeResponse {
  success: boolean;
  data: {
    formationsResponsable?: any[];
    cours?: any[];
  };
}

// Storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export const authService = {
  // Admin login
  loginAdmin: async (data: LoginAdminRequest): Promise<LoginAdminResponse> => {
    return api.post<LoginAdminResponse>("/api/auth/admin/login", data);
  },

  // Get current user profile
  getMe: async (): Promise<GetMeResponse> => {
    return api.get<GetMeResponse>("/api/administration/me");
  },

  // Password management
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ success: boolean; message?: string }> => {
    return api.post<{ success: boolean; message?: string }>('/api/auth/admin/forgot-password', data);
  },

  // Reset password is no longer available - password is generated and sent via email
  // resetPassword: async (data: ResetPasswordRequest): Promise<{ success: boolean; message?: string }> => {
  //   return api.post<{ success: boolean; message?: string }>('/api/auth/admin/reset-password', data);
  // },

  changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message?: string }> => {
    return api.put<{ success: boolean; message?: string }>("/api/etudiants/change-password", data);
  },

  // Token management
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // User management
  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // Authentication status
  isAuthenticated: (): boolean => {
    return !!authService.getAccessToken() && !!authService.getUser();
  },

  // Logout
  logout: (): void => {
    authService.clearTokens();
    authService.clearUser();
  }
};

export type { User };