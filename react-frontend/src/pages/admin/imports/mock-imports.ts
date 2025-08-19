
export interface ImportHistory {
  id: string;
  date: string;
  type: 'utilisateurs' | 'notes' | 'emplois_du_temps';
  etablissementNom: string;
  fichierSource: string;
  enregistrementsImportes: number;
  erreurs: number;
  statut: 'succès' | 'échec' | 'en_cours';
  rapportUrl?: string; // Lien vers un rapport d'erreurs détaillé
}

export const importsData: ImportHistory[] = [
  {
    id: 'import-001',
    date: '2024-03-10T14:30:00Z',
    type: 'utilisateurs',
    etablissementNom: 'Lycée Lamine Guèye',
    fichierSource: 'liste_eleves_2024.csv',
    enregistrementsImportes: 250,
    erreurs: 0,
    statut: 'succès',
  },
  {
    id: 'import-002',
    date: '2024-03-08T10:00:00Z',
    type: 'notes',
    etablissementNom: 'Collège Sacré-Cœur',
    fichierSource: 'notes_trimestre2.xlsx',
    enregistrementsImportes: 120,
    erreurs: 5,
    statut: 'échec',
    rapportUrl: '/path/to/error-report-002.log',
  },
  {
    id: 'import-003',
    date: '2024-03-11T11:00:00Z',
    type: 'emplois_du_temps',
    etablissementNom: 'Maison d\'Éducation Mariama Bâ',
    fichierSource: 'edt_2024_v2.csv',
    enregistrementsImportes: 85,
    erreurs: 0,
    statut: 'en_cours',
  },
    {
    id: 'import-004',
    date: '2024-02-20T16:00:00Z',
    type: 'utilisateurs',
    etablissementNom: 'Groupe Scolaire Les Pédagogues',
    fichierSource: 'enseignants_staff.csv',
    enregistrementsImportes: 35,
    erreurs: 2,
    statut: 'échec',
    rapportUrl: '/path/to/error-report-004.log',
  },
];
