import { useState } from 'react';
import { formations } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Plus, Users, UserCog, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const FormationsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const baseFormations = user?.role === 'resp_formation' && user.formationId
    ? formations.filter(f => f.id === user.formationId)
    : formations;

  const filtered = baseFormations.filter(
    (f) =>
      f.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.departement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Formations</h1>
            <p className="mt-1 opacity-80 text-sm">
              {isAdmin ? "Gérez les formations de l'université" : "Votre formation"}
            </p>
          </div>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Formation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Ajouter une Formation</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>
                  <div className="space-y-2">
                    <Label>Nom de la formation</Label>
                    <Input placeholder="Ex: Master Informatique" />
                  </div>
                  <div className="space-y-2">
                    <Label>Département</Label>
                    <Input placeholder="Ex: Sciences et Technologies" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Description de la formation" />
                  </div>
                  <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground">
                    Créer la Formation
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {baseFormations.length > 1 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
        {filtered.map((f) => (
          <Card key={f.id} className="shadow-card card-hover-lift overflow-hidden group cursor-pointer">
            <div className="h-1.5 bg-gold-gradient" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-display">{f.nom}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.departement}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              {f.responsableNom && (
                <p className="text-xs text-foreground">
                  <span className="text-muted-foreground">Responsable :</span> <span className="font-semibold">{f.responsableNom}</span>
                </p>
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Badge variant="secondary" className="gap-1.5">
                  <Users className="w-3 h-3" />
                  {f.nbEtudiants} étudiants
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <UserCog className="w-3 h-3" />
                  {f.nbProfesseurs} professeurs
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormationsPage;
