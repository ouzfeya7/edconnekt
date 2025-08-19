
export interface ReferentielItem {
  id: string;
  code: string;
  libelle: string;
  description?: string;
  // Ajout des liens de parenté
  domaineId?: string;
  matiereId?: string;
}

export interface Referentiel {
  id: string;
  nom: string;
  items: ReferentielItem[];
}

export const referentielsData: Referentiel[] = [
  {
    id: 'domaines_competences',
    nom: 'Domaines de Compétences',
    items: [
      { id: 'dom-01', code: 'LANG_COM', libelle: 'Langue et Communication' },
      { id: 'dom-02', code: 'SCI_SOC', libelle: 'Sciences Sociales' },
      { id: 'dom-03', code: 'SCI_MATH', libelle: 'Sciences et Mathématiques' },
    ],
  },
  {
    id: 'matieres',
    nom: 'Matières',
    items: [
      { id: 'mat-01', code: 'FR', libelle: 'Français', domaineId: 'dom-01' },
      { id: 'mat-02', code: 'MATH', libelle: 'Mathématiques', domaineId: 'dom-03' },
      { id: 'mat-03', code: 'HG', libelle: 'Histoire-Géographie', domaineId: 'dom-02' },
      { id: 'mat-04', code: 'SVT', libelle: 'Sciences de la Vie et de la Terre', domaineId: 'dom-03' },
      { id: 'mat-05', code: 'PC', libelle: 'Physique-Chimie', domaineId: 'dom-03' },
      { id: 'mat-06', code: 'EN', libelle: 'Anglais', domaineId: 'dom-01' },
      { id: 'mat-07', code: 'EPS', libelle: 'Éducation Physique et Sportive', domaineId: 'dom-02' },
    ],
  },
    {
    id: 'competences',
    nom: 'Compétences',
    items: [
      { id: 'comp-01', code: 'LECT', libelle: 'Lecture Compréhension', matiereId: 'mat-01' },
      { id: 'comp-02', code: 'CALC', libelle: 'Calcul et Résolution de problèmes', matiereId: 'mat-02' },
      { id: 'comp-03', code: 'RAIS_SCI', libelle: 'Raisonnement Scientifique', matiereId: 'mat-04' },
      { id: 'comp-04', code: 'COMM_OR', libelle: 'Communication Orale', matiereId: 'mat-01' },
    ],
  },
  {
    id: 'niveaux',
    nom: 'Niveaux Scolaires',
    items: [
      { id: 'niv-01', code: 'CI', libelle: 'Cours d\'Initiation' },
      { id: 'niv-02', code: 'CP', libelle: 'Cours Préparatoire' },
      { id: 'niv-03', code: 'CE1', libelle: 'Cours Élémentaire 1' },
      { id: 'niv-04', code: 'CE2', libelle: 'Cours Élémentaire 2' },
      { id: 'niv-05', code: 'CM1', libelle: 'Cours Moyen 1' },
      { id: 'niv-06', code: 'CM2', libelle: 'Cours Moyen 2' },
      { id: 'niv-07', code: '6eme', libelle: 'Sixième' },
      { id: 'niv-08', code: '5eme', libelle: 'Cinquième' },
      { id: 'niv-09', code: '4eme', libelle: 'Quatrième' },
      { id: 'niv-10', code: '3eme', libelle: 'Troisième' },
      { id: 'niv-11', code: '2nde', libelle: 'Seconde' },
      { id: 'niv-12', code: '1ere', libelle: 'Première' },
      { id: 'niv-13', code: 'Term', libelle: 'Terminale' },
    ],
  },
  {
    id: 'types_eval',
    nom: 'Types d\'Évaluation',
    items: [
      { id: 'eval-01', code: 'DEVOIR', libelle: 'Devoir surveillé' },
      { id: 'eval-02', code: 'COMPO', libelle: 'Composition' },
      { id: 'eval-03', code: 'PART', libelle: 'Participation en classe' },
      { id: 'eval-04', code: 'PROJET', libelle: 'Projet' },
    ],
  },
];
