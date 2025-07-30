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
const CourseCard = () => {};
const RemediationResourceModal = () => {};

// ❌ Mauvais
const userProfile = () => {};
const course_card = () => {};
```

### Types et interfaces

```typescript
// ✅ Bon - PascalCase avec préfixe I pour interfaces
interface IUser {
  id: string;
  name: string;
}

type UserRole = 'teacher' | 'student' | 'parent';

// ❌ Mauvais
interface user {
  id: string;
  name: string;
}
```

### Fichiers et dossiers

```bash
# ✅ Bon - kebab-case pour les fichiers
user-profile.tsx
course-detail.tsx
remediation-resource-modal.tsx

# ✅ Bon - PascalCase pour les dossiers
components/
├── UserProfile/
├── CourseDetail/
└── RemediationResource/
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

// 2. Imports externes (lucide-react, etc.)
import { User, Settings } from 'lucide-react';

// 3. Imports internes (composants, hooks, etc.)
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

// 4. Imports de types
import { UserProps } from './types';

// 5. Imports de styles (si nécessaire)
import './Component.css';
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

### Composants stylés

```typescript
// ✅ Bon - Utiliser des classes réutilisables
const buttonClasses = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
};

const Button = ({ variant = 'primary', children }) => (
  <button className={`px-4 py-2 rounded-lg ${buttonClasses[variant]}`}>
    {children}
  </button>
);
```

## 🔧 Gestion d'état

### Hooks personnalisés

```typescript
// ✅ Bon - Hook personnalisé
const useUserData = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getUser(userId);
        setUser(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
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

## 🧪 Tests

### Structure des tests

```typescript
// ✅ Bon - Test bien structuré
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('affiche les informations de l\'utilisateur', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('appelle onEdit quand le bouton est cliqué', () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Modifier'));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
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
- [ ] Tests ajoutés/modifiés si nécessaire
- [ ] Pas d'erreurs ESLint
- [ ] Types TypeScript corrects
- [ ] Performance optimisée
- [ ] Sécurité vérifiée
- [ ] Accessibilité respectée
- [ ] Responsive design testé

---

*Standards mis à jour le : [Date]*
*Version : [Version du projet]* 