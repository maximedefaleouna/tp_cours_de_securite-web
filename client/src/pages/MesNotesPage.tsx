import { useAuth } from '@/contexts/AuthContext';
import { FileText, Award, CheckCircle, XCircle } from 'lucide-react';
import { useNotesStore } from '@/stores/notes.store';
import { useCoursStore } from '@/stores/cours.store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MesNotesPage = () => {
  const { user } = useAuth();
  const { notes, fetchNotes } = useNotesStore();
  const { cours, fetchCours } = useCoursStore();

  useEffect(() => {
    fetchNotes();
    fetchCours();
  }, [fetchNotes, fetchCours]);

  const mesNotes = notes.filter((n) => n.etudiantId === user?.id);

  const moyenne =
    mesNotes.length > 0
      ? (mesNotes.reduce((acc, n) => acc + n.valeur, 0) / mesNotes.length).toFixed(2)
      : '—';

  const totalCoefficients = mesNotes.reduce((acc, n) => {
    const c = cours.find((co) => co.id === n.coursId);
    return acc + (c?.coefficient || 0);
  }, 0);

  const coefficientsValides = mesNotes
    .filter((n) => n.valeur >= 10)
    .reduce((acc, n) => {
      const c = cours.find((co) => co.id === n.coursId);
      return acc + (c?.coefficient || 0);
    }, 0);

  // Group notes by semester (S1 or S2)
  const notesBySemestre: Record<string, typeof mesNotes> = {};
  mesNotes.forEach((n) => {
    const c = cours.find((co) => co.id === n.coursId);
    const sem = c?.semestre || 'S1';
    if (!notesBySemestre[sem]) notesBySemestre[sem] = [];
    notesBySemestre[sem].push(n);
  });

  const semestres = Object.keys(notesBySemestre).sort();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Mes Notes</h1>
        <p className="text-muted-foreground mt-1">Consultez vos résultats académiques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold-gradient flex items-center justify-center">
              <Award className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moyenne Générale</p>
              <p className="text-2xl font-display font-bold text-foreground">{moyenne}/20</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              <FileText className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coefficients Obtenus</p>
              <p className="text-2xl font-display font-bold text-foreground">{coefficientsValides}/{totalCoefficients}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Matières Validées</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {mesNotes.filter((n) => n.valeur >= 10).length}/{mesNotes.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full table of all grades */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <FileText className="w-5 h-5 text-accent" />
            Récapitulatif Complet des Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Semestre</TableHead>
                  <TableHead className="font-semibold">Matière</TableHead>
                  <TableHead className="text-center font-semibold">Coefficient</TableHead>
                  <TableHead className="text-center font-semibold">Note / 20</TableHead>
                  <TableHead className="text-center font-semibold">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semestres.map((sem) => {
                  const semNotes = notesBySemestre[sem];
                  const semMoyenne = (semNotes.reduce((a, n) => a + n.valeur, 0) / semNotes.length).toFixed(2);
                  const semCoefficients = semNotes.reduce((a, n) => {
                    const c = cours.find((co) => co.id === n.coursId);
                    return a + (c?.coefficient || 0);
                  }, 0);
                  const semCoefficientsValides = semNotes.filter(n => n.valeur >= 10).reduce((a, n) => {
                    const c = cours.find((co) => co.id === n.coursId);
                    return a + (c?.coefficient || 0);
                  }, 0);

                  return (
                    <>
                      {semNotes.map((n, idx) => {
                        const c = cours.find((co) => co.id === n.coursId);
                        const passed = n.valeur >= 10;
                        return (
                          <TableRow key={n.id} className={!passed ? 'bg-destructive/5' : ''}>
                            {idx === 0 && (
                              <TableCell
                                rowSpan={semNotes.length}
                                className="font-display font-bold text-base text-primary align-middle border-r border-border bg-muted/30"
                              >
                                {sem}
                              </TableCell>
                            )}
                            <TableCell className="font-medium text-foreground">{n.Cours?.nom || c?.nom || 'N/A'}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{c?.coefficient || '—'}</TableCell>
                            <TableCell className="text-center">
                              <span className={`text-base font-bold ${passed ? 'text-success' : 'text-destructive'}`}>
                                {n.valeur}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {passed ? (
                                <Badge className="bg-success/15 text-success border-success/30">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Validé
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/30">
                                  <XCircle className="w-3 h-3 mr-1" /> Non validé
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* Semester summary row */}
                      <TableRow key={`summary-${sem}`} className="bg-muted/60 border-b-2 border-border">
                        <TableCell colSpan={2} className="font-semibold text-foreground text-right">
                          Moyenne {sem}  :  <span className="text-primary font-bold">{semMoyenne}/20</span>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-foreground">
                          {semCoefficientsValides}/{semCoefficients}
                        </TableCell>
                        <TableCell colSpan={2} className="text-center text-sm text-muted-foreground">
                          {semCoefficientsValides === semCoefficients ? (
                            <Badge className="bg-success/15 text-success">Semestre validé</Badge>
                          ) : (
                            <Badge variant="secondary">Coefficients manquants</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesNotesPage;
