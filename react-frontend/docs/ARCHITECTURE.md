# Architecture Frontend EdConnekt

## Vue d'ensemble

EdConnekt est une plateforme éducative complète avec une architecture frontend moderne basée sur React, TypeScript et Vite. L'application supporte multiple rôles (admin staff, enseignant, élève, parent, admin) avec une architecture microservices et des clients API générés automatiquement via OpenAPI Generator.

## Structure du Projet

```
src/
├── api/                     # Clients API générés (OpenAPI)
│   ├── admission-service/   # Gestion des admissions
│   ├── classe-service/      # Gestion des classes
│   ├── competence-service/  # Gestion des compétences
│   ├── establishment-service/ # Gestion des établissements
│   ├── event-service/       # Gestion des événements
│   ├── identity-service/    # Authentification
│   ├── message-service/     # Messagerie
│   ├── pdi-service/         # Plans de développement
│   ├── provisioning-service/ # Provisioning utilisateurs
│   ├── resource-service/    # Gestion des ressources
│   ├── student-service/     # Gestion des élèves
│   ├── supplies-service/    # Gestion des fournitures
│   └── timetable-service/   # Emplois du temps
├── components/              # Composants par domaine métier
│   ├── ui/                 # Composants UI de base
│   ├── Header/             # En-tête de l'application
│   ├── GestionDesNotes/    # Gestion des notes
│   ├── admin/              # Interface administration
│   └── [22+ autres dossiers] # Composants spécialisés
├── contexts/               # 13 contextes React
│   ├── AuthContext.tsx
│   ├── EstablishmentContext.tsx
│   ├── UserContext.tsx
│   ├── ClasseContext.tsx
│   ├── StudentContext.tsx
│   ├── SuppliesContext.tsx
│   ├── TimetableContext.tsx
│   ├── CompetenceContext.tsx
│   ├── MessageContext.tsx
│   ├── ResourceContext.tsx
│   ├── EventContext.tsx
│   ├── AdmissionContext.tsx
│   └── PDIContext.tsx
├── pages/                  # Pages par rôle
│   ├── directeur/         # Interface admin staff
│   ├── enseignant/        # Interface enseignant
│   ├── eleve/             # Interface élève
│   ├── parent/            # Interface parent
│   └── admin/             # Interface admin
├── hooks/                  # 90+ hooks personnalisés
├── types/                  # Définitions TypeScript
├── utils/                  # Fonctions utilitaires
├── lib/                    # Librairies et helpers
├── assets/                 # Ressources statiques
├── styles/                 # Styles globaux
├── layouts/                # Layouts de l'application
├── config/                 # Configuration
│   ├── navigation.tsx     # Navigation multi-rôles
│   └── featureFlags.ts    # Feature flags
├── docs-api/              # Documentation API générée
├── i18n.ts                # Configuration i18n (FR/EN)
└── theme.tsx              # Configuration thème
```

## Architecture Microservices

### Services API (13 services)

Chaque client API est généré automatiquement via **OpenAPI Generator typescript-axios** :

#### Services Métier
- **admission-service** : Gestion des admissions et inscriptions
- **classe-service** : Gestion des classes et groupes
- **competence-service** : Référentiel de compétences
- **student-service** : Gestion des élèves et profils
- **supplies-service** : Campagnes de fournitures scolaires
- **timetable-service** : Emplois du temps et planification
- **resource-service** : Ressources pédagogiques
- **message-service** : Messagerie et communications
- **event-service** : Événements et calendrier
- **pdi-service** : Plans de développement individualisés

#### Services Transverses
- **identity-service** : Authentification et autorisation
- **establishment-service** : Gestion des établissements
- **provisioning-service** : Provisioning utilisateurs

### Configuration des Clients API

```typescript
// Factory centralisée pour tous les clients
class ApiClientFactory {
  private static axiosInstance = this.createAxiosInstance();

  private static createAxiosInstance() {
    const instance = axios.create();
    
    // Headers de contexte automatiques
    instance.interceptors.request.use((config) => {
      const establishment = localStorage.getItem('selectedEstablishment');
      const roles = localStorage.getItem('userRoles');
      
      if (establishment) config.headers['X-Etab'] = establishment;
      if (roles) config.headers['X-Roles'] = roles;
      
      return config;
    });

    return instance;
  }

  static createStudentApi(): StudentsApi {
    const config = new Configuration({
      basePath: process.env.VITE_STUDENT_API_BASE_URL,
    });
    return new StudentsApi(config, undefined, this.axiosInstance);
  }
  
  // ... autres services
}
```

## Architecture des Contextes (13 contextes)

### Contextes d'Authentification
- **AuthContext** : Authentification, rôles, permissions
- **EstablishmentContext** : Sélection et gestion d'établissement
- **UserContext** : Profil utilisateur et préférences

### Contextes Métier
- **ClasseContext** : Gestion des classes et groupes
- **StudentContext** : Gestion des élèves
- **SuppliesContext** : Campagnes de fournitures
- **TimetableContext** : Emplois du temps
- **CompetenceContext** : Référentiel de compétences
- **MessageContext** : Messagerie
- **ResourceContext** : Ressources pédagogiques
- **EventContext** : Événements
- **AdmissionContext** : Admissions
- **PDIContext** : Plans de développement

## Composants Multi-Rôles

### Composants UI de Base (`components/ui/`)
- **Button** : Boutons avec variantes EdConnekt (primary, secondary, outline)
- **Card** : Cartes avec thème EdConnekt
- **Modal** : Modales accessibles avec Radix UI
- **Form** : Formulaires avec validation TypeScript
- **Table** : Tables avec tri, filtrage et pagination

### Composants Métier par Domaine
- **Header/** : En-tête adaptatif selon le rôle
- **GestionDesNotes/** : Interface de gestion des notes
- **admin/** : Composants d'administration
- **[22+ autres dossiers]** : Composants spécialisés par fonctionnalité

### Exemples de Composants Réutilisables
```typescript
// Composant avec couleurs EdConnekt
<Button variant="primary" className="bg-o300 hover:bg-o400">
  Créer une campagne
</Button>

// Carte avec thème adaptatif
<Card className="border-g200 dark:border-g400">
  <CardHeader className="text-g500 dark:text-g100">
    Statistiques
  </CardHeader>
</Card>
```

## Flux de Données avec OpenAPI

```
UI Action → Hook → OpenAPI Client → API Gateway → Microservice
    ↑                                                        ↓
Re-render ← Context Update ← Response Processing ← API Response
```

### Exemple de Flux Complet
1. **Action utilisateur** : Création d'une campagne de fournitures
2. **Composant** : `SuppliesCampaignForm` utilise `useSuppliesContext()`
3. **Hook personnalisé** : `useOpenApiCall()` avec le client généré
4. **Client OpenAPI** : `SuppliesApi.createCampaign()` avec headers automatiques
5. **API Gateway** : Routage vers supplies-service avec `X-Etab` et `X-Roles`
6. **Microservice** : Traitement et réponse
7. **Context Update** : Mise à jour de l'état global
8. **Re-render** : Toutes les vues concernées se mettent à jour

### Gestion d'Erreurs avec React Hot Toast
```typescript
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const { data, loading, error, execute } = useOpenApiCall(
  () => suppliesApi.createCampaign(campaignData)
);

const { t } = useTranslation();

// Gestion des notifications avec react-hot-toast
useEffect(() => {
  if (error) {
    toast.error(t('supplies.errors.createFailed'));
  }
  if (data) {
    toast.success(t('supplies.success.campaignCreated'));
  }
}, [error, data, t]);

// Notifications avec actions personnalisées
const handleDelete = async (id: string) => {
  const promise = suppliesApi.deleteCampaign(id);
  
  toast.promise(promise, {
    loading: t('supplies.deleting'),
    success: t('supplies.success.deleted'),
    error: t('supplies.errors.deleteFailed'),
  });
};
```

## Avantages de cette Architecture

### 1. Séparation des Responsabilités
- **Contextes** : Logique métier et gestion d'état
- **Composants** : Interface utilisateur et interactions
- **Pages** : Orchestration des composants

### 2. Réutilisabilité
- Composants communs utilisables dans toute l'application
- Contextes réutilisables pour différentes pages
- Logique métier centralisée

### 3. Maintenabilité
- Code modulaire et bien organisé
- Tests unitaires facilités
- Débogage simplifié

### 4. Intégration Microservices
- Contextes prêts pour l'intégration API
- Séparation claire entre UI et logique métier
- Facilite l'ajout de nouveaux services

## Patterns Utilisés

### 1. Provider Pattern
```typescript
// App.tsx
<DirectorProvider>
  <OnboardingProvider>
    <AlertProvider>
      <ScheduleProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AlertProvider>
    </OnboardingProvider>
  </DirectorProvider>
</DirectorProvider>
```

### 2. Custom Hook Pattern
```typescript
// Utilisation dans les composants
const { kpiData, refreshData } = useDirector();
const { alertes, resolveAlert } = useAlert();
```

### 3. Component Composition
```typescript
// Réutilisation de composants
<KPICard 
  title={t('total_students')} 
  value={kpiData.totalEleves} 
  icon={Users} 
  color="blue" 
/>
```

## Internationalisation

L'application utilise `react-i18next` pour l'internationalisation :
- **Fichiers** : `public/locales/fr/translation.json`, `public/locales/en/translation.json`
- **Utilisation** : `const { t } = useTranslation();`
- **Clés** : Organisées par fonctionnalité (dashboard, onboarding, alertes, etc.)

## Styling

- **Framework** : Tailwind CSS
- **Composants UI** : shadcn/ui + Radix UI
- **Icônes** : Lucide React
- **Couleurs EdConnekt** : Gammes G (bleu-gris) et O (orange) personnalisées
- **Approche** : Utility-first avec classes conditionnelles

## Technologies Clés

### Frontend Stack
- **React 18** : Composants fonctionnels avec hooks
- **TypeScript** : Type safety complet
- **Vite** : Build tool moderne et rapide
- **Tailwind CSS** : Utility-first CSS avec couleurs EdConnekt
- **React i18next** : Internationalisation FR/EN

### API & État
- **OpenAPI Generator** : Clients TypeScript générés automatiquement
- **Axios** : Client HTTP avec intercepteurs
- **React Context** : Gestion d'état globale (13 contextes)
- **Custom Hooks** : 90+ hooks pour la logique métier

### UI & UX
- **Radix UI** : Composants accessibles
- **Lucide React** : Icônes modernes
- **React Hot Toast** : Notifications toast élégantes et performantes
- **Gamme de couleurs EdConnekt** : G (bleu-gris) et O (orange)

## Patterns Architecturaux

### 1. Factory Pattern pour APIs
```typescript
// Centralisation de la création des clients
const studentApi = ApiClientFactory.createStudentApi();
const suppliesApi = ApiClientFactory.createSuppliesApi();
```

### 2. Hook Pattern pour la logique
```typescript
// Hook réutilisable pour tous les appels API
const { data, loading, error } = useOpenApiCall(
  () => studentApi.getStudentById(id)
);
```

### 3. Context Pattern pour l'état
```typescript
// Contexte avec provider et hook personnalisé
const { students, addStudent } = useStudentContext();
```

## Système de Notifications avec React Hot Toast

### Configuration Globale

```typescript
// App.tsx - Configuration du Toaster
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="app">
      {/* Contenu de l'application */}
      
      {/* Configuration globale des toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}
```

### Utilisation Standard

```typescript
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  // Notifications de base
  const handleSuccess = () => {
    toast.success(t('common.success'));
  };

  const handleError = () => {
    toast.error(t('common.error'));
  };

  const handleInfo = () => {
    toast(t('common.info'), {
      icon: 'ℹ️',
      style: {
        borderColor: '#3b82f6',
      },
    });
  };

  // Notification avec action personnalisée
  const handleWithAction = () => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>{t('supplies.confirmDelete')}</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => {
            handleDelete();
            toast.dismiss(t.id);
          }}
        >
          {t('common.confirm')}
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          {t('common.cancel')}
        </button>
      </div>
    ), {
      duration: Infinity,
    });
  };
};
```

### Intégration avec les Hooks API

```typescript
// Hook personnalisé avec notifications intégrées
const useApiWithToast = <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  messages?: {
    loading?: string;
    success?: string;
    error?: string;
  }
) => {
  const { t } = useTranslation();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    const promise = apiCall();
    
    // Toast.promise gère automatiquement les 3 états
    toast.promise(promise, {
      loading: messages?.loading || t('common.loading'),
      success: messages?.success || t('common.success'),
      error: messages?.error || t('common.error'),
    });

    try {
      const response = await promise;
      setData(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { data, loading, execute };
};

// Utilisation dans un composant
const SuppliesPage = () => {
  const suppliesApi = ApiClientFactory.createSuppliesApi();
  const { t } = useTranslation();
  
  const { execute: createCampaign } = useApiWithToast(
    () => suppliesApi.createCampaign(campaignData),
    {
      loading: t('supplies.creating'),
      success: t('supplies.success.created'),
      error: t('supplies.errors.createFailed'),
    }
  );

  return (
    <button onClick={createCampaign}>
      {t('supplies.createCampaign')}
    </button>
  );
};
```

### Toasts Personnalisés avec Thème EdConnekt

```typescript
// Utilitaires pour toasts avec couleurs EdConnekt
export const edConnektToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #22c55e',
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #ef4444',
      },
    });
  },
  
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: 'var(--g50)',
        color: 'var(--g500)',
        border: '1px solid var(--g200)',
      },
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: 'var(--o50)',
        color: 'var(--o500)',
        border: '1px solid var(--o200)',
      },
    });
  },
};
```

### Avantages de React Hot Toast

- **Performance** : Optimisé pour les animations fluides
- **Accessibilité** : Support ARIA intégré
- **Personnalisation** : Styles et comportements entièrement configurables
- **Promesses** : Gestion automatique des états loading/success/error
- **TypeScript** : Support complet avec types
- **Bundle size** : Très léger (~3kb gzipped)

## Bonnes Pratiques

### 1. Nommage
- **Composants** : PascalCase (ex: `KPICard`)
- **Contextes** : PascalCase + Context (ex: `DirectorContext`)
- **Hooks** : camelCase + use (ex: `useDirector`)
- **Fichiers** : PascalCase pour composants, camelCase pour utilitaires

### 2. Organisation
- Un contexte par domaine métier
- Composants communs dans `common/`
- Composants spécifiques dans des dossiers dédiés
- Types TypeScript dans les contextes

### 3. Performance
- Éviter les re-renders inutiles
- Utiliser les hooks de React correctement
- Optimiser les listes avec des clés uniques

## Développement

### Installation
```bash
npm install
npm run dev
```

### Standards de Code
- **Linter** : ESLint 9+ (nouveau format)
- **Formatter** : Prettier avec configuration EdConnekt
- **TypeScript** : Strict mode + types générés OpenAPI
- **Commits** : Conventional Commits
- **PR** : Code review + validation des types
- **Headers API** : X-Etab et X-Roles automatiques

## Avantages de cette Architecture

### 1. Type Safety Complet
- Types générés automatiquement depuis les specs OpenAPI
- Aucune désynchronisation entre frontend et backend
- Détection d'erreurs à la compilation

### 2. Scalabilité
- Architecture microservices avec 13 services indépendants
- Contextes spécialisés par domaine métier
- Composants réutilisables entre rôles

### 3. Maintenabilité
- Clients API générés automatiquement
- Séparation claire des responsabilités
- Tests facilités par l'injection de dépendances

### 4. Performance
- Build optimisé avec Vite
- Lazy loading des pages par rôle
- Mise en cache intelligente des données

### 5. Expérience Développeur
- Auto-complétion complète avec TypeScript
- Hot reload instantané avec Vite
- Documentation API générée automatiquement

Cette architecture moderne permet à EdConnekt de supporter efficacement tous les rôles éducatifs avec une base de code maintenable et évolutive.
