
export interface Plan {
  id: string;
  nom: string;
  description: string;
  tarif: number; // Tarif mensuel en FCFA
  duree: 'mensuel' | 'annuel';
  limitations: {
    utilisateursMax: number;
    fonctionnalites: string[];
  };
  status: 'actif' | 'inactif';
}

export const plansData: Plan[] = [
  {
    id: 'plan-basic-01',
    nom: 'Basic',
    description: 'Idéal pour les petites écoles et les structures en démarrage.',
    tarif: 150000,
    duree: 'mensuel',
    limitations: {
      utilisateursMax: 500,
      fonctionnalites: [
        'Gestion des élèves et enseignants',
        'Suivi des notes de base',
        'Support par email',
      ],
    },
    status: 'actif',
  },
  {
    id: 'plan-pro-02',
    nom: 'Pro',
    description: 'Pour les établissements en croissance avec des besoins avancés.',
    tarif: 200000,
    duree: 'mensuel',
    limitations: {
      utilisateursMax: 750,
      fonctionnalites: [
        'Toutes les fonctionnalités du plan Basic',
        'Gestion avancée des évaluations',
        'Rapports et statistiques',
        'Support prioritaire',
      ],
    },
    status: 'actif',
  },
  {
    id: 'plan-premium-03',
    nom: 'Premium',
    description: 'La solution complète pour les grands groupes scolaires.',
    tarif: 250000,
    duree: 'annuel',
    limitations: {
      utilisateursMax: 1500,
      fonctionnalites: [
        'Toutes les fonctionnalités du plan Pro',
        'API d\'intégration',
        'Gestion multi-établissements',
        'Support dédié 24/7',
      ],
    },
    status: 'actif',
  },
    {
    id: 'plan-legacy-04',
    nom: 'Ancien Plan',
    description: 'Ce plan n\'est plus disponible à la souscription.',
    tarif: 75000,
    duree: 'mensuel',
    limitations: {
      utilisateursMax: 200,
      fonctionnalites: ['Fonctionnalités de base'],
    },
    status: 'inactif',
  },
];
