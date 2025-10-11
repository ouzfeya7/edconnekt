# Administration - Gestion des Plans (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock

**Description** : Interface d'administration pour gérer les plans d'abonnement EdConnekt (Basic, Pro, Premium). Permet de visualiser, créer et modifier les plans avec leurs fonctionnalités et tarifs.

**Type de données** : Mockées / Simulées  
**Source des données** : 
- Fichier TypeScript statique (`mock-plans.ts`)
- État local React (useState)
- Calculs côté client pour les prix

## Prérequis

### Rôles Utilisateur
- [x] Admin
- [ ] Admin Staff
- [ ] Enseignant  
- [ ] Élève
- [ ] Parent

### Permissions Requises
- `admin.plans.read` : Lecture des plans (simulée)
- `admin.plans.write` : Création/modification (simulée)
- `admin.pricing.manage` : Gestion des tarifs

### État Initial du Système
- Utilisateur authentifié avec rôle Admin
- Données mockées initialisées (3 plans de test)
- Fonctionnalités par plan pré-définies

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/admin/plans/PlansPage.tsx`  
**Route** : `/admin/plans`  
**Navigation** : Menu Admin → Plans

**Action utilisateur** :
- Clic sur "Plans" dans le menu admin
- Accès direct via URL

**Source des données** :
```typescript
// Import des données mockées
import { plansData, Plan } from './mock-plans';

// État local React
const [plans, setPlans] = useState<Plan[]>(plansData);
```

**Résultat attendu** :
- Affichage des 3 plans (Basic, Pro, Premium)
- Cartes avec fonctionnalités et tarifs
- Boutons d'action pour chaque plan

### 2. Visualisation des Plans (Simulé)
**Déclencheur** : Chargement de la page

**Simulation** :
```typescript
interface Plan {
  id: string;
  nom: string;
  description: string;
  prix: number;
  devise: string;
  periode: 'mois' | 'année';
  fonctionnalites: string[];
  populaire?: boolean;
  actif: boolean;
}

// Plans mockés
const plansData: Plan[] = [
  {
    id: 'plan-basic',
    nom: 'Basic',
    description: 'Pour les petits établissements',
    prix: 29,
    devise: 'EUR',
    periode: 'mois',
    fonctionnalites: [
      'Jusqu\'à 100 élèves',
      'Gestion des notes',
      'Emploi du temps basique',
      'Support email'
    ],
    actif: true
  },
  // ... autres plans
];
```

**Résultat attendu** :
- Affichage en grille des plans
- Mise en évidence du plan populaire
- Prix formatés correctement
- Liste des fonctionnalités claire

### 3. Création de Plan (Simulée)
**Déclencheur** : Clic sur bouton "Nouveau Plan"

**Action utilisateur** :
- Ouverture du modal de création
- Saisie nom, description, prix
- Sélection des fonctionnalités
- Définition de la période de facturation

**Simulation** :
```typescript
const handleCreatePlan = (newPlan: Omit<Plan, 'id'>) => {
  const plan: Plan = {
    id: `plan-${Date.now()}`,
    ...newPlan,
    actif: true // Actif par défaut
  };
  
  setPlans(prev => [...prev, plan]);
  setIsModalOpen(false);
  toast.success('Plan créé avec succès');
};
```

**Résultat attendu** :
- Toast de succès simulé
- Nouveau plan ajouté à la grille
- Modal fermé automatiquement
- Données persistées dans l'état local

### 4. Modification de Plan (Simulée)
**Déclencheur** : Clic sur "Modifier" sur une carte de plan

**Action utilisateur** :
- Ouverture du modal pré-rempli
- Modification des champs (prix, fonctionnalités)
- Sauvegarde des changements

**Simulation** :
```typescript
const handleUpdatePlan = (updatedPlan: Plan) => {
  setPlans(prev => 
    prev.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    )
  );
  setIsModalOpen(false);
  setEditingPlan(null);
  toast.success('Plan mis à jour avec succès');
};
```

**Résultat attendu** :
- Toast de succès
- Données mises à jour dans l'interface
- Recalcul automatique des prix affichés

### 5. Activation/Désactivation (Simulée)
**Déclencheur** : Toggle sur le statut du plan

**Simulation** :
```typescript
const handleToggleStatus = (planId: string) => {
  setPlans(prev => 
    prev.map(plan => 
      plan.id === planId 
        ? { ...plan, actif: !plan.actif }
        : plan
    )
  );
  
  const plan = plans.find(p => p.id === planId);
  const status = plan?.actif ? 'désactivé' : 'activé';
  toast.success(`Plan ${status} avec succès`);
};
```

**Résultat attendu** :
- Changement visuel immédiat (badge, opacité)
- Toast de confirmation
- Impact sur les nouveaux abonnements (simulé)

## Points de Validation

### Fonctionnels
- [x] Interface de gestion complète (CRUD)
- [x] Validation des prix et fonctionnalités
- [x] Gestion des statuts actif/inactif
- [x] Mise en évidence du plan populaire
- [x] Formatage correct des devises

### Techniques
- [x] Code TypeScript typé avec interfaces
- [x] État React géré correctement
- [x] Composants réutilisables (cartes, modals)
- [x] Validation côté client
- [x] Structure facilement migratable vers API

### UX/UI
- [x] Interface claire en grille
- [x] Cartes de plans attractives
- [x] Modal de création/édition ergonomique
- [x] Feedback visuel pour les actions
- [x] Responsive design

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Validation des plans
const validatePlan = (plan: Partial<Plan>) => {
  if (!plan.nom || plan.nom.trim().length < 2) {
    throw new Error('Le nom du plan doit contenir au moins 2 caractères');
  }
  if (!plan.prix || plan.prix <= 0) {
    throw new Error('Le prix doit être supérieur à 0');
  }
  if (!plan.fonctionnalites || plan.fonctionnalites.length === 0) {
    throw new Error('Au moins une fonctionnalité doit être définie');
  }
};

// Simulation d'erreurs de sauvegarde
const simulateSaveError = () => {
  if (Math.random() < 0.03) { // 3% d'erreurs
    throw new Error('Erreur de sauvegarde du plan');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Validation | Vérification champs requis | Messages d'erreur formulaire |
| Prix | Validation format numérique | Erreur sur le champ prix |
| Fonctionnalités | Liste vide | Message "Au moins une fonctionnalité" |
| Sauvegarde | Échec aléatoire 3% | Toast d'erreur + retry |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isLoading, setIsLoading] = useState(false);

const simulateLoading = async (action: () => void) => {
  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 600));
  action();
  setIsLoading(false);
};
```

### Empty States
```typescript
// Aucun plan configuré
if (plans.length === 0) {
  return (
    <div className="text-center py-12">
      <h3>Aucun plan configuré</h3>
      <p>Créez votre premier plan d'abonnement</p>
      <Button onClick={() => setIsModalOpen(true)}>
        Créer un plan
      </Button>
    </div>
  );
}
```

## Données Mockées

### Structure des Données
```typescript
interface Plan {
  id: string;
  nom: string;
  description: string;
  prix: number;
  devise: string;
  periode: 'mois' | 'année';
  fonctionnalites: string[];
  populaire?: boolean;
  actif: boolean;
}

// Données de test actuelles
export const plansData: Plan[] = [
  {
    id: 'plan-basic',
    nom: 'Basic',
    description: 'Pour les petits établissements',
    prix: 29,
    devise: 'EUR',
    periode: 'mois',
    fonctionnalites: [
      'Jusqu\'à 100 élèves',
      'Gestion des notes',
      'Emploi du temps basique',
      'Support email'
    ],
    actif: true
  },
  {
    id: 'plan-pro',
    nom: 'Pro',
    description: 'Pour les établissements moyens',
    prix: 79,
    devise: 'EUR',
    periode: 'mois',
    populaire: true,
    fonctionnalites: [
      'Jusqu\'à 500 élèves',
      'Toutes les fonctionnalités Basic',
      'Gestion des ressources',
      'Rapports avancés',
      'Support prioritaire'
    ],
    actif: true
  },
  {
    id: 'plan-premium',
    nom: 'Premium',
    description: 'Pour les grands établissements',
    prix: 149,
    devise: 'EUR',
    periode: 'mois',
    fonctionnalites: [
      'Élèves illimités',
      'Toutes les fonctionnalités Pro',
      'API personnalisée',
      'Formation dédiée',
      'Support 24/7'
    ],
    actif: true
  }
];
```

### Formatage des Prix
```typescript
const formatPrice = (prix: number, devise: string, periode: string) => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: devise
  });
  
  return `${formatter.format(prix)}/${periode}`;
};
```

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec schémas API
- [ ] **Endpoints** : Implémenter CRUD complet
- [ ] **Validation** : Ajouter validation serveur
- [ ] **Pricing** : Intégrer système de facturation
- [ ] **Features** : Système de feature flags
- [ ] **Historique** : Versioning des plans

### Plan de Migration
```typescript
// Étape 1 : Interface service
interface PlanService {
  list(): Promise<Plan[]>;
  create(data: CreatePlanRequest): Promise<Plan>;
  update(id: string, data: UpdatePlanRequest): Promise<Plan>;
  delete(id: string): Promise<void>;
  toggleStatus(id: string): Promise<Plan>;
}

// Étape 2 : Implémentation API
class ApiPlanService implements PlanService {
  async list() {
    const response = await planApi.getPlans();
    return response.data;
  }
  // ... autres méthodes
}

// Étape 3 : Hook React Query
const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.list(),
  });
};
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Données** | 3 plans statiques | Base de données complète |
| **Pricing** | Prix fixes | Système de facturation dynamique |
| **Features** | Liste statique | Feature flags configurables |
| **Validation** | Côté client uniquement | Client + serveur |
| **Historique** | Aucun | Versioning des modifications |

## Limitations Connues

### Fonctionnelles
- **Données** : Pas de persistance entre sessions
- **Pricing** : Pas d'intégration facturation
- **Features** : Fonctionnalités hardcodées
- **Historique** : Pas de suivi des modifications

### Techniques
- **Validation** : Règles métier simplifiées
- **Concurrence** : Pas de gestion des conflits
- **Sécurité** : Pas de validation serveur
- **Intégrations** : Pas de lien avec systèmes de paiement

## Roadmap API

### Priorité Haute 🔴
- **CRUD Plans** : Q2 2025
- **Système de pricing** : Q2 2025
- **Feature flags** : Q2 2025

### Priorité Moyenne 🟡
- **Historique des modifications** : Q3 2025
- **Intégration facturation** : Q3 2025
- **Plans personnalisés** : Q3 2025

### Priorité Basse 🟢
- **A/B Testing des prix** : Q4 2025
- **Analytics d'adoption** : Q4 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "react-icons": "^4.11.0",
  "@/components/ui": "local",
  "react-hot-toast": "^2.4.1"
}
```

### Configuration
```typescript
// Devises supportées
const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'XOF'] as const;

// Périodes de facturation
const BILLING_PERIODS = ['mois', 'année'] as const;
```

### Outils de Développement
- **TypeScript** : Typage strict des interfaces
- **React State** : Gestion d'état local
- **Intl.NumberFormat** : Formatage des devises
- **React Hot Toast** : Notifications utilisateur

---

*Workflow documenté le : 11 octobre 2025*  
*Migration API prévue : Q2 2025*  
*Auteur : Équipe EdConnekt Frontend*
