import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  LogOut,
  ClipboardList,
  UserCog,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Briefcase,
} from 'lucide-react';
import type { AppRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import ukLogo from '@/assets/uk-logo.jpg';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
  roles: AppRole[];
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard', roles: ['admin', 'resp_formation', 'professeur', 'etudiant'] },
  { label: 'Formations', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/formations', roles: ['admin', 'resp_formation'] },
  { label: 'Personnel', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/personnel', roles: ['admin', 'resp_formation'] },
  { label: 'Étudiants', icon: <Users className="w-5 h-5" />, path: '/dashboard/etudiants', roles: ['admin', 'resp_formation'] },
  { label: 'Cours', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/cours', roles: ['admin', 'resp_formation', 'professeur'] },
  { label: 'Saisie des Notes', icon: <ClipboardList className="w-5 h-5" />, path: '/dashboard/saisie-notes', roles: ['professeur'] },
  { label: 'Notes & Validation', icon: <FileText className="w-5 h-5" />, path: '/dashboard/notes', roles: ['admin', 'resp_formation', 'professeur'] },
  { label: 'Mes Notes', icon: <FileText className="w-5 h-5" />, path: '/dashboard/mes-notes', roles: ['etudiant'] },
  { label: 'Mon Relevé', icon: <GraduationCap className="w-5 h-5" />, path: '/dashboard/releve', roles: ['etudiant'] },
  { label: 'Mon Profil', icon: <UserCog className="w-5 h-5" />, path: '/dashboard/profil', roles: ['etudiant'] },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));

  const roleLabels: Record<AppRole, string> = {
    admin: 'Administrateur',
    resp_formation: 'Resp. Formation',
    professeur: 'Professeur',
    etudiant: 'Étudiant',
  };

  const roleColors: Record<AppRole, string> = {
    admin: 'bg-accent text-accent-foreground',
    resp_formation: 'bg-success text-success-foreground',
    professeur: 'bg-primary text-primary-foreground',
    etudiant: 'bg-secondary text-secondary-foreground',
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const currentPageLabel = filteredNav.find(item => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-[272px] bg-sidebar flex flex-col border-r border-sidebar-border shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={ukLogo} alt="Logo Université de Kara" className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" />
            <div>
              <h2 className="text-sm font-display font-bold text-sidebar-foreground tracking-wide">Univ. de Kara</h2>
              <p className="text-[11px] text-sidebar-foreground/50">Gestion des Notes</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold">Navigation</p>
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground'
                  }
                `}
              >
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-sidebar-primary opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-sidebar-accent/30">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-sm font-bold text-accent-foreground shadow-sm">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.prenom} {user.nom}</p>
              <Badge className={`text-[10px] px-1.5 py-0 ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex-1">
            <h2 className="text-lg font-display font-bold text-foreground">{currentPageLabel}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60">
              <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center text-xs font-bold text-accent-foreground">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <span className="text-sm font-medium text-foreground">{user.prenom}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
