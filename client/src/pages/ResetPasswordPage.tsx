import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ukLogoFull from '@/assets/uk-logo-full.png';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Rediriger vers la page de mot de passe oublié car cette fonctionnalité est obsolète
  useEffect(() => {
    // Show a message to the user explaining the change
    alert("La fonctionnalité de réinitialisation de mot de passe a changé. Un nouveau mot de passe est maintenant généré automatiquement et envoyé par email.");
    navigate('/forgot-password');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <img src={ukLogoFull} alt="Université de Kara" className="h-12 object-contain" />
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Fonctionnalité obsolète</h1>
          <p className="text-muted-foreground text-sm">
            La fonctionnalité de réinitialisation de mot de passe a changé. 
            Un nouveau mot de passe est maintenant généré automatiquement et envoyé par email.
          </p>
          <Link to="/auth">
            <Button className="mt-4 bg-hero-gradient text-primary-foreground">
              Retour à la connexion
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
