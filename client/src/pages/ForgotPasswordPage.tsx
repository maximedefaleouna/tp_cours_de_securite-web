import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ukLogoFull from '@/assets/uk-logo-full.png';
import { authService } from '@/services/auth.service';
import { etudiantService } from '@/services/etudiant.service';

interface ForgotPasswordPageProps {
  isAdmin?: boolean;
}

const ForgotPasswordPage = ({ isAdmin = false }: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (isAdmin) {
        response = await authService.forgotPassword({ email });
      } else {
        response = await etudiantService.forgotPassword({ email });
      }
      
      if (response.success) {
        setSent(true);
      }
    } catch (error: any) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => isAdmin ? 'Administrateur' : 'Étudiant';
  const getSubtitle = () => 
    isAdmin 
      ? 'Espace Administration' 
      : 'Espace Étudiant';
  
  const getReturnPath = () => isAdmin ? '/admin/login' : '/auth';
  const getIcon = () => isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {getIcon()}
            <span className="text-sm">{getSubtitle()}</span>
          </div>
          <img src={ukLogoFull} alt="Université de Kara" className="h-12 object-contain" />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Email envoyé !</h1>
            <p className="text-muted-foreground text-sm">
              Si un compte {getTitle().toLowerCase()} est associé à <strong>{email}</strong>, vous recevrez un code de réinitialisation.
            </p>
            <p className="text-xs text-muted-foreground">(Mode démo : aucun email réel n'est envoyé)</p>
            <Link to={getReturnPath()}>
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Réinitialiser le mot de passe</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Entrez votre adresse email pour recevoir un code de réinitialisation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isAdmin ? "admin@univ-kara.tg" : "votre.email@univ-kara.tg"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-hero-gradient text-primary-foreground font-semibold" disabled={loading}>
                <Mail className="w-5 h-5 mr-2" />
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>
            </form>

            <div className="text-center">
              <Link to={getReturnPath()} className="text-sm text-accent font-semibold hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
