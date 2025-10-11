# Workflows avec Données Mockées - EdConnekt

## Vue d'ensemble

Ce dossier contient la documentation des fonctionnalités EdConnekt qui utilisent des données mockées en attendant l'implémentation des APIs correspondantes. Ces workflows permettent de valider l'expérience utilisateur et les interfaces avant le développement backend.

## 📋 Fonctionnalités Documentées

### 🔧 Administration
- **[Gestion des Abonnements](./admin-abonnements.md)** - Suivi des abonnements établissements aux plans EdConnekt
- **[Gestion des Plans](./admin-plans.md)** - Configuration des plans d'abonnement (Basic, Pro, Premium)

### 📚 Pédagogie
- **[Cours et Leçons](./cours-pedagogiques.md)** - Gestion des cours, évaluations et remédiations
- **[Notes et Bulletins](./gestion-notes-eleves.md)** - Consultation des notes et progression des élèves

## 🎯 Statut Global

| Fonctionnalité | Statut Mock | Complexité | Migration Prévue |
|----------------|-------------|------------|------------------|
| Abonnements | ✅ Complet | ⭐⭐⭐ | Q2 2025 |
| Plans | ✅ Complet | ⭐⭐ | Q2 2025 |
| Cours/Leçons | ✅ Complet | ⭐⭐⭐⭐⭐ | Q1 2025 |
| Notes/Bulletins | ✅ Complet | ⭐⭐⭐⭐ | Q1 2025 |

## 🔄 Processus de Migration

### Phase 1 : Validation UX (Actuelle)
- ✅ Interfaces utilisateur complètes
- ✅ Workflows E2E fonctionnels
- ✅ Données mockées réalistes
- ✅ Validation des règles métier

### Phase 2 : Développement API
- 🔄 Spécifications techniques finalisées
- 📋 Développement des endpoints backend
- 📋 Tests d'intégration
- 📋 Migration progressive des données

### Phase 3 : Intégration
- 📋 Remplacement des services mock
- 📋 Tests de charge et performance
- 📋 Validation des migrations de données
- 📋 Déploiement en production

## 📁 Structure des Fichiers Mock

```
src/
├── lib/
│   ├── mock-data.ts              # Cours et leçons
│   ├── mock-student-notes.ts     # Notes et bulletins
│   ├── mock-message-data.ts      # Messages (non documenté)
│   └── mock-parent-data.ts       # Données parents (non documenté)
├── pages/admin/
│   ├── abonnements/
│   │   └── mock-abonnements.ts   # Abonnements
│   ├── plans/
│   │   └── mock-plans.ts         # Plans d'abonnement
│   └── [autres]/
│       └── mock-*.ts             # Autres données admin
└── components/
    └── [divers]/
        └── mock-*.ts             # Données composants spécifiques
```

## 🛠️ Standards de Développement Mock

### Types TypeScript
```typescript
// Interfaces identiques aux futures APIs
interface MockEntity {
  id: string;
  // Champs identiques à l'API future
  createdAt: string;
  updatedAt: string;
}

// Services mock implémentant les mêmes interfaces
interface EntityService {
  list(): Promise<Entity[]>;
  create(data: CreateEntityRequest): Promise<Entity>;
  // ... autres méthodes
}
```

### Génération de Données
```typescript
// Utilisation de Faker.js pour des données réalistes
import { faker } from '@faker-js/faker';

const generateMockEntity = (): MockEntity => ({
  id: `mock-${Date.now()}-${Math.random()}`,
  name: faker.company.name(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
```

### Simulation d'Erreurs
```typescript
// Taux d'erreur configurable
const simulateError = (errorRate: number = 0.05) => {
  if (Math.random() < errorRate) {
    throw new Error('Erreur simulée');
  }
};
```

## 📊 Métriques de Qualité

### Couverture Fonctionnelle
- **Workflows complets** : 4/4 ✅
- **Interfaces utilisateur** : 100% ✅
- **Règles métier** : 85% ✅
- **Gestion d'erreurs** : 90% ✅

### Performance Mock
- **Temps de réponse simulé** : 300-1000ms
- **Données générées** : Réalistes et cohérentes
- **États UI** : Loading, Error, Empty gérés
- **Persistance locale** : Variable selon le workflow

## 🔍 Points de Vigilance

### Limitations Actuelles
- **Persistance** : Données perdues au refresh (sauf localStorage)
- **Concurrence** : Pas de gestion des conflits multi-utilisateur
- **Validation** : Règles métier simplifiées côté client
- **Performance** : Calculs côté client non optimisés

### Risques de Migration
- **Compatibilité types** : Vérifier les interfaces API réelles
- **Règles métier** : Complexité backend vs frontend
- **Performance** : Optimisations serveur nécessaires
- **Sécurité** : Validation et permissions réelles

## 🎯 Bonnes Pratiques

### Développement Mock
1. **Types identiques** aux APIs futures
2. **Interfaces de service** abstraites
3. **Données réalistes** avec Faker.js
4. **Gestion d'erreurs** simulée
5. **Documentation complète** des workflows

### Préparation Migration
1. **Tests unitaires** sur la logique métier
2. **Interfaces de service** bien définies
3. **Validation** des types TypeScript
4. **Stratégie de migration** progressive
5. **Plan de rollback** en cas de problème

## 📚 Ressources

### Documentation Technique
- [Template de Workflow Mock](../_templates/mock-workflow-template.md)
- [Guide de Migration API](../api-workflows/README.md)
- [Standards de Développement](../../development/README.md)

### Outils Utilisés
- **Faker.js** : Génération de données réalistes
- **TypeScript** : Typage strict des interfaces
- **React State** : Gestion d'état local
- **React Query** : Préparation à l'intégration API

---

*Documentation mise à jour le : 11 octobre 2025*  
*Équipe EdConnekt Frontend*
