
# DEVBOOK.md - Documentation Technique du Frontend Ed-Connect

Ce document sert de référence technique pour les développeurs travaillant sur le projet frontend Ed-Connect. Il détaille l'architecture, les fonctionnalités implémentées, celles en cours de développement, et propose des pistes pour les prochaines étapes.

---

## 1. Fonctionnalités Déjà Développées

Cette section liste les fonctionnalités matures et stables du projet.

### 1.1. Architecture Générale et Stack Technique

- **Framework** : React 18+ avec Vite.js comme bundler.
- **Langage** : TypeScript pour un typage robuste.
- **Style** : TailwindCSS avec une configuration centralisée (`tailwind.config.js`) et une approche "utility-first".
- **Composants UI** : Utilisation de `shadcn/ui` pour une bibliothèque de composants de base, accessible et personnalisable (`components.json`).
- **Structure de Projet** : L'organisation du dossier `src` est modulaire et suit les meilleures pratiques :
  - `pages/` : Contient les composants de haut niveau pour chaque route.
  - `components/` : Contient les composants réutilisables (UI, graphiques, etc.).
  - `layouts/` : Gère la mise en page globale (ex: `DashboardLayout`).
  - `contexts/` : Pour la gestion d'état partagé (ex: `AuthContext`, `ResourceContext`).
  - `hooks/` : Pour la logique réutilisable.
  - `lib/` : Utilitaires et données mock.

### 1.2. Système d'Authentification et de Rôles (RBAC)

C'est la fonctionnalité la plus complète et la plus critique du projet.

- **Description** : L'application intègre un système d'authentification robuste basé sur Keycloak. L'accès aux différentes pages et fonctionnalités est strictement contrôlé par le rôle de l'utilisateur.
- **Composants Clés** :
  - `src/pages/authentification/keycloak.ts` : Configuration de l'instance Keycloak.
  - `src/pages/authentification/AuthContext.tsx` : Fournisseur de contexte qui gère l'état de l'authentification (utilisateur, rôles, statut de chargement), l'initialisation de Keycloak, et les fonctions `login`/`logout`.
  - `src/pages/authentification/useAuth.tsx` : Hook simplifié pour consommer le `AuthContext`.
- **Dépendances** : `keycloak-js`.
- **Logique Noteworthy** :
  - **Login Forcé** : La configuration `onLoad: 'login-required'` redirige automatiquement les utilisateurs non connectés vers la page de connexion de Keycloak.
  - **Transformation des Rôles** : Une fonction `transformRoles` dans `AuthContext.tsx` mappe les rôles bruts de Keycloak (ex: `ROLE_ENSEIGNANT`) à des rôles simplifiés utilisés dans le frontend (ex: `enseignant`), ce qui découple l'application de la configuration de Keycloak.
  - **Mode Mock** : Une variable `MOCK_AUTH` permet de désactiver Keycloak pour le développement local, facilitant le travail sur l'UI sans dépendre du service d'authentification.

### 1.3. Routage Applicatif

- **Description** : Le routage de l'application est géré de manière centralisée et est directement lié au système de rôles.
- **Composant Principal** : `src/App.tsx`.
- **Dépendances** : `react-router-dom`.
- **Logique** : Le composant `AppContent` détermine le rôle principal de l'utilisateur connecté et rend dynamiquement les routes autorisées pour ce rôle à l'intérieur d'un `DashboardLayout`.

### 1.4. Tableau de Bord Enseignant (UI)

- **Description** : Le tableau de bord de l'enseignant est une page riche en fonctionnalités UI, servant de prototype avancé pour la visualisation de données.
- **Composant Principal** : `src/pages/enseignants/EnseignantDashboard.tsx`.
- **Fonctionnalités UI** :
  - **Visualisation de Données** : Intégration de graphiques complexes comme `QuadrantChart` et `ProgressionChart`.
  - **Composants Interactifs** : Cartes d'action, en-têtes de cours, sélecteurs de date, et `Combobox` pour le filtrage.
  - **Internationalisation** : Utilisation de `react-i18next` pour un affichage multilingue.
- **Dépendances** : `lucide-react` pour les icônes, `react-i18next`.

---

## 2. Fonctionnalités Non Encore Développées (ou Incomplètes)

Cette section liste les fonctionnalités qui existent dans le code mais qui sont incomplètes ou non fonctionnelles.

### 2.1. Intégration avec les APIs Backend

**C'est le point le plus important.** Actuellement, l'application ne communique pas avec les microservices backend.

- **Symptôme** : Toutes les pages affichant des données (ex: `EnseignantDashboard.tsx`) utilisent des **données de test (mock data)**, soit importées depuis `src/lib/mock-data.ts`, soit codées en dur dans les composants.
- **Impact** : L'application est une coquille UI/UX fonctionnelle mais déconnectée des données réelles. Aucune donnée n'est créée, lue, mise à jour ou supprimée via des appels API.

### 2.2. Pages "Placeholder"

Plusieurs pages définies dans le routeur sont des "coquilles vides".

- **Exemples** :
  - `src/pages/Eleves.tsx` : Ne contient qu'un simple `div`.
  - `src/pages/Evaluations.tsx`, `src/pages/Rapport.tsx`, etc. sont probablement dans un état similaire.
- **Raison** : L'architecture de routage a été mise en place, mais le contenu de chaque page n'a pas encore été développé.

### 2.3. Logique d'Actions Incomplète

Sur les pages où l'UI est développée, certaines actions ne sont pas implémentées.

- **Exemple** : Dans `EnseignantDashboard.tsx`, le bouton "Ajouter une fiche" (`ActionCard`) exécute un simple `console.log`. Les fonctions de changement de filtre (`onClasseChange`, `onDateChange`) sont également des placeholders.

---

## 3. Suggestions de Développement

Basé sur l'analyse, voici des pistes logiques pour les prochaines étapes de développement.

### 3.1. Connecter le Frontend aux APIs Backend

C'est la priorité absolue pour rendre l'application fonctionnelle.

- **Action** : Remplacer progressivement toutes les utilisations de données mock par des appels API réels.
- **Suggestion d'Outil** : Envisager l'utilisation d'une bibliothèque de data-fetching comme **TanStack Query (React Query)**. Elle simplifie la gestion du cache, des états de chargement/erreur, et la synchronisation des données, et s'intègre parfaitement avec une architecture à base de hooks.
- **Méthodologie** :
  1. Créer une couche de services API (ex: `src/services/eleveService.ts`) pour centraliser les appels `fetch` ou `axios`.
  2. Créer des hooks personnalisés (ex: `useEleves`) qui utilisent TanStack Query et le service correspondant pour récupérer les données.
  3. Remplacer les données mock dans les composants par les données fournies par ces hooks.

### 3.2. Développer le Contenu des Pages Placeholder

- **Action** : Implémenter l'interface utilisateur et la logique pour les pages vides comme `Eleves.tsx`, `Evaluations.tsx`, etc., en s'inspirant de la structure et des composants déjà présents dans `EnseignantDashboard.tsx`.

### 3.3. Compléter la Logique des Actions Utilisateur

- **Action** : Implémenter la logique derrière les boutons et les filtres. Par exemple, faire en sorte que le bouton "Ajouter une fiche" ouvre un formulaire (modal ou nouvelle page) et envoie les données à l'API.

### 3.4. Mettre en Place des Tests

- **Action** : Le projet est maintenant assez mature pour commencer à intégrer des tests afin de garantir la non-régression.
- **Suggestions** :
  - **Tests Unitaires** : Utiliser **Vitest** et **React Testing Library** pour tester des composants individuels et des hooks (ex: tester la logique du hook `useAuth` en mode mock).
  - **Tests d'Intégration** : Tester des flux utilisateurs simples (ex: un enseignant se connecte et voit son tableau de bord).
  - **Tests E2E (End-to-End)** : Envisager **Cypress** ou **Playwright** pour tester des scénarios complets dans un vrai navigateur.

### 3.5. Améliorer la Gestion de l'État Global

- **Description** : `Context` est bien pour des états simples, mais pour des données plus complexes et transversales (comme les listes d'élèves, les cours, etc.), il peut devenir lourd.
- **Suggestion** : Pour l'état global qui n'est pas lié au serveur (ex: préférences UI, état d'un formulaire complexe), envisager un gestionnaire d'état comme **Zustand**. Il est beaucoup plus léger et simple à utiliser que Redux et évite les re-renders inutiles souvent associés au `Context`.
