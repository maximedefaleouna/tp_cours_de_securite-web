import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, AppRole } from '@/types';
import { currentUser } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User> = {
  'admin@univ-kara.tg': { id: 'admin-1', email: 'admin@univ-kara.tg', nom: 'KOFFI', prenom: 'Ama', role: 'admin' },
  'rf@univ-kara.tg': { id: 'rf-1', email: 'rf@univ-kara.tg', nom: 'AGBEKO', prenom: 'Kodjo', role: 'resp_formation', formationId: 'f1' },
  'prof@univ-kara.tg': { id: 'p1', email: 'prof@univ-kara.tg', nom: 'ADOM', prenom: 'Kofi', role: 'professeur' },
  'etudiant@univ-kara.tg': { id: 'e1', email: 'etudiant@univ-kara.tg', nom: 'TOSSOU', prenom: 'Kossi', role: 'etudiant', formationId: 'f1' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const foundUser = mockUsers[email];
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const switchRole = (role: AppRole) => {
    const userForRole = Object.values(mockUsers).find(u => u.role === role);
    if (userForRole) setUser(userForRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
