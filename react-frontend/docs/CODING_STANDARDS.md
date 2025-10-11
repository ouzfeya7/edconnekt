# Standards de Codage EdConnekt

## Vue d'ensemble

Ce document définit les standards de codage pour maintenir la cohérence et la qualité du code dans le projet EdConnekt.

## 🎯 Principes généraux

### 1. Lisibilité
- Code auto-documenté
- Noms de variables et fonctions explicites
- Commentaires pour la logique complexe

### 2. Maintenabilité
- Fonctions courtes et focalisées
- Séparation des responsabilités
- Réutilisabilité des composants

### 3. Performance
- Optimisations appropriées
- Éviter les re-renders inutiles
- Gestion efficace de la mémoire

## 📝 Conventions de nommage

### Variables et fonctions

```typescript
// ✅ Bon
const userName = 'John Doe';
const isUserLoggedIn = true;
const handleUserClick = () => {};

// ❌ Mauvais
const u = 'John Doe';
const loggedIn = true;
const click = () => {};
```

### Composants React

```typescript
// ✅ Bon - PascalCase
const UserProfile = () => {};
const SuppliesCampaignPage = () => {};
const GestionDesNotesModal = () => {};

// ❌ Mauvais
const userProfile = () => {};
const supplies_campaign = () => {};
```

### Types et interfaces

```typescript
// ✅ Bon - PascalCase pour types et interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

type UserRole = 'teacher' | 'student' | 'parent' | 'admin';
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// ❌ Mauvais
interface user {
  id: string;
  name: string;
}
```

### Fichiers et dossiers

```bash
# ✅ Bon - PascalCase pour les fichiers et dossiers
UserProfile.tsx
CourseDetail.tsx
SuppliesCampaignModal.tsx

# ✅ Structure réelle EdConnekt
components/
├── Header/
├── GestionDesNotes/
├── admin/
├── ui/
└── ...

api/
├── admission-service/
├── classe-service/
├── competence-service/
└── ...
```

## 🏗️ Structure des composants

### Template de composant

```typescript
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  // 1. Hooks
  const [state, setState] = useState('');
  
  // 2. Effects
  useEffect(() => {
    // Logique d'effet
  }, []);
  
  // 3. Handlers
  const handleClick = () => {
    onAction?.();
  };
  
  // 4. Render
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={handleClick}>
        Action
      </button>
    </div>
  );
};

export default Component;
```

### Organisation des imports

```typescript
// 1. Imports React
import React, { useState, useEffect } from 'react';

// 2. Imports externes
import { User, Settings, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 3. Imports clients API générés OpenAPI
import { StudentsApi, ClassesApi } from '@/api/student-service';
import { CompetencesApi } from '@/api/competence-service';

// 4. Imports hooks et contextes
import { useAuth } from '@/hooks/useAuth';
import { useEstablishment } from '@/contexts/EstablishmentContext';

// 5. Imports composants UI
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 6. Imports de types
import { Student, Classe } from '@/types';
```

## 🎨 Styling avec Tailwind CSS

### Classes organisées

```tsx
// ✅ Bon - Classes organisées par catégorie
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg
  border border-gray-200
  hover:shadow-md transition-shadow
">
  {/* Contenu */}
</div>

// ❌ Mauvais - Classes mélangées
<div className="flex p-4 hover:shadow-md bg-white border border-gray-200 rounded-lg items-center justify-between transition-shadow">
  {/* Contenu */}
</div>
```

### Composants stylés avec couleurs EdConnekt

```typescript
// ✅ Bon - Utiliser les couleurs EdConnekt
const buttonClasses = {
  primary: 'bg-o300 hover:bg-o400 text-white', // Orange EdConnekt
  secondary: 'bg-g100 hover:bg-g200 text-g500', // Bleu-gris EdConnekt
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border-2 border-g300 text-g300 hover:bg-g300 hover:text-white'
};

const Button = ({ variant = 'primary', children, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-lg transition-colors ${buttonClasses[variant]}`}
    {...props}
  >
    {children}
  </button>
);
```

## 🔧 Gestion d'état

### Hooks personnalisés avec OpenAPI

```typescript
// ✅ Bon - Hook avec client OpenAPI généré
import { StudentsApi, Configuration } from '@/api/student-service';

const useStudentData = (studentId: string) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const config = new Configuration({
          basePath: process.env.VITE_STUDENT_API_BASE_URL,
        });
        const api = new StudentsApi(config);
        const response = await api.getStudentById(studentId);
        setStudent(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  return { student, loading, error };
};
```

### Context API

```typescript
// ✅ Bon - Context bien structuré
interface ResourceContextType {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);

  const addResource = (resource: Resource) => {
    setResources(prev => [...prev, resource]);
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ResourceContext.Provider value={{ resources, addResource, removeResource }}>
      {children}
    </ResourceContext.Provider>
  );
};
```

## 🌐 Internationalisation (i18n)

### Utilisation des traductions

```typescript
// ✅ Bon - Utilisation de useTranslation
import { useTranslation } from 'react-i18next';

const UserProfile = ({ user }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('user.profile.title')}</h1>
      <p>{t('user.profile.welcome', { name: user.name })}</p>
      <button>{t('common.edit')}</button>
    </div>
  );
};
```

### Structure des clés de traduction

```json
// public/locales/fr/translation.json
{
  "common": {
    "edit": "Modifier",
    "delete": "Supprimer",
    "save": "Enregistrer"
  },
  "user": {
    "profile": {
      "title": "Profil utilisateur",
      "welcome": "Bienvenue {{name}}"
    }
  },
  "supplies": {
    "campaign": {
      "title": "Campagne de fournitures",
      "create": "Créer une campagne"
    }
  }
}
```

## 📚 Documentation

### Commentaires

```typescript
// ✅ Bon - Commentaires utiles
/**
 * Calcule la moyenne des notes d'un élève
 * @param grades - Tableau des notes
 * @returns La moyenne arrondie à 2 décimales
 */
const calculateAverage = (grades: number[]): number => {
  if (grades.length === 0) return 0;
  
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / grades.length) * 100) / 100;
};

// ✅ Bon - Commentaire pour logique complexe
const processStudentData = (students: Student[]) => {
  // Filtrer les élèves actifs et calculer leurs moyennes
  const activeStudents = students.filter(s => s.isActive);
  const averages = activeStudents.map(s => calculateAverage(s.grades));
  
  return averages;
};
```

### JSDoc pour les composants

```typescript
/**
 * Composant d'affichage du profil utilisateur
 * 
 * @param user - Données de l'utilisateur
 * @param onEdit - Callback appelé lors de la modification
 * @param onDelete - Callback appelé lors de la suppression
 */
interface UserProfileProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit, onDelete }) => {
  // Implémentation
};
```

## 🔒 Sécurité

### Validation des données

```typescript
// ✅ Bon - Validation des props
interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'student'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }
    
    if (!formData.email.includes('@')) {
      alert('Email invalide');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champs du formulaire */}
    </form>
  );
};
```

### Protection contre les injections

```typescript
// ✅ Bon - Échapper les données utilisateur
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const UserComment = ({ comment }: { comment: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeInput(comment) }} />
);
```

## 🚀 Performance

### Optimisations React

```typescript
// ✅ Bon - React.memo pour éviter les re-renders
const UserCard = React.memo<UserCardProps>(({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// ✅ Bon - useMemo pour calculs coûteux
const UserList = ({ users, searchTerm }: UserListProps) => {
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### Lazy loading

```typescript
// ✅ Bon - Lazy loading des composants
const UserProfile = lazy(() => import('./UserProfile'));
const CourseDetail = lazy(() => import('./CourseDetail'));

const App = () => (
  <Suspense fallback={<div>Chargement...</div>}>
    <Routes>
      <Route path="/user/:id" element={<UserProfile />} />
      <Route path="/course/:id" element={<CourseDetail />} />
    </Routes>
  </Suspense>
);
```

## 🔄 Gestion des erreurs

### Error Boundaries

```typescript
// ✅ Bon - Error Boundary
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur capturée:', error, errorInfo);
    // Envoyer à un service de monitoring
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Une erreur est survenue</h2>
          <button onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Gestion des erreurs API

```typescript
// ✅ Bon - Hook pour gérer les erreurs API
const useApiCall = <T>(apiFunction: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
```

## 📋 Checklist de review

### Avant de soumettre un PR

- [ ] Code lisible et bien documenté
- [ ] Pas d'erreurs ESLint
- [ ] Types TypeScript corrects
- [ ] Performance optimisée
- [ ] Sécurité vérifiée
- [ ] Accessibilité respectée
- [ ] Responsive design testé
- [ ] Traductions ajoutées (FR/EN)
- [ ] Couleurs EdConnekt utilisées
- [ ] Headers API corrects (X-Etab, X-Roles)
- [ ] Clients OpenAPI correctement configurés
- [ ] Types générés utilisés

## 📡 Standards OpenAPI Generator

### Utilisation des types générés

```typescript
// ✅ Bon - Utiliser les types générés
import { Student, CreateStudentRequest, ApiResponse } from '@/api/student-service';

interface StudentFormProps {
  onSubmit: (student: CreateStudentRequest) => void;
  initialData?: Partial<Student>;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    classId: initialData?.classId || ''
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      {/* Formulaire */}
    </form>
  );
};
```

### Factory pattern pour les clients API

```typescript
// ✅ Bon - Factory centralisée pour les clients API
class ApiClientFactory {
  private static axiosInstance = this.createAxiosInstance();

  private static createAxiosInstance() {
    const instance = axios.create();
    
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

  static createClasseApi(): ClassesApi {
    const config = new Configuration({
      basePath: process.env.VITE_CLASSE_API_BASE_URL,
    });
    return new ClassesApi(config, undefined, this.axiosInstance);
  }
}

// Utilisation
const studentApi = ApiClientFactory.createStudentApi();
const classeApi = ApiClientFactory.createClasseApi();
```

### Hook générique pour OpenAPI

```typescript
// ✅ Bon - Hook réutilisable pour tous les clients OpenAPI
const useApiClient = <TApi>(createClient: () => TApi) => {
  const clientRef = useRef<TApi>();
  
  if (!clientRef.current) {
    clientRef.current = createClient();
  }
  
  return clientRef.current;
};

// Utilisation dans un composant
const SuppliesCampaignPage = () => {
  const suppliesApi = useApiClient(() => ApiClientFactory.createSuppliesApi());
  const { data: campaigns, loading, error, execute } = useOpenApiCall(
    () => suppliesApi.getCampaigns()
  );

  useEffect(() => {
    execute();
  }, []);

  return (
    <div>
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur: {error}</div>}
      {campaigns?.map(campaign => (
        <div key={campaign.id}>{campaign.name}</div>
      ))}
    </div>
  );
};
```

## 🚀 Standards API EdConnekt

### Configuration des clients OpenAPI

```typescript
// ✅ Bon - Configuration client OpenAPI avec headers
import { Configuration, StudentsApi } from '@/api/student-service';
import axios, { AxiosRequestConfig } from 'axios';

// Création d'une instance axios avec intercepteurs
const createApiClient = (baseURL: string) => {
  const axiosInstance = axios.create({ baseURL });
  
  // Intercepteur pour ajouter les headers de contexte
  axiosInstance.interceptors.request.use((config) => {
    const establishment = localStorage.getItem('selectedEstablishment');
    const roles = localStorage.getItem('userRoles');
    
    if (establishment) {
      config.headers['X-Etab'] = establishment;
    }
    if (roles) {
      config.headers['X-Roles'] = roles;
    }
    
    return config;
  });
  
  return axiosInstance;
};

// Configuration du client OpenAPI
const createStudentApiClient = () => {
  const axiosInstance = createApiClient(process.env.VITE_STUDENT_API_BASE_URL!);
  
  const config = new Configuration({
    basePath: process.env.VITE_STUDENT_API_BASE_URL,
  });
  
  return new StudentsApi(config, undefined, axiosInstance);
};
```

### Gestion des erreurs avec OpenAPI

```typescript
// ✅ Bon - Hook générique pour clients OpenAPI
import { AxiosResponse } from 'axios';

const useOpenApiCall = <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 
                     err?.message || 
                     t('errors.generic');
      setError(message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

// Exemple d'utilisation
const StudentProfile = ({ studentId }: { studentId: string }) => {
  const studentApi = createStudentApiClient();
  
  const { data: student, loading, error, execute } = useOpenApiCall(
    () => studentApi.getStudentById(studentId)
  );
  
  useEffect(() => {
    execute();
  }, [studentId]);
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      <h1>{student?.name}</h1>
      <p>{student?.email}</p>
    </div>
  );
};
```

---

*Standards mis à jour le : 10 octobre 2025*
*Version : EdConnekt React Frontend v1.0*