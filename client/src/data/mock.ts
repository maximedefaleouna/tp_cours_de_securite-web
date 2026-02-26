import type { Formation, Cours, Note, Etudiant, Professeur, StatsData, User } from '@/types';

export const currentUser: User = {
  id: 'admin-1',
  email: 'admin@univ-kara.tg',
  nom: 'KOFFI',
  prenom: 'Ama',
  role: 'admin',
};

export const formations: Formation[] = [
  {
    id: 'f1',
    nom: 'Licence Informatique',
    departement: 'Sciences et Technologies',
    description: 'Formation en informatique fondamentale et appliquée',
    responsableId: 'rf-1',
    responsableNom: 'Dr. AGBEKO Kodjo',
    nbEtudiants: 145,
    nbProfesseurs: 12,
  },
  {
    id: 'f2',
    nom: 'Licence Gestion',
    departement: 'Sciences Économiques',
    description: 'Formation en gestion des entreprises et management',
    responsableId: 'rf-2',
    responsableNom: 'Dr. MENSAH Afi',
    nbEtudiants: 198,
    nbProfesseurs: 15,
  },
  {
    id: 'f3',
    nom: 'Licence Droit',
    departement: 'Droit et Sciences Politiques',
    description: 'Formation en droit privé et droit public',
    responsableId: 'rf-3',
    responsableNom: 'Pr. AMEGAVI Komi',
    nbEtudiants: 220,
    nbProfesseurs: 18,
  },
  {
    id: 'f4',
    nom: 'Licence Mathématiques',
    departement: 'Sciences et Technologies',
    description: 'Formation en mathématiques pures et appliquées',
    responsableNom: 'Dr. DJATO Essivi',
    nbEtudiants: 85,
    nbProfesseurs: 8,
  },
];

export const cours: Cours[] = [
  // Semestre 1
  { id: 'c1', nom: 'Algorithmique Avancée', code: 'INFO301', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 4, semestre: 1 },
  { id: 'c2', nom: 'Base de Données', code: 'INFO302', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p2', professeurNom: 'Dr. BOKO Essi', credits: 3, semestre: 1 },
  { id: 'c3', nom: 'Réseaux Informatiques', code: 'INFO303', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 3, semestre: 1 },
  // Semestre 2
  { id: 'c8', nom: 'Programmation Web', code: 'INFO304', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p2', professeurNom: 'Dr. BOKO Essi', credits: 4, semestre: 2 },
  { id: 'c9', nom: 'Systèmes d\'Exploitation', code: 'INFO305', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 3, semestre: 2 },
  { id: 'c10', nom: 'Probabilités & Statistiques', code: 'INFO306', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p6', professeurNom: 'Dr. EKLU Mawuli', credits: 3, semestre: 2 },
  // Semestre 3
  { id: 'c11', nom: 'Génie Logiciel', code: 'INFO401', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 4, semestre: 3 },
  { id: 'c12', nom: 'Intelligence Artificielle', code: 'INFO402', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p2', professeurNom: 'Dr. BOKO Essi', credits: 3, semestre: 3 },
  { id: 'c13', nom: 'Sécurité Informatique', code: 'INFO403', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 3, semestre: 3 },
  // Semestre 4
  { id: 'c14', nom: 'Projet de Fin d\'Études', code: 'INFO501', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p1', professeurNom: 'Dr. ADOM Kofi', credits: 6, semestre: 4 },
  { id: 'c15', nom: 'Stage Professionnel', code: 'INFO502', formationId: 'f1', formationNom: 'Licence Informatique', professeurId: 'p2', professeurNom: 'Dr. BOKO Essi', credits: 4, semestre: 4 },
  // Autres formations
  { id: 'c4', nom: 'Comptabilité Générale', code: 'GEST201', formationId: 'f2', formationNom: 'Licence Gestion', professeurId: 'p3', professeurNom: 'Pr. FOLLY Akuvi', credits: 4, semestre: 1 },
  { id: 'c5', nom: 'Marketing Digital', code: 'GEST202', formationId: 'f2', formationNom: 'Licence Gestion', professeurId: 'p4', professeurNom: 'Dr. GNASSINGBE Yao', credits: 3, semestre: 2 },
  { id: 'c6', nom: 'Droit Civil', code: 'DROIT101', formationId: 'f3', formationNom: 'Licence Droit', professeurId: 'p5', professeurNom: 'Pr. ABALO Kafui', credits: 5, semestre: 1 },
  { id: 'c7', nom: 'Analyse Mathématique', code: 'MATH201', formationId: 'f4', formationNom: 'Licence Mathématiques', professeurId: 'p6', professeurNom: 'Dr. EKLU Mawuli', credits: 4, semestre: 1 },
];

export const etudiants: Etudiant[] = [
  { id: 'e1', nom: 'TOSSOU', prenom: 'Kossi', email: 'kossi.tossou@univ-kara.tg', matricule: 'UK2024-001', formationId: 'f1', formationNom: 'Licence Informatique', dateInscription: '2024-09-15' },
  { id: 'e2', nom: 'ADAMA', prenom: 'Fatou', email: 'fatou.adama@univ-kara.tg', matricule: 'UK2024-002', formationId: 'f1', formationNom: 'Licence Informatique', dateInscription: '2024-09-15' },
  { id: 'e3', nom: 'OLYMPIO', prenom: 'Edem', email: 'edem.olympio@univ-kara.tg', matricule: 'UK2024-003', formationId: 'f2', formationNom: 'Licence Gestion', dateInscription: '2024-09-16' },
  { id: 'e4', nom: 'LAWSON', prenom: 'Akouavi', email: 'akouavi.lawson@univ-kara.tg', matricule: 'UK2024-004', formationId: 'f2', formationNom: 'Licence Gestion', dateInscription: '2024-09-16' },
  { id: 'e5', nom: 'SOKPOH', prenom: 'Yaovi', email: 'yaovi.sokpoh@univ-kara.tg', matricule: 'UK2024-005', formationId: 'f3', formationNom: 'Licence Droit', dateInscription: '2024-09-17' },
  { id: 'e6', nom: 'ATCHOU', prenom: 'Ama', email: 'ama.atchou@univ-kara.tg', matricule: 'UK2024-006', formationId: 'f1', formationNom: 'Licence Informatique', dateInscription: '2024-09-15' },
  { id: 'e7', nom: 'AGBODJAN', prenom: 'Koffi', email: 'koffi.agbodjan@univ-kara.tg', matricule: 'UK2024-007', formationId: 'f4', formationNom: 'Licence Mathématiques', dateInscription: '2024-09-18' },
  { id: 'e8', nom: 'KUEVI', prenom: 'Afi', email: 'afi.kuevi@univ-kara.tg', matricule: 'UK2024-008', formationId: 'f3', formationNom: 'Licence Droit', dateInscription: '2024-09-17' },
];

export const professeurs: Professeur[] = [
  { id: 'p1', nom: 'ADOM', prenom: 'Kofi', email: 'kofi.adom@univ-kara.tg', specialite: 'Informatique', formations: ['f1', 'f4'], formationNoms: ['Licence Informatique', 'Licence Mathématiques'] },
  { id: 'p2', nom: 'BOKO', prenom: 'Essi', email: 'essi.boko@univ-kara.tg', specialite: 'Base de données', formations: ['f1'], formationNoms: ['Licence Informatique'] },
  { id: 'p3', nom: 'FOLLY', prenom: 'Akuvi', email: 'akuvi.folly@univ-kara.tg', specialite: 'Comptabilité', formations: ['f2'], formationNoms: ['Licence Gestion'] },
  { id: 'p4', nom: 'GNASSINGBE', prenom: 'Yao', email: 'yao.gnassingbe@univ-kara.tg', specialite: 'Marketing', formations: ['f2'], formationNoms: ['Licence Gestion'] },
  { id: 'p5', nom: 'ABALO', prenom: 'Kafui', email: 'abalo.kafui@univ-kara.tg', specialite: 'Droit Civil', formations: ['f3'], formationNoms: ['Licence Droit'] },
  { id: 'p6', nom: 'EKLU', prenom: 'Mawuli', email: 'mawuli.eklu@univ-kara.tg', specialite: 'Mathématiques', formations: ['f4'], formationNoms: ['Licence Mathématiques'] },
];

export const notes: Note[] = [
  // Etudiant e1 - S1
  { id: 'n1', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c1', coursNom: 'Algorithmique Avancée', note: 15.5, scanUrl: '#', scanFilename: 'copie_tossou_algo.pdf', validee: true, dateCreation: '2025-01-20' },
  { id: 'n2', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c2', coursNom: 'Base de Données', note: 13, scanUrl: '#', scanFilename: 'copie_tossou_bdd.pdf', validee: true, dateCreation: '2025-01-22' },
  { id: 'n9', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c3', coursNom: 'Réseaux Informatiques', note: 11.5, scanUrl: '#', scanFilename: 'copie_tossou_reseau.pdf', validee: true, dateCreation: '2025-01-23' },
  // Etudiant e1 - S2
  { id: 'n10', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c8', coursNom: 'Programmation Web', note: 16, scanUrl: '#', scanFilename: 'copie_tossou_web.pdf', validee: true, dateCreation: '2025-06-10' },
  { id: 'n11', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c9', coursNom: 'Systèmes d\'Exploitation', note: 12, scanUrl: '#', scanFilename: 'copie_tossou_se.pdf', validee: true, dateCreation: '2025-06-12' },
  { id: 'n12', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c10', coursNom: 'Probabilités & Statistiques', note: 9, scanUrl: '#', scanFilename: 'copie_tossou_stats.pdf', validee: true, dateCreation: '2025-06-14' },
  // Etudiant e1 - S3
  { id: 'n13', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c11', coursNom: 'Génie Logiciel', note: 14, scanUrl: '#', scanFilename: 'copie_tossou_gl.pdf', validee: true, dateCreation: '2026-01-15' },
  { id: 'n14', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c12', coursNom: 'Intelligence Artificielle', note: 17, scanUrl: '#', scanFilename: 'copie_tossou_ia.pdf', validee: false, dateCreation: '2026-01-18' },
  { id: 'n15', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c13', coursNom: 'Sécurité Informatique', note: 8, scanUrl: '#', scanFilename: 'copie_tossou_secu.pdf', validee: true, dateCreation: '2026-01-20' },
  // Etudiant e1 - S4
  { id: 'n16', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c14', coursNom: 'Projet de Fin d\'Études', note: 15, scanUrl: '#', scanFilename: 'copie_tossou_pfe.pdf', validee: false, dateCreation: '2026-06-10' },
  { id: 'n17', etudiantId: 'e1', etudiantNom: 'TOSSOU Kossi', coursId: 'c15', coursNom: 'Stage Professionnel', note: 14.5, scanUrl: '#', scanFilename: 'copie_tossou_stage.pdf', validee: false, dateCreation: '2026-06-15' },
  // Autres étudiants
  { id: 'n3', etudiantId: 'e2', etudiantNom: 'ADAMA Fatou', coursId: 'c1', coursNom: 'Algorithmique Avancée', note: 16, scanUrl: '#', scanFilename: 'copie_adama_algo.pdf', validee: false, dateCreation: '2025-01-20' },
  { id: 'n4', etudiantId: 'e2', etudiantNom: 'ADAMA Fatou', coursId: 'c2', coursNom: 'Base de Données', note: 14.5, scanUrl: '#', scanFilename: 'copie_adama_bdd.pdf', validee: true, dateCreation: '2025-01-22' },
  { id: 'n5', etudiantId: 'e3', etudiantNom: 'OLYMPIO Edem', coursId: 'c4', coursNom: 'Comptabilité Générale', note: 11, scanUrl: '#', scanFilename: 'copie_olympio_compta.pdf', validee: true, dateCreation: '2025-01-25' },
  { id: 'n6', etudiantId: 'e4', etudiantNom: 'LAWSON Akouavi', coursId: 'c4', coursNom: 'Comptabilité Générale', note: 8.5, scanUrl: '#', scanFilename: 'copie_lawson_compta.pdf', validee: false, dateCreation: '2025-01-25' },
  { id: 'n7', etudiantId: 'e5', etudiantNom: 'SOKPOH Yaovi', coursId: 'c6', coursNom: 'Droit Civil', note: 14, scanUrl: '#', scanFilename: 'copie_sokpoh_droit.pdf', validee: true, dateCreation: '2025-01-28' },
  { id: 'n8', etudiantId: 'e6', etudiantNom: 'ATCHOU Ama', coursId: 'c1', coursNom: 'Algorithmique Avancée', note: 9.5, scanUrl: '#', scanFilename: 'copie_atchou_algo.pdf', validee: true, dateCreation: '2025-01-20' },
];

export const stats: StatsData = {
  totalEtudiants: 648,
  totalProfesseurs: 53,
  totalFormations: 4,
  totalCours: 7,
  tauxReussite: 72.5,
  moyenneGenerale: 12.8,
};
