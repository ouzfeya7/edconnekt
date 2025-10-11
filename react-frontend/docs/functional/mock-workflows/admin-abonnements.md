# Administration - Gestion des Abonnements (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock 

**Description** : Interface d'administration pour gérer les abonnements des établissements aux différents plans EdConnekt. Permet de visualiser, créer, modifier et suivre les abonnements avec leurs dates d'expiration.

**Type de données** : Mockées / Simulées  
**Source des données** : 
- Fichiers TypeScript statiques (`mock-abonnements.ts`)
- Relations avec `mock-etablissements.ts` et `mock-plans.ts`
- État local React (useState)
- Calculs côté client pour les dates

## Prérequis

### Rôles Utilisateur
- [x] Admin
- [ ] Directeur
- [ ] Enseignant  
- [ ] Élève
- [ ] Parent

### Permissions Requises
- `admin.abonnements.read` : Lecture des abonnements (simulée)
- `admin.abonnements.write` : Création/modification (simulée)
- `admin.etablissements.read` : Accès aux établissements liés

### État Initial du Système
- Utilisateur authentifié avec rôle Admin
- Données mockées initialisées (4 abonnements de test)
- Plans et établissements mockés disponibles

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/admin/abonnements/AbonnementsPage.tsx`  
**Route** : `/admin/abonnements`  
**Navigation** : Menu Admin → Abonnements

**Action utilisateur** :
- Clic sur "Abonnements" dans le menu admin
- Accès direct via URL

**Source des données** :
```typescript
// Import des données mockées
import { abonnementsData, Abonnement } from './mock-abonnements';
import { plansData } from '../plans/mock-plans';

// État local React
const [abonnements, setAbonnements] = useState<Abonnement[]>(abonnementsData);
```

**Résultat attendu** :
- Affichage de la liste des abonnements (4 éléments)
- Filtres par plan et statut fonctionnels
- Recherche par nom d'établissement
- Indicateurs visuels pour les abonnements expirant

### 2. Filtrage et Recherche (Simulé)
**Déclencheur** : Saisie dans la barre de recherche ou sélection de filtres

**Action utilisateur** :
- Saisie du nom d'établissement
- Sélection d'un plan (Basic, Pro, Premium)
- Filtrage par statut (actif, expiré, annulé)

**Simulation** :
```typescript
const filteredAbonnements = useMemo(() => {
  return abonnements
    .filter(sub => sub.etablissementNom.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(sub => planFilter === 'all' || sub.planId === planFilter)
    .filter(sub => statusFilter === 'all' || sub.statut === statusFilter);
}, [abonnements, searchTerm, planFilter, statusFilter]);
```

**Résultat attendu** :
- Filtrage instantané côté client
- Mise à jour du compteur de résultats
- Préservation de l'état des filtres

### 3. Création d'Abonnement (Simulée)
**Déclencheur** : Clic sur bouton "Nouvel Abonnement"

**Action utilisateur** :
- Ouverture du modal de création
- Sélection de l'établissement
- Choix du plan
- Définition des dates de début/fin

**Simulation** :
```typescript
const handleCreateAbonnement = (newAbonnement: Omit<Abonnement, 'id'>) => {
  const abonnement: Abonnement = {
    id: `sub-${Date.now()}`, // ID généré
    ...newAbonnement,
    statut: 'actif' // Statut par défaut
  };
  
  setAbonnements(prev => [...prev, abonnement]);
  setIsModalOpen(false);
};
```

**Résultat attendu** :
- Toast de succès simulé
- Nouvel abonnement ajouté à la liste
- Modal fermé automatiquement
- Données persistées dans l'état local

### 4. Modification d'Abonnement (Simulée)
**Déclencheur** : Clic sur icône "Modifier"

**Action utilisateur** :
- Ouverture du modal pré-rempli
- Modification des champs (dates, plan, statut)
- Sauvegarde des changements

**Simulation** :
```typescript
const handleUpdateAbonnement = (updatedAbonnement: Abonnement) => {
  setAbonnements(prev => 
    prev.map(sub => 
      sub.id === updatedAbonnement.id ? updatedAbonnement : sub
    )
  );
  setIsModalOpen(false);
  setEditingAbonnement(null);
};
```

**Résultat attendu** :
- Toast de succès
- Données mises à jour dans l'interface
- Recalcul automatique des indicateurs d'expiration

### 5. Calcul des Dates d'Expiration (Simulé)
**Déclencheur** : Affichage de la liste ou modification des dates

**Simulation** :
```typescript
const getDaysRemaining = (dateFin: string) => {
  const diff = new Date(dateFin).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

// Indicateurs visuels
const getStatusBadge = (statut: string, daysRemaining: number) => {
  if (statut === 'expiré') return { color: 'red', text: 'Expiré' };
  if (daysRemaining <= 30) return { color: 'orange', text: `${daysRemaining}j restants` };
  return { color: 'green', text: 'Actif' };
};
```

**Résultat attendu** :
- Badges colorés selon le statut
- Alertes visuelles pour les expirations proches
- Tri automatique par urgence

## Points de Validation

### Fonctionnels
- [x] Interface de gestion complète (CRUD)
- [x] Filtrage et recherche fonctionnels
- [x] Calculs de dates d'expiration corrects
- [x] Relations établissements-plans cohérentes
- [x] États visuels appropriés (badges, alertes)

### Techniques
- [x] Code TypeScript typé avec interfaces
- [x] État React géré correctement
- [x] Composants réutilisables (modals, badges)
- [x] Performance acceptable (useMemo pour filtres)
- [x] Structure facilement migratable vers API

### UX/UI
- [x] Interface intuitive avec filtres clairs
- [x] Feedback visuel pour les actions
- [x] États d'alerte pour les expirations
- [x] Modal de création/édition ergonomique
- [x] Responsive design

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Validation des dates
const validateAbonnement = (abonnement: Partial<Abonnement>) => {
  if (new Date(abonnement.dateDebut!) >= new Date(abonnement.dateFin!)) {
    throw new Error('La date de fin doit être postérieure à la date de début');
  }
  if (!abonnement.etablissementId) {
    throw new Error('Un établissement doit être sélectionné');
  }
};

// Simulation d'erreurs de sauvegarde
const simulateSaveError = () => {
  if (Math.random() < 0.05) { // 5% d'erreurs
    throw new Error('Erreur de sauvegarde simulée');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Validation | Vérification dates/champs | Messages d'erreur formulaire |
| Sauvegarde | Échec aléatoire 5% | Toast d'erreur + retry |
| Données | Établissement inexistant | Message "Données incohérentes" |
| Permissions | Vérification rôle admin | Redirection vers login |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isLoading, setIsLoading] = useState(false);

const simulateLoading = async (action: () => void) => {
  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 800));
  action();
  setIsLoading(false);
};
```

### Empty States
```typescript
// Aucun abonnement trouvé
if (filteredAbonnements.length === 0) {
  return (
    <div className="text-center py-8">
      <p>Aucun abonnement trouvé</p>
      <Button onClick={() => setIsModalOpen(true)}>
        Créer le premier abonnement
      </Button>
    </div>
  );
}
```

## Données Mockées

### Structure des Données
```typescript
interface Abonnement {
  id: string;
  etablissementId: string;
  etablissementNom: string;
  planId: string;
  planNom: string;
  dateDebut: string; // ISO date
  dateFin: string;   // ISO date
  statut: 'actif' | 'expiré' | 'annulé';
}

// Générateur de données de test
const generateMockAbonnement = (): Abonnement => ({
  id: `sub-${Date.now()}-${Math.random()}`,
  etablissementId: faker.datatype.uuid(),
  etablissementNom: faker.company.name(),
  planId: faker.helpers.arrayElement(['plan-basic', 'plan-pro', 'plan-premium']),
  planNom: faker.helpers.arrayElement(['Basic', 'Pro', 'Premium']),
  dateDebut: faker.date.past().toISOString().split('T')[0],
  dateFin: faker.date.future().toISOString().split('T')[0],
  statut: faker.helpers.arrayElement(['actif', 'expiré', 'annulé']),
});
```

### Sources de Données
```typescript
// 1. Fichiers TypeScript statiques
import { abonnementsData } from './mock-abonnements';
import { etablissementsData } from '../etablissements/mock-etablissements';
import { plansData } from '../plans/mock-plans';

// 2. Relations entre entités
const getEtablissementName = (id: string) => 
  etablissementsData.find(etab => etab.id === id)?.name || 'Inconnu';

const getPlanName = (id: string) => 
  plansData.find(plan => plan.id === id)?.nom || 'Inconnu';

// 3. État local React (pas de persistance)
const [abonnements, setAbonnements] = useState<Abonnement[]>(abonnementsData);
```

### Données de Test Actuelles
- **4 abonnements** avec différents statuts
- **Relations** avec 5 établissements et 3 plans
- **Dates variées** : actifs, expirant, expirés
- **Calculs automatiques** des jours restants

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec schémas API
- [ ] **Endpoints** : Implémenter CRUD complet
- [ ] **Relations** : Gérer les jointures établissements/plans
- [ ] **Validation** : Ajouter validation serveur
- [ ] **Pagination** : Implémenter pour grandes listes
- [ ] **Notifications** : Alertes automatiques d'expiration

### Plan de Migration
```typescript
// Étape 1 : Interface service
interface AbonnementService {
  list(filters?: AbonnementFilters): Promise<PaginatedResponse<Abonnement>>;
  create(data: CreateAbonnementRequest): Promise<Abonnement>;
  update(id: string, data: UpdateAbonnementRequest): Promise<Abonnement>;
  delete(id: string): Promise<void>;
  getExpiringAbonnements(days: number): Promise<Abonnement[]>;
}

// Étape 2 : Implémentation API
class ApiAbonnementService implements AbonnementService {
  async list(filters?: AbonnementFilters) {
    const response = await abonnementApi.getAbonnements(filters);
    return response.data;
  }
  // ... autres méthodes
}

// Étape 3 : Hook React Query
const useAbonnements = (filters?: AbonnementFilters) => {
  return useQuery({
    queryKey: ['abonnements', filters],
    queryFn: () => abonnementService.list(filters),
  });
};
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Données** | 4 abonnements statiques | Base de données complète |
| **Filtrage** | Côté client | Côté serveur avec pagination |
| **Relations** | Jointures manuelles | Relations SQL automatiques |
| **Validation** | Côté client uniquement | Client + serveur |
| **Notifications** | Aucune | Emails automatiques d'expiration |

## Limitations Connues

### Fonctionnelles
- **Données** : Pas de persistance entre sessions
- **Relations** : Jointures manuelles fragiles
- **Notifications** : Pas d'alertes automatiques
- **Historique** : Pas de suivi des modifications

### Techniques
- **Performance** : Filtrage côté client uniquement
- **Concurrence** : Pas de gestion des conflits
- **Validation** : Règles métier simplifiées
- **Sécurité** : Pas de validation serveur

## Roadmap API

### Priorité Haute 🔴
- **CRUD Abonnements** : Q2 2025
- **Gestion des expirations** : Q2 2025
- **Notifications automatiques** : Q2 2025

### Priorité Moyenne 🟡
- **Historique des modifications** : Q3 2025
- **Rapports d'utilisation** : Q3 2025
- **API de facturation** : Q3 2025

### Priorité Basse 🟢
- **Renouvellement automatique** : Q4 2025
- **Intégration paiement** : Q4 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "react-icons": "^4.11.0",
  "@/components/ui": "local"
}
```

### Configuration
```typescript
// Pas de variables d'environnement nécessaires
// Données hardcodées dans les fichiers mock
```

### Outils de Développement
- **TypeScript** : Typage strict des interfaces
- **React State** : Gestion d'état local
- **useMemo** : Optimisation des filtres
- **Date-fns** : Calculs de dates (à ajouter)

---

*Workflow documenté le : 11 octobre 2025*  
*Migration API prévue : Q2 2025*  
*Auteur : Équipe EdConnekt Frontend*
