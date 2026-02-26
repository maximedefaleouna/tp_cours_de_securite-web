import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Search, Mail, Calendar, Plus, GraduationCap, Loader2, Pencil, Trash2 } from 'lucide-react';
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEtudiantStore } from '@/stores/etudiant.store';
import { useFormationStore } from '@/stores/formation.store';
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

const EtudiantsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState<any>(null);
  const [filterFormation, setFilterFormation] = useState<string>('all');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    formationId: '',
    dateNaissance: '',
  });

  const { etudiants, isLoading, error, fetchEtudiants, createEtudiant, updateEtudiant, deleteEtudiant } = useEtudiantStore();
  const { formations, fetchFormations } = useFormationStore();
  const { toast } = useToast();

  const canCreate = user?.role === 'admin' || user?.role === 'resp_formation';
  const canEdit = user?.role === 'admin';
  const canDelete = user?.role === 'admin';

  useEffect(() => {
    fetchEtudiants();
    fetchFormations();
  }, [fetchEtudiants, fetchFormations]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filtered = etudiants.filter(
    (e) => {
      const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
        e.prenom.toLowerCase().includes(search.toLowerCase()) ||
        (e.numeroCarteEtudiant && e.numeroCarteEtudiant.toLowerCase().includes(search.toLowerCase())) ||
        (e.Formation?.nom && e.Formation.nom.toLowerCase().includes(search.toLowerCase()));
      const matchFormation = filterFormation === 'all' || e.formationId === filterFormation;
      return matchSearch && matchFormation;
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createEtudiant({
      ...formData,
      dateNaissance: new Date(formData.dateNaissance).toISOString(),
    });
    if (success) {
      toast({
        title: "Succès",
        description: "Étudiant créé avec succès. Les identifiants ont été envoyés par email.",
      });
      setIsDialogOpen(false);
      setFormData({ nom: '', prenom: '', email: '', formationId: '', dateNaissance: '' });
    }
  };

  const handleEdit = (etudiant: any) => {
    setSelectedEtudiant(etudiant);
    setFormData({
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      formationId: etudiant.formationId,
      dateNaissance: etudiant.dateNaissance ? new Date(etudiant.dateNaissance).toISOString().split('T')[0] : '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEtudiant) return;
    const success = await updateEtudiant(selectedEtudiant.id, {
      ...formData,
      dateNaissance: new Date(formData.dateNaissance).toISOString(),
    });
    if (success) {
      toast({
        title: "Succès",
        description: "Étudiant mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedEtudiant(null);
      setFormData({ nom: '', prenom: '', email: '', formationId: '', dateNaissance: '' });
    }
  };

  const handleDeleteClick = (etudiant: any) => {
    setSelectedEtudiant(etudiant);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEtudiant) return;
    const success = await deleteEtudiant(selectedEtudiant.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Étudiant supprimé avec succès.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedEtudiant(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Étudiants</h1>
            <p className="mt-1 opacity-80 text-sm">{etudiants.length} étudiants inscrits</p>
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
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        placeholder="Ex: TOSSOU"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input
                        placeholder="Ex: Kossi"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Ex: kossi.tossou@univ-kara.tg"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <Input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Formation</Label>
                    <Select
                      value={formData.formationId}
                      onValueChange={(value) => setFormData({ ...formData, formationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une formation" />
                      </SelectTrigger>
                      <SelectContent>
                        {formations.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-hero-gradient text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Inscription..." : "Inscrire l'Étudiant"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Modifier un Étudiant</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'étudiant {selectedEtudiant?.prenom} {selectedEtudiant?.nom}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  placeholder="Ex: TOSSOU"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  placeholder="Ex: Kossi"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Ex: kossi.tossou@univ-kara.tg"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select
                value={formData.formationId}
                onValueChange={(value) => setFormData({ ...formData, formationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
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
              Êtes-vous sûr de vouloir supprimer l'étudiant {selectedEtudiant?.prenom} {selectedEtudiant?.nom} ?
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
                <TableHead className="text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {e.numeroCarteEtudiant || 'N/A'}
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
                      {e.Formation?.nom || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(e.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(e)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(e)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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
