import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useIdentityBulkImport, useIdentityCommitBatch } from '../hooks/useIdentity';
import { useDirector } from './DirectorContext';

type Domain = 'student' | 'parent' | 'teacher' | 'admin_staff';

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

interface UploadHistoryItem {
  id: string;
  domain: Domain;
  fileName: string;
  status: 'success' | 'error';
  timestamp: Date;
  recordCount: number;
}

interface OnboardingContextType {
  invitations: Invitation[];
  isUploading: boolean;
  uploadStatus: 'idle' | 'success' | 'error';
  lastIdentityBatchId: string | null;
  lastProvisioningBatchId: string | null;
  shouldFocusTracking: boolean;
  setShouldFocusTracking: (v: boolean) => void;
  focusIdentityBatch: (id: string) => void;
  focusProvisioningBatch: (id: string) => void;
  handleUpload: (file: File, domain: Domain) => Promise<boolean>;
  resendInvitation: (id: number) => void;
  
  // Nouvelles propriétés pour améliorer l'UX
  uploadProgress: number;
  currentUploadDomain: Domain | null;
  uploadHistory: UploadHistoryItem[];
  
  // Nouvelles méthodes
  clearUploadHistory: () => void;
  getUploadStats: () => {
    totalUploads: number;
    successfulUploads: number;
    failedUploads: number;
    lastUploadDate: Date | null;
  };
}

const mockInvitations: Invitation[] = [
  { id: 1, email: 'marie.dupont@email.com', nom: 'Dupont', prenom: 'Marie', role: 'enseignant', statut: 'en_attente', dateEnvoi: '2024-01-15T10:30:00', dateExpiration: '2024-01-22T10:30:00' },
  { id: 2, email: 'jean.martin@email.com', nom: 'Martin', prenom: 'Jean', role: 'parent', statut: 'acceptee', dateEnvoi: '2024-01-14T14:20:00', dateExpiration: '2024-01-21T14:20:00' },
  { id: 3, email: 'sophie.leroy@email.com', nom: 'Leroy', prenom: 'Sophie', role: 'eleve', statut: 'expiree', dateEnvoi: '2024-01-10T09:15:00', dateExpiration: '2024-01-17T09:15:00' },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps { children: ReactNode; }

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [invitations] = useState<Invitation[]>(mockInvitations);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastIdentityBatchId, setLastIdentityBatchId] = useState<string | null>(null);
  const [lastProvisioningBatchId, setLastProvisioningBatchId] = useState<string | null>(null);
  const [shouldFocusTracking, setShouldFocusTracking] = useState<boolean>(false);
  
  // Nouvelles propriétés pour améliorer l'UX
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadDomain, setCurrentUploadDomain] = useState<Domain | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  
  const { currentEtablissementId } = useDirector();
  const bulkImport = useIdentityBulkImport();
  const commitBatch = useIdentityCommitBatch();

  const handleUpload = async (file: File, domain: Domain): Promise<boolean> => {
    if (!file) return false;
    if (!currentEtablissementId) {
      setUploadStatus('error');
      return false;
    }
    
    setIsUploading(true);
    setCurrentUploadDomain(domain);
    setUploadProgress(0);
    
    // Simulation de progression
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const res = await bulkImport.mutateAsync({ file, establishmentId: currentEtablissementId });
      setUploadStatus('success');
      setUploadProgress(100);
      
      if (res?.batch_id) {
        // Commit automatique du batch d'identités
        try {
          await commitBatch.mutateAsync({ batchId: res.batch_id });
        } catch {
          // On n'empêche pas la suite, mais on garde le focus pour permettre un retry manuel
        }
        setLastIdentityBatchId(res.batch_id);
        setShouldFocusTracking(true);
      }
      
      // Ajouter à l'historique
      setUploadHistory(prev => [{
        id: Date.now().toString(),
        domain,
        fileName: file.name,
        status: 'success',
        timestamp: new Date(),
        recordCount: 0, // À récupérer de la réponse API si disponible
      }, ...prev.slice(0, 9)]); // Garder seulement les 10 derniers
      
      return true;
    } catch {
      setUploadStatus('error');
      setUploadProgress(0);
      
      // Ajouter l'échec à l'historique
      setUploadHistory(prev => [{
        id: Date.now().toString(),
        domain,
        fileName: file.name,
        status: 'error',
        timestamp: new Date(),
        recordCount: 0,
      }, ...prev.slice(0, 9)]);
      
      return false;
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setCurrentUploadDomain(null);
      setUploadProgress(0);
    }
  };

  const focusIdentityBatch = (id: string) => {
    setLastIdentityBatchId(id);
    setShouldFocusTracking(true);
  };

  const focusProvisioningBatch = (id: string) => {
    setLastProvisioningBatchId(id);
    setShouldFocusTracking(true);
  };

  const resendInvitation = (id: number) => {
    console.log(`Renvoyer l'invitation ${id}`);
  };

  // Nouvelles méthodes
  const clearUploadHistory = () => {
    setUploadHistory([]);
  };

  const getUploadStats = () => {
    const totalUploads = uploadHistory.length;
    const successfulUploads = uploadHistory.filter(item => item.status === 'success').length;
    const failedUploads = uploadHistory.filter(item => item.status === 'error').length;
    const lastUploadDate = uploadHistory.length > 0 ? uploadHistory[0].timestamp : null;

    return {
      totalUploads,
      successfulUploads,
      failedUploads,
      lastUploadDate,
    };
  };

  const value: OnboardingContextType = {
    invitations,
    isUploading,
    uploadStatus,
    lastIdentityBatchId,
    lastProvisioningBatchId,
    shouldFocusTracking,
    setShouldFocusTracking,
    focusIdentityBatch,
    focusProvisioningBatch,
    handleUpload,
    resendInvitation,
    uploadProgress,
    currentUploadDomain,
    uploadHistory,
    clearUploadHistory,
    getUploadStats,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
