# Pédagogie - Gestion des Cours et Leçons (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock

**Description** : Interface pédagogique pour la gestion des cours, leçons, évaluations et remédiations. Permet aux enseignants et admin staff de suivre le progrès pédagogique avec des statistiques détaillées et des ressources associées.

**Type de données** : Mockées / Simulées  
**Source des données** : 
- Fichier TypeScript statique (`mock-data.ts`)
- Générateurs de données avec statistiques
- Images et ressources mockées
- Calculs côté client pour les moyennes

## Prérequis

### Rôles Utilisateur
- [x] Admin Staff
- [x] Enseignant  
- [x] Élève (lecture seule)
- [ ] Parent
- [ ] Admin

### Permissions Requises
- `cours.read` : Lecture des cours (simulée)
- `cours.write` : Création/modification (simulée)
- `evaluations.read` : Accès aux évaluations
- `remediation.manage` : Gestion des remédiations

### État Initial du Système
- Utilisateur authentifié avec rôle approprié
- Données mockées initialisées (cours avec leçons)
- Images d'illustration disponibles
- Statistiques pré-calculées

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/CourseDetailPage.tsx` / `src/pages/enseignants/MesCoursPage.tsx`  
**Route** : `/courses/:courseId` / `/enseignant/mes-cours`  
**Navigation** : Menu Principal → Mes Cours → Détail du cours

**Action utilisateur** :
- Clic sur une carte de cours
- Navigation depuis le tableau de bord
- Accès direct via URL

**Source des données** :
```typescript
// Import des données mockées
import { mockCourses, Course, Lesson } from '../lib/mock-data';

// Structure des données
interface Course {
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
```

**Résultat attendu** :
- Affichage du cours avec statistiques
- Liste des leçons associées
- Ressources pédagogiques disponibles
- Indicateurs de progression

### 2. Visualisation des Statistiques (Simulé)
**Déclencheur** : Chargement du détail du cours

**Simulation** :
```typescript
// Calcul des statistiques mockées
const calculateCourseStats = (lessons: Lesson[]) => {
  const totalStudents = lessons.reduce((acc, lesson) => 
    acc + lesson.studentCount, 0) / lessons.length;
  
  const averageNote = lessons.reduce((acc, lesson) => 
    acc + lesson.statsData.evaluationNote, 0) / lessons.length;
  
  const skillsAcquired = lessons.reduce((acc, lesson) => 
    acc + lesson.statsData.skillAcquired, 0);
  
  const skillsNotAcquired = lessons.reduce((acc, lesson) => 
    acc + lesson.statsData.skillNotAcquired, 0);
  
  return {
    studentAverage: Math.round(averageNote * 10) / 10,
    skillAcquired: skillsAcquired,
    skillNotAcquired: skillsNotAcquired,
    remediationCount: lessons.filter(l => l.remediation).length
  };
};
```

**Résultat attendu** :
- Graphiques de progression simulés
- Moyennes calculées dynamiquement
- Indicateurs visuels colorés
- Comparaisons avec objectifs

### 3. Gestion des Leçons (Simulée)
**Déclencheur** : Clic sur "Nouvelle Leçon" ou modification d'une leçon

**Action utilisateur** :
- Ouverture du formulaire de leçon
- Saisie titre, thème, objectifs
- Ajout de ressources pédagogiques
- Définition des critères d'évaluation

**Simulation** :
```typescript
const createLesson = (courseId: string, lessonData: CreateLessonRequest) => {
  const newLesson: Lesson = {
    id: `lesson-${Date.now()}`,
    lessonTitle: lessonData.title,
    theme: lessonData.theme,
    date: new Date().toISOString(),
    teacher: getCurrentUser().name,
    studentCount: getClassSize(courseId),
    statusTags: [
      { label: 'Planifiée', color: 'blue', icon: 'calendar' }
    ],
    statsData: {
      evaluationNote: 0,
      skillAcquired: 0,
      skillNotAcquired: 0,
      studentsToRemediate: 0
    },
    illustrationImage: courseIllustrationImage,
    resources: []
  };
  
  // Ajout à la liste des leçons
  updateCourseData(courseId, { lessons: [...existingLessons, newLesson] });
  return newLesson;
};
```

**Résultat attendu** :
- Toast de succès simulé
- Nouvelle leçon ajoutée à la liste
- Mise à jour des statistiques du cours
- Navigation vers le détail de la leçon

### 4. Évaluation et Notes (Simulée)
**Déclencheur** : Clic sur "Évaluer" dans une leçon

**Action utilisateur** :
- Ouverture de l'interface d'évaluation
- Saisie des notes par élève
- Validation des compétences acquises
- Identification des élèves en difficulté

**Simulation** :
```typescript
const evaluateLesson = (lessonId: string, evaluations: StudentEvaluation[]) => {
  const averageNote = evaluations.reduce((acc, eval) => 
    acc + eval.note, 0) / evaluations.length;
  
  const skillsAcquired = evaluations.filter(eval => 
    eval.competencesAcquises.length > eval.competencesNonAcquises.length).length;
  
  const studentsToRemediate = evaluations.filter(eval => 
    eval.note < 10 || eval.competencesNonAcquises.length > 2).length;
  
  // Mise à jour des statistiques de la leçon
  updateLessonStats(lessonId, {
    evaluationNote: averageNote,
    skillAcquired: skillsAcquired,
    skillNotAcquired: evaluations.length - skillsAcquired,
    studentsToRemediate
  });
  
  // Génération automatique de remédiation si nécessaire
  if (studentsToRemediate > 0) {
    generateRemediationSuggestion(lessonId, evaluations);
  }
};
```

**Résultat attendu** :
- Mise à jour des statistiques en temps réel
- Génération automatique de suggestions de remédiation
- Mise à jour des tags de statut de la leçon
- Notification des élèves en difficulté

### 5. Gestion des Remédiations (Simulée)
**Déclencheur** : Détection d'élèves en difficulté ou création manuelle

**Simulation** :
```typescript
const createRemediation = (lessonId: string, studentsInDifficulty: string[]) => {
  const remediation = {
    id: `remediation-${Date.now()}`,
    title: `Remédiation - ${getLessonTitle(lessonId)}`,
    subject: getLessonSubject(lessonId),
    time: generateNextAvailableSlot(),
    teacher: getCurrentUser().name,
    teacherImage: getCurrentUser().avatar,
    statusText: 'Planifiée',
    statusColor: 'orange',
    studentsIds: studentsInDifficulty,
    competencesToReview: getFailedCompetences(lessonId, studentsInDifficulty)
  };
  
  // Ajout à la leçon
  updateLesson(lessonId, { remediation });
  
  // Notification aux élèves concernés
  notifyStudents(studentsInDifficulty, remediation);
  
  return remediation;
};
```

**Résultat attendu** :
- Création automatique de session de remédiation
- Planning automatique selon disponibilités
- Notification des élèves concernés
- Mise à jour du tableau de bord enseignant

## Points de Validation

### Fonctionnels
- [x] Interface pédagogique complète
- [x] Calculs statistiques corrects
- [x] Workflow d'évaluation cohérent
- [x] Génération automatique de remédiations
- [x] Suivi de progression par compétences

### Techniques
- [x] Code TypeScript typé avec interfaces complexes
- [x] Calculs statistiques optimisés
- [x] Gestion d'état React avancée
- [x] Composants réutilisables (graphiques, cartes)
- [x] Performance acceptable pour les calculs

### UX/UI
- [x] Interface intuitive pour les enseignants
- [x] Visualisations statistiques claires
- [x] Workflow d'évaluation fluide
- [x] Feedback visuel pour les actions
- [x] Design responsive et accessible

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Validation des évaluations
const validateEvaluation = (evaluation: StudentEvaluation) => {
  if (evaluation.note < 0 || evaluation.note > 20) {
    throw new Error('La note doit être comprise entre 0 et 20');
  }
  if (evaluation.competencesAcquises.length === 0 && evaluation.note >= 10) {
    throw new Error('Au moins une compétence doit être acquise pour une note >= 10');
  }
};

// Simulation d'erreurs de sauvegarde
const simulateEvaluationError = () => {
  if (Math.random() < 0.02) { // 2% d'erreurs
    throw new Error('Erreur lors de la sauvegarde des évaluations');
  }
};

// Erreurs de génération de remédiation
const validateRemediationCreation = (studentsCount: number) => {
  if (studentsCount > 15) {
    throw new Error('Impossible de créer une remédiation pour plus de 15 élèves');
  }
  if (studentsCount === 0) {
    throw new Error('Aucun élève sélectionné pour la remédiation');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Validation Notes | Vérification 0-20 | Messages d'erreur sur champs |
| Compétences | Cohérence notes/compétences | Alerte de validation |
| Sauvegarde | Échec aléatoire 2% | Toast d'erreur + retry |
| Remédiation | Limite nombre d'élèves | Modal d'information |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isEvaluating, setIsEvaluating] = useState(false);
const [isGeneratingRemediation, setIsGeneratingRemediation] = useState(false);

const simulateEvaluationSave = async (evaluations: StudentEvaluation[]) => {
  setIsEvaluating(true);
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulation calculs
  setIsEvaluating(false);
};
```

### Empty States
```typescript
// Aucune leçon dans le cours
if (course.lessons.length === 0) {
  return (
    <div className="text-center py-12">
      <BookText className="mx-auto h-12 w-12 text-gray-400" />
      <h3>Aucune leçon créée</h3>
      <p>Commencez par créer votre première leçon</p>
      <Button onClick={() => setShowCreateLesson(true)}>
        Créer une leçon
      </Button>
    </div>
  );
}
```

## Données Mockées

### Structure des Données
```typescript
interface Lesson {
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

// Générateur de données de test
const generateMockLesson = (courseId: string): Lesson => ({
  id: `lesson-${Date.now()}-${Math.random()}`,
  lessonTitle: faker.lorem.words(3),
  theme: faker.lorem.words(2),
  date: faker.date.recent().toISOString(),
  teacher: faker.name.fullName(),
  studentCount: faker.datatype.number({ min: 15, max: 35 }),
  statusTags: generateStatusTags(),
  statsData: {
    evaluationNote: faker.datatype.number({ min: 8, max: 18, precision: 0.1 }),
    skillAcquired: faker.datatype.number({ min: 10, max: 30 }),
    skillNotAcquired: faker.datatype.number({ min: 2, max: 8 }),
    studentsToRemediate: faker.datatype.number({ min: 0, max: 5 })
  },
  illustrationImage: courseIllustrationImage,
  resources: generateMockResources()
});
```

### Données de Test Actuelles
- **Cours multiples** avec leçons variées
- **Statistiques réalistes** basées sur des moyennes scolaires
- **Images d'illustration** communes
- **Ressources pédagogiques** mockées
- **Remédiations** générées automatiquement

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec schémas pédagogiques
- [ ] **Endpoints** : Implémenter CRUD cours/leçons/évaluations
- [ ] **Calculs** : Migrer statistiques côté serveur
- [ ] **Ressources** : Système de gestion de fichiers
- [ ] **Notifications** : Alertes automatiques pour remédiations
- [ ] **Compétences** : Intégration avec référentiel de compétences

### Plan de Migration
```typescript
// Étape 1 : Interface service pédagogique
interface PedagogyService {
  getCourse(id: string): Promise<Course>;
  createLesson(courseId: string, data: CreateLessonRequest): Promise<Lesson>;
  evaluateLesson(lessonId: string, evaluations: StudentEvaluation[]): Promise<LessonStats>;
  createRemediation(lessonId: string, studentIds: string[]): Promise<Remediation>;
  getCourseStats(courseId: string): Promise<CourseStats>;
}

// Étape 2 : Hooks React Query
const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => pedagogyService.getCourse(courseId),
  });
};

const useEvaluateLesson = () => {
  return useMutation({
    mutationFn: ({ lessonId, evaluations }) => 
      pedagogyService.evaluateLesson(lessonId, evaluations),
    onSuccess: () => {
      queryClient.invalidateQueries(['course']);
      queryClient.invalidateQueries(['lesson-stats']);
    }
  });
};
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Statistiques** | Calculées côté client | Pré-calculées serveur |
| **Évaluations** | Stockage local temporaire | Base de données persistante |
| **Ressources** | Images statiques | Système de fichiers complet |
| **Notifications** | Simulées | Emails/SMS automatiques |
| **Compétences** | Liste hardcodée | Référentiel dynamique |

## Limitations Connues

### Fonctionnelles
- **Données** : Pas de persistance entre sessions
- **Calculs** : Statistiques simplifiées
- **Ressources** : Pas de gestion de fichiers réelle
- **Collaboration** : Pas de partage entre enseignants

### Techniques
- **Performance** : Calculs côté client pour grandes classes
- **Concurrence** : Pas de gestion des modifications simultanées
- **Validation** : Règles pédagogiques simplifiées
- **Intégrations** : Pas de lien avec systèmes de notes

## Roadmap API

### Priorité Haute 🔴
- **CRUD Cours/Leçons** : Q1 2025
- **Système d'évaluation** : Q1 2025
- **Calculs statistiques** : Q1 2025

### Priorité Moyenne 🟡
- **Gestion des ressources** : Q2 2025
- **Système de remédiation** : Q2 2025
- **Notifications automatiques** : Q2 2025

### Priorité Basse 🟢
- **Analytics avancées** : Q3 2025
- **Collaboration enseignants** : Q3 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "@faker-js/faker": "^8.0.0",
  "dayjs": "^1.11.0",
  "lucide-react": "^0.263.1"
}
```

### Configuration
```typescript
// Paramètres pédagogiques
const EVALUATION_SCALE = { min: 0, max: 20 };
const REMEDIATION_THRESHOLD = 10;
const MAX_STUDENTS_PER_REMEDIATION = 15;
```

---

*Workflow documenté le : 11 octobre 2025*  
*Migration API prévue : Q1 2025*  
*Auteur : Équipe EdConnekt Frontend*
