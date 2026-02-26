import { useAuth } from '@/contexts/AuthContext';
import { useFormationStore } from '@/stores/formation.store';
import { useNotesStore } from '@/stores/notes.store';
import { useEtudiantStore } from '@/stores/etudiant.store';
import { useEffect } from 'react';
import {
  Users,
  UserCog,
  BookOpen,
  TrendingUp,
  Award,
  BarChart3,
  FileCheck,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const StatCard = ({ icon, label, value, sub, accent, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  trend?: string;
}) => (
  <Card className="shadow-card card-hover-lift overflow-hidden relative">
    {accent && <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />}
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
          <p className={`text-3xl font-display font-bold ${accent ? 'text-gradient-gold' : 'text-foreground'}`}>
            {value}
          </p>
          {sub && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trend && <ArrowUpRight className="w-3 h-3 text-success" />}
              {sub}
            </p>
          )}
        </div>
        <div className={`stat-icon ${accent ? 'bg-gold-gradient text-accent-foreground shadow-md' : 'bg-secondary text-foreground'}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { formations, fetchFormations } = useFormationStore();
  const { notes, fetchNotes } = useNotesStore();
  const { etudiants, fetchEtudiants } = useEtudiantStore();

  useEffect(() => {
    fetchFormations();
    fetchNotes();
    fetchEtudiants();
  }, [fetchFormations, fetchNotes, fetchEtudiants]);

  const stats = {
    totalEtudiants: etudiants.length,
    totalProfesseurs: 0,
    totalFormations: formations.length,
    totalCours: 0,
    tauxReussite: 0,
    moyenneGenerale: 0,
  };

  return (
  <div className="space-y-8 animate-fade-in">
    <div className="page-header text-primary-foreground">
      <div className="relative z-10">
        <p className="text-sm opacity-70 mb-1">Bienvenue 👋</p>
        <h1 className="text-3xl font-display font-bold">Tableau de Bord</h1>
        <p className="mt-1 opacity-80 text-sm">Vue d'ensemble de l'Université de Kara</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      <StatCard icon={<Users className="w-5 h-5" />} label="Étudiants" value={stats.totalEtudiants} sub="+12% cette année" trend="up" />
      <StatCard icon={<UserCog className="w-5 h-5" />} label="Professeurs" value={stats.totalProfesseurs} sub="4 formations" />
      <StatCard icon={<BookOpen className="w-5 h-5" />} label="Formations" value={stats.totalFormations} />
      <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Taux de Réussite" value={`${stats.tauxReussite}%`} accent />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card card-hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-accent" />
            </div>
            Formations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formations.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full bg-gold-gradient" />
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{f.nom}</p>
                  <p className="text-xs text-muted-foreground">{f.description?.substring(0, 50)}...</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{f.etudiants?.length || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">étudiants</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card card-hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-accent" />
            </div>
            Notes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.slice(0, 5).map((n) => (
            <div key={n.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                  n.valeur >= 10 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {n.valeur}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {n.Etudiant ? `${n.Etudiant.prenom} ${n.Etudiant.nom}` : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">{n.Cours?.nom || 'N/A'}</p>
                </div>
              </div>
              <Badge className="bg-success text-success-foreground">
                ✓ Saisie
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);
};

const RespFormationDashboard = () => {
  const { user } = useAuth();
  const { formations, fetchFormations } = useFormationStore();
  const { notes, fetchNotes } = useNotesStore();
  const { etudiants, fetchEtudiants } = useEtudiantStore();

  useEffect(() => {
    fetchFormations();
    fetchNotes();
    fetchEtudiants();
  }, [fetchFormations, fetchNotes, fetchEtudiants]);

  const formation = formations.find(f => f.id === user?.formationId) || formations[0];
  const formationEtudiants = etudiants.filter(e => e.formationId === formation?.id);
  const formationEtudiantIds = formationEtudiants.map(e => e.id);
  const formationNotes = notes.filter(n => formationEtudiantIds.includes(n.etudiantId));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header text-primary-foreground">
        <div className="relative z-10">
          <p className="text-sm opacity-70 mb-1">Ma Formation</p>
          <h1 className="text-3xl font-display font-bold">{formation?.nom || 'Ma Formation'}</h1>
          <p className="mt-1 opacity-80 text-sm">{formation?.description?.substring(0, 60)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard icon={<Users className="w-5 h-5" />} label="Étudiants" value={formationEtudiants.length} />
        <StatCard icon={<UserCog className="w-5 h-5" />} label="Professeurs" value={0} />
        <StatCard icon={<FileCheck className="w-5 h-5" />} label="Notes" value={formationNotes.length} accent />
        <StatCard icon={<Award className="w-5 h-5" />} label="Taux de Réussite" value="74%" />
      </div>

      <Card className="shadow-card card-hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-accent" />
            </div>
            Notes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formationNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Aucune note pour le moment</p>
            </div>
          ) : (
            formationNotes.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    n.valeur >= 10 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {n.valeur}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {n.Etudiant ? `${n.Etudiant.prenom} ${n.Etudiant.nom}` : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">{n.Cours?.nom || 'N/A'}</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">Saisie</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfesseurDashboard = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="page-header text-primary-foreground">
      <div className="relative z-10">
        <p className="text-sm opacity-70 mb-1">Bienvenue 👋</p>
        <h1 className="text-3xl font-display font-bold">Mon Espace Professeur</h1>
        <p className="mt-1 opacity-80 text-sm">Gérez vos cours et notes</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
      <StatCard icon={<BookOpen className="w-5 h-5" />} label="Mes Cours" value={3} />
      <StatCard icon={<FileCheck className="w-5 h-5" />} label="Notes Saisies" value={12} />
      <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Moyenne Classe" value="13.2" accent />
    </div>

    <Card className="shadow-card card-hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          Mes Cours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { nom: 'Algorithmique Avancée', code: 'INFO301', formation: 'Licence Informatique', etudiants: 45 },
          { nom: 'Base de Données', code: 'INFO302', formation: 'Licence Informatique', etudiants: 45 },
          { nom: 'Réseaux Informatiques', code: 'INFO303', formation: 'Licence Informatique', etudiants: 42 },
        ].map((c) => (
          <div key={c.code} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{c.nom}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-mono text-[10px] px-1 py-0 mr-1">{c.code}</Badge>
                  {c.formation}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {c.etudiants}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const EtudiantDashboard = () => {
  const { user } = useAuth();
  const { notes, fetchNotes } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const mesNotes = notes.filter(n => n.etudiantId === user?.id);
  const moyenne = mesNotes.length > 0
    ? (mesNotes.reduce((acc, n) => acc + n.valeur, 0) / mesNotes.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header text-primary-foreground">
        <div className="relative z-10">
          <p className="text-sm opacity-70 mb-1">Bienvenue 👋</p>
          <h1 className="text-3xl font-display font-bold">Mon Espace Étudiant</h1>
          <p className="mt-1 opacity-80 text-sm">Licence Informatique — Semestre 1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <StatCard icon={<FileCheck className="w-5 h-5" />} label="Notes Disponibles" value={mesNotes.length} />
        <StatCard icon={<Award className="w-5 h-5" />} label="Moyenne Générale" value={moyenne} accent />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Coefficients" value="—" />
      </div>

      <Card className="shadow-card card-hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-accent" />
            </div>
            Mes Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mesNotes.map((n) => (
            <div key={n.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  n.valeur >= 10 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {n.valeur}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{n.Cours?.nom || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
              </div>
              <Badge className="bg-success text-success-foreground gap-1">
                <FileCheck className="w-3 h-3" />
                Saisie
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'resp_formation':
      return <RespFormationDashboard />;
    case 'professeur':
      return <ProfesseurDashboard />;
    case 'etudiant':
      return <EtudiantDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
