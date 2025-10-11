# Élèves - Gestion des Notes et Bulletins (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock

**Description** : Interface élève pour consulter les notes, bulletins, moyennes et progression académique. Permet aux élèves et parents de suivre les résultats scolaires avec des visualisations graphiques et des analyses de performance.

**Type de données** : Mockées / Simulées  
**Source des données** : 
- Fichier TypeScript statique (`mock-student-notes.ts`)
- Générateurs de notes réalistes
- Calculs de moyennes côté client
- Données de progression simulées

## Prérequis

### Rôles Utilisateur
- [ ] Admin Staff
- [ ] Enseignant  
- [x] Élève
- [x] Parent (via compte élève)
- [ ] Admin

### Permissions Requises
- `notes.read` : Lecture des notes personnelles (simulée)
- `bulletins.read` : Accès aux bulletins (simulée)
- `progression.read` : Suivi de progression

### État Initial du Système
- Utilisateur authentifié avec rôle Élève
- Données de notes mockées initialisées
- Moyennes pré-calculées par matière
- Graphiques de progression générés

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/eleves/MesNotesPage.tsx`  
**Route** : `/eleve/mes-notes`  
**Navigation** : Menu Élève → Mes Notes

**Action utilisateur** :
- Clic sur "Mes Notes" dans le menu élève
- Accès depuis le tableau de bord
- Navigation depuis une notification de nouvelle note

**Source des données** :
```typescript
// Import des données mockées
import { mockStudentNotes, StudentNote, SubjectAverage } from '../lib/mock-student-notes';

// Structure des données
interface StudentNote {
  id: string;
  subjectId: string;
  subjectName: string;
  evaluationType: 'devoir' | 'controle' | 'examen' | 'oral';
  title: string;
  note: number;
  noteMax: number;
  coefficient: number;
  date: string;
  teacher: string;
  competences: CompetenceEvaluation[];
  comment?: string;
}

interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  average: number;
  noteCount: number;
  trend: 'up' | 'down' | 'stable';
  lastEvaluation: string;
}
```

**Résultat attendu** :
- Affichage du tableau de bord des notes
- Moyennes par matière avec tendances
- Graphique de progression temporelle
- Dernières évaluations en surbrillance

### 2. Visualisation des Notes par Matière (Simulé)
**Déclencheur** : Sélection d'une matière ou filtre par période

**Action utilisateur** :
- Clic sur une carte de matière
- Sélection d'un trimestre/semestre
- Filtrage par type d'évaluation

**Simulation** :
```typescript
const getSubjectNotes = (subjectId: string, period?: string) => {
  let notes = mockStudentNotes.filter(note => note.subjectId === subjectId);
  
  if (period) {
    const periodStart = getPeriodStart(period);
    const periodEnd = getPeriodEnd(period);
    notes = notes.filter(note => 
      new Date(note.date) >= periodStart && 
      new Date(note.date) <= periodEnd
    );
  }
  
  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const calculateSubjectAverage = (notes: StudentNote[]) => {
  const totalPoints = notes.reduce((sum, note) => 
    sum + (note.note / note.noteMax) * 20 * note.coefficient, 0);
  const totalCoefficients = notes.reduce((sum, note) => sum + note.coefficient, 0);
  
  return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
};
```

**Résultat attendu** :
- Liste détaillée des notes de la matière
- Moyenne calculée avec coefficients
- Graphique d'évolution des notes
- Comparaison avec la moyenne de classe (simulée)

### 3. Analyse de Performance (Simulée)
**Déclencheur** : Clic sur "Analyse de Performance" ou onglet dédié

**Simulation** :
```typescript
const generatePerformanceAnalysis = (notes: StudentNote[]) => {
  const subjectAverages = calculateAveragesBySubject(notes);
  const overallAverage = calculateOverallAverage(subjectAverages);
  
  const strengths = subjectAverages
    .filter(avg => avg.average >= overallAverage + 2)
    .map(avg => avg.subjectName);
  
  const weaknesses = subjectAverages
    .filter(avg => avg.average <= overallAverage - 2)
    .map(avg => avg.subjectName);
  
  const trends = subjectAverages.map(avg => ({
    subject: avg.subjectName,
    trend: calculateTrend(avg.subjectId, notes),
    evolution: calculateEvolution(avg.subjectId, notes)
  }));
  
  return {
    overallAverage,
    strengths,
    weaknesses,
    trends,
    recommendations: generateRecommendations(strengths, weaknesses)
  };
};
```

**Résultat attendu** :
- Analyse automatique des points forts/faibles
- Tendances par matière avec graphiques
- Recommandations personnalisées
- Comparaisons avec objectifs fixés

### 4. Génération de Bulletin (Simulée)
**Déclencheur** : Clic sur "Télécharger Bulletin" ou fin de période

**Simulation** :
```typescript
const generateBulletin = (studentId: string, period: string) => {
  const periodNotes = getNotesForPeriod(studentId, period);
  const subjectAverages = calculateAveragesBySubject(periodNotes);
  const overallAverage = calculateOverallAverage(subjectAverages);
  
  const bulletin = {
    studentInfo: getStudentInfo(studentId),
    period: period,
    generatedDate: new Date().toISOString(),
    subjectResults: subjectAverages.map(avg => ({
      ...avg,
      classAverage: generateClassAverage(avg.subjectId), // Simulée
      rank: generateRank(avg.average, avg.subjectId), // Simulé
      teacherComment: generateTeacherComment(avg.average),
      competences: getCompetencesSummary(avg.subjectId, periodNotes)
    })),
    overallResults: {
      average: overallAverage,
      classAverage: generateOverallClassAverage(),
      rank: generateOverallRank(overallAverage),
      appreciation: generateGeneralAppreciation(overallAverage)
    },
    absences: generateAbsencesSummary(studentId, period),
    nextObjectives: generateObjectives(subjectAverages)
  };
  
  return bulletin;
};
```

**Résultat attendu** :
- Bulletin PDF généré automatiquement
- Moyennes détaillées par matière
- Appréciations et commentaires simulés
- Objectifs pour la période suivante

### 5. Suivi de Progression (Simulé)
**Déclencheur** : Navigation vers l'onglet "Progression"

**Simulation** :
```typescript
const generateProgressionData = (notes: StudentNote[]) => {
  const monthlyAverages = calculateMonthlyAverages(notes);
  const competenceProgress = calculateCompetenceProgress(notes);
  
  return {
    timelineData: monthlyAverages.map(month => ({
      period: month.period,
      average: month.average,
      target: 12, // Objectif fixé
      improvement: month.average - (month.previousAverage || month.average)
    })),
    competenceRadar: competenceProgress.map(comp => ({
      competence: comp.name,
      level: comp.acquisitionLevel,
      maxLevel: 4,
      evaluationCount: comp.evaluationCount
    })),
    milestones: generateMilestones(monthlyAverages),
    predictions: generateProgressionPredictions(monthlyAverages)
  };
};
```

**Résultat attendu** :
- Graphique temporel de progression
- Radar des compétences acquises
- Jalons et objectifs atteints
- Prédictions de performance future

## Points de Validation

### Fonctionnels
- [x] Interface complète de consultation des notes
- [x] Calculs de moyennes corrects avec coefficients
- [x] Analyses de performance automatiques
- [x] Génération de bulletins simulée
- [x] Suivi de progression temporelle

### Techniques
- [x] Code TypeScript typé avec interfaces complexes
- [x] Calculs statistiques optimisés
- [x] Génération de graphiques performante
- [x] Composants réutilisables (tableaux, graphiques)
- [x] Gestion d'état React efficace

### UX/UI
- [x] Interface intuitive pour les élèves
- [x] Visualisations claires et engageantes
- [x] Navigation fluide entre les vues
- [x] Design responsive et accessible
- [x] Feedback motivant pour les élèves

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Validation des notes
const validateNote = (note: StudentNote) => {
  if (note.note < 0 || note.note > note.noteMax) {
    throw new Error(`Note invalide: ${note.note}/${note.noteMax}`);
  }
  if (note.coefficient <= 0) {
    throw new Error('Le coefficient doit être positif');
  }
};

// Simulation d'erreurs de calcul
const simulateCalculationError = () => {
  if (Math.random() < 0.01) { // 1% d'erreurs
    throw new Error('Erreur de calcul de moyenne');
  }
};

// Erreurs de génération de bulletin
const validateBulletinGeneration = (period: string, notes: StudentNote[]) => {
  if (notes.length === 0) {
    throw new Error('Aucune note disponible pour cette période');
  }
  if (!isValidPeriod(period)) {
    throw new Error('Période invalide pour la génération du bulletin');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Calcul | Erreur moyenne aléatoire 1% | Toast d'erreur + recalcul |
| Données | Notes manquantes | Message "Données indisponibles" |
| Bulletin | Période invalide | Modal d'information |
| Performance | Analyse échouée | Graphiques par défaut |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isCalculatingAverages, setIsCalculatingAverages] = useState(false);
const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false);

const simulateAverageCalculation = async () => {
  setIsCalculatingAverages(true);
  await new Promise(resolve => setTimeout(resolve, 800));
  setIsCalculatingAverages(false);
};
```

### Empty States
```typescript
// Aucune note disponible
if (studentNotes.length === 0) {
  return (
    <div className="text-center py-12">
      <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
      <h3>Aucune note disponible</h3>
      <p>Vos notes apparaîtront ici dès qu'elles seront saisies</p>
    </div>
  );
}
```

## Données Mockées

### Structure des Données
```typescript
interface StudentNote {
  id: string;
  subjectId: string;
  subjectName: string;
  evaluationType: 'devoir' | 'controle' | 'examen' | 'oral';
  title: string;
  note: number;
  noteMax: number;
  coefficient: number;
  date: string;
  teacher: string;
  competences: CompetenceEvaluation[];
  comment?: string;
}

// Générateur de notes réalistes
const generateMockNote = (subjectId: string): StudentNote => {
  const noteMax = faker.helpers.arrayElement([10, 20]);
  const baseNote = faker.datatype.number({ min: 6, max: noteMax });
  
  return {
    id: `note-${Date.now()}-${Math.random()}`,
    subjectId,
    subjectName: getSubjectName(subjectId),
    evaluationType: faker.helpers.arrayElement(['devoir', 'controle', 'examen', 'oral']),
    title: faker.lorem.words(3),
    note: baseNote,
    noteMax,
    coefficient: faker.helpers.arrayElement([1, 2, 3]),
    date: faker.date.recent({ days: 90 }).toISOString(),
    teacher: faker.name.fullName(),
    competences: generateCompetenceEvaluations(),
    comment: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
  };
};
```

### Données de Test Actuelles
- **Notes variées** sur 3 mois glissants
- **Matières multiples** avec coefficients différents
- **Types d'évaluations** diversifiés
- **Compétences** associées aux notes
- **Commentaires** enseignants simulés

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec système de notes
- [ ] **Endpoints** : Implémenter lecture notes/bulletins
- [ ] **Calculs** : Migrer moyennes côté serveur
- [ ] **Bulletins** : Système de génération PDF
- [ ] **Notifications** : Alertes nouvelles notes
- [ ] **Permissions** : Accès parent/élève sécurisé

### Plan de Migration
```typescript
// Étape 1 : Interface service notes
interface NotesService {
  getStudentNotes(studentId: string, period?: string): Promise<StudentNote[]>;
  getSubjectAverage(studentId: string, subjectId: string): Promise<SubjectAverage>;
  generateBulletin(studentId: string, period: string): Promise<Bulletin>;
  getProgressionData(studentId: string): Promise<ProgressionData>;
}

// Étape 2 : Hooks React Query
const useStudentNotes = (studentId: string, period?: string) => {
  return useQuery({
    queryKey: ['student-notes', studentId, period],
    queryFn: () => notesService.getStudentNotes(studentId, period),
  });
};
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Calculs** | Côté client | Serveur avec cache |
| **Bulletins** | Génération simulée | PDF réel avec template |
| **Notifications** | Aucune | Push/Email automatiques |
| **Permissions** | Simulées | RBAC complet parent/élève |
| **Historique** | 3 mois | Toute la scolarité |

## Limitations Connues

### Fonctionnelles
- **Données** : Historique limité à 3 mois
- **Bulletins** : Pas de génération PDF réelle
- **Comparaisons** : Moyennes de classe simulées
- **Notifications** : Pas d'alertes automatiques

### Techniques
- **Performance** : Calculs côté client pour grandes listes
- **Persistance** : Pas de sauvegarde entre sessions
- **Synchronisation** : Pas de mise à jour temps réel
- **Sécurité** : Pas de contrôle d'accès réel

## Roadmap API

### Priorité Haute 🔴
- **API Notes** : Q1 2025
- **Calculs moyennes** : Q1 2025
- **Génération bulletins** : Q1 2025

### Priorité Moyenne 🟡
- **Notifications** : Q2 2025
- **Accès parents** : Q2 2025
- **Historique complet** : Q2 2025

### Priorité Basse 🟢
- **Analytics avancées** : Q3 2025
- **Comparaisons inter-établissements** : Q3 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "@faker-js/faker": "^8.0.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "jspdf": "^2.5.1"
}
```

### Configuration
```typescript
// Paramètres de notation
const GRADING_SCALE = { min: 0, max: 20 };
const PASSING_GRADE = 10;
const EXCELLENCE_THRESHOLD = 16;
```

---

*Workflow documenté le : 11 octobre 2025*  
*Migration API prévue : Q1 2025*  
*Auteur : Équipe EdConnekt Frontend*
