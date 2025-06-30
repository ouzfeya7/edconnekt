// Données centralisées des élèves pour assurer la cohérence entre toutes les pages

export interface StudentData {
  id: number | string;
  name: string;
  imageUrl: string;
  ref: string;
  gender: string;
  birthDate: string;
  email: string;
  address: string;
  department: string;
  class: string;
  classId: string;
  admissionDate: string;
  status: string;
  competence?: string;
}

// Données fictives par défaut pour l'élève connecté
export const getCurrentStudentData = (): StudentData => ({
  id: 1,
  name: "Ouz Feya",
  imageUrl: "https://i.pravatar.cc/150?img=33",
  ref: "STU_2024_001",
  gender: "Féminin",
  birthDate: "15 Septembre 2015",
  email: "ouz.feya@exemple.com",
  address: "123 Rue de l'École, Dakar, Sénégal",
  department: "Cours Préparatoire",
  class: "CP1",
  classId: "cp1",
  admissionDate: "1 Septembre 2024",
  status: "Présent",
  competence: "Lecture et écriture"
});

// Interface pour les cours enrichis - synchronisée avec les évaluations
export interface EnrichedCourse {
  id: string;
  subject: string;
  teacher: string;
  theme: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: 'active' | 'completed' | 'upcoming';
  nextLessonDate: string;
  classId: string;
  domain: string;
  competences: string[];
  onViewDetails: () => void;
  title: string;
  time: string;
  presentCount: number;
  remediationCount: number;
}

// Données enrichies des cours basées sur la structure des évaluations CP1
export const getStudentCourseProgress = () => {
  const courseProgress = [
    { subject: "Français", progress: 78, status: "active" as const, domain: "Langues et Communication" },
    { subject: "Anglais", progress: 67, status: "active" as const, domain: "Langues et Communication" },
    { subject: "Mathématiques", progress: 85, status: "active" as const, domain: "STEM" },
    { subject: "Histoire", progress: 92, status: "active" as const, domain: "Sciences Humaines" },
    { subject: "Géographie", progress: 88, status: "active" as const, domain: "Sciences Humaines" },
    { subject: "Études islamiques", progress: 75, status: "active" as const, domain: "Sciences Humaines" },
    { subject: "Quran", progress: 82, status: "active" as const, domain: "Sciences Humaines" },
    { subject: "Vivre Ensemble", progress: 90, status: "active" as const, domain: "Sciences Humaines" },
    { subject: "Arts plastiques", progress: 95, status: "completed" as const, domain: "Créativité & Sport" },
    { subject: "EPS", progress: 88, status: "active" as const, domain: "Créativité & Sport" },
  ];
  
  return courseProgress;
};

// Cours enrichis avec toutes les données synchronisées avec les évaluations
export const getEnrichedCourses = (navigate: (path: string) => void): EnrichedCourse[] => {
  return [
    {
      id: "francais-cp1",
      subject: "Français",
      teacher: "Mme Sagna",
      theme: "Langage et communication",
      progress: 78,
      totalLessons: 15,
      completedLessons: 12,
      status: "active" as const,
      nextLessonDate: "Lundi 25 Nov",
      classId: "cp1",
      domain: "Langues et Communication",
      competences: ["Expression Orale", "Vocabulaire", "Grammaire", "Conjugaison", "Orthographe", "Compréhension", "Fluidité"],
      onViewDetails: () => navigate('/mes-cours/francais-cp1'),
      title: "Les mots de la famille",
      time: "8H30 - 9H30",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "anglais-cp1",
      subject: "Anglais",
      teacher: "Miss Johnson",
      theme: "Basic English Communication",
      progress: 67,
      totalLessons: 12,
      completedLessons: 8,
      status: "active" as const,
      nextLessonDate: "Mercredi 27 Nov",
      classId: "cp1",
      domain: "Langues et Communication",
      competences: ["Speaking-Grammar", "Listening", "Vocabulary", "Reading-Writing"],
      onViewDetails: () => navigate('/mes-cours/anglais-cp1'),
      title: "Family members",
      time: "9H30 - 10H30",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "maths-cp1",
      subject: "Mathématiques",
      teacher: "M. Diagne",
      theme: "Nombres et opérations",
      progress: 85,
      totalLessons: 14,
      completedLessons: 12,
      status: "active" as const,
      nextLessonDate: "Mardi 26 Nov",
      classId: "cp1",
      domain: "STEM",
      competences: ["Numérique", "Géométrie", "Mesure", "Résolution de problèmes"],
      onViewDetails: () => navigate('/mes-cours/maths-cp1'),
      title: "Résoudre une équation du second degrés",
      time: "8H30 - 10H30",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "histoire-cp1",
      subject: "Histoire",
      teacher: "Mme Ndiaye",
      theme: "Découverte du passé",
      progress: 92,
      totalLessons: 10,
      completedLessons: 9,
      status: "active" as const,
      nextLessonDate: "Jeudi 28 Nov",
      classId: "cp1",
      domain: "Sciences Humaines",
      competences: ["Histoire Compétences"],
      onViewDetails: () => navigate('/mes-cours/histoire-cp1'),
      title: "Les grandes civilisations",
      time: "10H30 - 11H30",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "geographie-cp1",
      subject: "Géographie",
      teacher: "M. Sow",
      theme: "Mon environnement proche",
      progress: 88,
      totalLessons: 11,
      completedLessons: 10,
      status: "active" as const,
      nextLessonDate: "Vendredi 29 Nov",
      classId: "cp1",
      domain: "Sciences Humaines",
      competences: ["Géographie Compétences"],
      onViewDetails: () => navigate('/mes-cours/geographie-cp1'),
      title: "La carte de mon quartier",
      time: "14H00 - 15H00",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "etudes-islamiques-cp1",
      subject: "Études islamiques",
      teacher: "Ustaz Mbaye",
      theme: "Principes de l'Islam",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      status: "active" as const,
      nextLessonDate: "Samedi 30 Nov",
      classId: "cp1",
      domain: "Sciences Humaines",
      competences: ["Études islamiques Compétences"],
      onViewDetails: () => navigate('/mes-cours/etudes-islamiques-cp1'),
      title: "Les piliers de l'Islam",
      time: "15H00 - 16H00",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "quran-cp1",
      subject: "Quran",
      teacher: "Ustaz Diallo",
      theme: "Mémorisation et récitation",
      progress: 82,
      totalLessons: 16,
      completedLessons: 13,
      status: "active" as const,
      nextLessonDate: "Dimanche 1 Déc",
      classId: "cp1",
      domain: "Sciences Humaines",
      competences: ["Quran Compétences"],
      onViewDetails: () => navigate('/mes-cours/quran-cp1'),
      title: "Sourate Al-Fatiha",
      time: "16H00 - 17H00",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "vivre-ensemble-cp1",
      subject: "Vivre Ensemble",
      teacher: "Mme Fall",
      theme: "Citoyenneté et valeurs",
      progress: 90,
      totalLessons: 8,
      completedLessons: 7,
      status: "active" as const,
      nextLessonDate: "Lundi 2 Déc",
      classId: "cp1",
      domain: "Sciences Humaines",
      competences: ["Vivre Ensemble Compétences"],
      onViewDetails: () => navigate('/mes-cours/vivre-ensemble-cp1'),
      title: "Respecter les différences",
      time: "11H30 - 12H30",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "arts-plastiques-cp1",
      subject: "Arts plastiques",
      teacher: "Mme Cissé",
      theme: "Expression artistique",
      progress: 95,
      totalLessons: 10,
      completedLessons: 10,
      status: "completed" as const,
      nextLessonDate: "Terminé",
      classId: "cp1",
      domain: "Créativité & Sport",
      competences: ["Arts plastiques Compétences"],
      onViewDetails: () => navigate('/mes-cours/arts-plastiques-cp1'),
      title: "Peinture à l'aquarelle",
      time: "13H00 - 14H00",
      presentCount: 0,
      remediationCount: 0,
    },
    {
      id: "eps-cp1",
      subject: "EPS",
      teacher: "Coach Diop",
      theme: "Développement moteur",
      progress: 88,
      totalLessons: 12,
      completedLessons: 11,
      status: "active" as const,
      nextLessonDate: "Mardi 3 Déc",
      classId: "cp1",
      domain: "Créativité & Sport",
      competences: ["EPS Compétences"],
      onViewDetails: () => navigate('/mes-cours/eps-cp1'),
      title: "Parcours d'agilité",
      time: "14H00 - 15H00",
      presentCount: 0,
      remediationCount: 0,
    },
  ].map(course => ({
    ...course,
    teacher: course.teacher || "N/A",
    theme: course.theme || "N/A",
    progress: course.progress || 0,
    totalLessons: course.totalLessons || 10,
    completedLessons: course.completedLessons || 0,
    status: course.status || "upcoming",
    nextLessonDate: course.nextLessonDate || "N/A",
    classId: course.classId || "cp1",
    domain: course.domain || "N/A",
    competences: course.competences || [],
    onViewDetails: course.onViewDetails || (() => {}),
  }));
};

// Interface pour les devoirs synchronisée avec les évaluations
export interface StudentAssignment {
  id: number;
  title: string;
  subject: string;
  domain: string; // Ajout du domaine
  competence: string; // Compétence spécifique évaluée
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  expectedScore?: number; // Score attendu basé sur les évaluations
  description: string;
  instructions: string[];
  resources: { name: string; type: string; url?: string }[];
}

// Devoirs basés sur la structure des évaluations CP1
export const getStudentAssignments = (): StudentAssignment[] => [
  {
    id: 1,
    title: "Exercices de numération",
    subject: "Mathématiques",
    domain: "STEM",
    competence: "Numérique",
    dueDate: "26 Nov",
    status: "pending" as const,
    expectedScore: 78,
    description: "Exercices sur les nombres de 0 à 100, comparaison et rangement.",
    instructions: [
      "Compléter les exercices pages 45-47 du manuel",
      "Ranger les nombres dans l'ordre croissant",
      "Comparer les nombres avec les signes < et >"
    ],
    resources: [
      { name: "Manuel de mathématiques CP1", type: "pdf" },
      { name: "Fiche d'exercices numération", type: "pdf" }
    ]
  },
  {
    id: 2,
    title: "Lecture et compréhension",
    subject: "Français",
    domain: "Langues et Communication",
    competence: "Compréhension",
    dueDate: "27 Nov",
    status: "completed" as const,
    expectedScore: 85,
    description: "Lecture du texte 'La petite poule rousse' et questions de compréhension.",
    instructions: [
      "Lire le texte à voix haute 3 fois",
      "Répondre aux questions de compréhension",
      "Dessiner la scène préférée du texte"
    ],
    resources: [
      { name: "Livre de lecture CP1", type: "pdf" },
      { name: "Questions de compréhension", type: "pdf" }
    ]
  },
  {
    id: 3,
    title: "Vocabulaire anglais - Family",
    subject: "Anglais",
    domain: "Langues et Communication",
    competence: "Vocabulary",
    dueDate: "28 Nov",
    status: "pending" as const,
    expectedScore: 67,
    description: "Apprendre le vocabulaire de la famille en anglais.",
    instructions: [
      "Mémoriser les 10 mots de vocabulaire",
      "Dessiner sa famille et légender en anglais",
      "S'entraîner à la prononciation"
    ],
    resources: [
      { name: "Flashcards Family", type: "pdf" },
      { name: "Audio prononciation", type: "audio" }
    ]
  },
  {
    id: 4,
    title: "Géométrie - Les formes",
    subject: "Mathématiques",
    domain: "STEM",
    competence: "Géométrie",
    dueDate: "29 Nov",
    status: "pending" as const,
    expectedScore: 82,
    description: "Identifier et dessiner les formes géométriques de base.",
    instructions: [
      "Colorier les formes selon les consignes",
      "Dessiner 3 objets de chaque forme dans la maison",
      "Compter les côtés et les angles"
    ],
    resources: [
      { name: "Fiche formes géométriques", type: "pdf" },
      { name: "Règle et compas", type: "materiel" }
    ]
  },
  {
    id: 5,
    title: "Production écrite - Ma journée",
    subject: "Français",
    domain: "Langues et Communication",
    competence: "Production Écrite",
    dueDate: "30 Nov",
    status: "pending" as const,
    expectedScore: 75,
    description: "Écrire un petit texte décrivant sa journée d'école.",
    instructions: [
      "Écrire 5 phrases minimum",
      "Utiliser les mots de liaison : d'abord, puis, ensuite, enfin",
      "Vérifier l'orthographe et la ponctuation"
    ],
    resources: [
      { name: "Modèle de texte", type: "pdf" },
      { name: "Liste des mots de liaison", type: "pdf" }
    ]
  },
  {
    id: 6,
    title: "Histoire - Ma famille",
    subject: "Histoire",
    domain: "Sciences Humaines",
    competence: "Histoire Compétences",
    dueDate: "1 Déc",
    status: "pending" as const,
    expectedScore: 88,
    description: "Recherche sur l'histoire de sa famille et création d'un arbre généalogique.",
    instructions: [
      "Interviewer ses parents sur l'histoire familiale",
      "Dessiner son arbre généalogique",
      "Écrire 3 informations importantes sur ses grands-parents"
    ],
    resources: [
      { name: "Modèle arbre généalogique", type: "pdf" },
      { name: "Questions d'interview", type: "pdf" }
    ]
  },
  {
    id: 7,
    title: "Conjugaison - Verbe être et avoir",
    subject: "Français",
    domain: "Langues et Communication",
    competence: "Conjugaison",
    dueDate: "2 Déc",
    status: "pending" as const,
    expectedScore: 70,
    description: "Apprendre la conjugaison des verbes être et avoir au présent.",
    instructions: [
      "Mémoriser les conjugaisons",
      "Compléter les exercices de la fiche",
      "Faire 5 phrases avec chaque verbe"
    ],
    resources: [
      { name: "Tableau de conjugaison", type: "pdf" },
      { name: "Exercices conjugaison", type: "pdf" }
    ]
  },
  {
    id: 8,
    title: "Géographie - Mon quartier",
    subject: "Géographie",
    domain: "Sciences Humaines",
    competence: "Géographie Compétences",
    dueDate: "3 Déc",
    status: "pending" as const,
    expectedScore: 85,
    description: "Observer et décrire son quartier, identifier les lieux importants.",
    instructions: [
      "Dessiner un plan simple de son quartier",
      "Identifier 5 lieux importants (école, mosquée, marché...)",
      "Décrire le chemin de la maison à l'école"
    ],
    resources: [
      { name: "Fiche observation quartier", type: "pdf" },
      { name: "Exemple de plan", type: "pdf" }
    ]
  },
  {
    id: 9,
    title: "Mesures - Longueurs",
    subject: "Mathématiques",
    domain: "STEM",
    competence: "Mesure",
    dueDate: "4 Déc",
    status: "pending" as const,
    expectedScore: 79,
    description: "Mesurer des objets avec une règle et comparer les longueurs.",
    instructions: [
      "Mesurer 10 objets de la classe",
      "Noter les mesures en centimètres",
      "Classer du plus petit au plus grand"
    ],
    resources: [
      { name: "Règle graduée", type: "materiel" },
      { name: "Tableau de mesures", type: "pdf" }
    ]
  },
  {
    id: 10,
    title: "Mémorisation Sourate Al-Fatiha",
    subject: "Quran",
    domain: "Sciences Humaines",
    competence: "Quran Compétences",
    dueDate: "5 Déc",
    status: "pending" as const,
    expectedScore: 90,
    description: "Mémoriser parfaitement la Sourate Al-Fatiha avec la bonne prononciation.",
    instructions: [
      "Répéter la sourate 10 fois par jour",
      "Écouter l'audio pour la prononciation",
      "Réciter devant un adulte de la famille"
    ],
    resources: [
      { name: "Audio Sourate Al-Fatiha", type: "audio" },
      { name: "Texte avec phonétique", type: "pdf" }
    ]
  }
];

// Événements à venir pour l'élève
export const getStudentEvents = () => [
  {
    id: 1,
    title: "Évaluation Mathématiques",
    subject: "Mathématiques",
    date: "Demain 10h00",
    type: "evaluation" as const,
    color: "blue" as const
  },
  {
    id: 2,
    title: "Réunion parents-professeurs",
    subject: "Général",
    date: "Vendredi 16h00",
    type: "meeting" as const,
    color: "green" as const
  },
  {
    id: 3,
    title: "Sortie éducative",
    subject: "Sciences",
    date: "Lundi prochain",
    type: "activity" as const,
    color: "purple" as const
  }
];

// Réussites récentes de l'élève
export const getStudentAchievements = () => [
  {
    id: 1,
    title: "Excellent en Français",
    description: "Note : 18/20",
    type: "grade" as const,
    color: "yellow" as const,
    date: "Il y a 2 jours"
  },
  {
    id: 2,
    title: "Objectif atteint",
    description: "Mathématiques +15%",
    type: "progress" as const,
    color: "purple" as const,
    date: "Cette semaine"
  },
  {
    id: 3,
    title: "Participation active",
    description: "Sciences naturelles",
    type: "participation" as const,
    color: "green" as const,
    date: "Hier"
  }
];

// Progression détaillée par domaines de compétences
export const getStudentCompetenceProgress = () => {
  return [
    {
      domain: "Langues et Communication",
      color: "blue",
      subjects: [
        {
          name: "Français",
          avgScore: 85,
          competences: [
            { name: "Expression Orale", score: 88, trend: "up" },
            { name: "Vocabulaire", score: 92, trend: "up" },
            { name: "Grammaire", score: 78, trend: "stable" },
            { name: "Compréhension", score: 85, trend: "up" },
            { name: "Production Écrite", score: 80, trend: "down" }
          ]
        },
        {
          name: "Anglais",
          avgScore: 75,
          competences: [
            { name: "Speaking", score: 78, trend: "up" },
            { name: "Listening", score: 82, trend: "up" },
            { name: "Vocabulary", score: 70, trend: "stable" },
            { name: "Reading/Writing", score: 70, trend: "stable" }
          ]
        }
      ]
    },
    {
      domain: "STEM",
      color: "green", 
      subjects: [
        {
          name: "Mathématiques",
          avgScore: 78,
          competences: [
            { name: "Numérique", score: 85, trend: "up" },
            { name: "Géométrie", score: 75, trend: "stable" },
            { name: "Mesure", score: 72, trend: "down" },
            { name: "Résolution", score: 80, trend: "up" }
          ]
        },
        {
          name: "Sciences",
          avgScore: 88,
          competences: [
            { name: "Observation", score: 92, trend: "up" },
            { name: "Expérimentation", score: 85, trend: "stable" },
            { name: "Analyse", score: 87, trend: "up" }
          ]
        }
      ]
    },
    {
      domain: "Sciences Humaines",
      color: "purple",
      subjects: [
        {
          name: "Histoire",
          avgScore: 82,
          competences: [
            { name: "Chronologie", score: 80, trend: "stable" },
            { name: "Compréhension", score: 85, trend: "up" }
          ]
        },
        {
          name: "Géographie", 
          avgScore: 79,
          competences: [
            { name: "Localisation", score: 82, trend: "up" },
            { name: "Orientation", score: 76, trend: "stable" }
          ]
        }
      ]
    },
    {
      domain: "Créativité & Sport",
      color: "orange",
      subjects: [
        {
          name: "Arts Plastiques",
          avgScore: 90,
          competences: [
            { name: "Créativité", score: 95, trend: "up" },
            { name: "Technique", score: 85, trend: "stable" }
          ]
        },
        {
          name: "Éducation Physique",
          avgScore: 85,
          competences: [
            { name: "Motricité", score: 88, trend: "up" },
            { name: "Coopération", score: 82, trend: "stable" }
          ]
        }
      ]
    }
  ];
};

// Évolution temporelle des compétences
export const getStudentProgressEvolution = () => {
  return {
    months: ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    domains: [
      {
        domain: "Langues et Communication",
        color: "blue",
        data: [65, 68, 72, 75, 73, 78, 80, 83, 85]
      },
      {
        domain: "STEM", 
        color: "green",
        data: [70, 72, 70, 74, 76, 78, 75, 80, 78]
      },
      {
        domain: "Sciences Humaines",
        color: "purple", 
        data: [68, 70, 75, 78, 76, 80, 82, 81, 82]
      },
      {
        domain: "Créativité & Sport",
        color: "orange",
        data: [80, 82, 85, 88, 87, 90, 89, 88, 90]
      }
    ]
  };
};

// Statistiques globales de l'élève
export const getStudentStats = () => {
  const courseProgress = getStudentCourseProgress();
  const assignments = getStudentAssignments();
  const competenceProgress = getStudentCompetenceProgress();
  
  const totalCourses = courseProgress.length;
  const activeCourses = courseProgress.filter(c => c.status === 'active').length;
  const completedCourses = courseProgress.filter(c => c.status === 'completed').length;
  const upcomingCourses = 0; // Pas de cours à venir dans la nouvelle structure
  const avgProgress = Math.round(
    courseProgress.reduce((sum, c) => sum + c.progress, 0) / totalCourses
  );
  
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const avgAssignmentProgress = Math.round(
    assignments.reduce((sum, a) => sum + (a.expectedScore || 0), 0) / totalAssignments
  );

  // Calcul de la moyenne générale par domaines
  const overallAverage = Math.round(
    competenceProgress.reduce((sum, domain) => 
      sum + domain.subjects.reduce((domainSum, subject) => domainSum + subject.avgScore, 0) / domain.subjects.length
    , 0) / competenceProgress.length
  );
  
  return {
    courses: {
      total: totalCourses,
      active: activeCourses,
      completed: completedCourses,
      upcoming: upcomingCourses,
      avgProgress
    },
    assignments: {
      total: totalAssignments,
      completed: completedAssignments,
      pending: pendingAssignments,
      avgProgress: avgAssignmentProgress
    },
    attendance: {
      present: 95,
      late: 3,
      absent: 2
    },
    competences: {
      overallAverage,
      domains: competenceProgress.length,
      totalCompetences: competenceProgress.reduce((sum, domain) => 
        sum + domain.subjects.reduce((subSum, subject) => subSum + subject.competences.length, 0), 0
      )
    }
  };
};

// Notifications synchronisées avec la messagerie
export const getStudentNotifications = () => [
  {
    id: 1,
    title: "Devoir de mathématiques pour lundi prochain",
    message: "M. Diallo - Mathématiques",
    type: "info" as const,
    time: "Il y a 2h",
    messageId: "1", // Lien avec la messagerie
    category: "Professeur"
  },
  {
    id: 2,
    title: "Notes du contrôle de français disponibles",
    message: "Mme Sow - Français",
    type: "success" as const,
    time: "Il y a 3h",
    messageId: "2",
    category: "Professeur"
  },
  {
    id: 3,
    title: "Rappel : Réunion parents-professeurs le 15 mars",
    message: "Administration",
    type: "warning" as const,
    time: "Il y a 1 jour",
    messageId: "3",
    category: "Administration"
  }
];

// Événements synchronisés avec l'agenda
export const getStudentAgendaEvents = () => [
  {
    id: 1,
    title: "Évaluation Mathématiques",
    subject: "Mathématiques",
    date: "Demain 10h00",
    fullDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
    type: "evaluation" as const,
    color: "blue" as const,
    location: "Salle 12",
    description: "Évaluation sur les fractions et les nombres décimaux"
  },
  {
    id: 2,
    title: "Réunion parents-professeurs",
    subject: "Général",
    date: "Vendredi 16h00",
    fullDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // Dans 4 jours
    type: "meeting" as const,
    color: "green" as const,
    location: "Grande salle",
    description: "Bilan trimestriel avec les parents"
  },
  {
    id: 3,
    title: "Sortie éducative au musée",
    subject: "Sciences",
    date: "Lundi prochain 9h00",
    fullDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
    type: "activity" as const,
    color: "purple" as const,
    location: "Musée des Sciences",
    description: "Visite guidée sur l'évolution et la biodiversité"
  }
]; 