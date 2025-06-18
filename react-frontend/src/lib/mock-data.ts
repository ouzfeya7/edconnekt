import { BookText, CheckCircle2, ClipboardList, ClipboardCheck } from 'lucide-react';
import courseIllustrationImage from '../assets/image.png';

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
}

export interface Course {
  id: string;
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
    }
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
  }
];

export const mockCourses: Course[] = [
  {
    id: "mathematique",
    subject: "Mathématique",
    teacher: "Monsieur Diouf",
    theme: "Thème : Les nombres et le calcul",
    courseTitle: "Mathématique",
    statusTags: [
      { id: 'tagA', label: "EN CLASSE", bgColor: "bg-gray-100", textColor: "text-gray-700", Icon: BookText },
      { id: 'tagB', label: "Terminé", bgColor: "bg-green-100", textColor: "text-green-700", Icon: CheckCircle2 },
      { id: 'tagC', label: "Evaluation - 10 Questions", bgColor: "bg-orange-100", textColor: "text-orange-700", Icon: ClipboardList },
    ],
    statsData: {
      studentAverage: 73,
      skillAcquired: 90,
      skillNotAcquired: 10,
      remediationCount: 2,
    },
    illustrationImage: courseIllustrationImage,
    lessons: defaultLessons,
  },
  {
    id: "francais",
    subject: "Français",
    teacher: "Monsieur Diouf",
    theme: "Thème : Grammaire et conjugaison",
    courseTitle: "Français",
    statusTags: [],
    statsData: { studentAverage: 85, skillAcquired: 88, skillNotAcquired: 12, remediationCount: 1 },
    illustrationImage: courseIllustrationImage,
    lessons: [defaultLessons[1]],
  },
  {
    id: "anglais",
    subject: "Anglais",
    teacher: "Monsieur Diouf",
    theme: "Theme: Vocabulary and Conversation",
    courseTitle: "Anglais",
    statusTags: [],
    statsData: { studentAverage: 92, skillAcquired: 95, skillNotAcquired: 5, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
  {
    id: "coran",
    subject: "Coran",
    teacher: "Oustaz DIENE",
    theme: "Thème : Apprentissage des sourates",
    courseTitle: "Coran",
    statusTags: [],
    statsData: { studentAverage: 98, skillAcquired: 99, skillNotAcquired: 1, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
  // Adding other courses from MesCoursPage for completeness
  {
    id: "elhadji-samb",
    subject: "El Hadji M. SAMB",
    teacher: "Facilitateur de coran",
    theme: "Thème : Facilitation Coran",
    courseTitle: "El Hadji M. SAMB",
    statusTags: [],
    statsData: { studentAverage: 0, skillAcquired: 0, skillNotAcquired: 0, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
  {
    id: "modou-diouf-fr",
    subject: "Modou DIOUF",
    teacher: "Facilitateur Français",
    theme: "Thème : Facilitation Français",
    courseTitle: "Modou DIOUF",
    statusTags: [],
    statsData: { studentAverage: 0, skillAcquired: 0, skillNotAcquired: 0, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
    {
    id: "modou-diouf-fr2",
    subject: "Modou DIOUF",
    teacher: "Facilitateur Français",
    theme: "Thème : Facilitation Français",
    courseTitle: "Modou DIOUF",
    statusTags: [],
    statsData: { studentAverage: 0, skillAcquired: 0, skillNotAcquired: 0, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
    {
    id: "modou-diouf-autre",
    subject: "Modou DIOUF",
    teacher: "Facilitateur Français",
    theme: "Thème : Facilitation Français",
    courseTitle: "Modou DIOUF",
    statusTags: [],
    statsData: { studentAverage: 0, skillAcquired: 0, skillNotAcquired: 0, remediationCount: 0 },
    illustrationImage: courseIllustrationImage,
    lessons: [],
  },
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
    classes: ['PRESK 1', 'PRESK 2', 'CI A', 'CP B'],
    stats: { avg: 73, acquired: 90, notAcquired: 10, remediation: 2 },
  },
  {
    id: '2',
    name: 'Philomène SAGNE',
    role: 'Facilitatrice français',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/female/63.jpg',
    classes: ['4eme B', '4eme B'],
    stats: { avg: 80, acquired: 85, notAcquired: 15, remediation: 1 },
  },
  {
    id: '3',
    name: 'Djiby DIOUF',
    role: "Facilitateur d'anglais",
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg',
    classes: ['4eme B', '4eme B'],
    stats: { avg: 70, acquired: 75, notAcquired: 25, remediation: 4 },
  },
  {
    id: '4',
    name: 'Mohamed M. DIENE',
    role: 'Facilitateur de coran',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/70.jpg',
    classes: ['4eme B', '4eme B'],
    stats: { avg: 90, acquired: 95, notAcquired: 5, remediation: 0 },
  },
  {
    id: '5',
    name: 'El Hadji M. SAMB',
    role: 'Facilitateur de coran',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/65.jpg',
    classes: ['4eme B', '4eme B'],
    stats: { avg: 88, acquired: 90, notAcquired: 10, remediation: 1 },
  },
  {
    id: '6',
    name: 'Modou DIOUF',
    role: 'Facilitateur Français',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/55.jpg',
    classes: ['4eme B', '4eme B'],
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