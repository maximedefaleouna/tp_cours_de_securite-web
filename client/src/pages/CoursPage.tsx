import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCoursStore } from '@/stores/cours.store';
import { useFormationStore } from '@/stores/formation.store';
import { usePersonnelStore } from '@/stores/personnel.store';
import { BookOpen, Plus, Search, GraduationCap, Award, Pencil, Trash2 } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useToast } from '@/hooks/use-toast';

const CoursPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCours, setSelectedCours] = useState<any>(null);
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    formationId: '',
    professeurId: '',
    coefficient: 3,
    semestre: 'S1' as 'S1' | 'S2',
  });

  const isAdmin = user?.role === 'admin';
  const isRF = user?.role === 'resp_formation';

  const { cours, fetchCours, createCours, updateCours, deleteCours } = useCoursStore();
  const { formations, fetchFormations } = useFormationStore();
  const { personnel, fetchPersonnel, fetchPersonnelForSelection } = usePersonnelStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchCours();
    fetchFormations();
    // Admin uses regular endpoint, responsable uses selection endpoint
    if (isAdmin) {
      fetchPersonnel();
    } else {
      fetchPersonnelForSelection();
    }
  }, [fetchCours, fetchFormations, fetchPersonnel, fetchPersonnelForSelection, isAdmin]);

  const canCreate = isAdmin || isRF;
  const canEdit = isAdmin || isRF;
  const canDelete = isAdmin || isRF;

  // Get formation IDs that the responsable manages
  const responsableFormationIds = user?.formationsResponsable?.map(f => f.id) || [];

  // Filter courses: admin sees all, responsable sees courses from their formations
  const baseCours = isRF && responsableFormationIds.length > 0
    ? cours.filter(c => responsableFormationIds.includes(c.formationId))
    : cours;

  const filteredByFormation = selectedFormation === 'all'
    ? baseCours
    : baseCours.filter(c => c.formationId === selectedFormation);

  const filtered = filteredByFormation.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      (c.professeur?.nom && c.professeur.nom.toLowerCase().includes(search.toLowerCase())) ||
      (c.professeur?.prenom && c.professeur.prenom.toLowerCase().includes(search.toLowerCase()))
  );

  // Filter formations: admin sees all, responsable sees only their formations
  const availableFormations = isRF && responsableFormationIds.length > 0
    ? formations.filter(f => responsableFormationIds.includes(f.id))
    : formations;

  // Filter professors from personnel (all administration members can be professors)
  const availableProfesseurs = personnel.filter(p => !p.isDeleted);

  const handleEdit = (c: any) => {
    setSelectedCours(c);
    setFormData({
      nom: c.nom,
      description: c.description || '',
      formationId: c.formationId,
      professeurId: c.professeurId,
      coefficient: c.coefficient,
      semestre: c.semestre,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCours) return;
    const success = await updateCours(selectedCours.id, formData);
    if (success) {
      toast({
        title: "Succès",
        description: "Cours mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedCours(null);
      setFormData({
        nom: '',
        description: '',
        formationId: '',
        professeurId: '',
        coefficient: 3,
        semestre: 'S1',
      });
    }
  };

  const handleDeleteClick = (c: any) => {
    setSelectedCours(c);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCours) return;
    const success = await deleteCours(selectedCours.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Cours supprimé avec succès.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCours(null);
    }
  };

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
                <form className="space-y-4 mt-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await createCours({
                    ...formData,
                    formationId: isRF && user?.formationId ? user.formationId : formData.formationId,
                  });
                  if (success) {
                    setIsDialogOpen(false);
                    setFormData({
                      nom: '',
                      description: '',
                      formationId: '',
                      professeurId: '',
                      coefficient: 3,
                      semestre: 'S1',
                    });
                  }
                }}>
                  <div className="space-y-2">
                    <Label>Nom du cours</Label>
                    <Input
                      placeholder="Ex: Algorithmique Avancée"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Description du cours"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
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
                      <Select
                        value={formData.formationId}
                        onValueChange={(value) => setFormData({ ...formData, formationId: value })}
                      >
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
                    <Select
                      value={formData.professeurId}
                      onValueChange={(value) => setFormData({ ...formData, professeurId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assigner un professeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProfesseurs.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.prenom} {p.nom} {p.isAdmin ? '(Administrateur)' : '(Professeur)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coefficient</Label>
                      <Input
                        type="number"
                        placeholder="3"
                        min={1}
                        max={10}
                        value={formData.coefficient}
                        onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Semestre</Label>
                      <Select
                        value={formData.semestre}
                        onValueChange={(value) => setFormData({ ...formData, semestre: value as 'S1' | 'S2' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S1">Semestre 1</SelectItem>
                          <SelectItem value="S2">Semestre 2</SelectItem>
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
                {baseCours.reduce((acc, c) => acc + c.coefficient, 0)}
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
                <TableHead className="text-xs uppercase tracking-wider">Nom</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Formation</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Professeur</TableHead>
                <TableHead className="text-center text-xs uppercase tracking-wider">Coefficient</TableHead>
                <TableHead className="text-center text-xs uppercase tracking-wider">Semestre</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Actions</TableHead>
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
                    <TableCell className="font-semibold text-foreground">{c.nom}</TableCell>
                    <TableCell>
                      <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {c.Formation?.nom || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.professeur ? `${c.professeur.prenom} ${c.professeur.nom}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">{c.coefficient}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{c.semestre}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(c)}
                            className="h-8 w-8"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(c)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Modifier le Cours</DialogTitle>
            <DialogDescription>
              Modifiez les informations du cours {selectedCours?.nom}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label>Nom du cours</Label>
              <Input
                placeholder="Ex: Algorithmique Avancée"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Description du cours"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select
                value={formData.formationId}
                onValueChange={(value) => setFormData({ ...formData, formationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Professeur</Label>
              <Select
                value={formData.professeurId}
                onValueChange={(value) => setFormData({ ...formData, professeurId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assigner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfesseurs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.prenom} {p.nom} {p.isAdmin ? '(Administrateur)' : '(Professeur)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coefficient</Label>
                <Input
                  type="number"
                  placeholder="3"
                  min={1}
                  max={10}
                  value={formData.coefficient}
                  onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Semestre</Label>
                <Select
                  value={formData.semestre}
                  onValueChange={(value) => setFormData({ ...formData, semestre: value as 'S1' | 'S2' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">Semestre 1</SelectItem>
                    <SelectItem value="S2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              >
                Mettre à jour
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
              Êtes-vous sûr de vouloir supprimer le cours {selectedCours?.nom} ?
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

export default CoursPage;
