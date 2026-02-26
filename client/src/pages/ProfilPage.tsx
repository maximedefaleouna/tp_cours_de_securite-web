import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
  });

  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été enregistrées avec succès.',
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">Modifier vos informations personnelles</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center text-xl font-bold text-primary-foreground shadow-md">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div>
              <CardTitle className="text-lg">{user.prenom} {user.nom}</CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs">Étudiant</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Nom
                </Label>
                <Input
                  id="nom"
                  value={form.nom}
                  onChange={e => handleChange('nom', e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom" className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Prénom
                </Label>
                <Input
                  id="prenom"
                  value={form.prenom}
                  onChange={e => handleChange('prenom', e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Téléphone
                </Label>
                <Input
                  id="telephone"
                  value={form.telephone}
                  onChange={e => handleChange('telephone', e.target.value)}
                  placeholder="+228 90 00 00 00"
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance" className="flex items-center gap-1.5">
                  Date de naissance
                </Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={form.dateNaissance}
                  onChange={e => handleChange('dateNaissance', e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse" className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Adresse
              </Label>
              <Input
                id="adresse"
                value={form.adresse}
                onChange={e => handleChange('adresse', e.target.value)}
                placeholder="Quartier, Ville"
                className="rounded-xl h-11"
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto rounded-xl h-11 gap-2">
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Enregistré' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilPage;
