import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ukLogoFull from "@/assets/uk-logo-full.png";

const AdminLoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await loginAdmin(identifier, password);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Back link */}
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        {/* Logo and Header */}
        <div className="flex items-center gap-4">
          <img
            src={ukLogoFull}
            alt="Logo Université de Kara"
            className="h-12 w-auto object-contain"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              Université de Kara
            </h2>
            <p className="text-sm text-muted-foreground leading-tight">
              Espace Administration
            </p>
          </div>
        </div>

        {/* Title */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Connexion Admin
            </h1>
          </div>
          <p className="text-muted-foreground">
            Accès réservé aux administrateurs et responsables
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-foreground font-medium">
              Email ou Matricule
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="admin@univ-kara.tg"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-hero-gradient text-primary-foreground font-semibold text-base"
            disabled={isLoading}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          © 2026 Université de Kara — Espace Administration Sécurisé
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
