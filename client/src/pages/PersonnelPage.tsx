import { useState, useEffect } from 'react';
import { Search, Mail, Plus, BookOpen, Shield, User, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const PersonnelPage = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    isAdmin: false,
  });

  const { personnel, isLoading, error, fetchPersonnel, createPersonnel, updatePersonnel, deletePersonnel } = usePersonnelStore();
  const { toast } = useToast();

  const canDelete = true; // Admin can delete

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filtered = personnel.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.matricule.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createPersonnel(formData);
    if (success) {
      toast({
        title: "Succès",
        description: "Personnel ajouté avec succès. Les identifiants ont été envoyés par email.",
      });
      setIsDialogOpen(false);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        isAdmin: false,
      });
    }
  };

  const handleEdit = (p: any) => {
    setSelectedPersonnel(p);
    setFormData({
      nom: p.nom,
      prenom: p.prenom,
      email: p.email,
      isAdmin: p.isAdmin,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonnel) return;
    const success = await updatePersonnel(selectedPersonnel.id, formData);
    if (success) {
      toast({
        title: "Succès",
        description: "Personnel mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedPersonnel(null);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        isAdmin: false,
      });
    }
  };

  const handleDeleteClick = (p: any) => {
    setSelectedPersonnel(p);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPersonnel) return;
    const success = await deletePersonnel(selectedPersonnel.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Personnel supprimé avec succès.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedPersonnel(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="page-header text-primary-foreground">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Personnel</h1>
            <p className="mt-1 opacity-80 text-sm">{personnel.length} membres du personnel enregistrés</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter du Personnel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Nouveau Membre du Personnel</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="KOFFI"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input
                      placeholder="Ama"
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
                    placeholder="ama.koffi@univ-kara.tg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select
                    value={formData.isAdmin ? "admin" : "professeur"}
                    onValueChange={(value) => setFormData({ ...formData, isAdmin: value === "admin" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="professeur">Professeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-hero-gradient text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Ajout en cours..." : "Ajouter le Personnel"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Modifier le Personnel</DialogTitle>
            <DialogDescription>
              Modifiez les informations de {selectedPersonnel?.prenom} {selectedPersonnel?.nom}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  placeholder="KOFFI"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  placeholder="Ama"
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
                placeholder="ama.koffi@univ-kara.tg"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={formData.isAdmin ? "admin" : "professeur"}
                onValueChange={(value) => setFormData({ ...formData, isAdmin: value === "admin" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="professeur">Professeur</SelectItem>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, email ou matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
        {filtered.map((p) => (
          <Card key={p.id} className="shadow-card card-hover-lift overflow-hidden group">
            <div className={`h-1.5 ${p.isAdmin ? 'bg-accent' : 'bg-hero-gradient'}`} />
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200 ${p.isAdmin ? 'bg-accent' : 'bg-hero-gradient'}`}>
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-foreground text-base">{p.prenom} {p.nom}</p>
                      {p.isAdmin && (
                        <Shield className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{p.email}</span>
                    </p>
                  </div>
                  <Badge className={p.isAdmin ? "bg-accent/10 text-accent border-accent/20 font-medium" : "bg-primary/10 text-primary border-primary/20 font-medium"}>
                    {p.isAdmin ? 'Administrateur' : 'Professeur'}
                  </Badge>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Matricule: {p.matricule}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(p)}
                        className="h-7 w-7"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(p)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Aucun membre du personnel trouvé</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      )}

      {/* Delete AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedPersonnel?.prenom} {selectedPersonnel?.nom} ?
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

export default PersonnelPage;
