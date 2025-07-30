import { BookText, CheckCircle2, ClipboardCheck } from 'lucide-react';
import courseIllustrationImage from '../assets/illustration.png';
import dayjs from 'dayjs';

export interface Lesson {
  id: string;
  lessonTitle: string;
  statusTags: StatusTagData[];
  statsData: {
    evaluationNote: number;
    skillAcquired: number;
    skillNotAcquired: number;
    studentsToRemediate: number;
  };
  illustrationImage: string;
  resources: { id: string; title: string; imageUrl: string }[];
  remediation?: {
    id: string;
    title: string;
    subject: string;
    time: string;
    teacher: string;
    teacherImage: string;
    statusText: string;
    statusColor: string;
  };
  theme: string;
  date: string;
  teacher: string;
  studentCount: number;
}

export interface Course {
  id: string;
  classId: string;
  subject: string;
  teacher: string;
  theme: string;
  courseTitle: string;
  statusTags: CourseStatusTagData[];
  statsData: {
    studentAverage: number;
    skillAcquired: number;
    skillNotAcquired: number;
    remediationCount: number;
  };
  illustrationImage: string;
  lessons: Lesson[];
}

interface CourseStatusTagData {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  Icon?: React.ElementType;
}

interface StatusTagData {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  Icon?: React.ElementType;
}

const defaultLessons: Lesson[] = [
  {
    id: 'lecon123',
    lessonTitle: "Résoudre une équation du second degrés",
    statusTags: [
      { id: 'tag1', label: "EN CLASSE", bgColor: "bg-gray-100", textColor: "text-gray-700", Icon: BookText },
      { id: 'tag2', label: "Terminé", bgColor: "bg-green-100", textColor: "text-green-700", Icon: CheckCircle2 },
      { id: 'tag3', label: "Evaluation - 10 Questions", bgColor: "bg-orange-100", textColor: "text-orange-700", Icon: ClipboardCheck },
    ],
    statsData: {
      evaluationNote: 80,
      skillAcquired: 90,
      skillNotAcquired: 10,
      studentsToRemediate: 2,
    },
    illustrationImage: courseIllustrationImage,
    resources: [
      { id: 'res1', title: "Evaluation 1", imageUrl: "https://via.placeholder.com/400x200/4A90E2/FFFFFF?text=Exercice+Interactif" },
      { id: 'res2', title: "Evaluation 2", imageUrl: "https://via.placeholder.com/400x200/50E3C2/FFFFFF?text=Vidéo+Explicative" },
      { id: 'res3', title: "Evaluation 3", imageUrl: "https://via.placeholder.com/400x200/F5A623/FFFFFF?text=Fiche+Récap" },
    ],
    remediation: {
      id: 'rem1',
      title: "Rappel : Résoudre une équation du second degrés",
      subject: "Mathématique",
      time: "12H30 - 13H00",
      teacher: "Mouhamed Sall",
      teacherImage: "https://via.placeholder.com/40x40/000000/FFFFFF?text=MS",
      statusText: "À faire",
      statusColor: "text-blue-600",
    },
    // Ajouter les propriétés manquantes
    theme: "Mathématiques appliquées",
    date: dayjs().format('YYYY-MM-DD'),
    teacher: "Mouhamed Sall",
    studentCount: 25
  },
  {
    id: 'lecon456',
    lessonTitle: "Introduction aux fractions",
    statusTags: [
      { id: 'tag1', label: "À DISTANCE", bgColor: "bg-blue-100", textColor: "text-blue-700", Icon: BookText },
      { id: 'tag2', label: "En cours", bgColor: "bg-yellow-100", textColor: "text-yellow-700", Icon: CheckCircle2 },
    ],
    statsData: {
      evaluationNote: 0,
      skillAcquired: 10,
      skillNotAcquired: 90,
      studentsToRemediate: 8,
    },
    illustrationImage: courseIllustrationImage,
    resources: [],
    // Ajouter les propriétés manquantes
    theme: "Numération et calcul",
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    teacher: "Mme Sagna",
    studentCount: 22
  }
];

const createCourse = (
  classId: string,
  id: string,
  subject: string,
  teacher: string,
  theme: string,
  lessons: { id: string; lessonTitle: string }[]
): Course => ({
  id,
  classId,
  subject,
  teacher,
  theme,
  courseTitle: subject, // Le titre du cours est simplement le nom de la matière
    statusTags: [
      { id: 'tagA', label: "EN CLASSE", bgColor: "bg-gray-100", textColor: "text-gray-700", Icon: BookText },
    { id: 'tagB', label: "En cours", bgColor: "bg-yellow-100", textColor: "text-yellow-700", Icon: CheckCircle2 }
    ],
    statsData: {
    studentAverage: Math.floor(Math.random() * 30 + 70), // 70-100
    skillAcquired: Math.floor(Math.random() * 20 + 80), // 80-100
    skillNotAcquired: Math.floor(Math.random() * 20), // 0-20
    remediationCount: Math.floor(Math.random() * 5), // 0-5
  },
    illustrationImage: courseIllustrationImage,
  lessons: lessons.map((l, index) => ({
    ...defaultLessons[0], // Utiliser une leçon par défaut comme modèle
    id: l.id,
    lessonTitle: l.lessonTitle,
    // Personnaliser les propriétés manquantes
    theme: theme,
    date: dayjs().add(index, 'week').format('YYYY-MM-DD'),
    teacher: teacher,
    studentCount: Math.floor(Math.random() * 10 + 15), // 15-25 élèves
    // Varier les statistiques pour chaque leçon
    statsData: {
      evaluationNote: Math.floor(Math.random() * 40 + 60), // 60-100
      skillAcquired: Math.floor(Math.random() * 30 + 70), // 70-100
      skillNotAcquired: Math.floor(Math.random() * 30), // 0-30
      studentsToRemediate: Math.floor(Math.random() * 5), // 0-5
    },
    // Varier les tags de statut
    statusTags: index === 0 ? [
      { id: 'tag1', label: "EN COURS", bgColor: "bg-blue-100", textColor: "text-blue-700", Icon: BookText },
      { id: 'tag2', label: "Évaluation prévue", bgColor: "bg-orange-100", textColor: "text-orange-700", Icon: ClipboardCheck },
    ] : [
      { id: 'tag1', label: "EN CLASSE", bgColor: "bg-gray-100", textColor: "text-gray-700", Icon: BookText },
      { id: 'tag2', label: "Programmé", bgColor: "bg-yellow-100", textColor: "text-yellow-700", Icon: CheckCircle2 },
    ],
  })),
});

export interface WeeklySkill {
  id: string;
  classId: string;
  title: string;
  subject: string;
  teacher: string;
  teacherImage: string;
  time: string;
  presentCount: number;
  absentCount: number;
}

const createSkill = (
  classId: string,
  id: string,
  subject: string,
  title: string,
): WeeklySkill => {
  const teachers = [
    { name: 'Mme Diallo', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { name: 'M. Diouf', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Ms. Smith', image: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { name: 'M. Gueye', image: 'https://randomuser.me/api/portraits/men/7.jpg' },
  ];
  const teacher = teachers[Math.floor(Math.random() * teachers.length)];
  return {
    id: `${classId}-${id}`,
    classId,
    title,
    subject,
    teacher: teacher.name,
    teacherImage: teacher.image,
    time: '10:30 - 11:15',
    presentCount: Math.floor(Math.random() * 5 + 15), // 15-20
    absentCount: Math.floor(Math.random() * 3), // 0-2
  };
};

export const mockWeeklySkills: WeeklySkill[] = [
  // PresK1 & PresK2
  ...['presk1', 'presk2'].flatMap(classId => [
    createSkill(classId, 'fr1', 'Français', 'Demander le prénom/nom'),
    createSkill(classId, 'fr2', 'Français', 'Décrire des personnages de contes'),
    createSkill(classId, 'fr3', 'Français', 'Tracer des traits (horizontal, vertical, point)'),
    createSkill(classId, 'en1', 'Anglais', 'Apprendre le vocabulaire d\'Halloween'),
    createSkill(classId, 'math1', 'Mathématiques', 'Réaliser des algorithmes simples'),
    createSkill(classId, 'math2', 'Mathématiques', 'Identifier la forme du cylindre'),
    createSkill(classId, 'math3', 'Mathématiques', 'Utiliser les notions de long/court'),
    createSkill(classId, 'sport1', 'Motricité', 'Marcher à pas chassés'),
  ]),
  // CP1 & CP2
  ...['cp1', 'cp2'].flatMap(classId => [
    createSkill(classId, 'fr1', 'Français', 'Se présenter et demander à quelqu\'un de se présenter'),
    createSkill(classId, 'fr2', 'Français', 'Dégager l\'idée générale d\'un texte'),
    createSkill(classId, 'en1', 'Anglais', 'Utiliser des expressions comme "like/dislike"'),
    createSkill(classId, 'en2', 'Anglais', 'Utiliser des prépositions (in, out, beside, behind)'),
    createSkill(classId, 'math1', 'Mathématiques', 'Comparer des longueurs'),
    createSkill(classId, 'math2', 'Mathématiques', 'Tracer des lignes ouvertes/fermées'),
  ]),
  // CE1 & CE2
  ...['ce1', 'ce2'].flatMap(classId => [
    createSkill(classId, 'fr1', 'Français', 'Orthographier les homophones (ce/se)'),
    createSkill(classId, 'fr2', 'Français', 'Employer des connecteurs temporels'),
    createSkill(classId, 'fr3', 'Français', 'Conjuguer les verbes en "er" au présent'),
    createSkill(classId, 'fr4', 'Français', 'Produire une carte d\'invitation'),
    createSkill(classId, 'en1', 'Anglais', 'Utiliser des pronoms personnels'),
    createSkill(classId, 'sh1', 'Wellness', 'Identifier les facteurs favorisant le paludisme'),
    createSkill(classId, 'math1', 'Mathématiques', 'Compter par dizaines'),
  ]),
  // CM2
  ...[
    createSkill('cm2', 'fr1', 'Français', 'Exposer un programme'),
    createSkill('cm2', 'fr2', 'Français', 'Employer des compléments circonstanciels'),
    createSkill('cm2', 'fr3', 'Français', 'Conjuguer au présent du conditionnel'),
    createSkill('cm2', 'fr4', 'Français', 'Écrire une lettre officielle'),
    createSkill('cm2', 'en1', 'Anglais', 'Utiliser des verbes au présent simple'),
    createSkill('cm2', 'en2', 'Anglais', 'Parler de son pays et de sa nationalité'),
    createSkill('cm2', 'hist1', 'Histoire', 'Découvrir le paléolithique/néolithique'),
    createSkill('cm2', 'math1', 'Mathématiques', 'Calculer le périmètre d\'un cercle'),
    createSkill('cm2', 'math2', 'Mathématiques', 'Tracer un triangle'),
  ]
];

export interface RemediationStudent {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late';
  initialGrade?: number;
  remediationGrade?: number | null;
  competenceAcquired?: boolean;
  parentNotified?: boolean;
}

export interface RemediationResource {
  id: string;
  title: string;
  type: 'fiche_cours' | 'exercice' | 'support_audio' | 'support_video' | 'jeu_educatif';
  url: string;
  description?: string;
}

export interface RemediationMethod {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutes
  type: 'individuel' | 'groupe' | 'pair';
}

export interface RemediationHistory {
  sessionId: string;
  date: string;
  method: RemediationMethod;
  resources: RemediationResource[];
  results: {
    studentsImproved: number;
    averageImprovement: number;
    competencesAcquired: number;
  };
}

export interface RemediationSession {
  id: string;
  classId: string;
  title: string;
  subject: string;
  theme: string;
  date: string;
  teacher: string;
  studentCount: number;
  status: 'completed' | 'upcoming' | 'in_progress';
  skillToAcquire: string;
  students: RemediationStudent[];
  // Nouvelles propriétés
  method?: RemediationMethod;
  resources?: RemediationResource[];
  duration: number;
  location: string;
  objective: string;
  parentReport?: {
    sent: boolean;
    sentDate?: string;
    content?: string;
  };
  history?: RemediationHistory[];
  pdiIntegration: {
    weeklyReportGenerated: boolean;
    alertsGenerated: string[];
    competenceTracking: {
      initial: number;
      target: number;
      current: number;
    };
  };
}

export const mockRemediationMethods: RemediationMethod[] = [
  {
    id: 'method1',
    name: 'Approche phonétique intensive',
    description: 'Travail spécifique sur les sons complexes avec support visuel et auditif',
    duration: 30,
    type: 'groupe'
  },
  {
    id: 'method2',
    name: 'Manipulation d\'objets mathématiques',
    description: 'Utilisation de matériel concret pour la compréhension des concepts',
    duration: 45,
    type: 'individuel'
  },
  {
    id: 'method3',
    name: 'Jeu de rôle pédagogique',
    description: 'Mise en situation pour ancrer les apprentissages',
    duration: 25,
    type: 'pair'
  }
];

export const mockRemediationResources: RemediationResource[] = [
  // Ressources Français
  {
    id: 'res1',
    title: 'Fiche sons complexes (ou, on, an)',
    type: 'fiche_cours',
    url: '/resources/fiche-sons-complexes.pdf',
    description: 'Support pédagogique avec exercices progressifs pour la lecture'
  },
  {
    id: 'res2',
    title: 'Exercices de lecture à voix haute',
    type: 'exercice',
    url: '/resources/exercices-lecture.pdf',
    description: 'Textes adaptés pour améliorer la fluidité de lecture'
  },
  {
    id: 'res3',
    title: 'Audio - Prononciation des sons',
    type: 'support_audio',
    url: '/resources/audio-sons.mp3',
    description: 'Fichier audio pour la correction phonétique'
  },
  {
    id: 'res4',
    title: 'Fiche d\'écriture - Construction de phrases',
    type: 'fiche_cours',
    url: '/resources/fiche-ecriture.pdf',
    description: 'Guide pour la rédaction de phrases simples'
  },
  {
    id: 'res5',
    title: 'Jeu de mots - Vocabulaire CP',
    type: 'jeu_educatif',
    url: '/resources/jeu-vocabulaire.html',
    description: 'Jeu interactif pour enrichir le vocabulaire'
  },
  
  // Ressources Mathématiques
  {
    id: 'res6',
    title: 'Exercices d\'addition sans retenue',
    type: 'exercice',
    url: '/resources/exercices-addition.pdf',
    description: 'Série d\'exercices adaptés au niveau CP'
  },
  {
    id: 'res7',
    title: 'Fiche numération - Nombres jusqu\'à 100',
    type: 'fiche_cours',
    url: '/resources/fiche-numeration.pdf',
    description: 'Support pour comprendre la numération décimale'
  },
  {
    id: 'res8',
    title: 'Jeu éducatif - Les maths en s\'amusant',
    type: 'jeu_educatif',
    url: '/resources/jeu-maths.html',
    description: 'Jeu interactif pour la numération'
  },
  {
    id: 'res9',
    title: 'Vidéo - Addition avec manipulation',
    type: 'support_video',
    url: '/resources/video-addition.mp4',
    description: 'Vidéo explicative avec matériel concret'
  },
  {
    id: 'res10',
    title: 'Exercices de soustraction simple',
    type: 'exercice',
    url: '/resources/exercices-soustraction.pdf',
    description: 'Série d\'exercices de soustraction sans retenue'
  },
  
  // Ressources Sciences
  {
    id: 'res11',
    title: 'Fiche - Le cycle de l\'eau',
    type: 'fiche_cours',
    url: '/resources/fiche-cycle-eau.pdf',
    description: 'Support visuel pour comprendre le cycle de l\'eau'
  },
  {
    id: 'res12',
    title: 'Expérience - Les états de l\'eau',
    type: 'exercice',
    url: '/resources/experience-eau.pdf',
    description: 'Protocole d\'expérience simple pour la classe'
  },
  {
    id: 'res13',
    title: 'Vidéo - Les animaux de la ferme',
    type: 'support_video',
    url: '/resources/video-animaux.mp4',
    description: 'Documentaire adapté aux enfants'
  },
  
  // Ressources Histoire-Géographie
  {
    id: 'res14',
    title: 'Fiche - Les saisons',
    type: 'fiche_cours',
    url: '/resources/fiche-saisons.pdf',
    description: 'Support pour comprendre le cycle des saisons'
  },
  {
    id: 'res15',
    title: 'Carte interactive - Mon quartier',
    type: 'jeu_educatif',
    url: '/resources/carte-quartier.html',
    description: 'Jeu pour découvrir l\'espace proche'
  }
];

export const mockRemediations: RemediationSession[] = [
  {
    id: 'rem1',
    classId: 'cp1',
    title: 'Remédiation en lecture',
    subject: 'Français',
    theme: 'Fluidité de la lecture',
    date: dayjs().subtract(5, 'day').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 5,
    status: 'completed',
    skillToAcquire: "Identifier les sons complexes (ou, on, an).",
    duration: 45,
    location: 'Salle de remédiation A',
    objective: 'Permettre aux élèves de maîtriser la lecture des sons complexes pour améliorer leur fluidité de lecture',
    method: mockRemediationMethods[0],
    resources: [mockRemediationResources[0], mockRemediationResources[2], mockRemediationResources[1]],
    parentReport: {
      sent: true,
      sentDate: dayjs().subtract(4, 'day').toISOString(),
      content: 'Votre enfant a participé à une session de remédiation en lecture. Des progrès notables ont été observés.'
    },
    pdiIntegration: {
      weeklyReportGenerated: true,
      alertsGenerated: ['Amélioration significative constatée', 'Suivi à maintenir'],
      competenceTracking: {
        initial: 45,
        target: 75,
        current: 68
      }
    },
    history: [{
      sessionId: 'rem1-prev',
      date: dayjs().subtract(15, 'day').toISOString(),
      method: mockRemediationMethods[0],
      resources: [mockRemediationResources[0], mockRemediationResources[1]],
      results: {
        studentsImproved: 3,
        averageImprovement: 15,
        competencesAcquired: 2
      }
    }],
    students: [
      { id: '1', name: 'Aminata Sow', avatar: 'https://i.pravatar.cc/150?img=1', status: 'present', initialGrade: 45, remediationGrade: 72, competenceAcquired: true, parentNotified: true },
      { id: '2', name: 'Babacar Diop', avatar: 'https://i.pravatar.cc/150?img=2', status: 'present', initialGrade: 38, remediationGrade: 65, competenceAcquired: true, parentNotified: true },
      { id: '3', name: 'Coumba Ndiaye', avatar: 'https://i.pravatar.cc/150?img=3', status: 'absent', initialGrade: 42, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '4', name: 'Daouda Faye', avatar: 'https://i.pravatar.cc/150?img=4', status: 'present', initialGrade: 35, remediationGrade: 58, competenceAcquired: false, parentNotified: true },
      { id: '5', name: 'Fatou Gueye', avatar: 'https://i.pravatar.cc/150?img=5', status: 'late', initialGrade: 40, remediationGrade: 70, competenceAcquired: true, parentNotified: true },
    ]
  },
  {
    id: 'rem3',
    classId: 'cp1',
    title: 'Soutien en numération',
    subject: 'Mathématiques',
    theme: 'Nombres et calcul',
    date: dayjs().add(2, 'day').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 3,
    status: 'upcoming',
    skillToAcquire: "Additionner des nombres à deux chiffres sans retenue.",
    duration: 45,
    location: 'Salle de mathématiques',
    objective: 'Consolider les bases de l\'addition pour les élèves en difficulté',
    method: mockRemediationMethods[1],
    resources: [mockRemediationResources[5], mockRemediationResources[7], mockRemediationResources[8]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session planifiée', 'Matériel préparé'],
      competenceTracking: {
        initial: 35,
        target: 70,
        current: 35
      }
    },
    students: [
      { id: '6', name: 'Ibrahima Fall', avatar: 'https://i.pravatar.cc/150?img=6', status: 'present', initialGrade: 35, parentNotified: false },
      { id: '7', name: 'Khady Cisse', avatar: 'https://i.pravatar.cc/150?img=7', status: 'present', initialGrade: 32, parentNotified: false },
      { id: '8', name: 'Lamine Thiam', avatar: 'https://i.pravatar.cc/150?img=8', status: 'present', initialGrade: 38, parentNotified: false },
    ]
  },
  {
    id: 'rem4',
    classId: 'cp1',
    title: 'Atelier d\'écriture créative',
    subject: 'Français',
    theme: 'Production écrite',
    date: dayjs().toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 4,
    status: 'in_progress',
    skillToAcquire: "Rédiger une phrase simple en respectant l'ordre des mots.",
    duration: 40,
    location: 'Salle de remédiation B',
    objective: 'Améliorer la construction de phrases et l\'expression écrite des élèves en difficulté',
    method: mockRemediationMethods[2],
    resources: [mockRemediationResources[3], mockRemediationResources[4]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session en cours', 'Élèves concentrés', 'Progression notée'],
      competenceTracking: {
        initial: 40,
        target: 70,
        current: 52
      }
    },
    history: [{
      sessionId: 'rem4-prev',
      date: dayjs().subtract(7, 'day').toISOString(),
      method: mockRemediationMethods[2],
      resources: [mockRemediationResources[3], mockRemediationResources[4]],
      results: {
        studentsImproved: 2,
        averageImprovement: 8,
        competencesAcquired: 1
      }
    }],
    students: [
      { id: '13', name: 'Aïda Ndiaye', avatar: 'https://i.pravatar.cc/150?img=13', status: 'present', initialGrade: 38, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '14', name: 'Moussa Sarr', avatar: 'https://i.pravatar.cc/150?img=14', status: 'present', initialGrade: 42, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '15', name: 'Binta Kane', avatar: 'https://i.pravatar.cc/150?img=15', status: 'present', initialGrade: 35, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '16', name: 'Omar Diagne', avatar: 'https://i.pravatar.cc/150?img=16', status: 'late', initialGrade: 45, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
    ]
  },
  {
    id: 'rem5',
    classId: 'cp1',
    title: 'Remédiation en géométrie',
    subject: 'Mathématiques',
    theme: 'Formes et espace',
    date: dayjs().subtract(3, 'day').toISOString(),
    teacher: 'M. Diouf',
    studentCount: 6,
    status: 'completed',
    skillToAcquire: "Reconnaître et tracer des formes géométriques simples.",
    duration: 50,
    location: 'Salle de géométrie',
    objective: 'Développer la perception spatiale et la reconnaissance des formes',
    method: mockRemediationMethods[1],
    resources: [mockRemediationResources[7], mockRemediationResources[8]],
    parentReport: {
      sent: true,
      sentDate: dayjs().subtract(2, 'day').toISOString(),
      content: 'Session de géométrie terminée. Votre enfant a montré un bon engagement dans les activités pratiques.'
    },
    pdiIntegration: {
      weeklyReportGenerated: true,
      alertsGenerated: ['Compétence acquise', 'Excellent travail'],
      competenceTracking: {
        initial: 30,
        target: 80,
        current: 85
      }
    },
    students: [
      { id: '17', name: 'Fatou Diallo', avatar: 'https://i.pravatar.cc/150?img=17', status: 'present', initialGrade: 30, remediationGrade: 85, competenceAcquired: true, parentNotified: true },
      { id: '18', name: 'Mamadou Ba', avatar: 'https://i.pravatar.cc/150?img=18', status: 'present', initialGrade: 35, remediationGrade: 78, competenceAcquired: true, parentNotified: true },
      { id: '19', name: 'Aissatou Ndiaye', avatar: 'https://i.pravatar.cc/150?img=19', status: 'present', initialGrade: 28, remediationGrade: 72, competenceAcquired: true, parentNotified: true },
      { id: '20', name: 'Ousmane Camara', avatar: 'https://i.pravatar.cc/150?img=20', status: 'present', initialGrade: 32, remediationGrade: 68, competenceAcquired: true, parentNotified: true },
      { id: '21', name: 'Mariama Seck', avatar: 'https://i.pravatar.cc/150?img=21', status: 'absent', initialGrade: 25, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '22', name: 'Ibrahim Fall', avatar: 'https://i.pravatar.cc/150?img=22', status: 'present', initialGrade: 40, remediationGrade: 82, competenceAcquired: true, parentNotified: true },
    ]
  },
  {
    id: 'rem6',
    classId: 'cp1',
    title: 'Atelier de compréhension orale',
    subject: 'Français',
    theme: 'Communication orale',
    date: dayjs().add(1, 'week').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 4,
    status: 'upcoming',
    skillToAcquire: "Comprendre et répondre à des questions simples.",
    duration: 35,
    location: 'Salle de langage',
    objective: 'Améliorer la compréhension orale et l\'expression des élèves',
    method: mockRemediationMethods[2],
    resources: [mockRemediationResources[2], mockRemediationResources[4]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session programmée', 'Matériel audio préparé'],
      competenceTracking: {
        initial: 50,
        target: 75,
        current: 50
      }
    },
    students: [
      { id: '23', name: 'Khadija Diop', avatar: 'https://i.pravatar.cc/150?img=23', status: 'present', initialGrade: 50, parentNotified: false },
      { id: '24', name: 'Modou Sarr', avatar: 'https://i.pravatar.cc/150?img=24', status: 'present', initialGrade: 45, parentNotified: false },
      { id: '25', name: 'Aminata Gueye', avatar: 'https://i.pravatar.cc/150?img=25', status: 'present', initialGrade: 55, parentNotified: false },
      { id: '26', name: 'Lamine Kane', avatar: 'https://i.pravatar.cc/150?img=26', status: 'present', initialGrade: 48, parentNotified: false },
    ]
  },
  {
    id: 'rem7',
    classId: 'cp1',
    title: 'Remédiation en calcul mental',
    subject: 'Mathématiques',
    theme: 'Calcul et numération',
    date: dayjs().subtract(1, 'day').toISOString(),
    teacher: 'M. Diouf',
    studentCount: 5,
    status: 'in_progress',
    skillToAcquire: "Calculer mentalement des additions simples (1-10).",
    duration: 30,
    location: 'Salle de mathématiques',
    objective: 'Développer la rapidité et la précision en calcul mental',
    method: mockRemediationMethods[0],
    resources: [mockRemediationResources[5], mockRemediationResources[9]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session en cours', 'Progrès notés', 'Intervention parentale suggérée'],
      competenceTracking: {
        initial: 40,
        target: 70,
        current: 55
      }
    },
    students: [
      { id: '27', name: 'Fatou Ndiaye', avatar: 'https://i.pravatar.cc/150?img=27', status: 'present', initialGrade: 40, remediationGrade: undefined, competenceAcquired: false, parentNotified: true },
      { id: '28', name: 'Moussa Diallo', avatar: 'https://i.pravatar.cc/150?img=28', status: 'present', initialGrade: 35, remediationGrade: undefined, competenceAcquired: false, parentNotified: true },
      { id: '29', name: 'Aissatou Ba', avatar: 'https://i.pravatar.cc/150?img=29', status: 'present', initialGrade: 45, remediationGrade: undefined, competenceAcquired: false, parentNotified: true },
      { id: '30', name: 'Omar Seck', avatar: 'https://i.pravatar.cc/150?img=30', status: 'late', initialGrade: 38, remediationGrade: undefined, competenceAcquired: false, parentNotified: true },
      { id: '31', name: 'Mariama Camara', avatar: 'https://i.pravatar.cc/150?img=31', status: 'present', initialGrade: 42, remediationGrade: undefined, competenceAcquired: false, parentNotified: true },
    ]
  },
  {
    id: 'rem8',
    classId: 'cp1',
    title: 'Remédiation en orthographe',
    subject: 'Français',
    theme: 'Orthographe et grammaire',
    date: dayjs().subtract(3, 'day').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 4,
    status: 'completed',
    skillToAcquire: "Orthographier correctement les mots courants.",
    duration: 45,
    location: 'Salle de français',
    objective: 'Améliorer l\'orthographe des élèves en difficulté',
    method: mockRemediationMethods[2],
    resources: [mockRemediationResources[0], mockRemediationResources[1], mockRemediationResources[4]],
    parentReport: {
      sent: true,
      sentDate: dayjs().subtract(2, 'day').toISOString(),
      content: 'Session d\'orthographe terminée. Votre enfant a encore des difficultés avec certains mots. Une intervention parentale est recommandée.'
    },
    pdiIntegration: {
      weeklyReportGenerated: true,
      alertsGenerated: ['Compétence non acquise', 'Intervention parentale requise', 'Difficultés persistantes'],
      competenceTracking: {
        initial: 30,
        target: 75,
        current: 45
      }
    },
    students: [
      { id: '32', name: 'Khadija Diop', avatar: 'https://i.pravatar.cc/150?img=32', status: 'present', initialGrade: 30, remediationGrade: 45, competenceAcquired: false, parentNotified: true },
      { id: '33', name: 'Modou Sarr', avatar: 'https://i.pravatar.cc/150?img=33', status: 'present', initialGrade: 35, remediationGrade: 52, competenceAcquired: false, parentNotified: true },
      { id: '34', name: 'Aminata Gueye', avatar: 'https://i.pravatar.cc/150?img=34', status: 'present', initialGrade: 28, remediationGrade: 38, competenceAcquired: false, parentNotified: true },
      { id: '35', name: 'Lamine Kane', avatar: 'https://i.pravatar.cc/150?img=35', status: 'absent', initialGrade: 32, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
    ]
  },
  {
    id: 'rem9',
    classId: 'cp1',
    title: 'Remédiation en lecture fluide',
    subject: 'Français',
    theme: 'Fluidité de lecture',
    date: dayjs().subtract(7, 'day').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 3,
    status: 'completed',
    skillToAcquire: "Lire avec fluidité des textes simples.",
    duration: 40,
    location: 'Salle de lecture',
    objective: 'Développer la fluidité de lecture des élèves',
    method: mockRemediationMethods[0],
    resources: [mockRemediationResources[0], mockRemediationResources[1], mockRemediationResources[2]],
    parentReport: {
      sent: true,
      sentDate: dayjs().subtract(6, 'day').toISOString(),
      content: 'Session de lecture terminée. Des progrès ont été observés mais votre enfant a encore besoin de pratique à la maison.'
    },
    pdiIntegration: {
      weeklyReportGenerated: true,
      alertsGenerated: ['Progrès notés', 'Intervention parentale suggérée', 'Pratique à domicile recommandée'],
      competenceTracking: {
        initial: 40,
        target: 80,
        current: 65
      }
    },
    students: [
      { id: '36', name: 'Fatou Diallo', avatar: 'https://i.pravatar.cc/150?img=36', status: 'present', initialGrade: 40, remediationGrade: 65, competenceAcquired: false, parentNotified: true },
      { id: '37', name: 'Mamadou Ba', avatar: 'https://i.pravatar.cc/150?img=37', status: 'present', initialGrade: 35, remediationGrade: 58, competenceAcquired: false, parentNotified: true },
      { id: '38', name: 'Aissatou Ndiaye', avatar: 'https://i.pravatar.cc/150?img=38', status: 'present', initialGrade: 42, remediationGrade: 72, competenceAcquired: true, parentNotified: true },
    ]
  },
  {
    id: 'rem10',
    classId: 'cp1',
    title: 'Remédiation en géométrie avancée',
    subject: 'Mathématiques',
    theme: 'Formes et mesures',
    date: dayjs().subtract(10, 'day').toISOString(),
    teacher: 'M. Diouf',
    studentCount: 6,
    status: 'completed',
    skillToAcquire: "Reconnaître et mesurer des formes géométriques.",
    duration: 50,
    location: 'Salle de géométrie',
    objective: 'Consolider les connaissances en géométrie',
    method: mockRemediationMethods[1],
    resources: [mockRemediationResources[7], mockRemediationResources[8], mockRemediationResources[9]],
    parentReport: {
      sent: true,
      sentDate: dayjs().subtract(9, 'day').toISOString(),
      content: 'Session de géométrie terminée. Votre enfant a montré un bon engagement mais des difficultés persistent dans la mesure.'
    },
    pdiIntegration: {
      weeklyReportGenerated: true,
      alertsGenerated: ['Engagement positif', 'Difficultés en mesure', 'Intervention parentale suggérée'],
      competenceTracking: {
        initial: 45,
        target: 75,
        current: 60
      }
    },
    students: [
      { id: '39', name: 'Ousmane Camara', avatar: 'https://i.pravatar.cc/150?img=39', status: 'present', initialGrade: 45, remediationGrade: 60, competenceAcquired: false, parentNotified: true },
      { id: '40', name: 'Mariama Seck', avatar: 'https://i.pravatar.cc/150?img=40', status: 'present', initialGrade: 38, remediationGrade: 55, competenceAcquired: false, parentNotified: true },
      { id: '41', name: 'Ibrahim Fall', avatar: 'https://i.pravatar.cc/150?img=41', status: 'present', initialGrade: 42, remediationGrade: 68, competenceAcquired: false, parentNotified: true },
      { id: '42', name: 'Khadija Diop', avatar: 'https://i.pravatar.cc/150?img=42', status: 'present', initialGrade: 35, remediationGrade: 52, competenceAcquired: false, parentNotified: true },
      { id: '43', name: 'Modou Sarr', avatar: 'https://i.pravatar.cc/150?img=43', status: 'late', initialGrade: 40, remediationGrade: 58, competenceAcquired: false, parentNotified: true },
      { id: '44', name: 'Aminata Gueye', avatar: 'https://i.pravatar.cc/150?img=44', status: 'present', initialGrade: 48, remediationGrade: 72, competenceAcquired: true, parentNotified: true },
    ]
  },
  {
    id: 'rem2',
    classId: 'cp1',
    title: 'Soutien en numération',
    subject: 'Mathématiques',
    theme: 'Nombres et calcul',
    date: dayjs().add(2, 'day').toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 3,
    status: 'upcoming',
    skillToAcquire: "Additionner des nombres à deux chiffres sans retenue.",
    duration: 45,
    location: 'Salle de mathématiques',
    objective: 'Consolider les bases de l\'addition pour les élèves en difficulté',
    method: mockRemediationMethods[1],
    resources: [mockRemediationResources[5], mockRemediationResources[6], mockRemediationResources[8]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session planifiée', 'Matériel préparé'],
      competenceTracking: {
        initial: 35,
        target: 70,
        current: 35
      }
    },
    students: [
      { id: '6', name: 'Ibrahima Fall', avatar: 'https://i.pravatar.cc/150?img=6', status: 'present', initialGrade: 35, parentNotified: false },
      { id: '7', name: 'Khady Cisse', avatar: 'https://i.pravatar.cc/150?img=7', status: 'present', initialGrade: 32, parentNotified: false },
      { id: '8', name: 'Lamine Thiam', avatar: 'https://i.pravatar.cc/150?img=8', status: 'present', initialGrade: 38, parentNotified: false },
    ]
  },
  {
    id: 'rem2b',
    classId: 'cp1',
    title: 'Atelier d\'écriture créative',
    subject: 'Français',
    theme: 'Production écrite',
    date: dayjs().toISOString(),
    teacher: 'Mme Sagna',
    studentCount: 4,
    status: 'in_progress',
    skillToAcquire: "Rédiger une phrase simple en respectant l'ordre des mots.",
    duration: 40,
    location: 'Salle de remédiation B',
    objective: 'Améliorer la construction de phrases et l\'expression écrite des élèves en difficulté',
    method: mockRemediationMethods[2],
    resources: [mockRemediationResources[3], mockRemediationResources[4]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session en cours', 'Élèves concentrés', 'Progression notée'],
      competenceTracking: {
        initial: 40,
        target: 70,
        current: 52
      }
    },
    history: [{
      sessionId: 'rem2b-prev',
      date: dayjs().subtract(7, 'day').toISOString(),
      method: mockRemediationMethods[2],
      resources: [mockRemediationResources[3], mockRemediationResources[4]],
      results: {
        studentsImproved: 2,
        averageImprovement: 8,
        competencesAcquired: 1
      }
    }],
    students: [
      { id: '13', name: 'Aïda Ndiaye', avatar: 'https://i.pravatar.cc/150?img=13', status: 'present', initialGrade: 38, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '14', name: 'Moussa Sarr', avatar: 'https://i.pravatar.cc/150?img=14', status: 'present', initialGrade: 42, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '15', name: 'Binta Kane', avatar: 'https://i.pravatar.cc/150?img=15', status: 'present', initialGrade: 35, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
      { id: '16', name: 'Omar Diagne', avatar: 'https://i.pravatar.cc/150?img=16', status: 'late', initialGrade: 45, remediationGrade: undefined, competenceAcquired: false, parentNotified: false },
    ]
  },
  {
    id: 'rem3',
    classId: 'ce1',
    title: 'Atelier de conjugaison',
    subject: 'Français',
    theme: 'Grammaire et conjugaison',
    date: dayjs().subtract(1, 'day').toISOString(),
    teacher: 'M. Diouf',
    studentCount: 4,
    status: 'in_progress',
    skillToAcquire: "Conjuguer les verbes du 1er groupe au présent de l'indicatif.",
    duration: 40,
    location: 'Salle B',
    objective: 'Maîtriser la conjugaison des verbes du premier groupe',
    method: mockRemediationMethods[2],
    resources: [mockRemediationResources[0], mockRemediationResources[1], mockRemediationResources[4]],
    parentReport: {
      sent: false
    },
    pdiIntegration: {
      weeklyReportGenerated: false,
      alertsGenerated: ['Session en cours'],
      competenceTracking: {
        initial: 40,
        target: 75,
        current: 55
      }
    },
    students: [
      { id: '9', name: 'Mamadou Ba', avatar: 'https://i.pravatar.cc/150?img=9', status: 'present', initialGrade: 42, parentNotified: false },
      { id: '10', name: 'Ndeye Seck', avatar: 'https://i.pravatar.cc/150?img=10', status: 'present', initialGrade: 38, parentNotified: false },
      { id: '11', name: 'Ousmane Camara', avatar: 'https://i.pravatar.cc/150?img=11', status: 'present', initialGrade: 45, parentNotified: false },
      { id: '12', name: 'Penda Diallo', avatar: 'https://i.pravatar.cc/150?img=12', status: 'absent', initialGrade: 35, parentNotified: false },
    ]
  },
];

export const mockCourses: Course[] = [
  // =================================
  // PresK1 & PresK2
  // =================================
  ...['presk1', 'presk2'].flatMap(classId => [
    createCourse(classId, `${classId}-fr`, 'Français', 'Mme Diallo', 'Langage et communication', [
      { id: 'l1', lessonTitle: 'Langage' }, { id: 'l2', lessonTitle: 'Conte' }, { id: 'l3', lessonTitle: 'Vocabulaire' }, { id: 'l4', lessonTitle: 'Lecture' }, { id: 'l5', lessonTitle: 'Graphisme' }
    ]),
    createCourse(classId, `${classId}-en`, 'Anglais', 'Ms. Smith', 'Conversation and Vocabulary', [
      { id: 'l1', lessonTitle: 'Conversation' }, { id: 'l2', lessonTitle: 'Vocabulaire' }, { id: 'l3', lessonTitle: 'Listening/Speaking' }
    ]),
    createCourse(classId, `${classId}-sh-ve`, 'Vivre ensemble', 'Mme Diallo', 'Sciences Humaines', []),
    createCourse(classId, `${classId}-sh-vm`, 'Vivre dans son milieu', 'Mme Diallo', 'Sciences Humaines', []),
    createCourse(classId, `${classId}-sh-quran`, 'Qran', 'Oustaz Diene', 'Études islamiques', [{ id: 'l1', lessonTitle: 'Mémorisation de sourates' }]),
    createCourse(classId, `${classId}-stem`, 'Mathématiques', 'Mme Diallo', 'STEM', [
      { id: 'l1', lessonTitle: 'Numérique' }, { id: 'l2', lessonTitle: 'Géométrie' }, { id: 'l3', lessonTitle: 'Mesure' }
    ]),
    createCourse(classId, `${classId}-as-moto`, 'Motricité', 'M. Gueye', 'Créativité & Sport', []),
    createCourse(classId, `${classId}-as-arts`, 'Arts plastiques', 'M. Gueye', 'Créativité & Sport', []),
    createCourse(classId, `${classId}-as-theatre`, 'Théâtre/Drama', 'M. Gueye', 'Créativité & Sport', []),
    createCourse(classId, `${classId}-as-music`, 'Drumming/Musique', 'M. Gueye', 'Créativité & Sport', []),
  ]),

  // =================================
  // CP1 & CP2
  // =================================
  ...['cp1', 'cp2'].flatMap(classId => [
      createCourse(classId, `${classId}-fr`, 'Français', 'Mme Sagna', 'Langage et communication', [
          { id: 'l1', lessonTitle: 'Communication orale' }, { id: 'l2', lessonTitle: 'Production écrite' }, { id: 'l3', lessonTitle: 'Fluidité' }, { id: 'l4', lessonTitle: 'IDM' }
      ]),
      createCourse(classId, `${classId}-en`, 'Anglais', 'Ms. Smith', 'English Studies', [
          { id: 'l1', lessonTitle: 'Conversation' }, { id: 'l2', lessonTitle: 'Vocabulaire' }, { id: 'l3', lessonTitle: 'Story Telling' }, { id: 'l4', lessonTitle: 'Grammaire' }, { id: 'l5', lessonTitle: 'Listening/Speaking' }
      ]),
      createCourse(classId, `${classId}-sh-geo`, 'Géographie', 'Mme Sagna', 'Sciences Humaines', []),
      createCourse(classId, `${classId}-sh-arabe`, 'Lecture arabe', 'Oustaz Diene', 'Études islamiques', []),
      createCourse(classId, `${classId}-sh-islam`, 'Études islamiques', 'Oustaz Diene', 'Études islamiques', []),
      createCourse(classId, `${classId}-sh-quran`, 'Qran', 'Oustaz Diene', 'Études islamiques', [{ id: 'l1', lessonTitle: 'Mémorisation de sourates' }]),
      createCourse(classId, `${classId}-stem`, 'Mathématiques', 'Mme Sagna', 'STEM', [
          { id: 'l1', lessonTitle: 'Mesure' }, { id: 'l2', lessonTitle: 'Géométrie' }, { id: 'l3', lessonTitle: 'Résolution de problèmes' }
      ]),
      createCourse(classId, `${classId}-as-eps`, 'EPS', 'M. Gueye', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-arts`, 'Arts plastiques', 'M. Gueye', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-theatre`, 'Théâtre/Drama', 'M. Gueye', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-music`, 'Drumming/Musique', 'M. Gueye', 'Créativité & Sport', []),
  ]),

  // =================================
  // CE1 & CE2
  // =================================
    ...['ce1', 'ce2'].flatMap(classId => [
      createCourse(classId, `${classId}-fr`, 'Français', 'M. Diouf', 'Langage et communication', [
        { id: 'l1', lessonTitle: 'Orthographe' }, { id: 'l2', lessonTitle: 'Vocabulaire' }, { id: 'l3', lessonTitle: 'Grammaire' }, { id: 'l4', lessonTitle: 'Conjugaison' }, { id: 'l5', lessonTitle: 'Lecture (CGP, IDM, Compréhension, Fluidité)' }, { id: 'l6', lessonTitle: 'Production écrite' }
      ]),
      createCourse(classId, `${classId}-en`, 'Anglais', 'Ms. Jones', 'English Studies', [
        { id: 'l1', lessonTitle: 'Grammaire' }, { id: 'l2', lessonTitle: 'Speaking/Listening' }, { id: 'l3', lessonTitle: 'Vocabulaire' }, { id: 'l4', lessonTitle: 'Reading' }
      ]),
      createCourse(classId, `${classId}-sh-well`, 'Wellness', 'M. Diouf', 'Sciences Humaines', []),
      createCourse(classId, `${classId}-sh-geo`, 'Géographie', 'M. Diouf', 'Sciences Humaines', []),
      createCourse(classId, `${classId}-sh-hist`, 'Histoire', 'M. Diouf', 'Sciences Humaines', []),
      createCourse(classId, `${classId}-sh-arabe`, 'Lecture arabe', 'Oustaz Ba', 'Études islamiques', []),
      createCourse(classId, `${classId}-sh-islam`, 'Études islamiques', 'Oustaz Ba', 'Études islamiques', []),
      createCourse(classId, `${classId}-sh-quran`, 'Qran', 'Oustaz Ba', 'Études islamiques', [{ id: 'l1', lessonTitle: 'Mémorisation de sourates' }]),
      createCourse(classId, `${classId}-stem`, 'Mathématiques', 'M. Diouf', 'STEM', [
          { id: 'l1', lessonTitle: 'Numérique' }, { id: 'l2', lessonTitle: 'Mesure' }, { id: 'l3', lessonTitle: 'Géométrie' }, { id: 'l4', lessonTitle: 'Résolution de problèmes' }
      ]),
      createCourse(classId, `${classId}-as-eps`, 'EPS', 'Mme Fall', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-moto`, 'Motricité', 'Mme Fall', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-arts`, 'Arts plastiques', 'Mme Fall', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-theatre`, 'Théâtre/Drama', 'Mme Fall', 'Créativité & Sport', []),
      createCourse(classId, `${classId}-as-music`, 'Drumming/Musique', 'Mme Fall', 'Créativité & Sport', []),
  ]),

  // =================================
  // CM2
  // =================================
  createCourse('cm2', 'cm2-fr', 'Français', 'M. Faye', 'Langage et communication', [
      { id: 'l1', lessonTitle: 'Expression orale' }, { id: 'l2', lessonTitle: 'Vocabulaire' }, { id: 'l3', lessonTitle: 'Grammaire' }, { id: 'l4', lessonTitle: 'Conjugaison' }, { id: 'l5', lessonTitle: 'Orthographe' }, { id: 'l6', lessonTitle: 'Lecture (Compréhension, IDM, Fluidité)' }, { id: 'l7', lessonTitle: 'Production écrite' }
  ]),
  createCourse('cm2', 'cm2-en', 'Anglais', 'Ms. Davis', 'English Studies', [
      { id: 'l1', lessonTitle: 'Speaking/Grammaire' }, { id: 'l2', lessonTitle: 'Listening/Vocabulaire' }, { id: 'l3', lessonTitle: 'Reading/Writing' }
  ]),
  createCourse('cm2', 'cm2-sh-hist', 'Histoire', 'M. Faye', 'Sciences Humaines', []),
  createCourse('cm2', 'cm2-sh-geo', 'Géographie', 'M. Faye', 'Sciences Humaines', []),
  createCourse('cm2', 'cm2-sh-islam', 'Études islamiques', 'Oustaz Tall', 'Études islamiques', []),
  createCourse('cm2', 'cm2-sh-quran', 'Qran', 'Oustaz Tall', 'Études islamiques', [{ id: 'l1', lessonTitle: 'Mémorisation de sourates' }]),
  createCourse('cm2', 'cm2-sh-ve', 'Vivre ensemble', 'M. Faye', 'Sciences Humaines', []),
  createCourse('cm2', 'cm2-stem', 'Mathématiques', 'M. Faye', 'STEM', [
      { id: 'l1', lessonTitle: 'Activités numériques' }, { id: 'l2', lessonTitle: 'Mesure' }, { id: 'l3', lessonTitle: 'Géométrie' }, { id: 'l4', lessonTitle: 'Résolution de problèmes' }
  ]),
  createCourse('cm2', 'cm2-as-eps', 'EPS', 'M. Diop', 'Créativité & Sport', []),
  createCourse('cm2', 'cm2-as-arts', 'Arts plastiques', 'M. Diop', 'Créativité & Sport', []),
  createCourse('cm2', 'cm2-as-theatre', 'Théâtre/Drama', 'M. Diop', 'Créativité & Sport', []),
  createCourse('cm2', 'cm2-as-music', 'Drumming/Musique', 'M. Diop', 'Créativité & Sport', []),
];

export const classStats = {
  total: 20,
  present: 18,
  retard: 1,
  absent: 1,
}; 

export const mockStudentProgression = [
  { date: 'Octobre', progression: 7 },
  { date: 'Novembre', progression: 10 },
  { date: 'Décembre', progression: 12 },
  { date: 'Janvier', progression: 15 },
  { date: 'Février', progression: 14 },
  { date: 'Mars', progression: 17 },
  { date: 'Avril', progression: 16 },
  { date: 'Mai', progression: 18 },
  { date: 'Juin', progression: 19 },
]; 

// --- Données pour la page Séance PDI ---

export interface Facilitator {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  classes: string[];
  stats: {
    avg: number;
    acquired: number;
    notAcquired: number;
    remediation: number;
  };
}

export const mockFacilitators: Facilitator[] = [
  {
    id: '1',
    name: 'Marie SENGHOR',
    role: 'Facilitatrice français',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/60.jpg',
    classes: ['PRESK 1', 'PRESK 2', 'CP1', 'CP2'],
    stats: { avg: 73, acquired: 90, notAcquired: 10, remediation: 2 },
  },
  {
    id: '2',
    name: 'Philomène SAGNA',
    role: 'Facilitatrice français',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/63.jpg',
    classes: ['PRESK 1', 'PRESK 2', 'CP1', 'CE1', 'CE2'],
    stats: { avg: 80, acquired: 85, notAcquired: 15, remediation: 1 },
  },
  {
    id: '3',
    name: 'Djiby DIOUF',
    role: "Facilitateur d'anglais",
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg',
    classes: ['PRESK 1', 'PRESK 2', 'CP1', 'CE1', 'CE2'],
    stats: { avg: 70, acquired: 75, notAcquired: 25, remediation: 4 },
  },
  {
    id: '4',
    name: 'Mohamed M. DIENE',
    role: 'Facilitateur de coran',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/70.jpg',
    classes: ['PRESK 2', 'CP1', 'CE1', 'CE2', 'CM2'],
    stats: { avg: 90, acquired: 95, notAcquired: 5, remediation: 0 },
  },
  {
    id: '5',
    name: 'El Hadji M. SAMB',
    role: 'Facilitateur de coran',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/65.jpg',
    classes: ['CP1', 'CE1', 'CE2', 'CM2'],
    stats: { avg: 88, acquired: 90, notAcquired: 10, remediation: 1 },
  },
  {
    id: '6',
    name: 'Modou DIOUF',
    role: 'Facilitateur Français',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/55.jpg',
    classes: ['CP2', 'CE1', 'CE2', 'CM2'],
    stats: { avg: 78, acquired: 80, notAcquired: 20, remediation: 3 },
  },
];

export const pdiSessionStats = {
  total: 20,
  present: 18,
  retard: 1,
  absent: 1,
}; 

// --- Données pour le tableau des élèves de la séance PDI ---
export interface PdiStudent {
  id: string;
  name: string;
  avatarUrl: string;
  evaluationDate: string;
  langage: number;
  conte: number;
  vocabulaire: number;
  lecture: number;
  graphisme: number;
  progression: number[]; // Tableau de 5 valeurs (0-1) pour les barres de progression
  remarques: string;
}

export const mockPdiStudents: PdiStudent[] = [
  { id: 's1', name: 'Khadija Ndiaye', avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/1.jpg', evaluationDate: '2 Mars 2025', langage: 75, conte: 79, vocabulaire: 68, lecture: 40, graphisme: 79, progression: [1,1,1,0,0], remarques: '-' },
  { id: 's2', name: 'Maty Diop', avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', evaluationDate: '2 Mars 2025', langage: 86, conte: 83, vocabulaire: 56, lecture: 82, graphisme: 28, progression: [1,1,1,1,0], remarques: '-' },
  { id: 's3', name: 'Mouhamed Fall', avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg', evaluationDate: '2 Mars 2025', langage: 71, conte: 1, vocabulaire: 72, lecture: 65, graphisme: 63, progression: [1,1,0,0,0], remarques: '-' },
  { id: 's4', name: 'Astou Gueye', avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/3.jpg', evaluationDate: '2 Mars 2025', langage: 18, conte: 19, vocabulaire: 98, lecture: 25, graphisme: 88, progression: [1,0,0,0,0], remarques: 'Difficultés en lecture' },
  { id: 's5', name: 'Lamine Sow', avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg', evaluationDate: '2 Mars 2025', langage: 94, conte: 53, vocabulaire: 14, lecture: 56, graphisme: 48, progression: [1,1,1,1,1], remarques: '-' },
]; 

// Interface pour les données de remédiation des parents
export interface ParentRemediationFollowUp {
  studentId: string; // l'enfant concerné
  remediations: {
    remediationId: string;
    status: 'acquired' | 'not_acquired';
    parentInterventionRequested?: boolean;
    parentMessage?: string;
    lastSessionDate: string;
    history: {
      date: string;
      status: 'acquired' | 'not_acquired';
    }[];
  }[];
}

// Données de remédiation pour les parents
export const mockParentRemediationFollowUp: ParentRemediationFollowUp[] = [
  {
    studentId: '1', // correspond à l'id d'un élève dans RemediationStudent
    remediations: [
      {
        remediationId: 'rem1',
        status: 'not_acquired',
        parentInterventionRequested: true,
        parentMessage: 'Mon enfant a encore des difficultés avec les sons complexes. Pouvez-vous organiser une session supplémentaire ?',
        lastSessionDate: '2024-06-20',
        history: [
          { date: '2024-06-10', status: 'not_acquired' },
          { date: '2024-06-15', status: 'not_acquired' },
          { date: '2024-06-20', status: 'not_acquired' }
        ]
      },
      {
        remediationId: 'rem2',
        status: 'acquired',
        lastSessionDate: '2024-06-18',
        history: [
          { date: '2024-06-05', status: 'not_acquired' },
          { date: '2024-06-18', status: 'acquired' }
        ]
      }
    ]
  },
  {
    studentId: '2',
    remediations: [
      {
        remediationId: 'rem1',
        status: 'acquired',
        lastSessionDate: '2024-06-20',
        history: [
          { date: '2024-06-10', status: 'not_acquired' },
          { date: '2024-06-20', status: 'acquired' }
        ]
      }
    ]
  }
];

export const classes = [
  { id: 'presk1', name: 'PresK1' },
  { id: 'presk2', name: 'PresK2' },
  { id: 'cp1', name: 'CP1' },
  { id: 'cp2', name: 'CP2' },
  { id: 'ce1', name: 'CE1' },
  { id: 'ce2', name: 'CE2' },
  { id: 'cm2', name: 'CM2' },
];

export const students = [
  // ... existing code ...
]; 