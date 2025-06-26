
# RÉPUBLIQUE DU SÉNÉGAL

## UNIVERSITÉ [Nom de votre université]

### ÉCOLE [Nom de votre école ou faculté]

#### DÉPARTEMENT [Nom de votre département]

---

# MÉMOIRE DE FIN DE CYCLE

## Pour l’obtention du DIPLÔME DE [Intitulé de votre diplôme]

---

### SUJET

**Conception et réalisation du frontend d'une plateforme éducative moderne : Le cas Edconnekt**

**Lieu de stage :** [Nom de l'entreprise]

**Période stage :** [Date de début] - [Date de fin]

| Présenté et soutenu par | Encadreur | Maître de stage |
| :--- | :--- | :--- |
| **[Votre Nom Complet]** | [Nom de votre encadreur] | [Nom de votre maître de stage] |

**Année universitaire :** [Année universitaire]

---

## Avant-propos

*[Cette section est personnelle. Décrivez ici le contexte de votre stage dans le cadre de votre formation, comme dans l'exemple fourni.]*

## Remerciements

*[Cette section est personnelle. Exprimez ici votre gratitude envers les personnes qui vous ont aidé durant votre stage et la rédaction de ce mémoire.]*

## Dédicaces

*[Cette section est personnelle. Dédiez ce travail aux personnes de votre choix.]*

---

## Table des matières

- **Chapitre 1 : Étude Générale**
  - I. Présentation générale
    - 1. Présentation de la structure d’accueil
    - 2. Présentation du sujet
  - II. Analyse et Spécifications (Approche UML)
    - 1. Diagramme de cas d’utilisation
    - 2. Descriptions textuelles des cas d'utilisation
    - 3. Diagramme de classe (Modèle du domaine frontend)
- **Chapitre 2 : Étude Technique et Réalisations**
  - I. Architecture
  - II. Choix Technologiques
  - III. Environnement de développement
  - IV. Réalisation
- **Conclusion**
  - Bilan du stage
  - Apports du stage
  - Perspectives d'évolution

---

## Liste des figures

- **Figure 1.1 :** Diagramme de cas d’utilisation *(Suggestion : vous pouvez créer un vrai diagramme et l'insérer ici)*
- **Figure 1.2 :** Diagramme de classe *(Suggestion : vous pouvez créer un vrai diagramme et l'insérer ici)*
- **Figure 2.1 :** Schéma de l'architecture frontend *(Suggestion : schéma montrant l'interaction entre les composants, les hooks et les contexts)*
- **Figure 2.2 :** Capture d'écran de la page de connexion
- **Figure 2.3 :** Capture d'écran du tableau de bord d'un enseignant
- **Figure 2.4 :** Capture d'écran de l'espace élève

---

## Liste des tableaux

- **Tableau 1.1 :** Fiche textuelle du cas "S'authentifier"
- **Tableau 1.2 :** Fiche textuelle du cas "Gérer les évaluations"

---

# Chapitre 1 : Étude Générale

## I. Présentation générale

### 1. Présentation de la structure d’accueil

*[Insérez ici la présentation de l'entreprise où vous avez effectué votre stage. Décrivez son secteur d'activité, ses missions, et son organisation.]*

### 2. Présentation du sujet

#### 2.1. Contexte

Le secteur de l'éducation est en pleine transformation numérique. La crise sanitaire mondiale a accéléré une tendance de fond : la nécessité pour les établissements scolaires de se doter d'outils numériques performants pour assurer la continuité pédagogique, simplifier la gestion administrative et fluidifier la communication. Face à des systèmes d'information souvent hétérogènes, vieillissants ou incomplets, la demande pour des plateformes intégrées, accessibles et sécurisées n'a jamais été aussi forte. C'est dans ce contexte que s'inscrit le projet Edconnekt, qui vise à fournir une solution tout-en-un pour la gestion de la vie scolaire.

#### 2.2. Problématique

La gestion d'un établissement scolaire implique une multitude d'acteurs aux besoins variés (administration, enseignants, élèves, parents) qui interagissent constamment. Comment concevoir et développer une interface utilisateur unique qui réponde de manière efficace et intuitive aux besoins spécifiques de chaque profil ? La problématique centrale de ce stage est donc la suivante : **Comment architecturer et réaliser un frontend d'application web qui soit à la fois modulaire, sécurisé, performant et capable d'offrir une expérience utilisateur personnalisée en fonction du rôle de l'utilisateur connecté ?**

#### 2.3. Objectifs

Pour répondre à cette problématique, les objectifs suivants ont été fixés :

*   **Analyser les besoins fonctionnels :** Identifier précisément les fonctionnalités attendues pour chaque type d'utilisateur.
*   **Concevoir l'architecture frontend :** Définir une architecture logicielle robuste, basée sur des composants réutilisables et une gestion d'état claire.
*   **Développer l'interface utilisateur :** Implémenter l'ensemble des pages et des composants de l'application en utilisant les technologies web modernes (React, TypeScript).
*   **Mettre en place un système d'accès par rôles (RBAC) :** Assurer que l'interface s'adapte dynamiquement au profil de l'utilisateur pour garantir la pertinence de l'information et la sécurité des données.
*   **Assurer la qualité et la maintenabilité :** Produire un code propre, documenté et facilement évolutif.

## II. Analyse et Spécifications (Approche UML)

La phase d’analyse et de spécifications est cruciale pour traduire les besoins en un modèle formel. L'utilisation du langage de modélisation UML (Unified Modeling Language) permet de décrire le système de manière claire et non ambiguë.

### 1. Diagramme de cas d’utilisation

Le diagramme de cas d'utilisation identifie les grandes fonctionnalités du système et les acteurs qui interagissent avec elles.

**Acteurs :**

*   **Enseignant :** Personne en charge de l'enseignement.
*   **Élève :** Apprenant inscrit dans l'établissement.
*   **Directeur :** Personnel administratif avec des droits de supervision.
*   **Parent :** Responsable légal d'un ou plusieurs élèves.
*   **Administrateur :** Profil technique gérant le système.

**Diagramme (description textuelle) :**

*L'acteur (qu'il soit Enseignant, Élève, Directeur, etc.) doit d'abord **S'authentifier**.*

*   **L'Enseignant** peut : `Gérer ses cours`, `Gérer les évaluations`, `Saisir les notes`, `Gérer les ressources pédagogiques`, `Communiquer avec les élèves` et `Consulter l'agenda`.
*   **L'Élève** peut : `Consulter ses notes`, `Accéder à ses cours et leçons`, `Consulter les ressources pédagogiques`, `Communiquer avec les enseignants` et `Consulter son agenda`.
*   **Le Directeur** peut : `Consulter les rapports de performance` et `Superviser les données de l'établissement`.
*   **Le Parent** peut : `Consulter les notes de son enfant`.
*   **L'Administrateur** peut : `Gérer les comptes utilisateurs`.

### 2. Descriptions textuelles des cas d'utilisation

Voici la description détaillée de quelques cas d'utilisation clés.

**Tableau 1.1 - Cas : S'authentifier**

| | |
| :--- | :--- |
| **Objectifs** | L'acteur souhaite accéder à la plateforme de manière sécurisée. |
| **Acteur(s)** | Enseignant, Élève, Directeur, Parent, Administrateur. |
| **Précondition** | L'acteur est sur la page de connexion. |
| **Scénario Nominal** | 1. L'acteur saisit son identifiant et son mot de passe.<br>2. Il valide le formulaire.<br>3. Le système vérifie les informations auprès du service d'authentification (ex: Keycloak).<br>4. Le système identifie ses rôles et le redirige vers son tableau de bord personnalisé. |
| **Scénario Alternatif** | a) Après l'étape 3, si les informations sont incorrectes, le système affiche un message d'erreur. |
| **Postcondition** | L'acteur est connecté et accède aux fonctionnalités autorisées par son rôle. |

**Tableau 1.2 - Cas : Gérer les évaluations**

| | |
| :--- | :--- |
| **Objectifs** | L'enseignant souhaite créer une évaluation et saisir les notes des élèves. |
| **Acteur(s)** | Enseignant. |
| **Précondition** | L'enseignant est authentifié et se trouve sur son tableau de bord. |
| **Scénario Nominal** | 1. L'enseignant navigue vers la section "Évaluations".<br>2. Il choisit de créer une nouvelle évaluation et remplit les informations (titre, date, classe...).<br>3. Le système crée l'évaluation.<br>4. L'enseignant sélectionne l'évaluation et accède à la grille de saisie des notes.<br>5. Il saisit les notes pour chaque élève et sauvegarde. |
| **Scénario Alternatif** | a) Après l'étape 2, si des informations sont manquantes, le système affiche une erreur. |
| **Postcondition** | Les notes de l'évaluation sont enregistrées dans le système. |

### 3. Diagramme de classe (Modèle du domaine frontend)

Le diagramme de classe représente les principales entités de données que le frontend manipule.

**Classes principales :**

*   **User :** `{ id, name, email, roles: Role[] }`
*   **Course :** `{ id, title, description, teacher: User }`
*   **Lesson :** `{ id, title, content, course: Course }`
*   **Evaluation :** `{ id, title, date, course: Course }`
*   **Grade :** `{ id, score, student: User, evaluation: Evaluation }`
*   **Resource :** `{ id, title, fileUrl, course: Course }`

**Relations :**

*   Un `User` avec le rôle `enseignant` peut avoir plusieurs `Course`s.
*   Un `Course` peut avoir plusieurs `Lesson`s, `Evaluation`s et `Resource`s.
*   Un `User` avec le rôle `eleve` peut avoir plusieurs `Grade`s.
*   Chaque `Grade` est lié à une `Evaluation` et à un `User` (élève).

# Chapitre 2 : Étude Technique et Réalisations

Ce chapitre détaille l'implémentation technique du frontend de l'application Edconnekt. Il présente l'architecture logicielle, les technologies sélectionnées, l'environnement de développement et les principales réalisations.

## I. Architecture

L'application est conçue comme une **Single Page Application (SPA)**. Ce modèle d'architecture permet de créer une expérience utilisateur fluide et réactive, proche de celle d'une application de bureau, en chargeant une seule page HTML et en mettant à jour dynamiquement son contenu via JavaScript.

L'architecture du code source est organisée de manière modulaire pour garantir la maintenabilité et l'évolutivité :

*   `src/pages/` : Ce répertoire contient les composants de haut niveau correspondant aux différentes pages de l'application (ex: `Accueil.tsx`, `Eleves.tsx`, `LoginPage.tsx`). Chaque page assemble plusieurs composants pour construire une vue complète.
*   `src/components/` : Contient tous les composants d'interface utilisateur réutilisables. On y trouve des composants atomiques (boutons, champs de saisie) et des composants plus complexes (tableaux de données, formulaires). Cette organisation favorise la réutilisation du code et la cohérence visuelle.
*   `src/layouts/` : Définit les structures de mise en page globales. Le `DashboardLayout.tsx`, par exemple, encapsule la structure commune à toutes les pages après connexion (barre de navigation supérieure, menu latéral, etc.) et adapte son contenu en fonction du rôle de l'utilisateur.
*   `src/hooks/` et `src/contexts/` : Ces répertoires centralisent la logique métier et la gestion de l'état. Les *hooks* personnalisés (ex: `useAuth`) encapsulent des logiques complexes (comme l'authentification), tandis que les *Contexts* (ex: `ResourceProvider`) permettent de partager des données globales à travers l'application sans `prop drilling`.

Cette architecture en couches permet une séparation claire des préoccupations (*Separation of Concerns*), rendant le code plus facile à comprendre, à déboguer et à faire évoluer.

## II. Choix Technologiques

Le choix des technologies a été guidé par les besoins de performance, de maintenabilité et de robustesse de l'application.

*   **React (avec TypeScript)** : Bibliothèque de référence pour la création d'interfaces utilisateur, React a été choisi pour son écosystème mature, son modèle de composants déclaratifs et ses performances. L'ajout de **TypeScript** a été une décision stratégique pour apporter un typage statique au code, ce qui permet de détecter de nombreuses erreurs au moment de la compilation, d'améliorer l'auto-complétion et de rendre le code plus robuste et auto-documenté.

*   **Vite** : Outil de build nouvelle génération, Vite a été préféré à des solutions comme Create React App ou Webpack pour sa vitesse de développement fulgurante. Son serveur de développement natif ESM (ES Modules) permet un démarrage quasi instantané et un rechargement à chaud (*Hot Module Replacement*) extrêmement rapide, améliorant significativement la productivité.

*   **React Router DOM** : Pour la gestion de la navigation, cette bibliothèque est le standard de l'écosystème React. Elle a permis de mettre en place un routage côté client performant et, surtout, un système de routes protégées et conditionnelles basé sur les rôles de l'utilisateur, un pilier de la sécurité de l'application.

*   **Tailwind CSS** : Pour le stylisme, l'approche *utility-first* de Tailwind CSS a été adoptée. Elle permet de construire des designs complexes et sur-mesure directement dans le code JSX sans quitter le contexte de développement. Cela accélère l'intégration et facilite la maintenance d'un système de design cohérent.

*   **i18next** : La présence du hook `useTranslation` et du fichier `i18n.ts` indique que l'application est conçue pour être multilingue. i18next est une solution puissante et flexible pour l'internationalisation (i18n) en JavaScript, permettant de gérer facilement les traductions.

## III. Environnement de développement

*   **Visual Studio Code** : Éditeur de code léger mais puissant, VS Code a été utilisé pour le développement grâce à son excellent support pour TypeScript, ses extensions pour React et ESLint, et son terminal intégré.
*   **Git & GitHub** : Le logiciel de gestion de versions Git a été utilisé pour le suivi des modifications du code. Le projet est hébergé sur GitHub, qui facilite la collaboration, la revue de code et l'intégration continue.
*   **ESLint** : Outil d'analyse de code statique, ESLint a été configuré pour garantir une qualité de code constante, le respect des bonnes pratiques et l'uniformité du style de code au sein du projet.

## IV. Réalisation

Cette section décrit quelques-unes des interfaces clés qui ont été développées.

### 1. Le portail d'authentification

La première interface rencontrée par l'utilisateur est la page de connexion (`LoginPage`). Sobre et directe, elle constitue le portail d'entrée sécurisé de l'application. La logique, encapsulée dans le hook `useAuth`, communique avec un service d'identité externe (type Keycloak) pour valider les informations d'identification et récupérer les rôles de l'utilisateur, sans jamais exposer de données sensibles côté client.

### 2. Le tableau de bord dynamique (`DashboardLayout`)

Une fois authentifié, l'utilisateur accède à un tableau de bord dont la structure est définie par le `DashboardLayout`. C'est une réalisation majeure du projet : ce layout est un composant "intelligent" qui reçoit le rôle de l'utilisateur en `prop` et adapte dynamiquement les éléments de navigation affichés (liens dans la barre latérale, options dans le menu utilisateur). Ainsi, un enseignant ne voit pas les mêmes options qu'un élève, garantissant une expérience utilisateur épurée et sécurisée.

### 3. L'interface Enseignant

Le tableau de bord de l'enseignant (`EnseignantDashboard`) est le centre névralgique de son activité. Depuis cette interface, il peut accéder à des modules complexes comme :
*   La gestion de ses cours (`MesCoursPage`).
*   La création et la gestion des évaluations (`Evaluations`).
*   La saisie des notes dans une grille interactive (`GNote`).
*   Le partage de ressources pédagogiques (`Ressource`).

### 4. L'espace Élève

L'interface de l'élève (`eleves/Dashboard`) est conçue pour être simple et directe. Elle lui permet de consulter rapidement les informations qui le concernent :
*   Ses dernières notes (`MesNotesPage`).
*   Le contenu de ses cours et leçons (`MesCoursPage`, `DetailCoursPage`).
*   Son emploi du temps (`Agenda`).

# Conclusion

Au terme de ce stage, la mission de développer le frontend de la plateforme Edconnekt a été menée à bien. Ce projet a représenté une immersion complète et enrichissante dans les défis concrets du développement d'applications web modernes à grande échelle.

## Bilan du stage

Le travail accompli a permis de transformer une analyse des besoins en une application fonctionnelle, intuitive et sécurisée. En partant des spécifications fonctionnelles, nous avons pu réaliser une interface utilisateur qui répond précisément aux attentes des différents acteurs du monde éducatif. Les objectifs fixés au départ ont tous été atteints : une architecture frontend modulaire a été conçue, les interfaces ont été développées en suivant les meilleures pratiques, et le système d'accès par rôles garantit une expérience personnalisée et sécurisée pour chaque utilisateur.

## Apports du stage

Cette expérience professionnelle a été extrêmement formatrice. Sur le plan technique, elle m'a permis de consolider et d'approfondir mes compétences sur des technologies de pointe comme React, TypeScript et l'écosystème frontend moderne (Vite, Tailwind CSS). J'ai notamment pu appréhender la complexité de la gestion d'état dans une application d'envergure et l'importance d'une architecture logicielle rigoureuse.

Sur le plan humain et professionnel, ce stage m'a appris à travailler au sein d'une équipe, à communiquer sur des sujets techniques et à traduire des besoins fonctionnels en solutions concrètes. La nécessité de produire un code de qualité, testable et maintenable a été un fil rouge tout au long du projet.

## Perspectives d'évolution

Le projet Edconnekt dispose d'une base solide, mais de nombreuses pistes d'amélioration peuvent être envisagées pour l'enrichir davantage :

*   **Fonctionnalités temps-réel :** Intégrer des notifications push ou une messagerie instantanée via des technologies comme les WebSockets pour améliorer la communication.
*   **Mode hors-ligne :** Transformer l'application en une Progressive Web App (PWA) pour permettre un accès à certaines fonctionnalités même sans connexion internet.
*   **Tests automatisés :** Mettre en place une stratégie de tests plus complète (tests d'intégration, tests end-to-end) pour garantir la non-régression et la fiabilité de l'application à long terme.
*   **Accessibilité :** Mener un audit d'accessibilité (WCAG) pour s'assurer que l'application est utilisable par le plus grand nombre, y compris les personnes en situation de handicap.

En somme, ce stage a été une étape décisive de mon parcours, me confortant dans mon choix de carrière et me dotant des compétences nécessaires pour aborder sereinement les défis du monde du développement logiciel.

