import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, UserPlus, ArrowLeft, Mail, Lock, CheckCircle, Clock } from "lucide-react";
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
import { useFormationStore } from "@/stores/formation.store";
import { etudiantService } from "@/services/etudiant.service";

import logo from "@/assets/uk-logo-full.png";

const MultiStepRegistrationPage = () => {
  const navigate = useNavigate();
  const { formations, fetchFormations } = useFormationStore();
  const [step, setStep] = useState(1); // 1: Personal Info, 2: OTP, 3: Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    formationId: "",
    dateNaissance: "",
  });

  // Step 2: OTP
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Step 3: Password
  const [passwordInfo, setPasswordInfo] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!personalInfo.nom || !personalInfo.prenom || !personalInfo.email || !personalInfo.formationId || !personalInfo.dateNaissance) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await etudiantService.signupInit({
        nom: personalInfo.nom,
        prenom: personalInfo.prenom,
        email: personalInfo.email,
        formationId: personalInfo.formationId,
        dateNaissance: personalInfo.dateNaissance,
      });

      if (response.success) {
        setOtpSent(true);
        setCountdown(60); // 60 seconds before allowing resend
        setStep(2);
      } else {
        setError(response.message || "Une erreur s'est produite lors de l'envoi de l'OTP.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'envoi de l'OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Le code OTP doit contenir 6 chiffres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await etudiantService.verifyOtp({
        email: personalInfo.email,
        otp,
      });

      if (response.success) {
        setStep(3);
      } else {
        setError(response.message || "OTP invalide.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la vérification de l'OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (passwordInfo.password !== passwordInfo.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (passwordInfo.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await etudiantService.setPassword({
        email: personalInfo.email,
        password: passwordInfo.password,
        confirmPassword: passwordInfo.confirmPassword,
      });

      if (response.success) {
        setStep(4); // Show success screen
      } else {
        setError(response.message || "Une erreur s'est produite lors de la création du compte.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Don't allow resend until countdown finishes

    setLoading(true);
    setError("");

    try {
      const response = await etudiantService.signupInit({
        nom: personalInfo.nom,
        prenom: personalInfo.prenom,
        email: personalInfo.email,
        formationId: personalInfo.formationId,
        dateNaissance: personalInfo.dateNaissance,
      });

      if (response.success) {
        setCountdown(60);
        setOtp("");
        setError("Nouveau code OTP envoyé à votre email.");
      } else {
        setError(response.message || "Une erreur s'est produite lors de l'envoi du nouvel OTP.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'envoi du nouvel OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= num
                  ? "bg-hero-gradient text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`w-12 h-1 ${
                  step > num ? "bg-hero-gradient" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground text-center">
        Informations Personnelles
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            placeholder="TOSSOU"
            value={personalInfo.nom}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, nom: e.target.value })
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
            value={personalInfo.prenom}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, prenom: e.target.value })
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
          value={personalInfo.email}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, email: e.target.value })
          }
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateNaissance">Date de naissance</Label>
        <Input
          id="dateNaissance"
          type="date"
          value={personalInfo.dateNaissance}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, dateNaissance: e.target.value })
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
          value={personalInfo.formationId}
          onValueChange={(val) =>
            setPersonalInfo({ ...personalInfo, formationId: val })
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Choisissez votre formation" />
          </SelectTrigger>
          <SelectContent>
            {formations.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                <span className="font-medium">{f.nom}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleSendOtp}
        className="w-full h-12 bg-hero-gradient text-primary-foreground font-semibold"
        disabled={loading}
      >
        {loading ? "Chargement..." : "Suivant"}
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground text-center">
        Vérification Email
      </h2>
      
      <div className="text-center space-y-2">
        <Mail className="w-12 h-12 text-hero-gradient mx-auto" />
        <p className="text-muted-foreground">
          Nous avons envoyé un code de vérification à <br />
          <span className="font-semibold">{personalInfo.email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Code de vérification</Label>
        <Input
          id="otp"
          placeholder="123456"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(value);
          }}
          className="h-11 text-center text-xl tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="h-11"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          onClick={handleVerifyOtp}
          className="h-11 bg-hero-gradient text-primary-foreground"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Vérification..." : "Soumettre"}
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="link"
          onClick={handleResendOtp}
          className="text-hero-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || countdown > 0}
        >
          {countdown > 0 ? (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Renvoyer dans {countdown}s
            </span>
          ) : (
            "Renvoyer le code"
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground text-center">
        Définir votre mot de passe
      </h2>
      
      <div className="text-center space-y-2">
        <Lock className="w-12 h-12 text-hero-gradient mx-auto" />
        <p className="text-muted-foreground">
          Créez un mot de passe sécurisé pour votre compte
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={passwordInfo.password}
          onChange={(e) =>
            setPasswordInfo({ ...passwordInfo, password: e.target.value })
          }
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={passwordInfo.confirmPassword}
          onChange={(e) =>
            setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })
          }
          className="h-11"
          required
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="h-11"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          onClick={handleSetPassword}
          className="h-11 bg-hero-gradient text-primary-foreground"
          disabled={loading}
        >
          {loading ? "Création..." : "Soumettre"}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-success" />
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
        className="bg-hero-gradient text-primary-foreground w-full"
      >
        Se connecter
      </Button>
    </div>
  );

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

        {step <= 3 && renderStepIndicator()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default MultiStepRegistrationPage;