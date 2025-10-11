# Documentation Technique du Front-End EdConnekt

> Ce document est une documentation technique complète de l'application front-end EdConnekt (React/TypeScript).

**Résumé**: Le projet est une application React moderne construite avec Vite, TypeScript et Tailwind CSS. Elle suit des principes d'architecture robustes, notamment une séparation claire des préoccupations grâce à l'utilisation de hooks personnalisés pour la logique métier et l'API Context de React pour l'état global. La communication avec le backend est modulaire, avec des services API dédiés pour chaque microservice, et la gestion de l'état serveur est assurée par `@tanstack/react-query`.

---

## ⚠️ **MIGRATION URGENTE EN COURS**

> **IMPORTANT** : Le rôle `directeur` est en cours de migration vers `admin_staff` dans tout le codebase frontend. 
> 
> **État actuel :**
> - ✅ **Documentation** : Migration terminée (84 occurrences corrigées)
> - ⚠️ **Code Frontend** : Migration **NON TERMINÉE** - **ACTION URGENTE REQUISE**
> 
> **Impact :** Les références au rôle `directeur` dans le code TypeScript/React (composants, pages, routes, types, hooks) doivent être mises à jour vers `admin_staff` pour maintenir la cohérence avec l'API backend.
> 
> **Fichiers concernés :** `src/pages/directeur/`, `src/components/directeur/`, types de rôles, navigation, etc.

---

## Table des Matières

1.  [**Vue d’ensemble de l’architecture**](#a-vue-densemble-de-larchitecture)
    *   [Arborescence des répertoires](#arborescence-des-repertoires)
    *   [Principes d’architecture](#principes-darchitecture)
    *   [Système de styles](#systeme-de-styles)
    *   [Diagramme d'architecture](#diagramme-darchitecture)
2.  [**Démarrage et outillage**](#b-demarrage-et-outillage)
3.  [**Routage et navigation**](#c-routage-et-navigation)
4.  [**Services API et contrats**](#d-services-api-et-contrats)
    *   [Configuration du client HTTP](#configuration-du-client-http)
    *   [Intercepteurs et contexte](#intercepteurs-et-contexte)
    *   [Tableau récapitulatif des services API](#tableau-recapitulatif-des-services-api)
5.  [**Domaines fonctionnels clés**](#e-domaines-fonctionnels-cles)
    *   [Onboarding Admin Staff](#onboarding-admin-staff)
    *   [Supplies (Fournitures)](#supplies-fournitures)
    *   [Compétences (competence-service)](#competences-competence-service)
6.  [**États, données et gestion des erreurs**](#f-etats-donnees-et-gestion-des-erreurs)
7.  [**Conventions de code et bonnes pratiques**](#g-conventions-de-code-et-bonnes-pratiques)
8.  [**Localisation/i18n**](#h-localisationi18n)
9.  [**Sécurité et contexte**](#i-securite-et-contexte)
10. [**Roadmap et extensions**](#j-roadmap-et-extensions)
11. [**Comment contribuer**](#comment-contribuer)
12. [**Pièges fréquents**](#pieges-frequents)

---

## A. Vue d’ensemble de l’architecture

### Arborescence des répertoires

L'organisation du code dans `react-frontend/src/` suit une approche par type de fonctionnalité, ce qui facilite la localisation du code.

-   `src/api/`: **Cœur de la communication Backend.** Contient les clients API générés (via OpenAPI) pour chaque microservice (ex: `supplies-service`, `competence-service`). Chaque sous-dossier contient la configuration de l'instance Axios (`http.ts`), les types de données (DTOs) et les endpoints.
-   `src/assets/`: Fichiers statiques comme les images et les polices.
-   `src/components/`: **Composants React réutilisables.** Ils sont organisés en sous-dossiers correspondant aux domaines fonctionnels ou aux pages (ex: `components/admin/onboarding`, `components/supplies`). Le dossier `components/ui/` contient des composants d'interface génériques (boutons, inputs, etc.).
-   `src/contexts/`: **Gestion de l'état global client.** Contient tous les providers de contexte React (ex: `IdentityContextProvider.tsx`, `OnboardingContext.tsx`).
-   `src/hooks/`: **Logique métier et accès aux données.** Contient tous les hooks personnalisés, qui encapsulent les appels API (via TanStack Query) et la logique métier complexe. C'est le cerveau de l'application.
-   `src/layouts/`: Composants de mise en page principaux, comme `DashboardLayout.tsx` qui structure l'interface post-connexion.
-   `src/pages/`: **Composants de haut niveau représentant les pages de l'application.** Chaque fichier correspond à une route (ex: `pages/supplies/TeacherSuppliesPage.tsx`). Ils assemblent les composants et les hooks pour construire une vue.
-   `src/services/`: Contient des services de plus haut niveau ou transverses qui ne sont pas des clients API directs (ex: `websocketService.ts`).
-   `src/styles/`: Fichiers de style globaux (ex: `index.css`).
-   `src/utils/`: Fonctions utilitaires pures et partagées dans l'application.

### Principes d’architecture

1.  **Découpage par Feature**: L'architecture est fortement orientée "feature". Chaque fonctionnalité majeure (Onboarding, Supplies, Compétences) possède ses propres composants, hooks, contextes et pages.
2.  **Hooks personnalisés pour la logique**: Toute la logique d'accès aux données et une grande partie de la logique métier sont extraites dans des hooks personnalisés (`src/hooks/`). Cela allège considérablement les composants de page et les rend plus déclaratifs.
3.  **Gestion d'état découplée**:
    *   **État Serveur**: Géré exclusivement par **`@tanstack/react-query`**. Les hooks personnalisés encapsulent `useQuery` et `useMutation` pour la mise en cache, le re-fetching et la gestion des états (loading, error).
    *   **État Client**: Géré par l'**API Context de React** pour les données globales qui ne viennent pas du serveur (ex: thème UI, identité de l'utilisateur, filtres actifs).
4.  **Container/Presentational Pattern (implicite)**: Les composants de page (`src/pages/`) agissent comme des "containers" qui récupèrent les données via les hooks et les passent à des composants de présentation plus simples (`src/components/`).

### Système de styles

Le style est géré par **Tailwind CSS**, avec une configuration avancée pour assurer la cohérence et la maintenabilité.

-   **Fichier de configuration**: `react-frontend/tailwind.config.js`.
-   **Theming**: Un système de theming pour les modes clair/sombre est implémenté dans `src/theme.tsx`. Il utilise un Contexte React (`ColorModeContext`) et une fonction `tokens` qui mappe les modes à des classes utilitaires Tailwind.
-   **Variables CSS**: Le projet utilise des variables CSS (`var(--primary)`, `var(--background)`) dans `tailwind.config.js`. Cela permet de changer de thème de manière très efficace en modifiant simplement les valeurs de ces variables dans un fichier CSS global (probablement `src/index.css`), une excellente pratique pour le theming dynamique.
-   **Convention**: Le style est appliqué directement dans les composants via les classes utilitaires Tailwind, favorisant la colocalisation du balisage et du style.

### Diagramme d'architecture

Ce diagramme illustre le flux de données général dans l'application.

```mermaid
graph TD
    subgraph Browser
        U[Utilisateur] --> C[Composant React];
    end

    subgraph "React App (Client-Side)"
        C -- "Appelle hook" --> H[Hook Personnalisé (`useRessource`)];
        H -- "Utilise Contexte" --> CTX[Context API (`IdentityContext`)];
        CTX -- "Fournit Etab/Role" --> I[Intercepteur Axios];
        H -- "Déclenche requête" --> TQ[@tanstack/react-query];
        TQ -- "Gère cache & états" --> H;
        TQ -- "Exécute" --> I;
        I -- "Injecte Headers (X-Etab, X-Roles, Auth)" --> HTTP;
        HTTP[Client Axios] -- "Requête HTTP" --> API;
    end

    subgraph Backend
        API[Microservice API];
    end

    API -- "Réponse HTTP" --> HTTP;
    HTTP -- "Réponse" --> I;
    I -- "Réponse" --> TQ;
    TQ -- "Met à jour données" --> H;
    H -- "Retourne données" --> C;
    C -- "Met à jour UI" --> U;

    style C fill:#a7f3d0
    style H fill:#bae6fd
    style CTX fill:#e9d5ff
    style TQ fill:#fde68a
```

## B. Démarrage et outillage

-   **Pré-requis**: Node.js, et un gestionnaire de paquets comme `npm` ou `pnpm` (le projet utilise `package-lock.json`, donc `npm` est le standard). Les variables d'environnement sont requises pour les URLs des API (ex: `VITE_SUPPLIES_API_BASE_URL`).
-   **Scripts NPM** (`package.json`):
    -   `npm run dev`: Lance le serveur de développement Vite sur le port 8000.
    -   `npm run build`: Compile le projet TypeScript et construit l'application pour la production.
    -   `npm run lint`: Lance ESLint pour analyser le code et trouver des erreurs potentielles.
    -   `npm run lint:strict`: Lance ESLint avec des règles plus strictes (0 avertissement maximum).
-   **Gestion des environnements**: Le projet utilise Vite, qui gère nativement les variables d'environnement via des fichiers `.env` (ex: `.env.development`, `.env.production`).

## C. Routage et navigation

Le routage est géré par `react-router-dom` v6 dans le fichier `react-frontend/src/App.tsx`.

-   **Routes principales**: Les routes sont définies dans un objet central `routesByRole` qui mappe un rôle utilisateur à une liste de routes autorisées.
-   **Gardes de Route (Protection)**: L'accès aux pages est protégé par un système à deux niveaux dans le composant `AppContent`:
    1.  **Garde d'Authentification**: Le hook `useAuth()` vérifie si l'utilisateur est authentifié via Keycloak. Si non, il est redirigé vers `/login`.
    2.  **Garde de Contexte**: Si l'utilisateur est authentifié mais n'a pas encore sélectionné son contexte (établissement et rôle), le hook `useIdentityContext()` le redirige vers la page `/select-contexte`. C'est une étape cruciale pour le fonctionnement de l'application multi-tenant.
-   **Navigation**: La navigation entre les sections est basée sur les rôles. Le `DashboardLayout` affiche probablement une barre de navigation différente en fonction du rôle de l'utilisateur connecté.

## D. Services API et contrats

### Configuration du client HTTP

Chaque microservice backend a son propre client API dans `src/api/`. Par exemple, le service des fournitures est dans `src/api/supplies-service/`.

Dans chaque dossier de service, le fichier `http.ts` est central. Il crée et configure une instance **Axios** dédiée pour ce service. La `baseURL` de l'API est configurable via une variable d'environnement (ex: `VITE_SUPPLIES_API_BASE_URL`).

### Intercepteurs et contexte

Deux intercepteurs Axios sont cruciaux pour le fonctionnement de l'application :

1.  **Intercepteur de Requête (dans chaque `http.ts`)**:
    -   Avant chaque requête, il récupère le contexte actif (établissement et rôle) via `getActiveContext()`.
    -   Il injecte ensuite dynamiquement les en-têtes `X-Etab` et `X-Roles`. **Ceci confirme le refactoring clé remplaçant `X-Etab-Select` et `X-Roles-Select`**.
    -   Il attache également le token d'authentification `Bearer`.

    ```typescript
    // Extrait de src/api/supplies-service/http.ts
    suppliesAxios.interceptors.request.use((config) => {
      // ...
      const { etabId: activeEtabId, role: activeRole } = getActiveContext();
      if (activeEtabId) {
        (config.headers as Record<string, string>)['X-Etab'] = activeEtabId;
      }
      if (activeRole) {
        (config.headers as Record<string, string>)['X-Roles'] = activeRole;
      }
      return config;
    });
    ```

2.  **Intercepteur de Réponse (centralisé)**:
    -   Le fichier `src/api/httpAuth.ts` contient une fonction `attachAuthRefresh`.
    -   Cette fonction attache un intercepteur qui gère le renouvellement de token. Si une API retourne une erreur `401 Unauthorized`, il tente de rafraîchir le token via Keycloak et de rejouer la requête automatiquement.

### Tableau récapitulatif des services API

L'application intègre **13 microservices** via des clients API générés automatiquement. Chaque service dispose de ses propres hooks personnalisés pour l'intégration frontend.

| Service | Rôle Principal | Documentation Détaillée |
|---------|---------------|-------------------------|
| **admission-service** | Gestion des admissions | [📋 admission-service.md](functional/api-workflows/admission-service.md) |
| **classe-service** | Gestion des classes | [📋 classe-service.md](functional/api-workflows/classe-service.md) |
| **competence-service** | Référentiels pédagogiques | [📋 competence-service.md](functional/api-workflows/competence-service.md) |
| **establishment-service** | Gestion des établissements | [📋 establishment-service.md](functional/api-workflows/establishment-service.md) |
| **event-service** | Événements et agenda | [📋 event-service.md](functional/api-workflows/event-service.md) |
| **identity-service** | Identités et onboarding | [📋 identity-service.md](functional/api-workflows/identity-service.md) |
| **message-service** | Messagerie interne | [📋 message-service.md](functional/api-workflows/message-service.md) |
| **pdi-service** | Plans de développement | [📋 pdi-service.md](functional/api-workflows/pdi-service.md) |
| **provisioning-service** | Provisioning comptes | [📋 provisioning-service.md](functional/api-workflows/provisioning-service.md) |
| **resource-service** | Ressources pédagogiques | [📋 resource-service.md](functional/api-workflows/resource-service.md) |
| **student-service** | Gestion des élèves | [📋 student-service.md](functional/api-workflows/student-service.md) |
| **supplies-service** | Campagnes de fournitures | [📋 supplies-service.md](functional/api-workflows/supplies-service.md) |
| **timetable-service** | Emplois du temps | [📋 timetable-service.md](functional/api-workflows/timetable-service.md) |

> 📚 **Documentation complète** : Consultez [functional/README.md](functional/README.md) pour une vue d'ensemble des workflows fonctionnels.

## E. Domaines fonctionnels clés

Les domaines fonctionnels majeurs sont documentés en détail dans des fichiers dédiés :

### 🔗 **Workflows Intégrés (API)**
- **📋 Onboarding** : Import utilisateurs CSV → [identity-service.md](functional/api-workflows/identity-service.md) & [provisioning-service.md](functional/api-workflows/provisioning-service.md)
- **📋 Fournitures** : Campagnes et listes → [supplies-service.md](functional/api-workflows/supplies-service.md)  
- **📋 Compétences** : Référentiels pédagogiques → [competence-service.md](functional/api-workflows/competence-service.md)
- **📋 Classes** : Gestion classes/élèves → [classe-service.md](functional/api-workflows/classe-service.md)
- **📋 Emplois du temps** : Planning et remplacements → [timetable-service.md](functional/api-workflows/timetable-service.md)

### 🔗 **Workflows Mockés (Données simulées)**
- **📋 Dashboard KPIs** : Statistiques → [mock-workflows/](functional/mock-workflows/)
- **📋 Notifications** : Système d'alertes → [mock-workflows/](functional/mock-workflows/)
- **📋 Gestion utilisateurs** : Interface admin → [mock-workflows/admin-utilisateurs.md](functional/mock-workflows/admin-utilisateurs.md)

> 📚 **Navigation complète** : Consultez [functional/README.md](functional/README.md) pour l'index complet des workflows.

## F. États, données et gestion des erreurs

-   **Store**: Pas de store externe comme Redux/Zustand. L'état global est géré par l'**API Context** de React. Chaque contexte est dédié à un domaine (`OnboardingContext`, `FilterContext`, `IdentityContextProvider`). `IdentityContextProvider` est le plus critique, car il fournit le contexte de l'utilisateur (établissement, rôle) à toute l'application.
-   **Hooks personnalisés**: C'est la stratégie centrale pour la gestion des données.
    -   **Nommage**: `use[Ressource]` pour la lecture (ex: `useClasses`), `use[Action][Ressource]` pour l'écriture (ex: `useCreateClasse`).
    -   **Responsabilité**: Chaque hook encapsule l'appel API, la logique de `@tanstack/react-query`, la gestion des clés de cache et les invalidations.
-   **Gestion des erreurs**:
    -   Les hooks `useQuery` retournent un état `isError` et un objet `error`, qui sont utilisés dans les composants pour afficher des messages d'erreur.
    -   Des composants comme `ErrorsTable.tsx` sont utilisés pour afficher des listes d'erreurs de validation de manière structurée.
    -   Les notifications `toast` (`react-hot-toast`) sont utilisées pour le feedback utilisateur immédiat après une action.

## G. Conventions de code et bonnes pratiques

-   **Nommage**:
    -   Fichiers/Composants: `PascalCase.tsx` (ex: `TeacherSuppliesPage.tsx`).
    -   Hooks: `useCamelCase.ts` (ex: `useSuppliesTeacherList.ts`).
-   **Typage**: Le projet utilise TypeScript de manière extensive. Les types API sont générés et importés depuis les dossiers `src/api/*/`.
-   **Styleguide UI**: Le projet utilise une combinaison de composants UI personnalisés (`src/components/ui/`) et de composants headless de `@radix-ui`, stylisés avec Tailwind CSS. La cohérence est assurée par la configuration dans `tailwind.config.js` et les tokens dans `src/theme.tsx`.

## H. Localisation/i18n

-   **Bibliothèque**: `i18next` avec `react-i18next`.
-   **Configuration**: `src/i18n.ts`. Les traductions sont chargées dynamiquement depuis le serveur grâce à `i18next-http-backend`.
-   **Organisation des fichiers**: Les traductions se trouvent dans `public/locales/`. Chaque langue a un dossier (ex: `fr`, `en`) contenant un `translation.json`.
-   **Comment ajouter/modifier des traductions**:
    1.  **Ajouter une clé**: Ajoutez la même clé dans `public/locales/fr/translation.json` et `public/locales/en/translation.json`.
    2.  **Ajouter une langue**: Créez un nouveau dossier (ex: `public/locales/es/`) et copiez-y un `translation.json` traduit. `i18next` la détectera automatiquement.

## I. Sécurité et contexte

-   **Gestion des en-têtes**: Les en-têtes `X-Etab` et `X-Roles`, cruciaux pour l'architecture multi-tenant, sont injectés dans chaque requête API par un intercepteur Axios situé dans les fichiers `src/api/*/http.ts`.
-   **Propagation du contexte**: Le contexte est initialement défini lors de la connexion ou via la page de sélection de contexte (`/select-contexte`). Il est stocké et géré par le `IdentityContextProvider` (`src/contexts/IdentityContextProvider.tsx`) et mis à disposition du reste de l'application.
-   **Accès conditionnel**: Le contrôle d'accès est géré à plusieurs niveaux :
    -   **Niveau Route**: L'objet `routesByRole` dans `App.tsx` n'affiche que les routes autorisées pour le rôle de l'utilisateur.
    -   **Niveau Composant**: Les composants peuvent conditionner l'affichage de certains éléments en fonction du rôle de l'utilisateur (ex: un bouton "Admin seulement").

## J. Roadmap et extensions

> 📚 **Documentation détaillée** : Consultez [ARCHITECTURE.md](ARCHITECTURE.md) pour l'architecture complète et [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) pour les guides d'intégration.

**Points d'extension** : L'architecture modulaire facilite l'ajout de nouvelles fonctionnalités selon le pattern établi (pages → hooks → composants → routes).

---

## 📚 **Ressources Complémentaires**

| Documentation | Description |
|---------------|-------------|
| [📋 ARCHITECTURE.md](ARCHITECTURE.md) | Architecture générale et structure du projet |
| [📋 API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | Guide d'intégration des APIs |
| [📋 CODING_STANDARDS.md](CODING_STANDARDS.md) | Standards de développement |
| [📋 functional/README.md](functional/README.md) | Index des workflows fonctionnels |
| [📋 functional/_templates/](functional/_templates/) | Templates pour documenter de nouveaux modules |

## ⚠️ **Points d'Attention**

-   **Contexte requis** : Vérifiez que `IdentityContext` est initialisé pour les fonctionnalités multi-tenant
-   **DTOs générés** : Ne modifiez jamais les fichiers dans `src/api/*/` - ils sont auto-générés
-   **Headers automatiques** : `X-Etab` et `X-Roles` sont injectés automatiquement par les intercepteurs
-   **Valider côté client**: Comme vu dans l'Onboarding, la tendance est de déléguer la validation métier complexe à l'API. Évitez de dupliquer cette logique côté front, sauf pour des validations de format simples (ex: email).