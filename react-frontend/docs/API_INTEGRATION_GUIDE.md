# Guide d'Intégration des API - EdConnekt Frontend

## Vue d'ensemble

Ce guide détaille la procédure complète d'intégration des microservices EdConnekt dans le frontend React. Il couvre l'intégration initiale, les mises à jour, la vérification de cohérence et les bonnes pratiques.

## 🎯 Objectifs

- **Standardisation** : Processus uniforme pour tous les services
- **Qualité** : Type safety et gestion d'erreurs robuste
- **Maintenabilité** : Code cohérent et documenté
- **Performance** : Optimisations React Query et mise en cache

## 📋 Prérequis

### Outils Requis
- **OpenAPI Generator** : Client typescript-axios généré
- **React Query** : Gestion d'état serveur
- **Axios** : Client HTTP avec intercepteurs
- **TypeScript** : Mode strict activé

### Structure Attendue
```
src/api/[service-name]/
├── api.ts              # Client généré (ne pas modifier)
├── base.ts             # Types de base générés
├── configuration.ts    # Configuration générée
├── http.ts            # Configuration axios (à créer)
└── client.ts          # Instances des clients (à créer)

src/hooks/
├── use[Resource].ts           # Hooks de lecture
└── use[Resource]Mutations.ts  # Hooks de mutation
```

## 🔄 Processus d'Intégration Complète

### Étape 1 : Préparation du Client HTTP

#### Créer `src/api/[service-name]/http.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

// Configuration des URLs
export const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/[SERVICE_PATH]/';
export const [SERVICE_NAME]_API_BASE_URL = 
  import.meta.env.VITE_[SERVICE_ENV]_API_BASE_URL || DEFAULT_BASE_URL;

// Normalisation des URLs (éviter les doubles slashes)
const normalizeUrl = (url: string): string => {
  return url.replace(/([^:]\/)\/+/g, '$1');
};

// Instance Axios configurée
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: normalizeUrl([SERVICE_NAME]_API_BASE_URL),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour l'authentification Keycloak
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('keycloak_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour la gestion d'erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection vers login si token expiré
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Log de configuration
console.log(`[${[service-name]}-api] baseURL = ${[SERVICE_NAME]_API_BASE_URL}`);
```

**✅ Validation Étape 1**
- [ ] Fichier `http.ts` créé
- [ ] Variables d'environnement configurées
- [ ] Intercepteurs Keycloak en place
- [ ] Log de baseURL visible en console

---

### Étape 2 : Configuration du Client API

#### Créer `src/api/[service-name]/client.ts`

```typescript
import { Configuration } from './configuration';
import { 
  [Resource1]Api, 
  [Resource2]Api,
  // Importer uniquement les APIs présentes dans api.ts
} from './api';
import { axiosInstance, [SERVICE_NAME]_API_BASE_URL } from './http';

// Configuration OpenAPI
const configuration = new Configuration({
  basePath: [SERVICE_NAME]_API_BASE_URL,
});

// Instances des clients API
export const [resource1]Api = new [Resource1]Api(configuration, undefined, axiosInstance);
export const [resource2]Api = new [Resource2]Api(configuration, undefined, axiosInstance);

// Export groupé pour faciliter les imports
export const [serviceName]Clients = {
  [resource1]: [resource1]Api,
  [resource2]: [resource2]Api,
} as const;
```

**✅ Validation Étape 2**
- [ ] Fichier `client.ts` créé
- [ ] Toutes les APIs disponibles instanciées
- [ ] Configuration OpenAPI correcte
- [ ] Exports organisés et typés

---

### Étape 3 : Hooks React Query

#### Créer `src/hooks/use[Resource].ts` (Lecture)

```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { [resource]Api } from '@/api/[service-name]/client';
import { [Resource], [ResourceListResponse] } from '@/api/[service-name]/api';

// Types pour les paramètres de requête
interface [Resource]ListParams {
  page?: number;
  size?: number;
  search?: string;
  // Autres filtres selon l'API
}

// Hook pour lister les ressources
export const use[Resource]List = (
  params: [Resource]ListParams = {},
  options?: Omit<UseQueryOptions<[ResourceListResponse]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['[service-name]', '[resource]', 'list', params],
    queryFn: async () => {
      const response = await [resource]Api.list[Resource]s(
        params.page,
        params.size,
        params.search
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook pour récupérer une ressource par ID
export const use[Resource] = (
  id: string,
  options?: Omit<UseQueryOptions<[Resource]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['[service-name]', '[resource]', id],
    queryFn: async () => {
      const response = await [resource]Api.get[Resource]ById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Hook pour les statistiques (si disponible)
export const use[Resource]Stats = (
  options?: Omit<UseQueryOptions<[ResourceStats]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['[service-name]', '[resource]', 'stats'],
    queryFn: async () => {
      const response = await [resource]Api.get[Resource]Stats();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes pour les stats
    ...options,
  });
};
```

#### Créer `src/hooks/use[Resource]Mutations.ts` (Mutations)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { [resource]Api } from '@/api/[service-name]/client';
import { [Resource], Create[Resource]Request, Update[Resource]Request } from '@/api/[service-name]/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Hook pour créer une ressource
export const useCreate[Resource] = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: Create[Resource]Request) => {
      const response = await [resource]Api.create[Resource](data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: ['[service-name]', '[resource]', 'list'] 
      });
      // Mettre en cache la nouvelle ressource
      queryClient.setQueryData(
        ['[service-name]', '[resource]', data.id],
        data
      );
      toast.success(t('[service-name].[resource].success.created'));
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error) || t('[service-name].[resource].errors.createFailed');
      toast.error(message);
    },
  });
};

// Hook pour mettre à jour une ressource
export const useUpdate[Resource] = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Update[Resource]Request }) => {
      const response = await [resource]Api.update[Resource](id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: ['[service-name]', '[resource]', 'list'] 
      });
      // Mettre à jour le cache de la ressource
      queryClient.setQueryData(
        ['[service-name]', '[resource]', data.id],
        data
      );
      toast.success(t('[service-name].[resource].success.updated'));
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error) || t('[service-name].[resource].errors.updateFailed');
      toast.error(message);
    },
  });
};

// Hook pour supprimer une ressource
export const useDelete[Resource] = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      await [resource]Api.delete[Resource](id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: ['[service-name]', '[resource]', 'list'] 
      });
      // Supprimer du cache
      queryClient.removeQueries({ 
        queryKey: ['[service-name]', '[resource]', deletedId] 
      });
      toast.success(t('[service-name].[resource].success.deleted'));
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error) || t('[service-name].[resource].errors.deleteFailed');
      toast.error(message);
    },
  });
};

// Utilitaire pour extraire les messages d'erreur
const extractErrorMessage = (error: unknown): string | null => {
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as any;
    return axiosError.response?.data?.message || 
           axiosError.response?.data?.error || 
           axiosError.message || 
           null;
  }
  return null;
};
```

**✅ Validation Étape 3**
- [ ] Hooks de lecture créés avec clés stables
- [ ] Hooks de mutation avec invalidation
- [ ] Gestion d'erreurs avec extraction de messages
- [ ] Notifications toast intégrées
- [ ] Types TypeScript stricts

---

### Étape 4 : Intégration dans l'UI

#### Exemple : Page de Liste

```typescript
// src/pages/admin/[Resource]Page.tsx
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { use[Resource]List, useDelete[Resource] } from '@/hooks/use[Resource]';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';

export const [Resource]Page: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Hooks React Query
  const { data, isLoading, error } = use[Resource]List({ 
    search, 
    page, 
    size: 20 
  });
  const deleteMutation = useDelete[Resource]();

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    const confirmed = await ConfirmDialog.show({
      title: t('[service-name].[resource].confirmDelete.title'),
      message: t('[service-name].[resource].confirmDelete.message'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
    });

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-o300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500 mb-4">
          {t('[service-name].[resource].errors.loadFailed')}
        </p>
        <Button onClick={() => window.location.reload()}>
          {t('common.retry')}
        </Button>
      </Card>
    );
  }

  // État vide
  if (!data?.items?.length && !search) {
    return (
      <Card className="p-12 text-center">
        <div className="text-g400 mb-4">
          <Plus className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-g500 mb-2">
          {t('[service-name].[resource].empty.title')}
        </h3>
        <p className="text-g400 mb-6">
          {t('[service-name].[resource].empty.description')}
        </p>
        <Button onClick={() => {/* Ouvrir modal de création */}}>
          <Plus className="h-4 w-4 mr-2" />
          {t('[service-name].[resource].create')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-g500">
          {t('[service-name].[resource].title')}
        </h1>
        <Button onClick={() => {/* Ouvrir modal de création */}}>
          <Plus className="h-4 w-4 mr-2" />
          {t('[service-name].[resource].create')}
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-g400" />
          <Input
            placeholder={t('[service-name].[resource].search.placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des ressources */}
      <div className="grid gap-4">
        {data?.items?.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-g500">{item.name}</h3>
                <p className="text-sm text-g400">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Ouvrir modal d'édition */}}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            {t('common.previous')}
          </Button>
          <span className="text-sm text-g400">
            {t('common.pageOf', { current: page, total: data.totalPages })}
          </span>
          <Button
            variant="outline"
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  );
};
```

**✅ Validation Étape 4**
- [ ] Pages de liste avec états vides
- [ ] Formulaires de création/édition
- [ ] Actions CRUD fonctionnelles
- [ ] Gestion d'erreurs RBAC (403)
- [ ] Styles et patterns respectés

---

### Étape 5 : Vérifications et Tests

#### Checklist de Vérification

```typescript
// Tests de base à effectuer
const verificationChecklist = {
  // Configuration
  baseUrlLogged: '[service-api] baseURL = https://api.uat1-engy-partners.com/[SERVICE_PATH]/',
  environmentVariables: 'VITE_[SERVICE_ENV]_API_BASE_URL configurée',
  
  // Authentification
  keycloakToken: 'Token Keycloak ajouté aux headers',
  unauthorizedRedirect: 'Redirection sur 401',
  
  // Fonctionnalités
  listEndpoint: 'Liste affiche longueur des données',
  emptyState: 'État vide si 0 résultats',
  createEndpoint: 'Création avec validation',
  updateEndpoint: 'Mise à jour avec cache invalidation',
  deleteEndpoint: 'Suppression avec confirmation',
  
  // Erreurs
  networkError: 'Gestion des erreurs réseau',
  validationError: 'Messages de validation clairs',
  rbacError: 'Signalement des erreurs 403',
  
  // Performance
  reactQueryCache: 'Mise en cache React Query',
  staleTime: 'Durée de fraîcheur configurée',
  invalidation: 'Invalidation après mutations',
};
```

#### Tests de Fumée

```bash
# Vérifications rapides
npm run lint                    # Pas d'erreurs ESLint
npm run build                  # Build réussi

# Tests en développement
npm run dev
# 1. Vérifier le log baseURL en console
# 2. Tester la liste (doit afficher la longueur)
# 3. Tester l'état vide si aucune donnée
# 4. Tester une création/modification
# 5. Vérifier les toasts de succès/erreur
```

**✅ Validation Étape 5**
- [ ] Log baseURL visible
- [ ] Liste fonctionne (affiche longueur)
- [ ] État vide géré
- [ ] Erreurs 403 signalées
- [ ] Pas d'erreurs lint/TypeScript

---

## 🔍 Vérification de Cohérence API ↔ UI

### Prompt de Vérification Complète

Utilisez ce prompt pour vérifier l'intégration d'une API existante :

```
Contexte: L'API [SERVICE_NAME] a été intégrée dans EdConnekt frontend.

Objectif: Vérifier exhaustivement que tous les endpoints (hors santé) sont couverts dans l'UI.

Étapes:
1. Analyser tous les endpoints disponibles dans src/api/[service-name]/api.ts
2. Vérifier où ils sont utilisés dans le code (hooks, pages, composants)
3. Comparer schémas API et implémentation UI
4. Identifier manquements ou incohérences
5. Produire une évaluation détaillée

Sortie attendue:
1. Résumé rapide (1-2 lignes)
2. Principales divergences repérées
3. To-do list des manquements
4. Score d'intégration (0-100) selon:
   - Couverture endpoints (30%)
   - Respect schémas (30%)
   - Flux & interactions (20%)
   - Nouveaux champs (10%)
   - Obsolètes supprimés (10%)
5. Estimation qualitative (⚠ Faible / ✅ Moyen / 🚀 Très bon)
```

### Vérification des Formulaires

Pour vérifier la cohérence des formulaires avec les schémas API :

```
Objectif: Vérifier que chaque formulaire correspond exactement au schéma API.

Périmètre:
- Formulaires de création, édition, filtres
- Champs simples et imbriqués
- Types, formats, contraintes
- Cas conditionnels et RBAC

Étapes:
1. Inventaire des formulaires par écran
2. Mapping schéma ↔ formulaire champ par champ
3. Validation côté UI alignée avec schéma
4. Sérialisation et envoi corrects
5. Réception et préremplissage

Sortie attendue:
- Tableau de correspondance par formulaire
- Liste des champs obsolètes/manquants
- Propositions de corrections
- Score de cohérence formulaires (0-100)
- Jeux de tests à ajouter
```

## 📊 Métriques de Qualité

### Score d'Intégration (0-100)

| Critère | Poids | Description |
|---------|-------|-------------|
| **Couverture endpoints** | 30% | Tous les endpoints utilisés dans l'UI |
| **Respect schémas** | 30% | Types et contraintes respectés |
| **Flux & interactions** | 20% | UX cohérente et intuitive |
| **Nouveaux champs** | 10% | Champs récents intégrés |
| **Obsolètes supprimés** | 10% | Ancien code nettoyé |

### Niveaux Qualitatifs

- **🚀 Très bon (80-100)** : Intégration complète et robuste
- **✅ Moyen (60-79)** : Fonctionnel avec quelques améliorations
- **⚠ Faible (0-59)** : Intégration incomplète, nécessite du travail

## 🛠 Outils et Automatisation

### Scripts Utiles

```json
// package.json
{
  "scripts": {
    "api:generate": "openapi-generator-cli generate -i openapi.json -g typescript-axios -o src/api/[service-name]",
    "api:verify": "node scripts/verify-api-integration.js",
    "api:test": "jest src/hooks/use[Resource].test.ts",
    "type-check": "tsc --noEmit",
    "lint:api": "eslint src/api/ src/hooks/ --ext .ts,.tsx"
  }
}
```

### Templates de Code

Utilisez les templates fournis dans ce guide pour :
- Configuration HTTP standardisée
- Hooks React Query avec bonnes pratiques
- Pages UI avec gestion d'erreurs
- Tests unitaires des hooks

## 📚 Ressources Complémentaires

- [CODING_STANDARDS.md](./CODING_STANDARDS.md) : Standards de code EdConnekt
- [ARCHITECTURE.md](./ARCHITECTURE.md) : Architecture générale
- [React Query Documentation](https://tanstack.com/query/latest)
- [OpenAPI Generator](https://openapi-generator.tech/)

---

*Guide mis à jour le : 10 octobre 2025*
*Version : EdConnekt Frontend v1.0*
