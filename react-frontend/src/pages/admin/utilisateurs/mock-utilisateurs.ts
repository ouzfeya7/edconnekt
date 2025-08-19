
export type UserRole = 'directeur' | 'enseignant' | 'eleve' | 'parent' | 'administrateur';

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
  etablissementId: string;
  etablissementNom: string; 
  status: 'actif' | 'inactif' | 'invité';
  dateInscription: string;
}

export const utilisateursData: Utilisateur[] = [
  {
    id: 'user-001',
    nom: 'Aïssatou Sow',
    email: 'aissatou.sow@email.com',
    role: 'directeur',
    etablissementId: 'etab-001',
    etablissementNom: 'Lycée Lamine Guèye',
    status: 'actif',
    dateInscription: '2023-01-20',
  },
  {
    id: 'user-002',
    nom: 'Mamadou Diallo',
    email: 'mamadou.diallo@email.com',
    role: 'enseignant',
    etablissementId: 'etab-001',
    etablissementNom: 'Lycée Lamine Guèye',
    status: 'actif',
    dateInscription: '2023-02-10',
  },
  {
    id: 'user-003',
    nom: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@email.com',
    role: 'eleve',
    etablissementId: 'etab-002',
    etablissementNom: 'Collège Sacré-Cœur',
    status: 'inactif',
    dateInscription: '2022-09-15',
  },
  {
    id: 'user-004',
    nom: 'Ousmane Fall',
    email: 'ousmane.fall@email.com',
    role: 'parent',
    etablissementId: 'etab-002',
    etablissementNom: 'Collège Sacré-Cœur',
    status: 'actif',
    dateInscription: '2022-09-16',
  },
  {
    id: 'user-005',
    nom: 'Aminata Diop',
    email: 'aminata.diop@email.com',
    role: 'administrateur',
    etablissementId: 'system',
    etablissementNom: 'Système EdConnect',
    status: 'actif',
    dateInscription: '2021-01-01',
  },
  {
    id: 'user-006',
    nom: 'invitation.prof@nouveau.sn',
    email: 'invitation.prof@nouveau.sn',
    role: 'enseignant',
    etablissementId: 'etab-004',
    etablissementNom: 'Maison d\'Éducation Mariama Bâ',
    status: 'invité',
    dateInscription: '2024-03-10',
  },
];
