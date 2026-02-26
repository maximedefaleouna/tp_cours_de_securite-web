export type AppRole = 'admin' | 'resp_formation' | 'professeur' | 'etudiant';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: AppRole;
  formationId?: string;
  avatar?: string;
}

export interface Formation {
  id: string;
  nom: string;
  departement: string;
  description: string;
  responsableId?: string;
  responsableNom?: string;
  nbEtudiants: number;
  nbProfesseurs: number;
}

export interface Cours {
  id: string;
  nom: string;
  code: string;
  formationId: string;
  formationNom: string;
  professeurId: string;
  professeurNom: string;
  credits: number;
  semestre: number;
}

export interface Note {
  id: string;
  etudiantId: string;
  etudiantNom: string;
  coursId: string;
  coursNom: string;
  note: number;
  scanUrl?: string;
  scanFilename?: string;
  validee: boolean;
  dateCreation: string;
  dateModification?: string;
}

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  formationId: string;
  formationNom: string;
  dateInscription: string;
}

export interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  formations: string[];
  formationNoms: string[];
}

export interface StatsData {
  totalEtudiants: number;
  totalProfesseurs: number;
  totalFormations: number;
  totalCours: number;
  tauxReussite: number;
  moyenneGenerale: number;
}
