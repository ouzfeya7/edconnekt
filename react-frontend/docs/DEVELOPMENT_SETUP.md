# Guide de Configuration de l'Environnement de Développement

## Prérequis

### Logiciels requis

- **Node.js** : Version 18+ (recommandé : LTS)
- **npm** ou **yarn** : Gestionnaire de paquets
- **Git** : Contrôle de version
- **VS Code** : Éditeur recommandé (avec extensions)

### Extensions VS Code recommandées

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone [URL_DU_REPO]
cd react-frontend
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configuration de l'environnement

Créer un fichier `.env.local` à la racine du projet :
```env
# API Configuration - Services EdConnekt
VITE_RESOURCE_API_BASE_URL=https://api.uat1-engy-partners.com/resource/
VITE_TIMETABLE_API_BASE_URL=https://api.uat1-engy-partners.com/timetable/
VITE_CLASSE_API_BASE_URL=https://api.uat1-engy-partners.com/classe/
VITE_ESTABLISHMENT_API_BASE_URL=https://api.uat1-engy-partners.com/establishment/
VITE_IDENTITY_API_BASE_URL=https://api.uat1-engy-partners.com/identity/
VITE_PROVISIONING_API_BASE_URL=https://api.uat1-engy-partners.com/provisioning/
VITE_COMPETENCE_API_BASE_URL=https://api.uat1-engy-partners.com/competence/
VITE_EVENT_API_BASE_URL=https://api.uat1-engy-partners.com/event/
VITE_STUDENT_API_BASE_URL=https://api.uat1-engy-partners.com/student/
VITE_PDI_API_BASE_URL=https://api.uat1-engy-partners.com/pdi/
VITE_ADMISSION_API_BASE_URL=https://api.uat1-engy-partners.com/admission/
VITE_SUPPLIES_API_BASE_URL=https://api.uat1-engy-partners.com/supplies/
VITE_MESSAGE_API_BASE_URL=https://api.uat1-engy-partners.com/message/

# Configuration externe
VITE_RECAPTCHA_SITE_KEY=6Lc1HLQrAAAAAAbERPkgsDjyfCqCvGRWAF1zG2v6
VITE_ROOMS_FROM_ESTABLISHMENT=true
```

### 4. Démarrer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:8000`

## 🛠️ Scripts disponibles

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

### Qualité du code

```bash
# Linter
npm run lint

# Linter avec correction automatique
npm run lint --fix
```

### Docker

```bash
# Build de l'image Docker
docker build -t edconnekt-frontend .

# Lancer le conteneur
docker run -p 80:80 edconnekt-frontend
```

## 📁 Structure du projet

### Organisation des fichiers

```
src/
├── api/               # Services API par domaine métier
│   ├── admission-service/
│   ├── classe-service/
│   ├── competence-service/
│   ├── establishment-service/
│   ├── event-service/
│   ├── identity-service/
│   ├── message-service/
│   ├── pdi-service/
│   ├── provisioning-service/
│   ├── resource-service/
│   ├── student-service/
│   ├── supplies-service/
│   └── timetable-service/
├── components/        # Composants réutilisables
│   ├── ui/           # Composants UI de base
│   ├── admin/        # Composants administration
│   ├── GestionDesNotes/
│   ├── Header/
│   └── ...
├── pages/            # Pages de l'application
├── contexts/         # Contextes React (13 contextes)
├── hooks/            # Hooks personnalisés (90+ hooks)
├── lib/              # Utilitaires et helpers
├── assets/           # Ressources statiques (images, icons)
├── config/           # Configuration (navigation, feature flags)
├── docs-api/         # Documentation API générée
├── i18n.ts          # Configuration internationalisation
├── layouts/          # Layouts de l'application
├── services/         # Services métier
├── styles/           # Styles globaux
├── theme.tsx         # Configuration du thème
├── types/            # Définitions TypeScript
└── utils/            # Fonctions utilitaires
```

### Conventions de nommage

- **Composants** : PascalCase (`UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
- **Services** : camelCase avec suffixe `Service` (`userService.ts`)
- **Types** : PascalCase (`User.ts`, `ApiResponse.ts`)

## 🔧 Configuration

### TypeScript

Le projet utilise TypeScript avec une configuration stricte. Voir `tsconfig.json` pour les détails.

### ESLint

Configuration ESLint moderne (ESLint 9+) pour maintenir la qualité du code :

```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

### Prettier

Configuration Prettier pour le formatage automatique :

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🎨 Tailwind CSS

### Configuration personnalisée

Le projet utilise une configuration Tailwind personnalisée avec :

- **Mode sombre** : Activé avec `darkMode: 'class'`
- **Palette de couleurs personnalisée** :
  - **Gamme G (bleu-gris)** : g50 à g500 pour les éléments principaux
  - **Gamme O (orange)** : o50 à o500 pour les accents
- **Variables CSS** : Utilisation de variables CSS pour la cohérence du thème

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Variables CSS pour le thème
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        // Gamme G (bleu-gris)
        g50: '#e8edf0',
        g100: '#7995a7',
        g300: '#184867',
        // Gamme O (orange)
        o100: '#fcb676',
        o300: '#f98113',
        // ...
      }
    },
  },
}
```

## 🌐 Internationalisation (i18n)

### Configuration React i18next

Le projet supporte le français et l'anglais :

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    lng: 'fr',
    resources: {
      fr: { translation: require('./public/locales/fr/translation.json') },
      en: { translation: require('./public/locales/en/translation.json') }
    }
  });
```

### Structure des traductions

```
public/locales/
├── fr/
│   └── translation.json
└── en/
    └── translation.json
```

## 🏗️ Architecture API

### Services par domaine métier

Chaque service API est organisé par domaine :

- **admission-service** : Gestion des admissions
- **classe-service** : Gestion des classes
- **competence-service** : Gestion des compétences
- **establishment-service** : Gestion des établissements
- **student-service** : Gestion des élèves
- **supplies-service** : Gestion des fournitures
- **timetable-service** : Gestion des emplois du temps
- Et autres...

### Configuration des headers

Tous les services utilisent les headers de contexte :

```typescript
// Exemple dans un service
axios.interceptors.request.use((config) => {
  config.headers['X-Etab'] = selectedEstablishment;
  config.headers['X-Roles'] = userRoles;
  return config;
});
```

## 🔄 Workflow de développement

### 1. Créer une nouvelle fonctionnalité

```bash
# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Développer la fonctionnalité
# ...

# Commiter les changements
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Pousser la branche
git push origin feature/nouvelle-fonctionnalite
```

### 2. Conventions de commit

Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: tests
chore: tâches de maintenance
```

### 3. Pull Request

1. Créer une Pull Request sur GitHub
2. Décrire les changements
3. S'assurer que le linter passe
4. Demander une review

## 🐛 Débogage

### Outils de développement

- **React DevTools** : Extension navigateur
- **Network tab** : Pour déboguer les requêtes API

### Logs de développement

```typescript
// Utiliser console.log pour le débogage
console.log('Données utilisateur:', user);

// Utiliser console.error pour les erreurs
console.error('Erreur API:', error);
```

### Debugger dans VS Code

1. Ouvrir le panneau Debug (Ctrl+Shift+D)
2. Créer une configuration de debug
3. Placer des breakpoints dans le code
4. Démarrer le debug

## 📚 Ressources utiles

### Documentation officielle

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite](https://vitejs.dev/guide/)

### Outils de développement

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🆘 Dépannage

### Problèmes courants

#### 1. Erreurs de dépendances

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### 2. Erreurs TypeScript

```bash
# Vérifier les types
npm run type-check

# Nettoyer le cache TypeScript
rm -rf node_modules/.cache
```

#### 3. Problèmes de build

```bash
# Nettoyer le cache Vite
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

*Guide mis à jour le : 10 octobre 2025*
*Version : EdConnekt React Frontend v1.0* 