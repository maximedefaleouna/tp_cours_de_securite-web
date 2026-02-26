import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import FormationsPage from "./pages/FormationsPage";
import EtudiantsPage from "./pages/EtudiantsPage";
import PersonnelPage from "./pages/PersonnelPage";
import SaisieNotesPage from "./pages/SaisieNotesPage";
import NotesPage from "./pages/NotesPage";
import MesNotesPage from "./pages/MesNotesPage";
import RelevePage from "./pages/RelevePage";
import ProfilPage from "./pages/ProfilPage";
import CoursPage from "./pages/CoursPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth" replace />} />
    <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
    <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/dashboard/formations" element={<ProtectedRoute><FormationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/etudiants" element={<ProtectedRoute><EtudiantsPage /></ProtectedRoute>} />
    <Route path="/dashboard/personnel" element={<ProtectedRoute><PersonnelPage /></ProtectedRoute>} />
    <Route path="/dashboard/cours" element={<ProtectedRoute><CoursPage /></ProtectedRoute>} />
    <Route path="/dashboard/saisie-notes" element={<ProtectedRoute><SaisieNotesPage /></ProtectedRoute>} />
    <Route path="/dashboard/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
    <Route path="/dashboard/mes-notes" element={<ProtectedRoute><MesNotesPage /></ProtectedRoute>} />
    <Route path="/dashboard/releve" element={<ProtectedRoute><RelevePage /></ProtectedRoute>} />
    <Route path="/dashboard/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
