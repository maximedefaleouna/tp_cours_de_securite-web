import { useState } from 'react';
import { notes, cours } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Search, CheckCircle, XCircle, Eye, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const NotesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCours, setSelectedCours] = useState<string>('all');
  const [localNotes, setLocalNotes] = useState(notes);

  const isAdmin = user?.role === 'admin';
  const isRF = user?.role === 'resp_formation';
  const isProf = user?.role === 'professeur';

  const availableCours = cours.filter((c) => {
    if (isAdmin) return true;
    if (isRF) return c.formationId === user?.formationId;
    if (isProf) return c.professeurId === user?.id;
    return false;
  });

  const filtered = localNotes.filter((n) => {
    const matchSearch = n.etudiantNom.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'validee' && n.validee) ||
      (filterStatus === 'en_attente' && !n.validee);
    const matchCours = selectedCours === 'all' || n.coursId === selectedCours;
    const matchRole = isAdmin
      ? true
      : isRF
        ? availableCours.some((c) => c.id === n.coursId)
        : isProf
          ? availableCours.some((c) => c.id === n.coursId)
          : false;
    return matchSearch && matchStatus && matchCours && matchRole;
  });

  const handleValidate = (id: string) => {
    setLocalNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, validee: true } : n))
    );
    toast({ title: 'Note validée ✓', description: 'La note a été validée avec succès.' });
  };

  const selectedCoursInfo = selectedCours !== 'all' ? cours.find((c) => c.id === selectedCours) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold">Notes & Validation</h1>
          <p className="mt-1 opacity-80 text-sm">Sélectionnez un cours pour consulter et valider les notes</p>
        </div>
      </div>

      {/* Cours selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger-children">
        <button
          onClick={() => setSelectedCours('all')}
          className={`p-4 rounded-xl border text-left transition-all duration-200 ${
            selectedCours === 'all'
              ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent/20'
              : 'border-border bg-card hover:border-accent/50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCours === 'all' ? 'bg-gold-gradient text-accent-foreground shadow-sm' : 'bg-muted text-muted-foreground'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Tous les cours</p>
              <p className="text-xs text-muted-foreground">{localNotes.filter((n) => {
                if (isAdmin) return true;
                return availableCours.some((c) => c.id === n.coursId);
              }).length} notes</p>
            </div>
          </div>
        </button>
        {availableCours.map((c) => {
          const courseNotes = localNotes.filter((n) => n.coursId === c.id);
          const isSelected = selectedCours === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCours(c.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent/20'
                  : 'border-border bg-card hover:border-accent/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-gold-gradient text-accent-foreground shadow-sm' : 'bg-accent/10 text-accent'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{c.nom}</p>
                  <p className="text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-mono text-[10px] px-1 py-0 mr-1">{c.code}</Badge>
                    {courseNotes.length} notes
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par étudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            <SelectItem value="validee">Validées</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes table */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            {selectedCoursInfo
              ? `Notes — ${selectedCoursInfo.nom}`
              : `Toutes les Notes`}
            <Badge variant="secondary" className="ml-2">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">Étudiant</TableHead>
                {selectedCours === 'all' && <TableHead className="text-xs uppercase tracking-wider">Cours</TableHead>}
                <TableHead className="text-xs uppercase tracking-wider">Note</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Copie Scannée</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        n.note >= 10 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {n.etudiantNom.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="font-semibold text-foreground">{n.etudiantNom}</span>
                    </div>
                  </TableCell>
                  {selectedCours === 'all' && (
                    <TableCell>
                      <Badge className="bg-accent/10 text-accent border-accent/20 font-mono text-xs">{n.coursNom}</Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <span className={`text-lg font-bold ${n.note >= 10 ? 'text-success' : 'text-destructive'}`}>
                      {n.note}<span className="text-sm font-normal text-muted-foreground">/20</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {n.scanFilename ? (
                      <button className="flex items-center gap-1.5 text-sm text-accent hover:underline group">
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        {n.scanFilename}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {n.validee ? (
                      <Badge className="bg-success/10 text-success border-success/20 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Validée
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 gap-1">
                        <XCircle className="w-3 h-3" />
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(n.dateCreation).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {!n.validee && (isAdmin || isRF) && (
                      <Button
                        size="sm"
                        className="bg-success/10 text-success hover:bg-success hover:text-success-foreground border border-success/20 transition-all duration-200"
                        variant="outline"
                        onClick={() => handleValidate(n.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Valider
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aucune note trouvée pour ce cours</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesPage;
