import { useState } from 'react';
import { cours, formations, professeurs } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Plus, Search, GraduationCap, Award } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CoursPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>('all');

  const isAdmin = user?.role === 'admin';
  const isRF = user?.role === 'resp_formation';
  const canCreate = isAdmin || isRF;

  const baseCours = isRF && user?.formationId
    ? cours.filter(c => c.formationId === user.formationId)
    : cours;

  const filteredByFormation = selectedFormation === 'all'
    ? baseCours
    : baseCours.filter(c => c.formationId === selectedFormation);

  const filtered = filteredByFormation.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.professeurNom.toLowerCase().includes(search.toLowerCase())
  );

  const availableFormations = isRF && user?.formationId
    ? formations.filter(f => f.id === user.formationId)
    : formations;

  const availableProfesseurs = professeurs;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Cours</h1>
            <p className="mt-1 opacity-80 text-sm">
              {isAdmin ? "Gérez les cours de toutes les formations" : "Cours de votre formation"}
            </p>
          </div>
          {canCreate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Cours
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Ajouter un Cours</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>
                  <div className="space-y-2">
                    <Label>Nom du cours</Label>
                    <Input placeholder="Ex: Algorithmique Avancée" />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input placeholder="Ex: INFO301" />
                  </div>
                  <div className="space-y-2">
                    <Label>Formation</Label>
                    {isRF && user?.formationId ? (
                      <Input
                        value={availableFormations[0]?.nom || ''}
                        disabled
                        className="bg-muted"
                      />
                    ) : (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une formation" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFormations.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Professeur</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assigner un professeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProfesseurs.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.prenom} {p.nom} — {p.specialite}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Crédits</Label>
                      <Input type="number" placeholder="3" min={1} max={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Semestre</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Semestre 1</SelectItem>
                          <SelectItem value="2">Semestre 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground">
                    Créer le Cours
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours, code ou professeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        {isAdmin && (
          <Select value={selectedFormation} onValueChange={setSelectedFormation}>
            <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl">
              <SelectValue placeholder="Toutes les formations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les formations</SelectItem>
              {formations.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        <Card className="shadow-card card-hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon bg-hero-gradient text-primary-foreground shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{baseCours.length}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total cours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card card-hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon bg-gold-gradient text-accent-foreground shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">
                {baseCours.reduce((acc, c) => acc + c.credits, 0)}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total crédits</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-accent" />
            </div>
            Liste des cours
            <Badge variant="secondary" className="ml-2">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">Code</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Nom</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Formation</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Professeur</TableHead>
                <TableHead className="text-center text-xs uppercase tracking-wider">Crédits</TableHead>
                <TableHead className="text-center text-xs uppercase tracking-wider">Semestre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Search className="w-7 h-7 text-muted-foreground" />
                    </div>
                    Aucun cours trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {c.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{c.nom}</TableCell>
                    <TableCell>
                      <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {c.formationNom}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.professeurNom}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">{c.credits}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">S{c.semestre}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursPage;
