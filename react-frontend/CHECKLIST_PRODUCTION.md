# ✅ Checklist de Tests - Production Ready

## 🔧 Tests Techniques (Automatiques)

### Build & Compilation
- [x] `npm run build` - Build réussi sans erreurs TypeScript
- [x] `npm run build` - Build Vite sans erreurs
- [ ] `npm run preview` - Serveur de preview fonctionne
- [ ] Vérifier la taille des bundles (warning si >500kB)

### Linting & Qualité du Code
```bash
npm run lint              # Vérifier les erreurs ESLint
npm run type-check        # Vérifier uniquement les types TypeScript (si disponible)
```

### Tests de Compatibilité Navigateurs
- [ ] Chrome/Edge (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (si accessible)
- [ ] Mode responsive (mobile/tablette)

---

## 🧪 Tests Fonctionnels (Manuels)

### Authentification & Autorisation
- [ ] **Login** : Connexion avec identifiants valides
- [ ] **Login** : Message d'erreur avec identifiants invalides
- [ ] **Roles** : Affichage correct selon le rôle (administrateur, enseignant, élève, etc.)
- [ ] **Session** : Persistence après rafraîchissement de page
- [ ] **Logout** : Déconnexion et redirection

### Navigation & Routing
- [ ] Toutes les routes principales accessibles
- [ ] Redirections correctes (pages protégées → login)
- [ ] Retour arrière/avant du navigateur fonctionne
- [ ] URLs partagées fonctionnent (deep linking)

### Modules Principaux à Tester

#### 📚 Module Compétences (ReferentielsManager)
- [ ] Liste des référentiels chargée
- [ ] Filtrage par cycle, état, visibilité
- [ ] Création d'un nouveau référentiel
- [ ] Publication d'un référentiel
- [ ] Suppression d'un référentiel
- [ ] Gestion des domaines/matières/compétences
- [ ] **Outbox Events** : Affichage correct avec `processed_at` null/undefined/string
- [ ] Clone de référentiel

#### 📦 Module Fournitures (Supplies)
- [ ] Liste des campagnes
- [ ] Création de campagne avec classes
- [ ] Mémorisation de la dernière classe (localStorage)
- [ ] Suggestions d'articles (autocomplétion)
- [ ] Workflow enseignant optimisé

#### 👥 Module Onboarding/Provisioning
- [ ] Upload de fichiers CSV
- [ ] Validation des données
- [ ] Sélecteur d'établissement fonctionne
- [ ] Import d'utilisateurs

#### 📅 Emploi du Temps
- [ ] Affichage de l'emploi du temps
- [ ] Filtrage par classe/enseignant
- [ ] Navigation entre semaines

#### 📁 Archives
- [ ] Chargement des archives
- [ ] Filtres fonctionnels

### API & Intégrations
- [ ] **Headers HTTP** : X-Etab et X-Roles envoyés correctement
- [ ] Gestion des erreurs API (500, 404, 403, etc.)
- [ ] Messages d'erreur clairs pour l'utilisateur
- [ ] Loading states pendant les requêtes
- [ ] Timeout et retry si nécessaire

### Performance
- [ ] Temps de chargement initial < 3s
- [ ] Navigation fluide entre pages
- [ ] Pagination efficace (grandes listes)
- [ ] Lazy loading des images/composants lourds
- [ ] Pas de memory leaks (vérifier console)

### UX/UI
- [ ] Responsive design (mobile, tablette, desktop)
- [ ] Accessibilité (contraste, navigation clavier)
- [ ] Messages toast/notifications visibles
- [ ] Modals se ferment correctement
- [ ] Formulaires : validation côté client
- [ ] États vides bien gérés (listes vides)
- [ ] États de chargement (spinners, skeletons)

### Sécurité
- [ ] Pas de données sensibles dans localStorage en clair
- [ ] Pas de clés API dans le code
- [ ] Tokens d'authentification sécurisés
- [ ] Protection CSRF si applicable
- [ ] Validation des inputs utilisateur

### Données & État
- [ ] localStorage fonctionne (préférences, cache)
- [ ] sessionStorage géré correctement
- [ ] React Query cache fonctionne
- [ ] Pas de conflits de state entre utilisateurs

---

## 🚀 Tests Production Spécifiques

### Build de Production
```bash
# 1. Build
npm run build

# 2. Preview local (simule production)
npm run preview
# Tester sur http://localhost:4173 (ou autre port)

# 3. Vérifier les warnings de taille de bundle
# Si >500kB, considérer code-splitting
```

### Variables d'Environnement
- [ ] `.env.local` configuré correctement
- [ ] URLs API pointent vers le bon environnement
- [ ] Pas de variables de dev en production

### Docker (si applicable)
```bash
# Build l'image Docker
docker build -t edconnekt-frontend .

# Lancer le container
docker run -p 80:80 edconnekt-frontend

# Tester sur http://localhost
```

### Console Browser
- [ ] Aucune erreur dans la console
- [ ] Aucun warning critique
- [ ] Network tab : toutes les requêtes réussissent

---

## 📋 Checklist Rapide (5 minutes)

**Avant de déployer, vérifier :**
1. ✅ Build réussi sans erreurs
2. ✅ Preview local fonctionne (`npm run preview`)
3. ✅ Login fonctionne
4. ✅ Navigation principale fonctionne
5. ✅ Aucune erreur console critique
6. ✅ Responsive mobile OK
7. ✅ API répond correctement

---

## 🔬 Tests Automatisés (À ajouter si besoin)

### Configuration Vitest (Recommandé)
```bash
# Installer Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Créer vitest.config.ts
# Ajouter script dans package.json : "test": "vitest"
```

### Tests E2E avec Playwright (Recommandé)
```bash
# Installer Playwright
npm install -D @playwright/test

# Initialiser
npx playwright install

# Créer tests/e2e/
```

---

## 📊 Métriques de Succès

### Performance
- **First Contentful Paint (FCP)** : < 1.5s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **Time to Interactive (TTI)** : < 3.5s
- **Bundle size** : < 500kB par chunk

### Qualité
- **TypeScript errors** : 0
- **ESLint errors** : 0
- **Console errors** : 0 (en navigation normale)
- **Lighthouse score** : > 90 (Performance, Accessibility)

---

## 🎯 Validation Finale

**Le code est prêt pour la production si :**
- ✅ Tous les tests critiques passent
- ✅ Aucune erreur bloquante
- ✅ Performance acceptable
- ✅ Build de production fonctionne localement
- ✅ Variables d'environnement configurées
- ✅ Tests manuels des fonctionnalités principales OK

**Actions recommandées avant déploiement :**
1. Backup de la version actuelle en production
2. Test sur environnement de staging
3. Plan de rollback en cas de problème
4. Monitoring actif après déploiement
