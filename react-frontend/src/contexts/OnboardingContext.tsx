import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useIdentityBulkImport } from '../hooks/useIdentity';
import { useDirector } from './DirectorContext';

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
  invitations: Invitation[];
  isUploading: boolean;
  uploadStatus: 'idle' | 'success' | 'error';
  lastIdentityBatchId: string | null;
  lastProvisioningBatchId: string | null;
  shouldFocusTracking: boolean;
  setShouldFocusTracking: (v: boolean) => void;
  focusIdentityBatch: (id: string) => void;
  focusProvisioningBatch: (id: string) => void;
  handleUpload: (file: File) => Promise<boolean>;
  resendInvitation: (id: number) => void;
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
  const { currentEtablissementId } = useDirector();
  const bulkImport = useIdentityBulkImport();

  const handleUpload = async (file: File): Promise<boolean> => {
    if (!file) return false;
    if (!currentEtablissementId) {
      setUploadStatus('error');
      return false;
    }
    setIsUploading(true);
    try {
      const res = await bulkImport.mutateAsync({ file, establishmentId: currentEtablissementId });
      setUploadStatus('success');
      if (res?.batch_id) {
        setLastIdentityBatchId(res.batch_id);
        setShouldFocusTracking(true);
      }
      return true;
    } catch {
      setUploadStatus('error');
      return false;
    } finally {
      setIsUploading(false);
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
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
