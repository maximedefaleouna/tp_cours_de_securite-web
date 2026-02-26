import { useState } from 'react';
import { professeurs } from '@/data/mock';
import { Search, Mail, Plus, BookOpen, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ProfesseursPage = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = professeurs.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.specialite.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Professeurs</h1>
            <p className="mt-1 opacity-80 text-sm">{professeurs.length} professeurs enregistrés</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Professeur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Nouveau Professeur</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input placeholder="ADOM" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input placeholder="Kofi" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="kofi.adom@univ-kara.tg" />
                </div>
                <div className="space-y-2">
                  <Label>Spécialité</Label>
                  <Input placeholder="Informatique" />
                </div>
                <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground">
                  Ajouter le Professeur
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou spécialité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
        {filtered.map((p) => (
          <Card key={p.id} className="shadow-card card-hover-lift overflow-hidden group">
            <div className="h-1.5 bg-hero-gradient" />
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200">
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    <p className="font-display font-bold text-foreground text-base">{p.prenom} {p.nom}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{p.email}</span>
                    </p>
                  </div>
                  <Badge className="bg-accent/10 text-accent border-accent/20 font-medium">
                    {p.specialite}
                  </Badge>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.formationNoms.map((fn) => (
                      <Badge key={fn} variant="secondary" className="text-xs gap-1">
                        <BookOpen className="w-3 h-3" />
                        {fn}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Aucun professeur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProfesseursPage;
