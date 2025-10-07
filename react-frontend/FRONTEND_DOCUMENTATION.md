# Documentation Technique du Frontend Edconnekt

## Table des Matières

1.  [Introduction](#introduction)
2.  [Architecture Générale](#architecture-générale)
    *   [Stack Technique Principale](#stack-technique-principale)
    *   [Structure des Répertoires](#structure-des-répertoires)
3.  [Technologies Utilisées (Détail)](#technologies-utilisées-détail)
    *   [Framework & Langage](#framework--langage)
    *   [Outil de Build](#outil-de-build)
    *   [Styling](#styling)
    *   [Composants UI](#composants-ui)
    *   [Routage](#routage)
    *   [Gestion d'État](#gestion-détat)
    *   [Authentification](#authentification)
    *   [Internationalisation (i18n)](#internationalisation-i18n)
    *   [Autres Bibliothèques Notables](#autres-bibliothèques-notables)
4.  [Composants Clés](#composants-clés)
    *   [`App.tsx` (Racine et Routage)](#apptsx-racine-et-routage)
    *   [`main.tsx` (Point d'Entrée)](#maintsx-point-dentrée)
    *   [`DashboardLayout.tsx`](#dashboardlayouttsx)
    *   [Composants `src/components/ui/`](#composants-srccomponentsui)
    *   [`EnseignantDashboard.tsx`](#enseignantdashboardtsx)
    *   [`AuthContext.tsx` & `useAuth.tsx`](#authcontexttsx--useauthtsx)
5.  [Gestion d'État](#gestion-détat-1)
    *   [React Context API](#react-context-api)
    *   [Flux de Données avec Context](#flux-de-données-avec-context)
    *   [Considérations Futures (TanStack Query, Zustand)](#considérations-futures-tanstack-query-zustand)
    *   [État Local des Composants](#état-local-des-composants)
6.  [Routage](#routage-1)
    *   [Principes Clés](#principes-clés)
    *   [Fonctionnement Détaillé](#fonctionnement-détaillé-1)
7.  [Organisation de l'Interface Utilisateur (UI)](#organisation-de-linterface-utilisateur-ui)
    *   [Système de Layout Principal](#système-de-layout-principal)
    *   [Styling avec Tailwind CSS](#styling-avec-tailwind-css-1)
    *   [Bibliothèque de Composants UI (`shadcn/ui`)](#bibliothèque-de-composants-ui-shadcnui)
    *   [Internationalisation et Thème](#internationalisation-et-thème)
8.  [Environnement de Développement](#environnement-de-développement)
    *   [Prérequis](#prérequis)
    *   [Configuration](#configuration)
    *   [Lancer le Projet en Local](#lancer-le-projet-en-local)
    *   [Autres Scripts Utiles](#autres-scripts-utiles)
9.  [Informations Utiles pour les Développeurs](#informations-utiles-pour-les-développeurs)
    *   [Conventions de Codage](#conventions-de-codage)
    *   [Gestion des Dépendances](#gestion-des-dépendances)
    *   [Importance du `DEVBOOK.md`](#importance-du-devbookmd)
    *   [Intégration Backend (État Actuel et Futur)](#intégration-backend-état-actuel-et-futur)
    *   [Tests](#tests)
    *   [Débogage](#débogage)

---

## Introduction

Ce document fournit une documentation technique complète du frontend de l'application Edconnekt. Il est destiné aux développeurs rejoignant le projet et vise à faciliter leur intégration en décrivant l'architecture, les technologies utilisées, les composants clés, et les procédures de développement.

Points clés récents:
- Multi-tenant généralisé via intercepteurs HTTP: envoi `X-Etab-Select`/`X-Role-Select`, réception `X-Etab`/`X-Role` et mise à jour du contexte global.
- Contexte d'identité global (`IdentityContextProvider`) et sélecteur de contexte (`ContextSelectModal`) permettant de choisir établissement et rôle.
- Utilisation étendue de TanStack Query pour l'état serveur (cache, invalidations, revalidation).

Voir également `docs/IDENTITY_CONTEXT.md` pour les détails d’implémentation multi-tenant.

Pour des informations spécifiques sur l'avancement des fonctionnalités et les décisions de conception, veuillez également consulter le fichier `DEVBOOK.md` situé à la racine de ce projet frontend.

## Architecture Générale

L'application frontend Ed-Connect est une **Single Page Application (SPA)** conçue pour offrir une expérience utilisateur riche et interactive.

### Stack Technique Principale

*   **Framework :** React 18+
*   **Langage :** TypeScript
*   **Outil de Build :** Vite.js
*   **Styling :** Tailwind CSS
*   **Composants UI :** shadcn/ui (basé sur Radix UI)
*   **Routage :** React Router DOM v6
*   **Gestion d'État :** React Context API + TanStack Query (état serveur). Zustand reste optionnel pour de futurs besoins d’état client complexe.
*   **Authentification :** Keycloak

### Structure des Répertoires

La structure du code source (`react-frontend/src/`) est modulaire pour une meilleure organisation et maintenabilité :

*   **`main.tsx`**: Point d'entrée principal, initialise React et les contextes globaux.
*   **`App.tsx`**: Composant racine, gère le routage principal basé sur les rôles.
*   **`pages/`**: Contient les composants de haut niveau pour chaque vue/page de l'application.
    *   Organisés en sous-répertoires par fonctionnalité ou rôle (ex: `eleves/`, `enseignants/`, `authentification/`).
*   **`components/`**: Héberge tous les composants réutilisables.
    *   **`ui/`**: Composants UI de base (issus de `shadcn/ui` comme `Button`, `Card`, `Input`).
    *   Autres sous-répertoires pour des composants plus spécifiques (ex: `charts/`, `agenda/`, `Header/`).
*   **`api/`**: Clients API organisés par service (ex: `identity-service/`, `student-service/`, `timetable-service/`, etc.) contenant:
    *   `client.ts`/`api.ts` générés ou écrits pour chaque service
    *   `http.ts` avec intercepteurs multi-tenant (envoi `X-Etab-Select`/`X-Role-Select`, réception `X-Etab`/`X-Role`).
*   **`layouts/`**: Composants de mise en page (ex: `DashboardLayout.tsx`).
*   **`contexts/`**: Providers pour la gestion d'état partagé via React Context API (ex: `AuthContext.tsx`, `IdentityContextProvider.tsx`, `EventContext.tsx`).
*   **`hooks/`**: Hooks React personnalisés pour la logique réutilisable (ex: `useAuth.tsx`, `useDarkMode.ts`).
*   **`lib/`**: Fonctions utilitaires, constantes, et actuellement, les données mockées (ex: `utils.ts`, `mock-data.ts`).
*   **`config/`**: Configurations spécifiques à l'application (ex: `navigation.tsx` pour les menus).
*   **`assets/`**: Fichiers statiques (images, logos).
*   **`i18n.ts`**: Configuration pour l'internationalisation avec `i18next`.
*   **`theme.tsx`**: Code lié à la gestion du thème (ex: mode sombre/clair).

## Technologies Utilisées (Détail)

### Framework & Langage

*   **React 18+ (`react`, `react-dom`) :** Bibliothèque JavaScript pour la construction d'interfaces utilisateur. L'application utilise les fonctionnalités modernes de React, y compris les hooks et les composants fonctionnels.
*   **TypeScript (`typescript`) :** Sur-ensemble de JavaScript qui ajoute un typage statique, améliorant la robustesse et la maintenabilité du code. Tous les nouveaux développements doivent être en TypeScript.

### Outil de Build

*   **Vite.js (`vite`, `@vitejs/plugin-react-swc`) :** Outil de build frontend nouvelle génération qui offre un démarrage de serveur de développement extrêmement rapide et un HMR (Hot Module Replacement) performant. La configuration se trouve dans `vite.config.ts`.
    *   Utilise SWC pour la compilation React.
    *   Alias de chemin (`@/`) configuré pour pointer vers `src/`.

### Styling

*   **Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`) :** Framework CSS "utility-first" pour construire rapidement des designs personnalisés. La configuration est dans `tailwind.config.js`.
    *   Supporte un mode sombre (`darkMode: 'class'`).
    *   Couleurs et thème personnalisés.
*   **`clsx`, `tailwind-merge` :** Utilitaires pour la gestion conditionnelle et la fusion des classes Tailwind.
*   **CSS global/modules :** Fichiers `src/index.css` et `src/App.css` pour les styles globaux ou spécifiques.

### Composants UI

*   **`shadcn/ui` (`components.json`, dépendances `@radix-ui/*`) :** Collection de composants UI réutilisables, accessibles et stylisables, construits avec Radix UI et Tailwind CSS. Les composants sont ajoutés via une CLI et résident directement dans `src/components/ui/`.
*   **Radix UI (`@radix-ui/*`) :** Fournit des primitives de composants UI "headless" (non stylisées) axées sur l'accessibilité et l'interaction.
*   **Lucide React (`lucide-react`) & React Icons (`react-icons`) :** Bibliothèques d'icônes SVG.
*   **`class-variance-authority` :** Utilisé pour créer des variantes de composants stylisées avec Tailwind CSS.

### Routage

*   **React Router DOM v6 (`react-router-dom`) :** Bibliothèque standard pour le routage dans les applications React. Gère la navigation et l'affichage conditionnel des composants en fonction de l'URL.

### Gestion d'État

*   **React Context API :** Pour l’état global (authentification, contexte d’identité multi-tenant, préférences UI, etc.).
*   **TanStack Query (React Query) :** Utilisé pour l’état serveur (appels API, cache, revalidation, invalidation ciblée).
*   **Zustand (optionnel) :** Potentiel pour des besoins d’état client plus complexes.

### Authentification

*   **Keycloak (`keycloak-js`, `@react-keycloak/web`) :** Solution de gestion d'identité et d'accès open source. Utilisée pour sécuriser l'application et gérer les rôles utilisateurs.
    *   Configuration dans `src/pages/authentification/keycloak.ts`.
    *   Logique d'intégration dans `src/pages/authentification/AuthContext.tsx`.
    *   Support d'un mode mock pour le développement local.

### Internationalisation (i18n)

*   **`i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector` :** Ensemble de bibliothèques pour l'internationalisation.
    *   Configuration dans `src/i18n.ts`.
    *   Fichiers de traduction dans `public/locales/{lang}/translation.json`.

### Autres Bibliothèques Notables

*   **`date-fns`, `dayjs` :** Manipulation et formatage des dates et heures. `dayjs` est synchronisé avec `i18next`.
*   **`recharts` :** Bibliothèque de graphiques/diagrammes.
*   **FullCalendar (`@fullcalendar/*`) :** Pour les fonctionnalités d'agenda.
*   **`react-dropzone` :** Gestion du téléversement de fichiers par glisser-déposer.
*   **`jspdf`, `jspdf-autotable` :** Génération de documents PDF côté client.
*   **`xlsx`, `jszip` :** Manipulation de fichiers Excel (lecture/écriture) et archives Zip.
*   **ESLint (`eslint`, `typescript-eslint`, etc.) :** Linter pour la qualité et la cohérence du code.

## Composants Clés

### `App.tsx` (Racine et Routage)

*   **Rôle :** Configure `react-router-dom` et gère la logique de routage principale basée sur les rôles et l'état d'authentification.
*   **Fonctionnement :** Utilise `useAuth` pour déterminer si l'utilisateur est connecté et quels sont ses rôles. Rend dynamiquement les routes autorisées (définies dans `routesByRole`) à l'intérieur du `DashboardLayout`. Gère les redirections pour les utilisateurs non authentifiés ou ceux tentant d'accéder à `/login` en étant déjà connectés.

### `main.tsx` (Point d'Entrée)

*   **Rôle :** Premier script exécuté. Rend le composant `App` dans le DOM.
*   **Fonctionnement :** Initialise `i18next`, `dayjs`, et enveloppe `App` avec les providers de contexte globaux (`AuthProvider`, `FilterProvider`, `EventProvider`, `StudentProvider`, `ResourceProvider` via `App.tsx`).

### `DashboardLayout.tsx`

*   **Rôle :** Situé dans `src/layouts/`, il fournit la structure visuelle commune (barre latérale de navigation, en-tête) pour les pages accessibles après connexion.
*   **Fonctionnement :** Reçoit le `role` de l'utilisateur pour afficher les menus de navigation appropriés (depuis `src/config/navigation.tsx`). Utilise `<Outlet />` de `react-router-dom` pour afficher le contenu de la page active.

### Composants `src/components/ui/`

*   **Rôle :** Collection de composants UI de base, réutilisables, stylisés avec Tailwind CSS, et souvent basés sur `shadcn/ui` et Radix UI (ex: `Button.tsx`, `Card.tsx`, `Dialog.tsx`, `Input.tsx`, `Select.tsx`).
*   **Fonctionnement :** Servent de blocs de construction pour des interfaces plus complexes. Ils encapsulent le style et le comportement de base des éléments d'interaction.

### `EnseignantDashboard.tsx`

*   **Rôle :** Page d'accueil pour les enseignants (`src/pages/enseignants/`), citée dans `DEVBOOK.md` comme un exemple d'interface utilisateur avancée.
*   **Fonctionnement :** Agrège et affiche des informations, des graphiques (`recharts`), et des éléments interactifs. Peut recourir à des données mockées en développement.

### `AuthContext.tsx` & `useAuth.tsx`

*   **Rôle :** Situés dans `src/pages/authentification/`, ils centralisent la logique et l'état d'authentification avec Keycloak.
*   **Fonctionnement :** `AuthContext` gère l'initialisation de Keycloak, l'état de l'utilisateur (`isAuthenticated`, `user`, `roles`), les fonctions `login`/`logout`, et un mode mock. `useAuth` est un hook pour consommer facilement ce contexte.

### `IdentityContextProvider.tsx` & `ContextSelectModal.tsx` & `Topbar`

*   **Rôle :** Gèrent le contexte multi-tenant (établissement et rôle actifs) et exposent une UI pour la sélection/modification.
*   **Fonctionnement :**
    * `IdentityContextProvider` synchronise le contexte global avec les en-têtes reçus (`X-Etab`, `X-Role`) et fournit `activeEtabId`/`activeRole`.
    * `ContextSelectModal` permet à l’utilisateur de choisir l’établissement/le rôle disponibles.
    * La barre supérieure (`Topbar`) expose un bouton pour ouvrir le sélecteur de contexte.

## Gestion d'État

L'état de l'application est géré via une combinaison de l'API React Context et de l'état local des composants.

### React Context API

Utilisé pour l'état global ou partagé à travers de multiples composants :

*   **`AuthProvider` (`AuthContext`) :** État d'authentification, informations utilisateur, rôles.
*   **`IdentityContextProvider` :** Contexte multi-tenant (établissement/rôle actifs), intégré aux intercepteurs HTTP.
*   **`ResourceProvider` (`ResourceContext`) :** Gestion des ressources pédagogiques (actuellement mock).
*   **`EventProvider` (`EventContext`) :** Gestion des événements (pour l'agenda, etc.).
*   **`StudentProvider` (`StudentContext`) :** Gestion des données des élèves.
*   **`FilterProvider` (`FilterContext`) :** Gestion des filtres globaux partagés.

### Flux de Données avec Context

1.  **Provider :** Les composants `*Provider` enveloppent les parties de l'application nécessitant leur état.
2.  **Consommation :** Via `useContext(MonContext)` ou un hook personnalisé (ex: `useAuth`).
3.  **Mise à Jour :** Via des fonctions exposées par le contexte, modifiant son état.
4.  **Re-rendu :** Les composants consommateurs sont re-rendus lors des changements d'état du contexte.

### État Serveur avec TanStack Query

*   **Cache & Revalidation :** Gestion automatique du cache, `staleTime`, `placeholderData`, `refetchOnWindowFocus` configurable.
*   **Invalidations ciblées :** Utiliser `queryClient.invalidateQueries({ queryKey: [...] })` après mutations.
*   **Clés de requête stables :** Preférez des clés structurées (ex: `['students', { page, classId, search }]`).

### État Local des Composants

`useState` et `useReducer` sont utilisés pour gérer l'état spécifique à un composant qui n'a pas besoin d'être partagé (ex: état d'un formulaire, visibilité d'un dropdown).

## Routage

Géré par `react-router-dom` v6, configuré principalement dans `src/App.tsx`.

### Principes Clés

*   **Centralisé :** `AppContent` dans `App.tsx` est le cœur du routage.
*   **Basé sur les Rôles (RBAC) :** L'accès aux pages est contrôlé par le rôle de l'utilisateur authentifié.
*   **Layout Commun :** `DashboardLayout.tsx` pour les routes protégées.
*   **Redirection Automatique :** Vers `/login` si non authentifié, ou vers `/` si authentifié et tentant d'accéder à `/login`.

### Fonctionnement Détaillé

1.  **`BrowserRouter` :** Enveloppe l'application dans `App.tsx`.
2.  **`AppContent` :**
    *   Vérifie l'authentification via `useAuth()`.
    *   Affiche `AppLoader` pendant le chargement.
    *   Si non authentifié, affiche les routes publiques (principalement `/login`).
    *   Si authentifié, détermine le rôle principal, sélectionne les routes autorisées depuis `routesByRole` (objet mappant rôle à un tableau de routes `{path, element}`).
    *   Rend ces routes à l'intérieur du `DashboardLayout` via `<Outlet />`.
3.  **`routesByRole` :** Objet dans `App.tsx` définissant les pages accessibles pour chaque rôle.
4.  **`DashboardLayout.tsx` :** Utilise la prop `role` et `<Outlet />` pour afficher la page correcte.
5.  **Navigation :** Via `<Link>` ou `useNavigate()`. Les menus sont générés dynamiquement à partir de `src/config/navigation.tsx`.

## Organisation de l'Interface Utilisateur (UI)

### Système de Layout Principal

*   **`DashboardLayout.tsx` :** Fournit la structure (barre latérale, en-tête, zone de contenu) pour une expérience cohérente. La barre latérale est dynamique en fonction du rôle.

### Styling avec Tailwind CSS

*   **Approche "Utility-First" :** Classes utilitaires pour un développement rapide et personnalisé.
*   **Configuration (`tailwind.config.js`) :**
    *   Mode sombre (`darkMode: 'class'`).
    *   Thème personnalisé (couleurs `g*`, `o*`, et sémantiques `primary`, `secondary` via variables CSS).
*   **Utilitaires :** `clsx` pour les classes conditionnelles, `tailwind-merge` pour la résolution de conflits.

### Bibliothèque de Composants UI (`shadcn/ui`)

*   **Approche :** Composants ajoutés via CLI dans `src/components/ui/`, basés sur Radix UI et stylisés avec Tailwind.
*   **Exemples :** `Button`, `Card`, `Dialog`, `Input`, `Select`, `Toast`.
*   **Avantages :** Contrôle total, personnalisation, accessibilité via Radix.

### Internationalisation et Thème

*   **i18n :** Interface multilingue avec `react-i18next`. Textes dans `public/locales`.
*   **Thème :** `src/theme.tsx` et `src/hook/useDarkMode.ts` gèrent le mode sombre/clair, s'appuyant sur les capacités de Tailwind CSS.

## Environnement de Développement

### Prérequis

*   **Node.js (LTS recommandé) :** Inclut `npm`. (Télécharger sur [nodejs.org](https://nodejs.org/))
*   **Git :** (Télécharger sur [git-scm.com](https://git-scm.com/))
*   **(Optionnel) Yarn :** Si `yarn.lock` est présent. Installer via `npm install --global yarn`.

### Configuration

1.  **Cloner le Référentiel :**
    ```bash
    git clone <URL_DU_REPO_GIT>
    cd nom-du-projet/react-frontend
    ```
2.  **Installer les Dépendances :**
    ```bash
    npm install  # ou yarn install
    ```
3.  **Configurer Keycloak :**
    *   **Mode Mock (développement UI) :** Dans `src/pages/authentification/AuthContext.tsx`, s'assurer que `MOCK_AUTH = true;`.
    *   **Intégration Réelle :** Mettre `MOCK_AUTH = false;` et configurer `src/pages/authentification/keycloak.ts` avec les détails de votre instance Keycloak.
4.  **Variables d'Environnement :** Si un `.env.example` existe, créer `.env` ou `.env.local` et y mettre les configurations locales (ex: `VITE_API_BASE_URL=...`).

### Lancer le Projet en Local

1.  **Démarrer le Serveur de Développement :**
    ```bash
    npm run dev  # ou yarn dev
    ```
    Le serveur démarre sur `http://localhost:8000` (configurable via `--port` dans le script `dev`).
2.  **Accéder à l'Application :** Ouvrir l'URL dans un navigateur.

### Autres Scripts Utiles

(Définis dans `package.json`)

*   `npm run build` (ou `yarn build`) : Construit l'application pour la production dans `dist/`.
*   `npm run preview` (ou `yarn preview`) : Prévisualise le build de production localement.
*   `npm run lint` (ou `yarn lint`) : Analyse le code avec ESLint.
*   `npm run lint:fix` (ou `yarn lint:fix`) : Tente de corriger les erreurs ESLint.

## Informations Utiles pour les Développeurs

### Conventions de Codage

*   **ESLint & TypeScript :** Suivre les règles définies. Utiliser le typage statique.
*   **Nommage :** PascalCase pour composants, camelCase pour variables/fonctions.
*   **Importations :** Utiliser l'alias `@/` pour les chemins depuis `src/`.

### Gestion des Dépendances

*   Via `npm` ou `yarn`. Mettre à jour avec `npm install` / `yarn install` après des changements dans `package.json`.

### Importance du `DEVBOOK.md`

*   **À LIRE ABSOLUMENT.** Contient des informations cruciales sur l'architecture, les fonctionnalités (complètes et incomplètes), et les pistes de développement futures.

### Intégration Backend (État Actuel et Futur)

*   **APIs Réelles :** L’intégration backend s’appuie sur des clients par service sous `src/api/*-service/`.
*   **Intercepteurs Multi-tenant :** Chaque `http.ts` envoie `X-Etab-Select`/`X-Role-Select` et persiste le contexte confirmé via `X-Etab`/`X-Role`.
*   **Legacy supprimé :** Plus d’utilisation de `X-Establishment-Id` ni de `current-etab-id` pour les headers. Voir `docs/IDENTITY_CONTEXT.md`.
*   **TanStack Query :** Utilisé pour l’état serveur (fetch, cache, invalidations) et la cohérence des écrans.

#### Etablissement Service – Intégration UI (Mises à jour récentes)

* Salles unifiées via establishment-service:
  * Feature flag `src/config/featureFlags.ts` `roomsFromEstablishment` activé par défaut.
  * Pages: `src/pages/admin/etablissements/EtablissementDetailPage.tsx` (onglets Bâtiments/Salles), `src/pages/directeur/EmploiDuTempsPage.tsx` (sélection des salles basée sur l’établissement).
  * Hook ajouté: `src/hooks/useAllEstablishmentRooms.ts` (agrège les salles de tous les bâtiments).

* Bâtiments et salles:
  * CRUD bâtiments/salles opérationnels via establishment-service.
  * Formulaire salle inclut `type_salle` (enum: CLASSROOM, LAB, OFFICE, OTHER), `capacite`, `etage`.

* Audit établissement:
  * Liste, statistiques, export CSV, création manuelle OK.
  * Résumé d’audit (N jours) ajouté dans l’onglet Audit.

* Établissements publics:
  * Intégrés à `src/pages/context/SelectContextPage.tsx` avec pagination (limit/offset).

* Normalisation des champs établissement:
  * `EtablissementFormModal` mappe `date_debut`/`date_fin` vers `subscription_start`/`subscription_end` (format ISO) et filtre les payloads aux champs du schéma.

### Tests

*   **À Développer :** `DEVBOOK.md` suggère Vitest, React Testing Library, Cypress/Playwright. Actuellement, la couverture de test semble minimale ou inexistante.

### Débogage

*   **Outils Navigateur :** Inspecteur, Console, Réseau.
*   **React DevTools (Extension) :** Indispensable pour inspecter les composants React.
*   `console.log()`, `debugger;`.
*   **Vérification Multi-tenant :** Sur l’onglet Réseau, confirmer l’envoi des en-têtes `X-Etab-Select`/`X-Role-Select` et la réception de `X-Etab`/`X-Role`.

---

Cette documentation devrait servir de guide complet pour comprendre et contribuer efficacement au projet frontend Edconnekt.
