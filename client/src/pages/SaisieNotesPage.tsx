import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useEtudiantStore } from '@/stores/etudiant.store';
import { useCoursStore } from '@/stores/cours.store';
import { useNotesStore } from '@/stores/notes.store';
import { ApiError } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const SaisieNotesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCours, setSelectedCours] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState('');
  const [note, setNote] = useState('');
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { etudiants, fetchEtudiants } = useEtudiantStore();
  const { cours, fetchCours } = useCoursStore();
  const { createNote } = useNotesStore();

  useEffect(() => {
    fetchEtudiants();
    fetchCours();
  }, [fetchEtudiants, fetchCours]);

  const isRF = user?.role === 'resp_formation';
  
  // Obtenir les IDs des formations que l'utilisateur gère (en tant que responsable)
  const responsableFormationIds = user?.formationsResponsable?.map(f => f.id) || [];
  
  // Prof courses - show:
  // 1. All courses in formations they manage (as responsable)
  // 2. Specific courses they teach (as professor), even in other formations
  const mesCours = cours.filter((c) => {
    // As responsable: all courses in their formations
    if (responsableFormationIds.includes(c.formationId)) return true;
    // As professor: courses they specifically teach
    if (c.professeurId === user?.id) return true;
    return false;
  });
  
  const etudiantsFiltered = selectedCours
    ? etudiants.filter((e) => {
        const c = cours.find((co) => co.id === selectedCours);
        return c && e.formationId === c.formationId;
      })
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Fichier trop volumineux', description: 'La taille maximale est de 10 Mo.', variant: 'destructive' });
        return;
      }
      setScanFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setScanFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scanFile) {
      toast({ title: 'Copie scannée obligatoire', description: 'Vous devez joindre la copie scannée de l\'étudiant.', variant: 'destructive' });
      return;
    }

    const noteVal = parseFloat(note);
    if (isNaN(noteVal) || noteVal < 0 || noteVal > 20) {
      toast({ title: 'Note invalide', description: 'La note doit être comprise entre 0 et 20.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await createNote({
        etudiantId: selectedEtudiant,
        coursId: selectedCours,
        valeur: noteVal,
        document: scanFile,
      });

      if (success) {
        toast({ title: 'Note enregistrée', description: 'La note a été saisie avec succès. En attente de validation.' });
        setSelectedEtudiant('');
        setNote('');
        setScanFile(null);
        setSelectedCours('');
      } else {
        toast({ title: 'Erreur', description: 'Impossible d\'enregistrer la note.', variant: 'destructive' });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Une erreur est survenue lors de l\'enregistrement.';
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Saisie des Notes</h1>
        <p className="text-muted-foreground mt-1">Saisissez les notes avec la copie scannée obligatoire</p>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Preuve numérique requise</p>
          <p className="text-sm text-muted-foreground">
            Chaque note doit être accompagnée de la copie scannée (PDF ou image) de l'étudiant pour garantir la traçabilité.
          </p>
        </div>
      </div>

      <Card className="shadow-card max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <FileCheck className="w-5 h-5 text-accent" />
            Nouvelle Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Cours</Label>
              <Select value={selectedCours} onValueChange={(v) => { setSelectedCours(v); setSelectedEtudiant(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un cours" />
                </SelectTrigger>
                <SelectContent>
                  {mesCours.length === 0 ? (
                    <SelectItem value="" disabled>Aucun cours assigné</SelectItem>
                  ) : (
                    mesCours.map((c) => {
                      // Déterminer le type d'accès pour l'affichage
                      const isResponsableCourse = responsableFormationIds.includes(c.formationId);
                      const isProfCourse = c.professeurId === user?.id;
                      let accessLabel = '';
                      if (isResponsableCourse && isProfCourse) accessLabel = ' (Responsable & Professeur)';
                      else if (isResponsableCourse) accessLabel = ' (Responsable)';
                      else if (isProfCourse) accessLabel = ' (Professeur)';
                      
                      return (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nom} ({c.semestre}) - {c.Formation?.nom || 'Formation'}{accessLabel}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedCours && (
              <div className="space-y-2">
                <Label>Étudiant</Label>
                <Select value={selectedEtudiant} onValueChange={setSelectedEtudiant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    {etudiantsFiltered.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.numeroCarteEtudiant} — {e.nom} {e.prenom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Note (/20)</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="20"
                placeholder="Ex: 14.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="max-w-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Copie Scannée <span className="text-destructive">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {scanFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck className="w-8 h-8 text-success" />
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">{scanFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(scanFile.size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez ou <span className="text-accent font-semibold">cliquez</span> pour uploader
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG — Max. 10 Mo</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-hero-gradient text-primary-foreground"
              disabled={!selectedCours || !selectedEtudiant || !note || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileCheck className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer la Note'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaisieNotesPage;
