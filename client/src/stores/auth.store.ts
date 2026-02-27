import { create } from "zustand";
import { authService, User } from "@/services/auth.service";
import { ApiError } from "@/lib/api";
import type { AppRole } from "@/types";

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
  loadUserProfile: () => Promise<void>;
  setUserState: (user: User, accessToken: string, refreshToken: string) => void;
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

        // Determine role based on isAdmin flag
        // Admin gets full access, others start as professeur and get upgraded based on assignments
        let role: AppRole = admin.isAdmin ? "admin" : "professeur";

        // Create user object
        const user: User = {
          id: admin.id,
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          matricule: admin.matricule,
          role,
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

        // Load extended profile to determine if user is also a responsable
        const profileResponse = await authService.getMe();
        if (profileResponse.success) {
          const hasFormations = (profileResponse.data.formationsResponsable?.length || 0) > 0;
          const hasCours = (profileResponse.data.cours?.length || 0) > 0;

          // Upgrade role to resp_formation if they have formations
          if (hasFormations && !admin.isAdmin) {
            role = "resp_formation";
          }

          const updatedUser: User = {
            ...user,
            role,
            formationsResponsable: profileResponse.data.formationsResponsable,
            cours: profileResponse.data.cours,
          };

          authService.setUser(updatedUser);
          set({ user: updatedUser });
        }

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

  initializeAuth: async () => {
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();

    set({
      user,
      isAuthenticated,
    });

    // If authenticated, load extended profile
    if (isAuthenticated && user) {
      try {
        const response = await authService.getMe();
        if (response.success) {
          const hasFormations = (response.data.formationsResponsable?.length || 0) > 0;
          const hasCours = (response.data.cours?.length || 0) > 0;

          // Determine proper role
          let role: AppRole = user.isAdmin ? "admin" : "professeur";
          if (hasFormations && !user.isAdmin) {
            role = "resp_formation";
          }

          const updatedUser: User = {
            ...user,
            role,
            formationsResponsable: response.data.formationsResponsable,
            cours: response.data.cours,
          };

          authService.setUser(updatedUser);
          set({ user: updatedUser });
        }
      } catch (error) {
        console.error("Failed to load user profile on init:", error);
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },

  loadUserProfile: async () => {
    try {
      const response = await authService.getMe();
      if (response.success) {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            formationsResponsable: response.data.formationsResponsable,
            cours: response.data.cours,
          };
          authService.setUser(updatedUser);
          set({ user: updatedUser });
        }
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  },

  setUserState: (user: User, accessToken: string, refreshToken: string) => {
    // Store tokens
    authService.setTokens(accessToken, refreshToken);
    
    // Store user
    authService.setUser(user);

    // Update store state
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },
}));

export type { User };
