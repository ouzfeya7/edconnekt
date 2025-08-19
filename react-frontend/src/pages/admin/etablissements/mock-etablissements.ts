
export interface Etablissement {
  id: string;
  name: string;
  address: string;
  contact: string;
  logoUrl?: string;
  plan: 'Basic' | 'Premium' | 'Enterprise';
  status: 'actif' | 'inactif';
  dateCreation: string;
}

export const etablissementsData: Etablissement[] = [
  {
    id: 'etab-001',
    name: 'Lycée Lamine Guèye',
    address: 'Avenue El Hadj Malick Sy, Dakar',
    contact: 'contact@lyceelaminegueye.sn',
    plan: 'Premium',
    status: 'actif',
    dateCreation: '2023-01-15',
  },
  {
    id: 'etab-002',
    name: 'Collège Sacré-Cœur',
    address: '3 Rue Moussé Diop, Dakar',
    contact: 'info@sacrecoeur.sn',
    plan: 'Basic',
    status: 'actif',
    dateCreation: '2022-09-01',
  },
  {
    id: 'etab-003',
    name: 'École Primaire HLM Grand Yoff',
    address: 'HLM Grand Yoff, Dakar',
    contact: 'ecole.hlm@education.sn',
    plan: 'Enterprise',
    status: 'inactif',
    dateCreation: '2023-05-20',
  },
  {
    id: 'etab-004',
    name: 'Maison d\'Éducation Mariama Bâ',
    address: 'Île de Gorée, Dakar',
    contact: 'admin@mariamaba.sn',
    plan: 'Premium',
    status: 'actif',
    dateCreation: '2021-11-10',
  },
    {
    id: 'etab-005',
    name: 'Groupe Scolaire Les Pédagogues',
    address: 'Quartier 10ème, Thiès',
    contact: 'info@lespedagogues.com',
    plan: 'Basic',
    status: 'actif',
    dateCreation: '2024-02-01',
  },
];
