# Architecture de l'Interface Directeur - EdConnect

## Vue d'ensemble

L'interface directeur d'EdConnect suit une architecture basée sur les composants React avec gestion d'état centralisée via les Context API. Cette approche facilite l'intégration future avec les microservices et améliore la maintenabilité du code.

## Structure du Projet

```
src/
├── components/
│   └── directeur/
│       ├── common/           # Composants réutilisables
│       │   ├── KPICard.tsx
│       │   ├── AlertCard.tsx
│       │   ├── FilterPanel.tsx
│       │   ├── StatsCard.tsx
│       │   └── ActionButton.tsx
│       ├── dashboard/        # Composants spécifiques au dashboard
│       │   └── DashboardKPIs.tsx
│       ├── onboarding/       # Composants spécifiques à l'onboarding
│       │   ├── CSVUploader.tsx
│       │   ├── InvitationList.tsx
│       │   ├── OnboardingSummary.tsx
│       │   └── ValidationErrors.tsx
│       ├── alertes/          # Composants spécifiques aux alertes
│       │   ├── AlertList.tsx
│       │   └── AlertStats.tsx
│       ├── emploi-du-temps/  # Composants spécifiques à l'emploi du temps
│       │   ├── ScheduleGrid.tsx
│       │   └── ScheduleForm.tsx
│       └── parametres/       # Composants spécifiques aux paramètres
│           ├── SchoolSettingsForm.tsx
│           └── CycleManagement.tsx
├── contexts/                 # Gestion d'état globale
│   ├── DirectorContext.tsx
│   ├── OnboardingContext.tsx
│   ├── AlertContext.tsx
│   ├── ScheduleContext.tsx
│   └── SettingsContext.tsx
├── pages/
│   └── directeur/           # Pages principales
│       ├── DirecteurDashboard.tsx
│       ├── OnboardingPage.tsx
│       ├── CentreAlertesPage.tsx
│       ├── EmploiDuTempsPage.tsx
│       ├── ReferentielsPage.tsx
│       └── ParametresPage.tsx
└── config/
    └── navigation.tsx       # Configuration de navigation
```

## Architecture des Contextes

### 1. DirectorContext
**Responsabilité** : Gestion des données du dashboard directeur
- **États** : `kpiData`, `levelStats`, `isRefreshing`, `lastUpdate`
- **Fonctions** : `refreshData()`, `isKPICritical()`
- **Données** : KPIs, statistiques par niveau, logique de rafraîchissement

### 2. OnboardingContext
**Responsabilité** : Gestion de l'import CSV et des invitations
- **États** : `selectedFile`, `previewData`, `validationErrors`, `summaryData`, `invitations`
- **Fonctions** : `validateCSVData()`, `handleUpload()`, `resendInvitation()`
- **Données** : Validation CSV, résumé d'import, liste des invitations

### 3. AlertContext
**Responsabilité** : Gestion des alertes et notifications
- **États** : `alertes`, `alertesFiltrees`, `filters`, `selectedAlert`
- **Fonctions** : `addAlert()`, `resolveAlert()`, `assignAlert()`, `getAlertStats()`
- **Données** : Liste des alertes, filtres, statistiques

### 4. ScheduleContext
**Responsabilité** : Gestion de l'emploi du temps
- **États** : `courses`, `conflicts`, `filters`, `showConflicts`
- **Fonctions** : `addCourse()`, `detectConflicts()`, `exportSchedule()`
- **Données** : Cours, conflits, filtres, statistiques

### 5. SettingsContext
**Responsabilité** : Gestion des paramètres de l'établissement
- **États** : `schoolSettings`, `cycles`, `userProfile`, `notificationSettings`
- **Fonctions** : `updateSchoolSettings()`, `addCycle()`, `uploadLogo()`
- **Données** : Configuration école, cycles, profil utilisateur

## Composants Réutilisables

### Composants Common
- **KPICard** : Affichage d'un indicateur clé de performance
- **AlertCard** : Affichage d'une alerte avec actions
- **FilterPanel** : Panneau de filtres réutilisable
- **StatsCard** : Carte de statistiques avec tendance
- **ActionButton** : Bouton d'action avec icône et description

### Composants Spécifiques par Page

#### Dashboard
- **DashboardKPIs** : Grille des KPIs du directeur

#### Onboarding
- **CSVUploader** : Upload et prévisualisation de fichiers CSV
- **InvitationList** : Liste des invitations utilisateurs
- **OnboardingSummary** : Résumé de l'import CSV
- **ValidationErrors** : Affichage des erreurs de validation

#### Alertes
- **AlertList** : Liste des alertes avec filtrage
- **AlertStats** : Statistiques des alertes

#### Emploi du Temps
- **ScheduleGrid** : Grille d'affichage de l'emploi du temps
- **ScheduleForm** : Formulaire d'ajout/modification de cours

#### Paramètres
- **SchoolSettingsForm** : Configuration de l'établissement
- **CycleManagement** : Gestion des cycles scolaires

## Flux de Données

```
Context Provider → Hook (useContext) → Component → UI
     ↓
API Service (futur) → Context → State Update → Re-render
```

### Exemple de Flux
1. **Action utilisateur** : Clic sur "Ajouter un cours"
2. **Composant** : `ScheduleForm` appelle `addCourse()` du contexte
3. **Context** : `ScheduleContext` met à jour l'état `courses`
4. **Re-render** : `ScheduleGrid` se met à jour automatiquement
5. **Futur** : L'API service sera appelé pour persister les données

## Avantages de cette Architecture

### 1. Séparation des Responsabilités
- **Contextes** : Logique métier et gestion d'état
- **Composants** : Interface utilisateur et interactions
- **Pages** : Orchestration des composants

### 2. Réutilisabilité
- Composants communs utilisables dans toute l'application
- Contextes réutilisables pour différentes pages
- Logique métier centralisée

### 3. Maintenabilité
- Code modulaire et bien organisé
- Tests unitaires facilités
- Débogage simplifié

### 4. Intégration Microservices
- Contextes prêts pour l'intégration API
- Séparation claire entre UI et logique métier
- Facilite l'ajout de nouveaux services

## Patterns Utilisés

### 1. Provider Pattern
```typescript
// App.tsx
<DirectorProvider>
  <OnboardingProvider>
    <AlertProvider>
      <ScheduleProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AlertProvider>
    </OnboardingProvider>
  </DirectorProvider>
</DirectorProvider>
```

### 2. Custom Hook Pattern
```typescript
// Utilisation dans les composants
const { kpiData, refreshData } = useDirector();
const { alertes, resolveAlert } = useAlert();
```

### 3. Component Composition
```typescript
// Réutilisation de composants
<KPICard 
  title={t('total_students')} 
  value={kpiData.totalEleves} 
  icon={Users} 
  color="blue" 
/>
```

## Internationalisation

L'application utilise `react-i18next` pour l'internationalisation :
- **Fichiers** : `public/locales/fr/translation.json`, `public/locales/en/translation.json`
- **Utilisation** : `const { t } = useTranslation();`
- **Clés** : Organisées par fonctionnalité (dashboard, onboarding, alertes, etc.)

## Styling

- **Framework** : Tailwind CSS
- **Composants UI** : shadcn/ui + Radix UI
- **Icônes** : Lucide React
- **Approche** : Utility-first avec classes conditionnelles

## Évolutions Futures

### 1. Intégration API
- Remplacement des données mockées par des appels API
- Utilisation d'OpenAPI Generator pour les clients API
- Gestion d'erreurs et états de chargement

### 2. Optimisations
- React.memo pour les composants lourds
- useMemo/useCallback pour les calculs coûteux
- Lazy loading des pages

### 3. Tests
- Tests unitaires pour les contextes
- Tests d'intégration pour les composants
- Tests E2E pour les flux utilisateur

## Bonnes Pratiques

### 1. Nommage
- **Composants** : PascalCase (ex: `KPICard`)
- **Contextes** : PascalCase + Context (ex: `DirectorContext`)
- **Hooks** : camelCase + use (ex: `useDirector`)
- **Fichiers** : PascalCase pour composants, camelCase pour utilitaires

### 2. Organisation
- Un contexte par domaine métier
- Composants communs dans `common/`
- Composants spécifiques dans des dossiers dédiés
- Types TypeScript dans les contextes

### 3. Performance
- Éviter les re-renders inutiles
- Utiliser les hooks de React correctement
- Optimiser les listes avec des clés uniques

## Développement

### Installation
```bash
npm install
npm run dev
```

### Structure des Branches
- `main` : Code de production
- `develop` : Développement en cours
- `feature/*` : Nouvelles fonctionnalités
- `hotfix/*` : Corrections urgentes

### Standards de Code
- **Linter** : ESLint + Prettier
- **TypeScript** : Strict mode activé
- **Commits** : Conventional Commits
- **PR** : Code review obligatoire

Cette architecture fournit une base solide pour le développement de l'interface directeur d'EdConnect, facilitant l'évolution et l'intégration avec les microservices.
