# Resource Service - Documentation Technique

## Vue d'ensemble

Le **Resource Service** d'EdConnekt est le service de gestion des ressources pédagogiques. Il permet aux enseignants et coordinateurs de créer, partager, organiser et suivre des ressources éducatives avec un système complet de permissions, d'audit et de versioning. Le service s'intègre étroitement avec le competence-service pour la classification par matières et compétences.

### Statut d'intégration : ✅ **COMPLET**

- **API Client** : ✅ Généré et configuré
- **Hooks React Query** : ✅ Implémentés (8/8 endpoints)
- **Interface utilisateur** : ✅ Pages dédiées et composants intégrés
- **Workflows E2E** : ✅ Fonctionnels avec audit trail

---

## Architecture du Service

### Structure des fichiers

```
src/api/resource-service/
├── api.ts              # Classes API générées (DefaultApi, ResourcesApi)
├── client.ts           # Instances configurées des APIs
├── http.ts             # Configuration Axios avec intercepteurs
├── configuration.ts    # Configuration OpenAPI
├── base.ts            # Classes de base
├── common.ts          # Utilitaires communs
└── index.ts           # Exports principaux
```

### Configuration HTTP

**Fichier source** : `src/api/resource-service/http.ts`

```typescript
// URL de base configurée
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/resource';
const BASE_URL = import.meta.env.VITE_RESOURCE_API_BASE_URL ?? DEFAULT_BASE_URL;

// Instance Axios configurée
export const resourceAxios = axios.create({ baseURL: BASE_URL });
```

**Headers automatiques** :
- `Authorization: Bearer {token}` (token Keycloak)
- `X-Etab: {etablissement_id}` (contexte établissement)
- `X-Roles: {role}` (contexte rôle utilisateur)

---

## Endpoints Disponibles

### 1. DefaultApi - Endpoints système

#### GET `/health` - Health Check
- **Description** : Vérification de santé du service
- **Réponse** : Statut du service
- **Usage** : Monitoring système

### 2. ResourcesApi - Endpoints métier

#### POST `/resources` - Create Resource
- **Description** : Crée une nouvelle ressource pédagogique
- **Payload** : FormData avec fichier et métadonnées
  ```typescript
  {
    title: string,
    visibility: Visibility,
    subjectId: string,      // UUID de la matière
    competenceId: string,   // UUID de la compétence
    file: File,
    description?: string
  }
  ```
- **Réponse** : `ResourceOut`
- **Hook** : `useCreateResource()`

#### GET `/resources` - List Resources
- **Description** : Liste les ressources avec filtres et pagination
- **Paramètres** :
  - `authorUserId?: string` - Filtrer par auteur
  - `visibility?: Visibility` - PUBLIC, PRIVATE, SHARED
  - `subjectId?: string` - Filtrer par matière
  - `competenceId?: string` - Filtrer par compétence
  - `status?: ResourceStatus` - ACTIVE, ARCHIVED
  - `limit?: number` - Nombre d'éléments (défaut: 10)
  - `offset?: number` - Décalage pour pagination
- **Réponse** : `ResourceListResponse`
- **Hook** : `useResources()`

#### GET `/resources/{resourceId}` - Get Resource
- **Description** : Récupère une ressource spécifique
- **Paramètres** : `resourceId: string`
- **Réponse** : `ResourceOut`
- **Hook** : `useResourceDetail()`

#### PATCH `/resources/{resourceId}` - Update Resource
- **Description** : Met à jour une ressource existante
- **Paramètres** : `resourceId: string` + champs optionnels
- **Payload** : FormData avec champs modifiés
- **Hook** : `useUpdateResource()`

#### DELETE `/resources/{resourceId}` - Delete/Archive Resource
- **Description** : Archive une ressource (soft delete)
- **Paramètres** : `resourceId: string`
- **Hook** : `useArchiveResource()`

#### PATCH `/resources/{resourceId}/restore` - Restore Resource
- **Description** : Restaure une ressource archivée
- **Paramètres** : `resourceId: string`
- **Permissions** : COORDONNATEUR, ADMINSTAFF ou auteur original
- **Hook** : `useRestoreResource()`

#### GET `/resources/{resourceId}/download` - Download Resource File
- **Description** : Télécharge le fichier associé à une ressource
- **Paramètres** : `resourceId: string`
- **Réponse** : Blob (fichier binaire)
- **Hook** : `useDownloadResourceFile()`

#### GET `/resources/{resourceId}/audit` - Get Resource Audit Log
- **Description** : Récupère l'historique d'audit d'une ressource
- **Paramètres** : 
  - `resourceId: string`
  - `limit?: number` (défaut: 20)
  - `offset?: number` (défaut: 0)
- **Réponse** : `AuditOut[]`
- **Hook** : `useResourceAudit()`

---

## Types TypeScript

### ResourceOut
```typescript
interface ResourceOut {
  id: string;
  title: string;
  description?: string;
  visibility: Visibility;
  status: ResourceStatus;
  subject_id: string;
  competence_id: string;
  author_user_id: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}
```

### Visibility
```typescript
enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE', 
  SHARED = 'SHARED'
}
```

### ResourceStatus
```typescript
enum ResourceStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}
```

### ResourceListResponse
```typescript
interface ResourceListResponse {
  items: ResourceOut[];
  total: number;
  page: number;
  size: number;
}
```

### AuditOut
```typescript
interface AuditOut {
  id: string;
  resource_id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  diff: { [key: string]: any };
  created_at: string;
}
```

---

## Hooks React Query

### Hooks de lecture (Queries)

#### `useResources(params?)`
**Fichier source** : `src/hooks/useResources.ts`

```typescript
const { data, isLoading, error } = useResources({
  authorUserId: "user-123",
  visibility: Visibility.PUBLIC,
  subjectId: "subject-456",
  competenceId: "comp-789",
  status: ResourceStatus.ACTIVE,
  limit: 20,
  offset: 0
});

// Réponse : { items: ResourceOut[], total: number, page: number, size: number }
```

#### `useResourceDetail(resourceId)`
**Fichier source** : `src/hooks/useResourceDetail.ts`

```typescript
const { data: resource, isLoading } = useResourceDetail("resource-123");
// Réponse : ResourceOut
```

#### `useResourceAudit(resourceId)`
**Fichier source** : `src/hooks/useResourceAudit.ts`

```typescript
const { data: auditLogs } = useResourceAudit("resource-123");
// Réponse : AuditOut[] (20 entrées max)
```

### Hooks de mutation

#### `useCreateResource()`
**Fichier source** : `src/hooks/useCreateResource.ts`

```typescript
const createResource = useCreateResource();

await createResource.mutateAsync({
  title: "Ma ressource",
  visibility: Visibility.PUBLIC,
  subjectId: "subject-123",
  competenceId: "comp-456",
  file: selectedFile,
  description: "Description optionnelle"
});
```

#### `useUpdateResource()`
**Fichier source** : `src/hooks/useUpdateResource.ts`

```typescript
const updateResource = useUpdateResource();

await updateResource.mutateAsync({
  resourceId: "resource-123",
  title: "Nouveau titre",
  description: "Nouvelle description",
  visibility: Visibility.SHARED,
  file: newFile // optionnel
});
```

#### `useArchiveResource()`
**Fichier source** : `src/hooks/useArchiveResource.ts`

```typescript
const archiveResource = useArchiveResource();

await archiveResource.mutateAsync("resource-123");
// Archive la ressource (soft delete)
```

#### `useRestoreResource()`
**Fichier source** : `src/hooks/useRestoreResource.ts`

```typescript
const restoreResource = useRestoreResource();

await restoreResource.mutateAsync("resource-123");
// Restaure une ressource archivée
```

#### `useDownloadResourceFile()`
**Fichier source** : `src/hooks/useDownloadResourceFile.ts`

```typescript
const downloadFile = useDownloadResourceFile();

await downloadFile.mutateAsync({
  resourceId: "resource-123",
  suggestedFilename: "mon-fichier.pdf" // optionnel
});
// Télécharge automatiquement le fichier
```

---

## Intégration Interface Utilisateur

### Pages principales

#### 1. RessourcesPage
**Fichier** : `src/pages/RessourcesPage.tsx`

**Fonctionnalités** :
- Liste paginée des ressources avec filtres
- Intégration avec competence-service pour filtres dynamiques
- Actions CRUD complètes
- Système de permissions par rôle
- Interface responsive avec badges colorés par matière

**Hooks utilisés** :
```typescript
import { useResources as useRemoteResources } from "../hooks/useResources";
import { useArchiveResource } from "../hooks/useArchiveResource";
import { useReferentials, useReferentialTree } from "../hooks/competence/useReferentials";
import { useCompetencies } from "../hooks/competence/useCompetencies";
```

#### 2. ArchivesPage
**Fichier** : `src/pages/ArchivesPage.tsx`

**Fonctionnalités** :
- Liste des ressources archivées
- Fonction de restauration pour les administrateurs
- Filtres par matière et compétence
- Interface dédiée aux archives

**Hooks utilisés** :
```typescript
import { useResources as useRemoteResources } from '../hooks/useResources';
import { useRestoreResource } from '../hooks/useRestoreResource';
```

### Composants spécialisés

#### 1. AuditTrail
**Fichier** : `src/components/ressources/AuditTrail.tsx`

**Fonctionnalités** :
- Historique complet des modifications
- Permissions restreintes (admin seulement)
- Interface temporelle avec codes couleur par action
- Intégration avec `useResourceAudit()`

#### 2. ResourceMetadata
**Fichier** : `src/components/ressources/ResourceMetadata.tsx`

**Fonctionnalités** :
- Affichage des métadonnées de ressource
- Intégration avec competence-service
- Badges visuels pour matières et compétences

#### 3. Composants d'intégration cours
**Fichiers** :
- `src/components/course/CourseResourcesWidget.tsx`
- `src/components/course/ResourceAssociationModal.tsx`
- `src/components/course/LessonResourcesSection.tsx`
- `src/components/course/ResourceCard.tsx`

**Fonctionnalités** :
- Intégration des ressources dans les cours
- Modales d'association ressource-cours
- Widgets de ressources dans les leçons
- Cartes de ressources réutilisables

---

## Workflows E2E

### 1. Workflow création de ressource

```typescript
// 1. Sélection des métadonnées (intégration competence-service)
const { data: referentials } = useReferentials();
const { data: competencies } = useCompetencies(selectedSubjectId);

// 2. Création de la ressource
const createResource = useCreateResource();
const newResource = await createResource.mutateAsync({
  title: "Ma nouvelle ressource",
  visibility: Visibility.PUBLIC,
  subjectId: selectedSubject.id,
  competenceId: selectedCompetence.id,
  file: uploadedFile,
  description: "Description détaillée"
});

// 3. Vérification et audit automatique
const { data: auditLog } = useResourceAudit(newResource.id);
```

### 2. Workflow gestion des permissions

```typescript
// Vérification des permissions utilisateur
const { capabilities } = useAppRolesFromIdentity();
const canEdit = capabilities.isTeacher || capabilities.isCoordinator;
const canArchive = capabilities.isAdminStaff || isAuthor;

// Actions conditionnelles
if (canEdit) {
  const updateResource = useUpdateResource();
  await updateResource.mutateAsync({ resourceId, title: newTitle });
}

if (canArchive) {
  const archiveResource = useArchiveResource();
  await archiveResource.mutateAsync(resourceId);
}
```

### 3. Workflow téléchargement et partage

```typescript
// Téléchargement avec gestion automatique du nom de fichier
const downloadFile = useDownloadResourceFile();

const handleDownload = async (resourceId: string, originalName?: string) => {
  try {
    await downloadFile.mutateAsync({
      resourceId,
      suggestedFilename: originalName
    });
    // Le fichier est automatiquement téléchargé
  } catch (error) {
    toast.error('Erreur lors du téléchargement');
  }
};
```

### 4. Workflow audit et traçabilité

```typescript
// Suivi complet des modifications
const AuditComponent = ({ resourceId }: { resourceId: string }) => {
  const { data: auditLogs } = useResourceAudit(resourceId);
  
  return (
    <div>
      {auditLogs?.map(log => (
        <div key={log.id}>
          <span>{log.action}</span> par {log.actor_id}
          le {new Date(log.created_at).toLocaleDateString()}
          <pre>{JSON.stringify(log.diff, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};
```

---

## Gestion d'erreurs et États

### États de chargement
```typescript
const { data, isLoading, isError, error } = useResources();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState error={error} />;
if (!data?.items?.length) return <EmptyState />;
```

### Gestion des mutations avec feedback
```typescript
const createResource = useCreateResource();

const handleCreate = async (formData: CreateResourceVariables) => {
  try {
    await createResource.mutateAsync(formData);
    toast.success('Ressource créée avec succès');
  } catch (error) {
    toast.error('Erreur lors de la création');
  }
};

// États de mutation
createResource.isPending    // En cours
createResource.isError      // Erreur
createResource.isSuccess    // Succès
```

### Invalidation de cache stratégique
```typescript
// Après création
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['resources'] });
}

// Après modification
onSuccess: (data, variables) => {
  queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
  queryClient.invalidateQueries({ queryKey: ['resources'] });
}
```

---

## Sécurité et Permissions

### Système de visibilité
- **PUBLIC** : Visible par tous les utilisateurs de l'établissement
- **PRIVATE** : Visible uniquement par l'auteur
- **SHARED** : Visible par l'auteur et les coordinateurs

### Permissions par rôle
```typescript
// Lecture
const canView = visibility === 'PUBLIC' || 
                isAuthor || 
                capabilities.isCoordinator || 
                capabilities.isAdminStaff;

// Modification
const canEdit = isAuthor || capabilities.isCoordinator;

// Archivage
const canArchive = isAuthor || capabilities.isAdminStaff;

// Restauration
const canRestore = capabilities.isCoordinator || 
                   capabilities.isAdminStaff || 
                   isOriginalAuthor;

// Audit
const canViewAudit = capabilities.isAdminStaff;
```

### Headers de sécurité
- **Authorization** : Token JWT Keycloak obligatoire
- **X-Etab** : ID établissement pour isolation multi-tenant
- **X-Roles** : Rôles utilisateur pour contrôle d'accès

---

## Intégration avec Competence Service

### Filtrage dynamique
```typescript
// Récupération des référentiels
const { data: referentials } = useReferentials();
const { data: referentialTree } = useReferentialTree();

// Filtrage des ressources par matière
const { data: resources } = useResources({
  subjectId: selectedSubject?.id,
  competenceId: selectedCompetence?.id
});

// Affichage avec badges colorés
const subjectBadgeColors = {
  "Mathématiques": "bg-amber-50 text-amber-700",
  "Français": "bg-green-50 text-green-700",
  "Anglais": "bg-emerald-50 text-emerald-700"
  // ... autres matières
};
```

---

## Points de validation

### ✅ Validation technique
- [x] API client généré et fonctionnel
- [x] Configuration HTTP avec intercepteurs
- [x] 8 hooks React Query pour tous les endpoints
- [x] Gestion d'erreurs et états de chargement
- [x] Invalidation de cache appropriée
- [x] Types TypeScript complets
- [x] Upload de fichiers avec FormData

### ✅ Validation fonctionnelle
- [x] Pages dédiées (Ressources, Archives)
- [x] Composants spécialisés (AuditTrail, ResourceMetadata)
- [x] Intégration dans les cours
- [x] Système de permissions complet
- [x] Workflows CRUD complets
- [x] Téléchargement automatique de fichiers
- [x] Audit trail fonctionnel

### ✅ Validation UX
- [x] Interface intuitive avec filtres dynamiques
- [x] Badges colorés par matière
- [x] États de chargement et erreurs
- [x] Feedback utilisateur (toasts)
- [x] Navigation fluide entre ressources
- [x] Intégration seamless avec competence-service

---

## Exemples d'utilisation

### Création complète d'une ressource
```typescript
const CreateResourceForm = () => {
  const createResource = useCreateResource();
  const { data: referentials } = useReferentials();
  
  const handleSubmit = async (formData: FormData) => {
    try {
      const newResource = await createResource.mutateAsync({
        title: formData.get('title') as string,
        visibility: formData.get('visibility') as Visibility,
        subjectId: formData.get('subjectId') as string,
        competenceId: formData.get('competenceId') as string,
        file: formData.get('file') as File,
        description: formData.get('description') as string
      });
      
      toast.success('Ressource créée avec succès');
      navigate(`/resources/${newResource.id}`);
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };
  
  return <form onSubmit={handleSubmit}>/* Form JSX */</form>;
};
```

### Liste avec filtres et pagination
```typescript
const ResourcesList = () => {
  const [filters, setFilters] = useState({
    subjectId: null,
    visibility: null,
    limit: 20,
    offset: 0
  });
  
  const { data, isLoading } = useResources(filters);
  
  return (
    <div>
      {/* Filtres */}
      <FilterBar onFiltersChange={setFilters} />
      
      {/* Liste */}
      {data?.items.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
      
      {/* Pagination */}
      <Pagination 
        total={data?.total} 
        current={filters.offset / filters.limit + 1}
        onChange={(page) => setFilters(prev => ({
          ...prev, 
          offset: (page - 1) * filters.limit
        }))}
      />
    </div>
  );
};
```

---

## Conclusion

Le **Resource Service** est **entièrement intégré** dans EdConnekt avec une couverture complète de tous les endpoints et une interface utilisateur riche. L'implémentation offre un système complet de gestion des ressources pédagogiques avec permissions granulaires, audit trail, et intégration seamless avec le competence-service.

**Points forts** :
- ✅ Système de permissions sophistiqué
- ✅ Audit trail complet pour traçabilité
- ✅ Intégration étroite avec competence-service
- ✅ Interface utilisateur riche et intuitive
- ✅ Gestion complète du cycle de vie des ressources
- ✅ Upload et téléchargement de fichiers fonctionnels

**Usage principal** : Gestion centralisée des ressources pédagogiques avec classification par matières/compétences, partage contrôlé, et traçabilité complète des modifications.
