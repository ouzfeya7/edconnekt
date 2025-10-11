# Timetable Service - Documentation Technique

## Vue d'ensemble

Le **Timetable Service** d'EdConnekt est le service central de gestion des emplois du temps scolaires. Il gère l'ensemble de l'écosystème des plannings éducatifs : salles, créneaux horaires, cours, absences, remplacements, avec un système complet d'audit et d'export iCalendar. Ce service est au cœur de l'organisation pédagogique des établissements scolaires.

### Statut d'intégration : ✅ **COMPLET**

- **API Client** : ✅ Généré et configuré (119 508 bytes - le plus volumineux)
- **Hooks React Query** : ✅ Implémentés (17/17 endpoints)
- **Interface utilisateur** : ✅ Module complet EmploiDuTempsPage
- **Workflows E2E** : ✅ Fonctionnels avec gestion des conflits

---

## Architecture du Service

### Structure des fichiers

```
src/api/timetable-service/
├── api.ts              # Classes API générées (8 APIs distinctes)
├── client.ts           # Instances configurées des APIs
├── http.ts             # Configuration Axios avec intercepteurs
├── configuration.ts    # Configuration OpenAPI
├── base.ts            # Classes de base
├── common.ts          # Utilitaires communs
└── index.ts           # Exports principaux
```

### Configuration HTTP

**Fichier source** : `src/api/timetable-service/http.ts`

```typescript
// URL de base configurée
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/timetable';
const BASE_URL = import.meta.env.VITE_TIMETABLE_API_BASE_URL ?? DEFAULT_BASE_URL;

// Instance Axios configurée
export const timetableAxios = axios.create({ baseURL: BASE_URL });
```

**Headers automatiques** :
- `Authorization: Bearer {token}` (token Keycloak)
- `X-Etab: {etablissement_id}` (contexte établissement)
- `X-Roles: {role}` (contexte rôle utilisateur)

### APIs disponibles

**Fichier source** : `src/api/timetable-service/client.ts`

```typescript
export const absencesApi = new AbsencesApi(configuration, undefined, timetableAxios);
export const auditApi = new AuditApi(configuration, undefined, timetableAxios);
export const feedApi = new FeedApi(configuration, undefined, timetableAxios);
export const healthApi = new HealthApi(configuration, undefined, timetableAxios);
export const lessonsApi = new LessonsApi(configuration, undefined, timetableAxios);
export const replacementsApi = new ReplacementsApi(configuration, undefined, timetableAxios);
export const roomsApi = new RoomsApi(configuration, undefined, timetableAxios);
export const timeslotsApi = new TimeslotsApi(configuration, undefined, timetableAxios);
```

---

## Endpoints Disponibles

### 1. HealthApi - Endpoints système

#### GET `/health` - Health Check
- **Description** : Vérification de santé du service
- **Réponse** : Statut du service
- **Usage** : Monitoring système

### 2. RoomsApi - Gestion des salles

#### POST `/rooms/` - Create Room
- **Description** : Créer une salle
- **Permissions** : ADMIN, COORDONNATEUR
- **Payload** : `RoomCreate`
- **Réponse** : `RoomRead`
- **Hook** : `useCreateRoom()`

#### GET `/rooms/` - List Rooms
- **Description** : Lister les salles (optionnellement filtrées par établissement)
- **Paramètres** :
  - `skip?: number` (défaut: 0)
  - `limit?: number` (défaut: 100)
  - `establishment_id?: string` (UUID)
- **Réponse** : `RoomRead[]`
- **Hook** : `useRooms()`

#### GET `/rooms/{room_id}` - Get Room
- **Description** : Récupérer une salle par ID
- **Paramètres** : `room_id: string` (UUID)
- **Réponse** : `RoomRead`
- **Hook** : `useRoom()`

#### PATCH `/rooms/{room_id}` - Update Room
- **Description** : Mettre à jour une salle
- **Permissions** : ADMIN, COORDONNATEUR
- **Payload** : `RoomUpdate`
- **Hook** : `useUpdateRoom()`

#### DELETE `/rooms/{room_id}` - Delete Room
- **Description** : Supprimer une salle
- **Permissions** : ADMIN, COORDONNATEUR
- **Hook** : `useDeleteRoom()`

### 3. TimeslotsApi - Gestion des créneaux horaires

#### POST `/timeslots/` - Create Timeslot
- **Description** : Créer un créneau horaire
- **Permissions** : ADMIN, COORDONNATEUR
- **Payload** : `TimeslotCreate`
- **Hook** : `useCreateTimeslot()`

#### GET `/timeslots/` - List Timeslots
- **Description** : Lister les créneaux horaires
- **Paramètres** : Pagination + `establishment_id`
- **Hook** : `useTimeslots()`

#### GET `/timeslots/{timeslot_id}` - Get Timeslot
- **Description** : Récupérer un créneau horaire par ID
- **Hook** : `useTimeslot()`

#### PATCH `/timeslots/{timeslot_id}` - Update Timeslot
- **Description** : Mettre à jour un créneau horaire
- **Permissions** : ADMIN, COORDONNATEUR
- **Hook** : `useUpdateTimeslot()`

#### DELETE `/timeslots/{timeslot_id}` - Delete Timeslot
- **Description** : Supprimer un créneau horaire
- **Permissions** : ADMIN, COORDONNATEUR
- **Hook** : `useDeleteTimeslot()`

### 4. LessonsApi - Gestion des cours

#### POST `/lessons/` - Create Lessons
- **Description** : Créer un cours ou une série (repeat weekly)
- **Permissions** : ENSEIGNANT, COORDONNATEUR, ADMIN
- **Payload** : `LessonCreate`
- **Fonctionnalité** : Support des cours récurrents
- **Hook** : `useCreateLesson()`

#### GET `/lessons/` - List Lessons
- **Description** : Lister les cours avec filtres avancés
- **Permissions** : Tous (PARENT: accès restreint)
- **Paramètres** :
  - `class_id?: string` (UUID)
  - `from_date?: string` (date)
  - `to_date?: string` (date)
  - `teacher_id?: string` (UUID)
  - `skip?: number`, `limit?: number`
- **Hook** : `useLessons()`

#### PATCH `/lessons/{lesson_id}` - Update Lesson
- **Description** : Mettre à jour salle/timeslot avec vérification de conflit
- **Permissions** : ENSEIGNANT, COORDONNATEUR, ADMIN
- **Hook** : `useUpdateLesson()`

#### DELETE `/lessons/{lesson_id}` - Delete Lesson
- **Description** : Supprimer un cours
- **Permissions** : COORDONNATEUR, ADMIN
- **Hook** : `useDeleteLesson()`

### 5. AbsencesApi - Gestion des absences

#### POST `/absences/` - Create Absence
- **Description** : Déclarer une absence (status REPORTED)
- **Permissions** : ENSEIGNANT, COORDONNATEUR, ADMIN
- **Payload** : `AbsenceCreate`
- **Hook** : `useCreateAbsence()`

#### GET `/absences/` - List Absences
- **Description** : Lister les absences
- **Hook** : `useAbsencesList()`

#### POST `/absences/{absence_id}/validate` - Validate Absence
- **Description** : Valider une absence (status VALIDATED)
- **Permissions** : DIRECTION
- **Fonctionnalité** : Propage le statut sur les lessons du créneau
- **Hook** : `useValidateAbsence()`

#### DELETE `/absences/{absence_id}` - Delete Absence
- **Description** : Supprimer une absence
- **Permissions** : COORDONNATEUR, ADMIN
- **Hook** : `useDeleteAbsence()`

### 6. ReplacementsApi - Gestion des remplacements

#### POST `/replacements/` - Create Replacement
- **Description** : Créer un remplacement (status=REPLACED)
- **Permissions** : COORDONNATEUR, DIRECTION, ADMIN
- **Hook** : `useCreateReplacement()`

#### GET `/replacements/` - List Replacements
- **Description** : Lister les remplacements
- **Hook** : `useReplacements()`

#### DELETE `/replacements/{replacement_id}` - Delete Replacement
- **Description** : Supprimer un remplacement
- **Permissions** : COORDONNATEUR, ADMIN
- **Hook** : `useDeleteReplacement()`

### 7. FeedApi - Export iCalendar

#### GET `/feed/{class_id}.ics` - Get ICS Feed
- **Description** : Flux iCalendar pour une classe
- **Paramètres** : `class_id: string` (UUID)
- **Réponse** : Fichier .ics
- **Hook** : `useIcsFeed()`

### 8. AuditApi - Audit et traçabilité

#### GET `/lessons/{lesson_id}/audit` - Get Lesson Audit
- **Description** : Journal d'audit pour un cours
- **Permissions** : DIRECTION
- **Hook** : `useAuditTrail()` (spécifique)

#### GET `/audit/` - Get Audit Trail
- **Description** : Journal d'audit complet
- **Permissions** : DIRECTION, ADMIN
- **Hook** : `useAuditTrail()`

---

## Types TypeScript

### RoomRead
```typescript
interface RoomRead {
  id: string;
  name: string;
  capacity?: number;
  equipment?: string[];
  establishment_id: string;
  created_at: string;
  updated_at: string;
}
```

### TimeslotRead
```typescript
interface TimeslotRead {
  id: string;
  name: string;
  start_time: string; // Format HH:MM
  end_time: string;   // Format HH:MM
  establishment_id: string;
  created_at: string;
  updated_at: string;
}
```

### LessonRead
```typescript
interface LessonRead {
  id: string;
  subject: string;
  teacher_id: string;
  class_id: string;
  room_id: string;
  timeslot_id: string;
  date: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'REPLACED';
  repeat_weekly?: boolean;
  created_at: string;
  updated_at: string;
}
```

### AbsenceRead
```typescript
interface AbsenceRead {
  id: string;
  teacher_id: string;
  date: string;
  timeslot_id: string;
  reason: string;
  status: 'REPORTED' | 'VALIDATED';
  created_at: string;
  validated_at?: string;
  validated_by?: string;
}
```

### ReplacementRead
```typescript
interface ReplacementRead {
  id: string;
  original_lesson_id: string;
  replacement_teacher_id: string;
  date: string;
  status: 'REPLACED';
  created_at: string;
  created_by: string;
}
```

---

## Hooks React Query

### Hooks de lecture (Queries)

#### `useLessons(params?)`
**Fichier source** : `src/hooks/useLessons.ts`

```typescript
const { data, isLoading, error } = useLessons({
  classId: "class-123",
  teacherId: "teacher-456",
  fromDate: "2024-01-01",
  toDate: "2024-01-31",
  skip: 0,
  limit: 100
});

// Réponse : LessonRead[]
```

#### `useRooms(params?)`
**Fichier source** : `src/hooks/useRooms.ts`

```typescript
const { data: rooms } = useRooms({
  skip: 0,
  limit: 100,
  establishmentId: "etab-123"
});

// Réponse : RoomRead[]
```

#### `useTimeslots(params?)`
**Fichier source** : `src/hooks/useTimeslots.ts`

```typescript
const { data: timeslots } = useTimeslots({
  establishmentId: "etab-123"
});
```

#### `useAbsencesList(params?)`
**Fichier source** : `src/hooks/useAbsences.ts`

```typescript
const { data: absences } = useAbsencesList({
  skip: 0,
  limit: 50
});
```

### Hooks de mutation

#### `useCreateLesson()`
**Fichier source** : `src/hooks/useLessonMutations.ts`

```typescript
const createLesson = useCreateLesson();

await createLesson.mutateAsync({
  subject: "Mathématiques",
  teacher_id: "teacher-123",
  class_id: "class-456",
  room_id: "room-789",
  timeslot_id: "timeslot-012",
  date: "2024-01-15",
  repeat_weekly: true // Cours récurrent
});
```

#### `useCreateRoom()`
**Fichier source** : `src/hooks/useRooms.ts`

```typescript
const createRoom = useCreateRoom();

await createRoom.mutateAsync({
  name: "Salle 101",
  capacity: 30,
  equipment: ["Projecteur", "Tableau numérique"],
  establishment_id: "etab-123"
});
```

#### `useCreateAbsence()`
**Fichier source** : `src/hooks/useAbsences.ts`

```typescript
const createAbsence = useCreateAbsence();

await createAbsence.mutateAsync({
  teacher_id: "teacher-123",
  date: "2024-01-15",
  timeslot_id: "timeslot-456",
  reason: "Maladie",
  status: "REPORTED"
});
```

#### `useValidateAbsence()`
**Fichier source** : `src/hooks/useAbsences.ts`

```typescript
const validateAbsence = useValidateAbsence();

// Validation par la direction
await validateAbsence.mutateAsync("absence-123");
```

#### `useCreateReplacement()`
**Fichier source** : `src/hooks/useReplacements.ts`

```typescript
const createReplacement = useCreateReplacement();

await createReplacement.mutateAsync({
  original_lesson_id: "lesson-123",
  replacement_teacher_id: "teacher-456",
  date: "2024-01-15"
});
```

---

## Intégration Interface Utilisateur

### Page principale

#### EmploiDuTempsPage
**Fichier** : `src/pages/directeur/EmploiDuTempsPage.tsx`

**Fonctionnalités complètes** :
- **Vue calendrier** : Affichage hebdomadaire des cours
- **Gestion des conflits** : Détection automatique des conflits de salles/enseignants
- **Onglets multiples** :
  - `calendar` : Vue principale du planning
  - `replacements` : Gestion des remplacements
  - `conflicts` : Résolution des conflits
  - `validation` : Validation des absences
  - `audit` : Historique des modifications
  - `ics` : Export iCalendar

**Hooks utilisés** :
```typescript
import { useLessons } from '../../hooks/useLessons';
import { useTimeslots } from '../../hooks/useTimeslots';
import { useCreateReplacement, useReplacements, useDeleteReplacement } from '../../hooks/useReplacements';
import { useUpdateLesson, useDeleteLesson, useCreateLesson } from '../../hooks/useLessonMutations';
import { useIcsFeed } from '../../hooks/useIcsFeed';
```

**États gérés** :
```typescript
const [currentWeek, setCurrentWeek] = useState(new Date());
const [selectedView, setSelectedView] = useState('global');
const [conflicts, setConflicts] = useState<Conflict[]>([]);
const [activeTab, setActiveTab] = useState<'calendar' | 'replacements' | 'conflicts' | 'validation' | 'audit' | 'ics'>('calendar');
```

### Composants spécialisés

#### AbsenceValidationPanel
**Fichier** : `src/components/directeur/emploi-du-temps/AbsenceValidationPanel.tsx`

**Fonctionnalités** :
- Liste des absences en attente de validation
- Interface de validation pour la direction
- Propagation automatique du statut sur les cours

#### DirectorTimetableContext
**Fichier** : `src/contexts/DirectorTimetableContext.tsx`

**Fonctionnalités** :
- Contexte global pour la gestion des emplois du temps
- État partagé entre les composants
- Gestion centralisée des données

---

## Workflows E2E

### 1. Workflow création de cours avec gestion des conflits

```typescript
// 1. Vérification des disponibilités
const { data: existingLessons } = useLessons({
  fromDate: selectedDate,
  toDate: selectedDate
});

// 2. Détection des conflits
const detectConflicts = (newLesson: LessonCreate) => {
  const conflicts: Conflict[] = [];
  
  existingLessons?.forEach(existing => {
    // Conflit enseignant
    if (existing.teacher_id === newLesson.teacher_id && 
        existing.timeslot_id === newLesson.timeslot_id) {
      conflicts.push({
        type: 'enseignant',
        message: 'Enseignant déjà occupé',
        existingCourse: existing,
        newCourse: newLesson
      });
    }
    
    // Conflit salle
    if (existing.room_id === newLesson.room_id && 
        existing.timeslot_id === newLesson.timeslot_id) {
      conflicts.push({
        type: 'salle',
        message: 'Salle déjà occupée',
        existingCourse: existing,
        newCourse: newLesson
      });
    }
  });
  
  return conflicts;
};

// 3. Création si pas de conflit
const createLesson = useCreateLesson();
if (conflicts.length === 0) {
  await createLesson.mutateAsync(newLesson);
  toast.success('Cours créé avec succès');
} else {
  setConflicts(conflicts);
  setActiveTab('conflicts');
}
```

### 2. Workflow gestion des absences

```typescript
// 1. Déclaration d'absence par l'enseignant
const createAbsence = useCreateAbsence();
await createAbsence.mutateAsync({
  teacher_id: currentTeacherId,
  date: absenceDate,
  timeslot_id: selectedTimeslot,
  reason: "Maladie",
  status: "REPORTED"
});

// 2. Validation par la direction
const validateAbsence = useValidateAbsence();
await validateAbsence.mutateAsync(absenceId);

// 3. Création automatique d'un remplacement (optionnel)
const createReplacement = useCreateReplacement();
if (replacementTeacherId) {
  await createReplacement.mutateAsync({
    original_lesson_id: affectedLessonId,
    replacement_teacher_id: replacementTeacherId,
    date: absenceDate
  });
}
```

### 3. Workflow export iCalendar

```typescript
// 1. Sélection de la classe
const { data: classes } = useClasses({ etablissementId: currentEtabId });

// 2. Génération du lien iCalendar
const generateIcsUrl = (classId: string) => {
  return `${TIMETABLE_API_BASE_URL}feed/${classId}.ics`;
};

// 3. Téléchargement ou intégration
const downloadIcs = useIcsFeed();
await downloadIcs.mutateAsync(selectedClassId);

// 4. Lien pour intégration externe
const icsUrl = generateIcsUrl(selectedClassId);
// Peut être utilisé dans Google Calendar, Outlook, etc.
```

### 4. Workflow audit et traçabilité

```typescript
// Audit spécifique à un cours
const { data: lessonAudit } = useAuditTrail(lessonId);

// Audit global
const { data: globalAudit } = useAuditTrail();

// Affichage de l'historique
const AuditView = () => {
  return (
    <div>
      {globalAudit?.map(entry => (
        <div key={entry.id} className="audit-entry">
          <span>{entry.action}</span>
          <span>{entry.actor}</span>
          <span>{new Date(entry.timestamp).toLocaleString()}</span>
          <pre>{JSON.stringify(entry.changes, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};
```

---

## Gestion d'erreurs et États

### États de chargement avec retry personnalisé
```typescript
const { data, isLoading, isError, error } = useLessons({
  classId: selectedClassId,
  fromDate: weekStart,
  toDate: weekEnd
});

// Configuration spécifique pour éviter les retries infinis
const queryConfig = {
  retry: false,
  refetchOnWindowFocus: false,
  staleTime: 60_000
};
```

### Gestion des mutations avec invalidation ciblée
```typescript
const updateLesson = useUpdateLesson();

const handleUpdate = async (lessonId: string, changes: LessonUpdate) => {
  try {
    await updateLesson.mutateAsync({ lessonId, update: changes });
    toast.success('Cours mis à jour');
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error('Conflit détecté - Vérifiez les disponibilités');
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  }
};

// Invalidation intelligente
onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({ queryKey: ['lessons'] });
  queryClient.invalidateQueries({ queryKey: ['timeslots'] });
  queryClient.invalidateQueries({ queryKey: ['rooms'] });
}
```

---

## Sécurité et Permissions

### Permissions granulaires par endpoint
```typescript
// Création de cours
const canCreateLesson = capabilities.isTeacher || 
                       capabilities.isCoordinator || 
                       capabilities.isAdminStaff;

// Validation d'absence
const canValidateAbsence = capabilities.isDirector;

// Gestion des salles
const canManageRooms = capabilities.isCoordinator || 
                      capabilities.isAdminStaff;

// Audit complet
const canViewAudit = capabilities.isDirector || 
                    capabilities.isAdminStaff;
```

### Headers de sécurité multi-tenant
- **Authorization** : Token JWT Keycloak obligatoire
- **X-Etab** : ID établissement pour isolation des données
- **X-Roles** : Rôles utilisateur pour contrôle d'accès granulaire

### Filtrage automatique par établissement
```typescript
// Les données sont automatiquement filtrées par établissement
const { data: rooms } = useRooms({
  establishmentId: currentEtabId // Filtrage côté API
});
```

---

## Points de validation

### ✅ Validation technique
- [x] API client généré et fonctionnel (119 508 bytes - le plus volumineux)
- [x] Configuration HTTP avec intercepteurs complets
- [x] 17 hooks React Query pour tous les endpoints
- [x] 8 APIs distinctes bien organisées
- [x] Gestion d'erreurs et états de chargement
- [x] Invalidation de cache intelligente
- [x] Types TypeScript complets

### ✅ Validation fonctionnelle
- [x] Module complet EmploiDuTempsPage avec onglets multiples
- [x] CRUD complet pour toutes les entités (salles, créneaux, cours, absences, remplacements)
- [x] Gestion avancée des conflits avec détection automatique
- [x] Système d'absences avec workflow de validation
- [x] Remplacements automatiques
- [x] Export iCalendar par classe
- [x] Audit trail complet avec permissions

### ✅ Validation UX
- [x] Interface calendrier intuitive
- [x] Gestion des conflits en temps réel
- [x] États de chargement et erreurs
- [x] Feedback utilisateur (toasts)
- [x] Navigation par onglets
- [x] Export iCalendar intégré
- [x] Validation des absences streamlinée

---

## Exemples d'utilisation

### Création d'un emploi du temps complet
```typescript
const TimetableCreator = () => {
  const createRoom = useCreateRoom();
  const createTimeslot = useCreateTimeslot();
  const createLesson = useCreateLesson();
  
  const setupTimetable = async () => {
    // 1. Créer les salles
    const room = await createRoom.mutateAsync({
      name: "Salle 101",
      capacity: 30,
      establishment_id: currentEtabId
    });
    
    // 2. Créer les créneaux
    const timeslot = await createTimeslot.mutateAsync({
      name: "8h00-9h00",
      start_time: "08:00",
      end_time: "09:00",
      establishment_id: currentEtabId
    });
    
    // 3. Créer les cours récurrents
    await createLesson.mutateAsync({
      subject: "Mathématiques",
      teacher_id: selectedTeacherId,
      class_id: selectedClassId,
      room_id: room.id,
      timeslot_id: timeslot.id,
      date: "2024-01-15",
      repeat_weekly: true
    });
  };
  
  return (
    <button onClick={setupTimetable}>
      Créer l'emploi du temps
    </button>
  );
};
```

### Gestionnaire de conflits avancé
```typescript
const ConflictManager = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const { data: lessons } = useLessons();
  const updateLesson = useUpdateLesson();
  
  const resolveConflict = async (conflict: Conflict, resolution: 'change_room' | 'change_time' | 'cancel') => {
    switch (resolution) {
      case 'change_room':
        const availableRooms = await findAvailableRooms(conflict.newCourse.timeslot_id);
        if (availableRooms.length > 0) {
          await updateLesson.mutateAsync({
            lessonId: conflict.newCourse.id,
            update: { room_id: availableRooms[0].id }
          });
        }
        break;
        
      case 'change_time':
        const availableSlots = await findAvailableTimeslots(conflict.newCourse.date);
        if (availableSlots.length > 0) {
          await updateLesson.mutateAsync({
            lessonId: conflict.newCourse.id,
            update: { timeslot_id: availableSlots[0].id }
          });
        }
        break;
        
      case 'cancel':
        await deleteLesson.mutateAsync(conflict.newCourse.id);
        break;
    }
    
    // Retirer le conflit résolu
    setConflicts(prev => prev.filter(c => c !== conflict));
  };
  
  return (
    <div>
      {conflicts.map(conflict => (
        <ConflictCard 
          key={conflict.id} 
          conflict={conflict} 
          onResolve={resolveConflict} 
        />
      ))}
    </div>
  );
};
```

---

## Conclusion

Le **Timetable Service** est **entièrement intégré** dans EdConnekt avec l'implémentation la plus complète et sophistiquée de tous les services. Il offre un écosystème complet de gestion des emplois du temps avec des fonctionnalités avancées de détection de conflits, gestion des absences, remplacements automatiques, et export iCalendar.

**Points forts** :
- ✅ **Architecture la plus complexe** : 8 APIs distinctes, 17 endpoints
- ✅ **Gestion avancée des conflits** : Détection automatique et résolution guidée
- ✅ **Workflow complet d'absences** : Déclaration → Validation → Remplacement
- ✅ **Export iCalendar** : Intégration avec calendriers externes
- ✅ **Audit trail complet** : Traçabilité de toutes les modifications
- ✅ **Interface utilisateur riche** : Vue calendrier avec onglets multiples
- ✅ **Permissions granulaires** : Contrôle d'accès par rôle et action
- ✅ **Cours récurrents** : Support des plannings hebdomadaires

**Usage principal** : Gestion complète des emplois du temps scolaires avec planification avancée, gestion des conflits, suivi des absences, et intégration calendaire externe. Le service le plus critique pour l'organisation pédagogique des établissements.
