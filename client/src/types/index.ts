export type AppRole = 'admin' | 'resp_formation' | 'professeur' | 'etudiant';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: AppRole;
  formationId?: string;
  matricule?: string;
  avatar?: string;
  isAdmin?: boolean;
  // Extended properties loaded from profile
  formationsResponsable?: Formation[];
  cours?: Cours[];
}

// Formation from API
export interface Formation {
  id: string;
  nom: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // Relations
  cours?: Cours[];
  formationResponsables?: FormationResponsable[];
  etudiants?: Etudiant[];
}

export interface FormationResponsable {
  id: string;
  formationId: string;
  responsableId: string;
  createdAt?: string;
  updatedAt?: string;
  Responsable?: Personnel;
}

// Cours from API
export interface Cours {
  id: string;
  nom: string;
  description: string;
  formationId: string;
  professeurId: string;
  coefficient: number;
  semestre: 'S1' | 'S2';
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // Relations
  Formation?: Formation;
  professeur?: Personnel;
  notes?: Note[];
}

// Note from API
export interface Note {
  id: string;
  etudiantId: string;
  coursId: string;
  valeur: number;
  documentUrl?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  Etudiant?: Etudiant;
  Cours?: Cours;
  createdBy?: Personnel;
  updatedBy?: Personnel;
}

// Etudiant from API
export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numeroCarteEtudiant: string;
  formationId: string;
  dateNaissance?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // Relations
  Formation?: Formation;
  notes?: Note[];
}

// Personnel/Administration from API
export interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // Relations
  cours?: Cours[];
  formationResponsables?: FormationResponsable[];
}

export interface StatsData {
  totalEtudiants: number;
  totalProfesseurs: number;
  totalFormations: number;
  totalCours: number;
  tauxReussite: number;
  moyenneGenerale: number;
}
