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
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_APP_NAME=EdConnekt

# Development
VITE_DEV_MODE=true
VITE_MOCK_DATA=true
```

### 4. Démarrer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

## 🛠️ Scripts disponibles

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

### Qualité du code

```bash
# Linter
npm run lint

# Linter avec correction automatique
npm run lint:fix

# Vérification des types TypeScript
npm run type-check
```

### Tests

```bash
# Exécuter les tests
npm run test

# Tests en mode watch
npm run test:watch

# Couverture de tests
npm run test:coverage
```

## 📁 Structure du projet

### Organisation des fichiers

```
src/
├── components/          # Composants réutilisables
│   ├── ui/            # Composants UI de base
│   ├── course/        # Composants spécifiques aux cours
│   ├── eleve/         # Composants spécifiques aux élèves
│   └── ...
├── pages/             # Pages de l'application
├── contexts/          # Contextes React
├── hooks/             # Hooks personnalisés
├── services/          # Services API
├── lib/               # Utilitaires et données mock
├── assets/            # Ressources statiques
└── config/            # Configuration
```

### Conventions de nommage

- **Composants** : PascalCase (`UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
- **Services** : camelCase avec suffixe `Service` (`userService.ts`)
- **Types** : PascalCase avec préfixe `I` pour interfaces (`IUser.ts`)

## 🔧 Configuration

### TypeScript

Le projet utilise TypeScript avec une configuration stricte. Voir `tsconfig.json` pour les détails.

### ESLint

Configuration ESLint pour maintenir la qualité du code :

```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "react/recommended"
  ]
}
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

## 🧪 Tests

### Configuration Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### Exemple de test

```typescript
// UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('affiche le nom de l\'utilisateur', () => {
    render(<UserProfile user={{ name: 'John Doe' }} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
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
3. Ajouter des tests si nécessaire
4. Demander une review

## 🐛 Débogage

### Outils de développement

- **React DevTools** : Extension navigateur
- **Redux DevTools** : Si Redux est utilisé
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

### Obtenir de l'aide

1. **Documentation** : Consulter ce guide et la documentation officielle
2. **Issues GitHub** : Rechercher dans les issues existantes
3. **Stack Overflow** : Pour les questions générales
4. **Équipe** : Contacter l'équipe de développement

---

*Guide mis à jour le : [Date]*
*Version : [Version du projet]* 