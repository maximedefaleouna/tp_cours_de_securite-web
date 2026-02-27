import { createContext, useContext, useEffect, ReactNode } from 'react';
import type { AppRole } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { User, authService } from '@/services/auth.service';
import { etudiantService } from '@/services/etudiant.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  switchRole: (role: AppRole) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo login (non-admin)
const mockUsers: Record<string, User> = {
  'admin@univ-kara.tg': { id: 'admin-1', email: 'admin@univ-kara.tg', nom: 'KOFFI', prenom: 'Ama', role: 'admin' },
  'rf@univ-kara.tg': { id: 'rf-1', email: 'rf@univ-kara.tg', nom: 'AGBEKO', prenom: 'Kodjo', role: 'resp_formation' },
  'prof@univ-kara.tg': { id: 'p1', email: 'prof@univ-kara.tg', nom: 'ADOM', prenom: 'Kofi', role: 'professeur' },
  'etudiant@univ-kara.tg': { id: 'e1', email: 'etudiant@univ-kara.tg', nom: 'TOSSOU', prenom: 'Kossi', role: 'etudiant' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    store.initializeAuth();
  }, []);

  // Login for etudiants
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if this is a mock user (for demo purposes)
    const foundMockUser = mockUsers[email];
    if (foundMockUser) {
      // For demo, we'll still use mock data for regular login
      // In production, this should call an API endpoint
      return true;
    }
    
    // For real etudiant login, use the auth store
    try {
      const response = await etudiantService.login({ login: email, password });
      if (response.success && response.data) {
        // Store tokens
        authService.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        
        // Store user data
        const user = {
          id: response.data.etudiant.id,
          nom: response.data.etudiant.nom,
          prenom: response.data.etudiant.prenom,
          email: response.data.etudiant.email,
          matricule: response.data.etudiant.numeroCarteEtudiant,
          role: 'etudiant' as const,
        };
        authService.setUser(user);
        
        // Update auth store
        store.setUserState(user, response.data.tokens.accessToken, response.data.tokens.refreshToken);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Etudiant login failed:', error);
      return false;
    }
  };

  // Admin login using real API
  const loginAdmin = async (identifier: string, password: string): Promise<boolean> => {
    return store.loginAdmin(identifier, password);
  };

  const logout = () => {
    store.logout();
  };

  const switchRole = (role: AppRole) => {
    const userForRole = Object.values(mockUsers).find(u => u.role === role);
    if (userForRole) {
      // This is for demo purposes only
      console.log('Switched to role:', role);
    }
  };

  const value: AuthContextType = {
    user: store.user,
    login,
    loginAdmin,
    logout,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    switchRole,
    clearError: store.clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
