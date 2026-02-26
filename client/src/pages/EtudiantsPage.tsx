import { useState } from 'react';
import { etudiants, formations } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Search, Mail, Calendar, Plus, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const EtudiantsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterFormation, setFilterFormation] = useState<string>('all');

  const canCreate = user?.role === 'admin' || user?.role === 'resp_formation';

  const baseEtudiants = user?.role === 'resp_formation' && user.formationId
    ? etudiants.filter(e => e.formationId === user.formationId)
    : etudiants;

  const availableFormations = user?.role === 'resp_formation' && user.formationId
    ? formations.filter(f => f.id === user.formationId)
    : formations;

  const filtered = baseEtudiants.filter(
    (e) => {
      const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
        e.prenom.toLowerCase().includes(search.toLowerCase()) ||
        e.matricule.toLowerCase().includes(search.toLowerCase()) ||
        e.formationNom.toLowerCase().includes(search.toLowerCase());
      const matchFormation = filterFormation === 'all' || e.formationId === filterFormation;
      return matchSearch && matchFormation;
    }
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Étudiants</h1>
            <p className="mt-1 opacity-80 text-sm">{baseEtudiants.length} étudiants inscrits</p>
          </div>
          {canCreate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Étudiant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Inscrire un Étudiant</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Ex: TOSSOU" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input placeholder="Ex: Kossi" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Ex: kossi.tossou@univ-kara.tg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Formation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une formation" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFormations.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground">
                    Inscrire l'Étudiant
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, matricule ou formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        {user?.role === 'admin' && (
          <Select value={filterFormation} onValueChange={setFilterFormation}>
            <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl">
              <SelectValue placeholder="Filtrer par formation" />
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

      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            Liste des Étudiants
            <Badge variant="secondary" className="ml-2">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">Matricule</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Nom & Prénom</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Formation</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {e.matricule}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {e.prenom[0]}{e.nom[0]}
                      </div>
                      <span className="font-semibold text-foreground">{e.nom} {e.prenom}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {e.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {e.formationNom}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(e.dateInscription).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aucun étudiant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EtudiantsPage;
