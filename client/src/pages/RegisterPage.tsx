import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formations } from "@/data/mock";

import logo from "@/assets/uk-logo-full.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    formationId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!formData.formationId) {
      setError("Veuillez choisir une formation.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <GraduationCap className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Inscription Réussie !
          </h1>
          <p className="text-muted-foreground">
            Votre compte étudiant a été créé avec succès. Vous pouvez maintenant
            vous connecter.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-hero-gradient text-primary-foreground"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo Université de Kara"
            className="h-12 w-auto object-contain"
          />

          {/* Texte */}
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              Université de Kara
            </h2>
            <p className="text-sm text-muted-foreground leading-tight">
              Inscription Étudiant
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Créer un compte
          </h1>
          <p className="mt-2 text-muted-foreground">
            Inscrivez-vous pour accéder à votre espace étudiant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="TOSSOU"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                placeholder="Kossi"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                className="h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@univ-kara.tg"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formation">
              Formation <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.formationId}
              onValueChange={(val) =>
                setFormData({ ...formData, formationId: val })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choisissez votre formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <div>
                      <span className="font-medium">{f.nom}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        — {f.departement}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="h-11"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-hero-gradient text-primary-foreground font-semibold"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            S'inscrire
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
