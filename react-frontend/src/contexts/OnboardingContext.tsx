import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour les données d'onboarding
interface CSVUser {
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

interface ValidationSummary {
  total: number;
  byRole: Record<string, number>;
  validEmails: number;
  invalidEmails: number;
}

interface Invitation {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  statut: 'en_attente' | 'acceptee' | 'expiree';
  dateEnvoi: string;
  dateExpiration: string;
}

interface OnboardingContextType {
  // État des données
  selectedFile: File | null;
  previewData: CSVUser[];
  validationErrors: string[];
  summaryData: ValidationSummary | null;
  invitations: Invitation[];
  isUploading: boolean;
  uploadStatus: 'idle' | 'success' | 'error';
  showSummary: boolean;
  
  // Actions
  setSelectedFile: (file: File | null) => void;
  setPreviewData: (data: CSVUser[]) => void;
  setValidationErrors: (errors: string[]) => void;
  setSummaryData: (summary: ValidationSummary | null) => void;
  setShowSummary: (show: boolean) => void;
  validateCSVData: (data: CSVUser[]) => string[];
  generateSummary: (data: CSVUser[]) => ValidationSummary;
  hasLineErrors: (lineIndex: number) => boolean;
  parseCsvLine: (line: string) => string[];
  readCsvFile: (file: File) => void;
  handleUpload: () => Promise<void>;
  resendInvitation: (id: number) => void;
}

// Données mockées pour les invitations
const mockInvitations: Invitation[] = [
  {
    id: 1,
    email: 'marie.dupont@email.com',
    nom: 'Dupont',
    prenom: 'Marie',
    role: 'enseignant',
    statut: 'en_attente',
    dateEnvoi: '2024-01-15T10:30:00',
    dateExpiration: '2024-01-22T10:30:00'
  },
  {
    id: 2,
    email: 'jean.martin@email.com',
    nom: 'Martin',
    prenom: 'Jean',
    role: 'parent',
    statut: 'acceptee',
    dateEnvoi: '2024-01-14T14:20:00',
    dateExpiration: '2024-01-21T14:20:00'
  },
  {
    id: 3,
    email: 'sophie.leroy@email.com',
    nom: 'Leroy',
    prenom: 'Sophie',
    role: 'eleve',
    statut: 'expiree',
    dateEnvoi: '2024-01-10T09:15:00',
    dateExpiration: '2024-01-17T09:15:00'
  }
];

// Création du contexte
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Props pour le provider
interface OnboardingProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CSVUser[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [summaryData, setSummaryData] = useState<ValidationSummary | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSummary, setShowSummary] = useState(false);

  // Colonnes obligatoires pour le CSV
  const requiredColumns = ['nom', 'prenom', 'email', 'role'];
  const validRoles = ['enseignant', 'eleve', 'parent', 'admin'];

  // Fonction pour valider les données CSV
  const validateCSVData = (data: CSVUser[]): string[] => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('Le fichier CSV est vide');
      return errors;
    }

    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    if (missingColumns.length > 0) {
      errors.push(`Colonnes manquantes : ${missingColumns.join(', ')}`);
    }

    data.forEach((row, index) => {
      const lineNumber = index + 1;
      
      requiredColumns.forEach(col => {
        if (!row[col as keyof CSVUser] || String(row[col as keyof CSVUser]).trim() === '') {
          errors.push(`Ligne ${lineNumber} : champ '${col}' manquant`);
        }
      });

      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push(`Ligne ${lineNumber} : email invalide '${row.email}'`);
      }

      if (row.role && !validRoles.includes(row.role.toLowerCase())) {
        errors.push(`Ligne ${lineNumber} : rôle invalide '${row.role}' (valides : ${validRoles.join(', ')})`);
      }
    });

    return errors;
  };

  // Fonction pour générer le résumé
  const generateSummary = (data: CSVUser[]): ValidationSummary => {
    const summary: ValidationSummary = {
      total: data.length,
      byRole: {},
      validEmails: 0,
      invalidEmails: 0
    };

    data.forEach(row => {
      const role = row.role?.toLowerCase() || 'inconnu';
      summary.byRole[role] = (summary.byRole[role] || 0) + 1;
      
      if (row.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        summary.validEmails++;
      } else {
        summary.invalidEmails++;
      }
    });

    return summary;
  };

  // Fonction pour vérifier si une ligne a des erreurs
  const hasLineErrors = (lineIndex: number): boolean => {
    return validationErrors.some(error => error.includes(`Ligne ${lineIndex + 1}`));
  };

  // Fonction pour parser une ligne CSV
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // Fonction pour lire le fichier CSV
  const readCsvFile = (file: File) => {
    setUploadStatus('idle'); // Réinitialiser le statut au début de la lecture
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      
      if (lines.length < 2) {
        alert('Le fichier CSV est vide ou ne contient pas de données');
        return;
      }
      
      const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());
      
      const csvData = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map((line) => {
          const values = parseCsvLine(line);
          const row: CSVUser = {
            nom: '',
            prenom: '',
            email: '',
            role: ''
          };
          
          headers.forEach((header, i) => {
            if (header in row) {
              (row as any)[header] = values[i] || '';
            }
          });
          
          return row;
        });
      
      setPreviewData(csvData);
      
      const errors = validateCSVData(csvData);
      setValidationErrors(errors);
      
      const summary = generateSummary(csvData);
      setSummaryData(summary);
    };
    
    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier');
    };
    
    reader.readAsText(file);
  };

  // Fonction pour gérer l'upload
  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulation d'upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      setSelectedFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      setSummaryData(null);
    }, 2000);
  };

  // Fonction pour renvoyer une invitation
  const resendInvitation = (id: number) => {
    console.log(`Renvoyer l'invitation ${id}`);
    // Ici on pourrait appeler une API pour renvoyer l'invitation
  };

  const value: OnboardingContextType = {
    selectedFile,
    previewData,
    validationErrors,
    summaryData,
    invitations,
    isUploading,
    uploadStatus,
    showSummary,
    setSelectedFile,
    setPreviewData,
    setValidationErrors,
    setSummaryData,
    setShowSummary,
    validateCSVData,
    generateSummary,
    hasLineErrors,
    parseCsvLine,
    readCsvFile,
    handleUpload,
    resendInvitation
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
