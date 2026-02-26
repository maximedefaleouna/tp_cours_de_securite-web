import { useAuth } from '@/contexts/AuthContext';
import { Download, Printer } from 'lucide-react';
import { useNotesStore } from '@/stores/notes.store';
import { useCoursStore } from '@/stores/cours.store';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ukLogo from '@/assets/uk-logo-full.png';

const RelevePage = () => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mon Relevé de Notes</h1>
          <p className="text-muted-foreground mt-1">Document officiel — Notes validées uniquement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <Button className="bg-hero-gradient text-primary-foreground gap-2">
            <Download className="w-4 h-4" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <Card className="shadow-card max-w-3xl mx-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <img src={ukLogo} alt="Université de Kara" className="h-20 w-auto object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">UNIVERSITÉ DE KARA</h2>
              <p className="text-sm text-muted-foreground">République Togolaise</p>
            </div>
            <div className="bg-gold-gradient text-accent-foreground px-4 py-1.5 rounded-full inline-block text-sm font-semibold">
              RELEVÉ DE NOTES OFFICIEL
            </div>
          </div>

          <Separator className="my-6" />

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="text-muted-foreground">Nom :</span>{' '}
              <span className="font-semibold text-foreground">{user?.nom} {user?.prenom}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Formation :</span>{' '}
              <span className="font-semibold text-foreground">Licence Informatique</span>
            </div>
            <div>
              <span className="text-muted-foreground">Matricule :</span>{' '}
              <span className="font-semibold text-foreground">{user?.matricule || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Année :</span>{' '}
              <span className="font-semibold text-foreground">2024-2025</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Notes Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left p-3 font-semibold text-foreground rounded-l-lg">Matière</th>
                <th className="text-center p-3 font-semibold text-foreground">Coefficient</th>
                <th className="text-center p-3 font-semibold text-foreground rounded-r-lg">Note /20</th>
              </tr>
            </thead>
            <tbody>
              {mesNotes.map((n) => {
                const c = cours.find((co) => co.id === n.coursId);
                return (
                  <tr key={n.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground">{n.Cours?.nom || c?.nom || 'N/A'}</td>
                    <td className="p-3 text-center text-muted-foreground">{c?.coefficient || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${n.valeur >= 10 ? 'text-success' : 'text-destructive'}`}>
                        {n.valeur}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Separator className="my-6" />

          {/* Summary */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-hero-gradient text-primary-foreground">
            <div>
              <p className="text-sm opacity-80">Moyenne Générale</p>
              <p className="text-2xl font-display font-bold">{moyenne}/20</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Coefficients</p>
              <p className="text-2xl font-display font-bold">{totalCoefficients}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Ce document est généré automatiquement. Pour un relevé officiel tamponné, veuillez contacter le secrétariat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelevePage;
