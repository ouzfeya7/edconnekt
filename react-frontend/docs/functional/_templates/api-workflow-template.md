# [Service Name] - [Workflow Name]

## Vue d'ensemble

**Statut** : ✅ Intégré | ⚠️ Partiel | 🔄 En cours | 📋 Planifié

**Description** : [Description courte du workflow et de son objectif business]

**Service API** : `[service-name]`  
**Endpoints utilisés** : 
- `GET /api/v1/[resource]` - Liste des ressources
- `POST /api/v1/[resource]` - Création
- `PUT /api/v1/[resource]/{id}` - Mise à jour
- `DELETE /api/v1/[resource]/{id}` - Suppression

## Prérequis

### Rôles Utilisateur
- [ ] Admin Staff
- [ ] Enseignant  
- [ ] Élève
- [ ] Parent
- [ ] Admin

### Permissions Requises
- `[permission1]` : Description
- `[permission2]` : Description

### État Initial du Système
- Utilisateur authentifié avec rôle approprié
- Établissement sélectionné (si applicable)
- [Autres prérequis spécifiques]

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/[role]/[PageName].tsx`  
**Route** : `/[role]/[route-path]`  
**Navigation** : Menu principal → [Section] → [Sous-section]

**Action utilisateur** :
- Clic sur [élément de navigation]
- Accès direct via URL

**Appel API** :
```typescript
// Hook utilisé
const { data, isLoading, error } = use[Resource]List({
  page: 1,
  size: 20,
  filters: {...}
});
```

**Résultat attendu** :
- Affichage de la liste des ressources
- Loading state pendant le chargement
- Empty state si aucune donnée

### 2. [Étape Principale - ex: Création]
**Déclencheur** : Clic sur bouton "Créer [Resource]"

**Action utilisateur** :
- Ouverture du modal/formulaire de création
- Saisie des données requises
- Validation côté client

**Appel API** :
```typescript
// Hook de mutation
const createMutation = useCreate[Resource]();

// Données envoyées
const payload: Create[Resource]Request = {
  name: formData.name,
  description: formData.description,
  // autres champs...
};

createMutation.mutate(payload);
```

**Résultat attendu** :
- Toast de succès : "Ressource créée avec succès"
- Fermeture du modal
- Actualisation de la liste
- Nouvelle ressource visible

### 3. [Étape Secondaire - ex: Modification]
**Déclencheur** : Clic sur icône "Modifier" d'une ressource

**Action utilisateur** :
- Ouverture du formulaire pré-rempli
- Modification des champs
- Sauvegarde

**Appel API** :
```typescript
const updateMutation = useUpdate[Resource]();

updateMutation.mutate({
  id: resource.id,
  data: updatedData
});
```

**Résultat attendu** :
- Toast de succès : "Ressource mise à jour"
- Données actualisées dans la liste
- Cache React Query invalidé

### 4. [Étape Finale - ex: Suppression]
**Déclencheur** : Clic sur icône "Supprimer"

**Action utilisateur** :
- Confirmation via dialog
- Validation de la suppression

**Appel API** :
```typescript
const deleteMutation = useDelete[Resource]();

// Avec confirmation
const confirmed = await ConfirmDialog.show({
  title: 'Confirmer la suppression',
  message: 'Cette action est irréversible.',
  confirmText: 'Supprimer',
  variant: 'destructive'
});

if (confirmed) {
  deleteMutation.mutate(resourceId);
}
```

**Résultat attendu** :
- Toast de succès : "Ressource supprimée"
- Ressource retirée de la liste
- Cache mis à jour

## Points de Validation

### Fonctionnels
- [ ] Liste affiche toutes les ressources accessibles
- [ ] Filtres et recherche fonctionnent correctement
- [ ] Création respecte les règles métier
- [ ] Modification préserve l'intégrité des données
- [ ] Suppression gère les dépendances

### Techniques
- [ ] Appels API avec headers corrects (X-Etab, X-Roles)
- [ ] Gestion des erreurs 400/401/403/500
- [ ] Loading states appropriés
- [ ] Cache React Query optimisé
- [ ] Types TypeScript respectés

### UX/UI
- [ ] Interface responsive sur mobile/desktop
- [ ] Feedback utilisateur clair (toasts, messages)
- [ ] États vides gérés élégamment
- [ ] Accessibilité respectée (ARIA, navigation clavier)

## Gestion d'Erreurs

### Erreurs API
| Code | Cause | Comportement UI |
|------|-------|-----------------|
| 400 | Données invalides | Toast d'erreur + validation formulaire |
| 401 | Token expiré | Redirection vers login |
| 403 | Permissions insuffisantes | Message "Accès refusé" |
| 404 | Ressource introuvable | Page d'erreur ou retour liste |
| 500 | Erreur serveur | Toast "Erreur technique, réessayez" |

### Erreurs Réseau
- **Timeout** : Message "Connexion lente, patientez..."
- **Offline** : Banner "Mode hors ligne détecté"
- **CORS** : Message développeur en console

### Erreurs Métier
- **Contraintes** : Messages spécifiques selon règles
- **Doublons** : "Cette ressource existe déjà"
- **Dépendances** : "Impossible de supprimer, ressource utilisée"

## États de l'UI

### Loading States
```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Empty States
```typescript
if (!data?.items?.length) {
  return (
    <EmptyState
      icon={<PlusIcon />}
      title="Aucune ressource"
      description="Créez votre première ressource"
      action={<Button onClick={openCreateModal}>Créer</Button>}
    />
  );
}
```

### Error States
```typescript
if (error) {
  return (
    <ErrorState
      title="Erreur de chargement"
      message={extractErrorMessage(error)}
      retry={() => refetch()}
    />
  );
}
```

## Données Impliquées

### Modèles de Données
```typescript
// Type principal
interface [Resource] {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // autres champs...
}

// Type de création
interface Create[Resource]Request {
  name: string;
  description?: string;
  // champs requis pour création...
}

// Type de mise à jour
interface Update[Resource]Request {
  name?: string;
  description?: string;
  // champs modifiables...
}
```

### Transformations de Données
```typescript
// UI → API
const transformToApiFormat = (formData: FormData): Create[Resource]Request => {
  return {
    name: formData.name.trim(),
    description: formData.description || null,
    // autres transformations...
  };
};

// API → UI
const transformFromApiFormat = (apiData: [Resource]): DisplayData => {
  return {
    ...apiData,
    displayName: apiData.name.toUpperCase(),
    formattedDate: formatDate(apiData.createdAt),
    // autres transformations...
  };
};
```

### Validations
```typescript
// Validation côté client
const validationSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100, 'Nom trop long'),
  description: z.string().max(500, 'Description trop longue').optional(),
  // autres validations...
});
```

## Optimisations

### Performance
- **React Query** : Cache avec `staleTime: 5 * 60 * 1000` (5 min)
- **Pagination** : Chargement par pages de 20 éléments
- **Debounce** : Recherche avec délai de 300ms
- **Memoization** : `useMemo` pour calculs coûteux

### UX
- **Optimistic Updates** : Mise à jour immédiate de l'UI
- **Background Refetch** : Actualisation silencieuse
- **Retry Logic** : 3 tentatives automatiques
- **Offline Support** : Cache local avec sync

## Tests

### Tests Unitaires
```typescript
// Hooks
describe('use[Resource]List', () => {
  it('should fetch resources list', async () => {
    // test implementation
  });
});

// Components
describe('[Resource]Page', () => {
  it('should display resources list', () => {
    // test implementation
  });
});
```

### Tests d'Intégration
```typescript
// Workflow complet
describe('[Resource] E2E Workflow', () => {
  it('should create, update and delete resource', async () => {
    // test implementation
  });
});
```

## Métriques

### Performance
- **Temps de chargement initial** : < 2s
- **Temps de réponse API** : < 500ms
- **Taille du bundle** : Impact minimal

### Usage
- **Taux de succès** : > 95%
- **Taux d'erreur** : < 5%
- **Satisfaction utilisateur** : Feedback positif

## Notes Techniques

### Dépendances
- `@tanstack/react-query` : Gestion d'état serveur
- `react-hook-form` : Gestion des formulaires
- `zod` : Validation des schémas
- `react-hot-toast` : Notifications

### Configuration
```typescript
// Variables d'environnement
VITE_[SERVICE_ENV]_API_BASE_URL=https://api.uat1-engy-partners.com/[service-path]/

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
    },
  },
});
```

### Liens Utiles
- [API Documentation](../api-docs/[service-name].md)
- [Component Storybook](http://localhost:6006/?path=/story/[component])
- [Backend Repository](https://github.com/org/[service-name])

---

*Workflow documenté le : [Date]*  
*Dernière mise à jour : [Date]*  
*Auteur : [Nom]*
