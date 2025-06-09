# Application de Gestion des Abonnements Scolaires

Une application React moderne pour gérer les abonnements scolaires, développée avec Vite et Tailwind CSS.

## Fonctionnalités actuelles

- **Tableau des abonnements**
  - Affichage des abonnements avec prénom, nom, classe, type, date de début et statut
  - Boutons pour résilier/réactiver les abonnements
  - Interface responsive et moderne

- **Formulaire d'ajout**
  - Ajout d'abonnements via un formulaire modal
  - Validation des champs obligatoires
  - Choix du type d'abonnement (mensuel/annuel)
  - Interface responsive (2 colonnes sur desktop, 1 sur mobile)

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application en développement :
```bash
npm run dev
```

## Structure du projet

```
src/
  ├── App.jsx              # Composant principal avec la gestion d'état
  ├── SubscriptionTable.jsx # Tableau des abonnements
  ├── SubscriptionForm.jsx  # Formulaire d'ajout d'abonnements
  ├── index.css            # Styles Tailwind
  └── main.jsx            # Point d'entrée
```

## Technologies utilisées

- React (Hooks, Composants fonctionnels)
- Vite
- Tailwind CSS
- ESLint

## Contributions

- **Ousmane Faye**
  - Implémentation de la logique React
  - Gestion de l'état et des événements
  - Structure du projet

- **Maïmouna Diallo**
  - Design et styles Tailwind CSS
  - Documentation
  - Tests et assurance qualité

## Prochaines étapes (Jour 3)

- [ ] Amélioration du responsive design
- [ ] Ajout d'une barre de recherche
- [ ] Filtrage par type d'abonnement
- [ ] Tri des colonnes
- [ ] Export des données

## Problèmes résolus

- Configuration initiale de Tailwind CSS
- Gestion du state pour les abonnements
- Validation du formulaire
- Design responsive

## Licence

MIT
