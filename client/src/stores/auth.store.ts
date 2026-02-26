import { create } from "zustand";
import { authService, LoginAdminRequest, User } from "@/services/auth.service";
import { ApiError } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loginAdmin: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginAdmin: async (identifier: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.loginAdmin({ identifier, password });

      if (response.success && response.data) {
        const { admin, tokens } = response.data;

        // Store tokens
        authService.setTokens(tokens.accessToken, tokens.refreshToken);

        // Create user object
        const user: User = {
          id: admin.id,
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          matricule: admin.matricule,
          role: admin.isAdmin ? "admin" : "resp_formation",
          isAdmin: admin.isAdmin,
        };

        // Store user
        authService.setUser(user);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      }

      set({
        isLoading: false,
        error: "Échec de la connexion",
      });
      return false;
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Une erreur s'est produite lors de la connexion";

      set({
        isLoading: false,
        error: message,
      });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initializeAuth: () => {
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();

    set({
      user,
      isAuthenticated,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
