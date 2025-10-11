# [Fonctionnalité] - [Workflow Name] (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock | 🔄 Migration en cours | 📋 API planifiée

**Description** : [Description courte du workflow et de son objectif business]

**Type de données** : Mockées / Simulées / Locales  
**Source des données** : 
- Fichiers JSON statiques
- Générateurs de données
- localStorage
- Calculs côté client

## Prérequis

### Rôles Utilisateur
- [ ] Admin Staff
- [ ] Enseignant  
- [ ] Élève
- [ ] Parent
- [ ] Admin

### Permissions Requises
- `[permission1]` : Description (simulée)
- `[permission2]` : Description (simulée)

### État Initial du Système
- Utilisateur authentifié avec rôle approprié
- Données mockées initialisées
- [Autres prérequis spécifiques]

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/[role]/[PageName].tsx`  
**Route** : `/[role]/[route-path]`  
**Navigation** : Menu principal → [Section] → [Sous-section]

**Action utilisateur** :
- Clic sur [élément de navigation]
- Accès direct via URL

**Source des données** :
```typescript
// Hook ou service mock
const { data, isLoading } = useMock[Resource]List();

// ou données statiques
import mockData from '@/data/mock-[resource].json';
```

**Résultat attendu** :
- Affichage des données simulées
- Simulation du loading state (optionnel)
- Comportement identique à l'API réelle

### 2. [Étape Principale - ex: Création Simulée]
**Déclencheur** : Clic sur bouton "Créer [Resource]"

**Action utilisateur** :
- Ouverture du modal/formulaire
- Saisie des données
- Validation côté client

**Simulation** :
```typescript
// Service mock
const mockCreate[Resource] = (data: Create[Resource]Request) => {
  const newResource = {
    id: generateMockId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Stockage local ou état global
  addToMockStore(newResource);
  
  // Simulation délai réseau
  return new Promise(resolve => 
    setTimeout(() => resolve(newResource), 500)
  );
};
```

**Résultat attendu** :
- Toast de succès simulé
- Nouvelle ressource ajoutée à la liste
- Données persistées localement (si applicable)

### 3. [Étape Secondaire - ex: Modification Simulée]
**Déclencheur** : Clic sur icône "Modifier"

**Action utilisateur** :
- Ouverture du formulaire pré-rempli
- Modification des champs
- Sauvegarde

**Simulation** :
```typescript
const mockUpdate[Resource] = (id: string, data: Update[Resource]Request) => {
  const updated = {
    ...getMockResource(id),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  updateMockStore(id, updated);
  return Promise.resolve(updated);
};
```

**Résultat attendu** :
- Toast de succès
- Données mises à jour dans l'interface
- Persistance locale maintenue

### 4. [Étape Finale - ex: Suppression Simulée]
**Déclencheur** : Clic sur icône "Supprimer"

**Action utilisateur** :
- Confirmation via dialog
- Validation de la suppression

**Simulation** :
```typescript
const mockDelete[Resource] = (id: string) => {
  removeFromMockStore(id);
  return Promise.resolve();
};
```

**Résultat attendu** :
- Toast de succès
- Ressource retirée de la liste
- Données locales mises à jour

## Points de Validation

### Fonctionnels
- [ ] Interface identique au comportement API attendu
- [ ] Règles métier simulées correctement
- [ ] États et transitions cohérents
- [ ] Données persistantes entre sessions (si requis)

### Techniques
- [ ] Code facilement migratable vers API réelle
- [ ] Types TypeScript identiques à l'API future
- [ ] Gestion d'erreurs simulée
- [ ] Performance acceptable

### UX/UI
- [ ] Expérience utilisateur complète
- [ ] Feedback approprié (loading, success, error)
- [ ] États vides et d'erreur gérés
- [ ] Responsive design

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Simulation d'erreurs aléatoires
const mockApiCall = () => {
  if (Math.random() < 0.1) { // 10% d'erreurs
    throw new Error('Erreur réseau simulée');
  }
  return mockData;
};

// Erreurs spécifiques
const simulateValidationError = (data: any) => {
  if (!data.name) {
    throw new Error('Le nom est requis');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Validation | Vérification côté client | Messages d'erreur formulaire |
| Réseau | Délai + échec aléatoire | Toast d'erreur + retry |
| Permissions | Vérification rôle mock | Message "Accès refusé" |
| Données | Ressource inexistante | Page d'erreur 404 |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isLoading, setIsLoading] = useState(false);

const simulateLoading = async () => {
  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 800));
  setIsLoading(false);
};
```

### Empty States
```typescript
// Données vides simulées
const mockEmptyState = {
  items: [],
  total: 0,
  hasMore: false
};
```

### Error States (Simulés)
```typescript
const simulateError = () => {
  throw new Error('Service temporairement indisponible');
};
```

## Données Mockées

### Structure des Données
```typescript
// Types identiques à l'API future
interface Mock[Resource] {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // champs identiques à l'API
}

// Générateur de données
const generateMock[Resource] = (): Mock[Resource] => ({
  id: `mock-${Date.now()}-${Math.random()}`,
  name: faker.company.name(),
  description: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
```

### Sources de Données
```typescript
// 1. Fichiers JSON statiques
import mockResources from '@/data/mock-resources.json';

// 2. Générateurs dynamiques
import { faker } from '@faker-js/faker';

// 3. Stockage local
const STORAGE_KEY = 'mock-[resource]-data';
const getMockData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultMockData;
};

// 4. Services mock
class Mock[Resource]Service {
  private data: Mock[Resource][] = [];
  
  async list(): Promise<Mock[Resource][]> {
    await this.simulateDelay();
    return this.data;
  }
  
  async create(data: Create[Resource]Request): Promise<Mock[Resource]> {
    await this.simulateDelay();
    const newResource = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.push(newResource);
    return newResource;
  }
  
  private simulateDelay(): Promise<void> {
    return new Promise(resolve => 
      setTimeout(resolve, 300 + Math.random() * 700)
    );
  }
}
```

### Persistance des Données
```typescript
// Sauvegarde automatique
const useMockPersistence = (key: string, data: any) => {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);
};

// Restauration au démarrage
const useInitializeMockData = () => {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialiser avec des données par défaut
      const defaultData = generateDefaultMockData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }, []);
};
```

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec schémas API
- [ ] **Hooks** : Remplacer services mock par clients API
- [ ] **Validation** : Adapter aux contraintes backend
- [ ] **Erreurs** : Mapper codes d'erreur réels
- [ ] **Tests** : Mettre à jour avec vrais endpoints

### Plan de Migration
```typescript
// Étape 1 : Préparer l'interface
interface [Resource]Service {
  list(): Promise<[Resource][]>;
  create(data: Create[Resource]Request): Promise<[Resource]>;
  update(id: string, data: Update[Resource]Request): Promise<[Resource]>;
  delete(id: string): Promise<void>;
}

// Étape 2 : Implémenter version mock
class Mock[Resource]Service implements [Resource]Service {
  // implémentation mock
}

// Étape 3 : Implémenter version API
class Api[Resource]Service implements [Resource]Service {
  // implémentation avec vrais appels API
}

// Étape 4 : Injection de dépendance
const [resource]Service = process.env.NODE_ENV === 'development' 
  ? new Mock[Resource]Service()
  : new Api[Resource]Service();
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Latence** | Simulée (300-1000ms) | Variable réseau |
| **Erreurs** | Aléatoires/simulées | Réelles du backend |
| **Validation** | Côté client uniquement | Client + serveur |
| **Données** | Générées/statiques | Base de données |
| **Permissions** | Simulées | RBAC réel |

## Tests

### Tests des Mocks
```typescript
describe('Mock[Resource]Service', () => {
  it('should simulate API behavior', async () => {
    const service = new Mock[Resource]Service();
    const result = await service.list();
    expect(result).toHaveLength(expect.any(Number));
  });
  
  it('should persist data locally', () => {
    // test persistance localStorage
  });
});
```

### Tests de Migration
```typescript
describe('[Resource] Migration', () => {
  it('should work with both mock and real API', async () => {
    // test avec les deux implémentations
  });
});
```

## Limitations Connues

### Fonctionnelles
- **Données** : Pas de synchronisation multi-utilisateur
- **Validation** : Règles métier simplifiées
- **Performance** : Pas de pagination réelle
- **Recherche** : Filtrage côté client uniquement

### Techniques
- **Concurrence** : Pas de gestion des conflits
- **Sécurité** : Pas de validation serveur
- **Scalabilité** : Limitée par le stockage local
- **Monitoring** : Pas de métriques réelles

## Roadmap API

### Priorité Haute 🔴
- **[Fonctionnalité critique]** : Q1 2025
- **[Workflow principal]** : Q1 2025

### Priorité Moyenne 🟡
- **[Fonctionnalité secondaire]** : Q2 2025
- **[Optimisations]** : Q2 2025

### Priorité Basse 🟢
- **[Nice to have]** : Q3 2025
- **[Fonctionnalités avancées]** : Q3 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "@faker-js/faker": "^8.0.0",
  "json-server": "^0.17.0",
  "msw": "^1.3.0"
}
```

### Configuration
```typescript
// Variables d'environnement
VITE_USE_MOCK_DATA=true
VITE_MOCK_DELAY_MIN=300
VITE_MOCK_DELAY_MAX=1000
VITE_MOCK_ERROR_RATE=0.05
```

### Outils de Développement
- **Faker.js** : Génération de données réalistes
- **MSW** : Mock Service Worker pour intercepter les requêtes
- **JSON Server** : API REST mockée complète
- **Storybook** : Documentation des composants avec données mock

---

*Workflow documenté le : [Date]*  
*Migration API prévue : [Date]*  
*Auteur : [Nom]*
