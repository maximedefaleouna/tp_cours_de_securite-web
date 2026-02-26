import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ukLogoFull from '@/assets/uk-logo-full.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <img src={ukLogoFull} alt="Université de Kara" className="h-12 object-contain" />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Email envoyé !</h1>
            <p className="text-muted-foreground text-sm">
              Si un compte est associé à <strong>{email}</strong>, vous recevrez un lien de réinitialisation.
            </p>
            <p className="text-xs text-muted-foreground">(Mode démo : aucun email réel n'est envoyé)</p>
            <Link to="/auth">
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
                Entrez votre adresse email pour recevoir un lien de réinitialisation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@univ-kara.tg"
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
              <Link to="/auth" className="text-sm text-accent font-semibold hover:underline inline-flex items-center gap-1">
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
