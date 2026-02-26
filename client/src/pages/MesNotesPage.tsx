import { useAuth } from '@/contexts/AuthContext';
import { notes, cours } from '@/data/mock';
import { FileText, Award, CheckCircle, XCircle } from 'lucide-react';
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
  const mesNotes = notes.filter((n) => n.etudiantId === user?.id);

  const moyenne =
    mesNotes.length > 0
      ? (mesNotes.reduce((acc, n) => acc + n.note, 0) / mesNotes.length).toFixed(2)
      : '—';

  const totalCredits = mesNotes.reduce((acc, n) => {
    const c = cours.find((co) => co.id === n.coursId);
    return acc + (c?.credits || 0);
  }, 0);

  const creditsValides = mesNotes
    .filter((n) => n.note >= 10)
    .reduce((acc, n) => {
      const c = cours.find((co) => co.id === n.coursId);
      return acc + (c?.credits || 0);
    }, 0);

  // Group notes by semester
  const notesBySemestre: Record<number, typeof mesNotes> = {};
  mesNotes.forEach((n) => {
    const c = cours.find((co) => co.id === n.coursId);
    const sem = c?.semestre || 0;
    if (!notesBySemestre[sem]) notesBySemestre[sem] = [];
    notesBySemestre[sem].push(n);
  });

  const semestres = Object.keys(notesBySemestre)
    .map(Number)
    .sort((a, b) => a - b);

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
              <p className="text-sm text-muted-foreground">Crédits Obtenus</p>
              <p className="text-2xl font-display font-bold text-foreground">{creditsValides}/{totalCredits}</p>
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
                {mesNotes.filter((n) => n.note >= 10).length}/{mesNotes.length}
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
                  <TableHead className="font-semibold">Code</TableHead>
                  <TableHead className="text-center font-semibold">Crédit</TableHead>
                  <TableHead className="text-center font-semibold">Note / 20</TableHead>
                  <TableHead className="text-center font-semibold">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semestres.map((sem) => {
                  const semNotes = notesBySemestre[sem];
                  const semMoyenne = (semNotes.reduce((a, n) => a + n.note, 0) / semNotes.length).toFixed(2);
                  const semCredits = semNotes.reduce((a, n) => {
                    const c = cours.find((co) => co.id === n.coursId);
                    return a + (c?.credits || 0);
                  }, 0);
                  const semCreditsValides = semNotes.filter(n => n.note >= 10).reduce((a, n) => {
                    const c = cours.find((co) => co.id === n.coursId);
                    return a + (c?.credits || 0);
                  }, 0);

                  return (
                    <>
                      {semNotes.map((n, idx) => {
                        const c = cours.find((co) => co.id === n.coursId);
                        const passed = n.note >= 10;
                        return (
                          <TableRow key={n.id} className={!passed ? 'bg-destructive/5' : ''}>
                            {idx === 0 && (
                              <TableCell
                                rowSpan={semNotes.length}
                                className="font-display font-bold text-base text-primary align-middle border-r border-border bg-muted/30"
                              >
                                S{sem}
                              </TableCell>
                            )}
                            <TableCell className="font-medium text-foreground">{n.coursNom}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-mono text-xs">{c?.code || '—'}</Badge>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">{c?.credits || '—'}</TableCell>
                            <TableCell className="text-center">
                              <span className={`text-base font-bold ${passed ? 'text-success' : 'text-destructive'}`}>
                                {n.note}
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
                        <TableCell colSpan={3} className="font-semibold text-foreground text-right">
                          Moyenne S{sem}  :  <span className="text-primary font-bold">{semMoyenne}/20</span>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-foreground">
                          {semCreditsValides}/{semCredits}
                        </TableCell>
                        <TableCell colSpan={2} className="text-center text-sm text-muted-foreground">
                          {semCreditsValides === semCredits ? (
                            <Badge className="bg-success/15 text-success">Semestre validé</Badge>
                          ) : (
                            <Badge variant="secondary">Crédits manquants</Badge>
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
