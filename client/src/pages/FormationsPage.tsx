import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Plus, Users, UserCog, Search, ArrowRight, Loader2, Pencil, Trash2 } from 'lucide-react';
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormationStore } from '@/stores/formation.store';
import { usePersonnelStore } from '@/stores/personnel.store';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FormationsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    responsableId: '',
  });

  const { formations, isLoading, error, fetchFormations, createFormation, updateFormation, deleteFormation } = useFormationStore();
  const { personnel, fetchPersonnel } = usePersonnelStore();
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';

  // Filter available personnel for responsable selection
  const availablePersonnel = personnel.filter(p => !p.isDeleted);

  useEffect(() => {
    fetchFormations();
    fetchPersonnel();
  }, [fetchFormations, fetchPersonnel]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filtered = formations.filter(
    (f) =>
      f.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createFormation({
      ...formData,
      responsableId: formData.responsableId || '',
    });
    if (success) {
      toast({
        title: "Succès",
        description: "Formation créée avec succès",
      });
      setIsDialogOpen(false);
      setFormData({ nom: '', description: '', responsableId: '' });
    }
  };

  const handleEdit = (f: any) => {
    setSelectedFormation(f);
    setFormData({
      nom: f.nom,
      description: f.description,
      responsableId: f.formationResponsables?.[0]?.responsableId || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormation) return;
    const success = await updateFormation(selectedFormation.id, formData);
    if (success) {
      toast({
        title: "Succès",
        description: "Formation mise à jour avec succès",
      });
      setIsEditDialogOpen(false);
      setSelectedFormation(null);
      setFormData({ nom: '', description: '', responsableId: '' });
    }
  };

  const handleDeleteClick = (f: any) => {
    setSelectedFormation(f);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFormation) return;
    const success = await deleteFormation(selectedFormation.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Formation supprimée avec succès",
      });
      setIsDeleteDialogOpen(false);
      setSelectedFormation(null);
    }
  };

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
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label>Nom de la formation</Label>
                    <Input
                      placeholder="Ex: Master Informatique"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Description de la formation"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Responsable</Label>
                    <Select
                      value={formData.responsableId}
                      onValueChange={(value) => setFormData({ ...formData, responsableId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePersonnel.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.prenom} {p.nom} {p.isAdmin ? '(Administrateur)' : '(Professeur)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-hero-gradient text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer la Formation"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {formations.length > 1 && (
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
          <Card key={f.id} className="shadow-card card-hover-lift overflow-hidden group">
            <div className="h-1.5 bg-gold-gradient" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-display">{f.nom}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Formation</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(f)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(f)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge variant="secondary" className="gap-1.5">
                  <BookOpen className="w-3 h-3" />
                  Voir les détails
                </Badge>
                {f.formationResponsables && f.formationResponsables[0]?.Responsable && (
                  <span className="text-xs text-muted-foreground">
                    Resp: {f.formationResponsables[0].Responsable.prenom} {f.formationResponsables[0].Responsable.nom}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Modifier la Formation</DialogTitle>
            <DialogDescription>
              Modifiez les informations de {selectedFormation?.nom}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label>Nom de la formation</Label>
              <Input
                placeholder="Ex: Master Informatique"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Description de la formation"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Responsable</Label>
              <Select
                value={formData.responsableId}
                onValueChange={(value) => setFormData({ ...formData, responsableId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {availablePersonnel.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.prenom} {p.nom} {p.isAdmin ? '(Administrateur)' : '(Professeur)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-hero-gradient text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la formation {selectedFormation?.nom} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FormationsPage;
