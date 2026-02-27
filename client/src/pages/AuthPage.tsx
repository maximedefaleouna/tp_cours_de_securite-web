import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, LogIn, Eye, EyeOff, Shield, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hero-university.jpg";
import ukLogoFull from "@/assets/uk-logo-full.png";


const AuthPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try real etudiant login via context
      const success = await contextLogin(login, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Identifiant ou mot de passe incorrect.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Campus de l'Université de Kara"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <img
            src={ukLogoFull}
            alt="Université de Kara"
            className="h-14 object-contain drop-shadow-lg self-start"
          />

          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight">
              Gestion des notes <br />
              <span className="text-gradient-gold">Université de kara</span>
            </h1>
            <p className="text-lg opacity-90 max-w-md leading-relaxed">
              Espace de gestion scolaire et gestion de note Université de Kara
            </p>
            {/* <div className="flex gap-4">
              <div className="px-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border">
                <p className="text-2xl font-bold">648</p>
                <p className="text-xs opacity-70">Étudiants</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border">
                <p className="text-2xl font-bold">53</p>
                <p className="text-xs opacity-70">Professeurs</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border">
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs opacity-70">Formations</p>
              </div>
            </div> */}
          </div>

          <p className="text-xs opacity-50">
            © 2026 Université de Kara — Tous droits réservés
          </p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="lg:hidden mb-8">
            <img
              src={ukLogoFull}
              alt="Université de Kara"
              className="h-12 object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Connexion
            </h1>
            <p className="mt-2 text-muted-foreground">
              Accédez à votre espace personnel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-foreground font-medium">
                Email ou N° Carte Étudiant
              </Label>
              <div className="relative">
                <Input
                  id="login"
                  type="text"
                  placeholder="votre.email@univ-kara.tg ou ETU20250001"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Vous pouvez utiliser votre email ou votre numéro de carte étudiant
              </p>
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

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-accent font-semibold hover:underline"
              >
                Réinitialiser le mot de passe
              </a>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-hero-gradient text-primary-foreground font-semibold text-base"
              disabled={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Exemples de connexion :
            </p>
            <div className="p-3 rounded-lg border border-border bg-card text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Étudiants :</p>
              <p>Email: votre.email@example.com</p>
              <p>ou N° Carte: ETU20250001</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Étudiant ?{" "}
                <a
                  href="/register"
                  className="text-accent font-semibold hover:underline"
                >
                  Créer un compte
                </a>
              </p>
            </div>
            <div className="text-center pt-3 border-t border-border">
              <a
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Espace Administration</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
