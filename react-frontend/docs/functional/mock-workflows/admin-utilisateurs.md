# Administration - Gestion des Utilisateurs (Données Mockées)

## Vue d'ensemble

**Statut** : ❌ Mock

**Description** : Interface d'administration pour gérer les utilisateurs de la plateforme EdConnekt. Permet de visualiser, créer, modifier et désactiver les comptes utilisateurs avec leurs rôles et permissions associés.

**Type de données** : Mockées / Simulées  
**Source des données** : 
- Fichier TypeScript statique (`mock-utilisateurs.ts`)
- Générateurs d'utilisateurs avec Faker.js
- État local React (useState)
- Relations avec établissements mockés

## Prérequis

### Rôles Utilisateur
- [x] Admin
- [ ] Directeur
- [ ] Enseignant  
- [ ] Élève
- [ ] Parent

### Permissions Requises
- `admin.users.read` : Lecture des utilisateurs (simulée)
- `admin.users.write` : Création/modification (simulée)
- `admin.users.delete` : Désactivation/suppression
- `admin.roles.manage` : Gestion des rôles

### État Initial du Système
- Utilisateur authentifié avec rôle Admin
- Données mockées initialisées (20+ utilisateurs de test)
- Rôles et établissements disponibles
- Filtres et recherche fonctionnels

## Workflow E2E

### 1. Point d'Entrée
**Page** : `src/pages/admin/utilisateurs/UtilisateursPage.tsx`  
**Route** : `/admin/utilisateurs`  
**Navigation** : Menu Admin → Utilisateurs

**Action utilisateur** :
- Clic sur "Utilisateurs" dans le menu admin
- Accès direct via URL

**Source des données** :
```typescript
// Import des données mockées
import { utilisateursData, Utilisateur } from './mock-utilisateurs';

// Structure des données
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'directeur' | 'enseignant' | 'parent' | 'eleve';
  etablissementId?: string;
  etablissementNom?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  derniereConnexion: string;
  dateCreation: string;
  telephone?: string;
  avatar?: string;
}

// État local React
const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(utilisateursData);
```

**Résultat attendu** :
- Affichage de la liste des utilisateurs (20+ éléments)
- Filtres par rôle, établissement et statut
- Recherche par nom/email fonctionnelle
- Indicateurs visuels pour les statuts

### 2. Filtrage et Recherche Avancée (Simulé)
**Déclencheur** : Saisie dans la recherche ou sélection de filtres

**Action utilisateur** :
- Saisie nom/prénom/email dans la barre de recherche
- Sélection d'un rôle spécifique
- Filtrage par établissement
- Tri par date de création/dernière connexion

**Simulation** :
```typescript
const filteredUtilisateurs = useMemo(() => {
  return utilisateurs
    .filter(user => {
      const searchMatch = searchTerm === '' || 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const etablissementMatch = etablissementFilter === 'all' || 
        user.etablissementId === etablissementFilter;
      const statutMatch = statutFilter === 'all' || user.statut === statutFilter;
      
      return searchMatch && roleMatch && etablissementMatch && statutMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'nom') return a.nom.localeCompare(b.nom);
      if (sortBy === 'email') return a.email.localeCompare(b.email);
      if (sortBy === 'dateCreation') return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      if (sortBy === 'derniereConnexion') return new Date(b.derniereConnexion).getTime() - new Date(a.derniereConnexion).getTime();
      return 0;
    });
}, [utilisateurs, searchTerm, roleFilter, etablissementFilter, statutFilter, sortBy]);
```

**Résultat attendu** :
- Filtrage instantané côté client
- Mise à jour du compteur de résultats
- Tri dynamique des colonnes
- Préservation de l'état des filtres

### 3. Création d'Utilisateur (Simulée)
**Déclencheur** : Clic sur bouton "Nouvel Utilisateur"

**Action utilisateur** :
- Ouverture du modal de création
- Saisie des informations personnelles
- Sélection du rôle et établissement
- Définition du mot de passe initial

**Simulation** :
```typescript
const handleCreateUtilisateur = (newUtilisateur: Omit<Utilisateur, 'id' | 'dateCreation' | 'derniereConnexion'>) => {
  const utilisateur: Utilisateur = {
    id: `user-${Date.now()}`,
    ...newUtilisateur,
    statut: 'actif', // Actif par défaut
    dateCreation: new Date().toISOString(),
    derniereConnexion: new Date().toISOString(), // Première connexion simulée
    avatar: generateAvatarUrl(newUtilisateur.nom, newUtilisateur.prenom)
  };
  
  // Validation des données
  validateUtilisateur(utilisateur);
  
  setUtilisateurs(prev => [...prev, utilisateur]);
  setIsModalOpen(false);
  
  // Simulation d'envoi d'email de bienvenue
  simulateWelcomeEmail(utilisateur.email);
  
  toast.success(`Utilisateur ${utilisateur.prenom} ${utilisateur.nom} créé avec succès`);
};
```

**Résultat attendu** :
- Toast de succès simulé
- Nouvel utilisateur ajouté à la liste
- Email de bienvenue simulé
- Modal fermé automatiquement

### 4. Modification d'Utilisateur (Simulée)
**Déclencheur** : Clic sur icône "Modifier" dans la liste

**Action utilisateur** :
- Ouverture du modal pré-rempli
- Modification des champs autorisés
- Changement de rôle/établissement
- Mise à jour du statut

**Simulation** :
```typescript
const handleUpdateUtilisateur = (updatedUtilisateur: Utilisateur) => {
  // Validation des modifications
  validateUtilisateurUpdate(updatedUtilisateur);
  
  setUtilisateurs(prev => 
    prev.map(user => 
      user.id === updatedUtilisateur.id ? {
        ...updatedUtilisateur,
        // Préservation de certains champs
        dateCreation: user.dateCreation,
        derniereConnexion: user.derniereConnexion
      } : user
    )
  );
  
  setIsModalOpen(false);
  setEditingUtilisateur(null);
  
  // Notification de changement de rôle si applicable
  if (originalUser.role !== updatedUtilisateur.role) {
    simulateRoleChangeNotification(updatedUtilisateur);
  }
  
  toast.success('Utilisateur mis à jour avec succès');
};
```

**Résultat attendu** :
- Toast de succès
- Données mises à jour dans l'interface
- Notification de changement de rôle (si applicable)
- Recalcul automatique des statistiques

### 5. Gestion des Statuts (Simulée)
**Déclencheur** : Clic sur bouton de changement de statut

**Action utilisateur** :
- Activation/désactivation d'un compte
- Suspension temporaire
- Confirmation via dialog

**Simulation** :
```typescript
const handleChangeStatut = (userId: string, newStatut: 'actif' | 'inactif' | 'suspendu') => {
  const user = utilisateurs.find(u => u.id === userId);
  if (!user) return;
  
  // Validation des permissions
  if (user.role === 'admin' && getCurrentUser().id !== userId) {
    throw new Error('Impossible de modifier le statut d\'un autre administrateur');
  }
  
  setUtilisateurs(prev => 
    prev.map(u => 
      u.id === userId ? { ...u, statut: newStatut } : u
    )
  );
  
  // Notification à l'utilisateur concerné
  simulateStatusChangeNotification(user, newStatut);
  
  const action = newStatut === 'actif' ? 'activé' : 
                newStatut === 'inactif' ? 'désactivé' : 'suspendu';
  toast.success(`Utilisateur ${action} avec succès`);
};
```

**Résultat attendu** :
- Changement visuel immédiat (badge, icône)
- Toast de confirmation
- Notification à l'utilisateur concerné
- Mise à jour des statistiques globales

## Points de Validation

### Fonctionnels
- [x] Interface de gestion complète (CRUD)
- [x] Filtrage et recherche avancés
- [x] Gestion des rôles et permissions
- [x] Validation des données utilisateur
- [x] Notifications simulées

### Techniques
- [x] Code TypeScript typé avec interfaces
- [x] État React géré correctement
- [x] Composants réutilisables (modals, filtres)
- [x] Validation côté client robuste
- [x] Performance acceptable (useMemo, useCallback)

### UX/UI
- [x] Interface intuitive avec filtres clairs
- [x] Recherche instantanée
- [x] Modal de création/édition ergonomique
- [x] Feedback visuel pour toutes les actions
- [x] Responsive design et accessibilité

## Simulation des Erreurs

### Erreurs Simulées
```typescript
// Validation des utilisateurs
const validateUtilisateur = (utilisateur: Partial<Utilisateur>) => {
  if (!utilisateur.email || !isValidEmail(utilisateur.email)) {
    throw new Error('Email invalide');
  }
  if (!utilisateur.nom || utilisateur.nom.trim().length < 2) {
    throw new Error('Le nom doit contenir au moins 2 caractères');
  }
  if (!utilisateur.prenom || utilisateur.prenom.trim().length < 2) {
    throw new Error('Le prénom doit contenir au moins 2 caractères');
  }
  if (utilisateur.role === 'enseignant' && !utilisateur.etablissementId) {
    throw new Error('Un établissement doit être sélectionné pour un enseignant');
  }
};

// Simulation d'erreurs de sauvegarde
const simulateSaveError = () => {
  if (Math.random() < 0.03) { // 3% d'erreurs
    throw new Error('Erreur de sauvegarde utilisateur');
  }
};

// Validation des permissions
const validatePermissions = (action: string, targetUser: Utilisateur) => {
  const currentUser = getCurrentUser();
  if (targetUser.role === 'admin' && currentUser.id !== targetUser.id) {
    throw new Error('Permissions insuffisantes pour cette action');
  }
};
```

### Types d'Erreurs Simulées
| Type | Simulation | Comportement UI |
|------|------------|-----------------|
| Validation | Vérification champs requis | Messages d'erreur formulaire |
| Email | Format email invalide | Erreur sur le champ email |
| Permissions | Action non autorisée | Modal d'erreur de permissions |
| Sauvegarde | Échec aléatoire 3% | Toast d'erreur + retry |
| Unicité | Email déjà existant | Message "Email déjà utilisé" |

## États de l'UI

### Loading States (Simulés)
```typescript
const [isLoading, setIsLoading] = useState(false);
const [isSaving, setIsSaving] = useState(false);

const simulateUserCreation = async (userData: CreateUserRequest) => {
  setIsSaving(true);
  await new Promise(resolve => setTimeout(resolve, 1000));
  setIsSaving(false);
};
```

### Empty States
```typescript
// Aucun utilisateur trouvé
if (filteredUtilisateurs.length === 0 && searchTerm) {
  return (
    <div className="text-center py-8">
      <Users className="mx-auto h-12 w-12 text-gray-400" />
      <h3>Aucun utilisateur trouvé</h3>
      <p>Essayez de modifier vos critères de recherche</p>
    </div>
  );
}
```

## Données Mockées

### Structure des Données
```typescript
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'directeur' | 'enseignant' | 'parent' | 'eleve';
  etablissementId?: string;
  etablissementNom?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  derniereConnexion: string;
  dateCreation: string;
  telephone?: string;
  avatar?: string;
}

// Générateur d'utilisateurs réalistes
const generateMockUtilisateur = (role?: string): Utilisateur => {
  const userRole = role || faker.helpers.arrayElement(['directeur', 'enseignant', 'parent', 'eleve']);
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  
  return {
    id: `user-${Date.now()}-${Math.random()}`,
    nom: lastName,
    prenom: firstName,
    email: faker.internet.email(firstName, lastName).toLowerCase(),
    role: userRole as any,
    etablissementId: userRole !== 'admin' ? faker.helpers.arrayElement(etablissementIds) : undefined,
    etablissementNom: userRole !== 'admin' ? getEtablissementName(etablissementId) : undefined,
    statut: faker.helpers.weightedArrayElement([
      { weight: 85, value: 'actif' },
      { weight: 10, value: 'inactif' },
      { weight: 5, value: 'suspendu' }
    ]),
    derniereConnexion: faker.date.recent({ days: 30 }).toISOString(),
    dateCreation: faker.date.past({ years: 2 }).toISOString(),
    telephone: faker.phone.number(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`
  };
};
```

### Données de Test Actuelles
- **25 utilisateurs** avec rôles variés
- **Relations** avec établissements mockés
- **Statuts réalistes** (85% actifs, 15% inactifs/suspendus)
- **Dates** de création et connexion cohérentes
- **Avatars** générés automatiquement

## Migration vers API Réelle

### Checklist de Migration
- [ ] **Types** : Vérifier compatibilité avec schémas utilisateur
- [ ] **Endpoints** : Implémenter CRUD complet
- [ ] **Authentication** : Intégration avec Keycloak
- [ ] **Permissions** : Système RBAC complet
- [ ] **Notifications** : Emails automatiques
- [ ] **Audit** : Logs des modifications utilisateur

### Plan de Migration
```typescript
// Étape 1 : Interface service utilisateur
interface UtilisateurService {
  list(filters?: UserFilters): Promise<PaginatedResponse<Utilisateur>>;
  create(data: CreateUtilisateurRequest): Promise<Utilisateur>;
  update(id: string, data: UpdateUtilisateurRequest): Promise<Utilisateur>;
  changeStatus(id: string, status: UserStatus): Promise<Utilisateur>;
  resetPassword(id: string): Promise<void>;
}

// Étape 2 : Implémentation API
class ApiUtilisateurService implements UtilisateurService {
  async list(filters?: UserFilters) {
    const response = await userApi.getUsers(filters);
    return response.data;
  }
  // ... autres méthodes
}

// Étape 3 : Hook React Query
const useUtilisateurs = (filters?: UserFilters) => {
  return useQuery({
    queryKey: ['utilisateurs', filters],
    queryFn: () => utilisateurService.list(filters),
  });
};
```

### Différences Attendues
| Aspect | Mock | API Réelle |
|--------|------|------------|
| **Données** | 25 utilisateurs statiques | Base de données complète |
| **Filtrage** | Côté client | Côté serveur avec pagination |
| **Authentication** | Simulée | Keycloak SSO intégré |
| **Permissions** | Vérifications basiques | RBAC complet |
| **Notifications** | Simulées | Emails/SMS automatiques |
| **Audit** | Aucun | Logs complets des actions |

## Limitations Connues

### Fonctionnelles
- **Données** : Pas de persistance entre sessions
- **Authentication** : Pas d'intégration SSO réelle
- **Permissions** : Vérifications simplifiées
- **Notifications** : Pas d'envoi d'emails réels

### Techniques
- **Performance** : Filtrage côté client uniquement
- **Concurrence** : Pas de gestion des conflits
- **Validation** : Règles métier simplifiées
- **Sécurité** : Pas de chiffrement des données sensibles

## Roadmap API

### Priorité Haute 🔴
- **CRUD Utilisateurs** : Q2 2025
- **Intégration Keycloak** : Q2 2025
- **Système de permissions** : Q2 2025

### Priorité Moyenne 🟡
- **Notifications automatiques** : Q3 2025
- **Audit des actions** : Q3 2025
- **Import/Export utilisateurs** : Q3 2025

### Priorité Basse 🟢
- **Analytics utilisateurs** : Q4 2025
- **Intégration LDAP** : Q4 2025

## Notes Techniques

### Dépendances Mock
```json
{
  "@faker-js/faker": "^8.0.0",
  "react-icons": "^4.11.0",
  "react-hot-toast": "^2.4.1"
}
```

### Configuration
```typescript
// Rôles disponibles
const USER_ROLES = ['admin', 'directeur', 'enseignant', 'parent', 'eleve'] as const;

// Statuts utilisateur
const USER_STATUSES = ['actif', 'inactif', 'suspendu'] as const;
```

---

*Workflow documenté le : 11 octobre 2025*  
*Migration API prévue : Q2 2025*  
*Auteur : Équipe EdConnekt Frontend*
