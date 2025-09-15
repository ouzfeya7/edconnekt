/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour les paramètres
interface SchoolSettings {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo?: string;
  directeur: string;
  anneeScolaire: string;
  siteWeb?: string;
  fuseauHoraire?: string;
  langue?: string;
  trimestres: {
    trimestre1: { debut: string; fin: string };
    trimestre2: { debut: string; fin: string };
    trimestre3: { debut: string; fin: string };
  };
}

interface Cycle {
  id: string;
  nom: string;
  description?: string;
  niveau?: string;
  duree?: number;
  actif: boolean;
  classes: string[];
  matieres: string[];
}

interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  avatar?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  alertes: boolean;
  rapports: boolean;
  emploiTemps: boolean;
}

interface SettingsContextType {
  // État des données
  schoolSettings: SchoolSettings;
  cycles: Cycle[];
  userProfile: UserProfile;
  notificationSettings: NotificationSettings;
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  addCycle: (cycle: Omit<Cycle, 'id'>) => Promise<void>;
  updateCycle: (id: string, updates: Partial<Cycle>) => Promise<void>;
  deleteCycle: (id: string) => Promise<void>;
  toggleCycle: (id: string) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  exportSettings: (format: 'json' | 'pdf') => void;
  resetSettings: () => Promise<void>;
  getActiveCycles: () => Cycle[];
  getCycleById: (id: string) => Cycle | undefined;
}

// Données mockées pour les paramètres
const mockSchoolSettings: SchoolSettings = {
  nom: 'Collège Saint-Exupéry',
  adresse: '123 Rue de l\'Éducation, 75001 Paris',
  telephone: '01 23 45 67 89',
  email: 'contact@college-saint-exupery.fr',
  directeur: 'Marie Dupont',
  anneeScolaire: '2024-2025',
  siteWeb: 'https://college-saint-exupery.fr',
  fuseauHoraire: 'Europe/Paris',
  langue: 'fr',
  trimestres: {
    trimestre1: { debut: '2024-09-02', fin: '2024-12-20' },
    trimestre2: { debut: '2025-01-06', fin: '2025-04-04' },
    trimestre3: { debut: '2025-04-22', fin: '2025-07-04' }
  }
};

const mockCycles: Cycle[] = [
  {
    id: 'prescolaire',
    nom: 'Préscolaire',
    description: 'Cycle d\'éveil et de découverte pour les 3-6 ans',
    niveau: 'prescolaire',
    duree: 3,
    actif: true,
    classes: ['Petite Section', 'Moyenne Section', 'Grande Section'],
    matieres: ['Langage', 'Activités physiques', 'Activités artistiques', 'Découverte du monde']
  },
  {
    id: 'primaire',
    nom: 'Primaire',
    description: 'Cycle d\'apprentissage des fondamentaux pour les 6-11 ans',
    niveau: 'primaire',
    duree: 5,
    actif: true,
    classes: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    matieres: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Arts plastiques', 'EPS']
  },
  {
    id: 'college',
    nom: 'Collège',
    description: 'Cycle d\'approfondissement pour les 11-15 ans',
    niveau: 'college',
    duree: 4,
    actif: true,
    classes: ['6ème', '5ème', '4ème', '3ème'],
    matieres: ['Français', 'Mathématiques', 'Histoire-Géographie', 'SVT', 'Anglais', 'EPS', 'Technologie', 'Physique-Chimie']
  },
  {
    id: 'lycee',
    nom: 'Lycée',
    description: 'Cycle de spécialisation pour les 15-18 ans',
    niveau: 'lycee',
    duree: 3,
    actif: true,
    classes: ['Seconde', 'Première', 'Terminale'],
    matieres: ['Français', 'Mathématiques', 'Histoire-Géographie', 'SVT', 'Anglais', 'EPS', 'Physique-Chimie', 'Philosophie']
  },
  {
    id: 'universite',
    nom: 'Université',
    description: 'Cycle d\'enseignement supérieur',
    niveau: 'universite',
    duree: 3,
    actif: false,
    classes: ['Licence', 'Master', 'Doctorat'],
    matieres: ['Sciences', 'Lettres', 'Droit', 'Économie', 'Médecine', 'Ingénierie']
  }
];

const mockUserProfile: UserProfile = {
  id: '1',
  nom: 'Dupont',
  prenom: 'Marie',
  email: 'marie.dupont@college.fr',
  role: 'directeur',
  telephone: '06 12 34 56 78'
};

const mockNotificationSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  alertes: true,
  rapports: true,
  emploiTemps: false
};

// Création du contexte
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Props pour le provider
interface SettingsProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(mockSchoolSettings);
  const [cycles, setCycles] = useState<Cycle[]>(mockCycles);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fonction pour mettre à jour les paramètres de l'école
  const updateSchoolSettings = async (settings: Partial<SchoolSettings>) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSchoolSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile(prev => ({ ...prev, ...profile }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour mettre à jour les paramètres de notification
  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotificationSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour ajouter un cycle
  const addCycle = async (cycle: Omit<Cycle, 'id'>) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCycle: Cycle = {
        ...cycle,
        id: cycle.nom.toLowerCase().replace(/\s+/g, '')
      };
      setCycles(prev => [...prev, newCycle]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cycle:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour mettre à jour un cycle
  const updateCycle = async (id: string, updates: Partial<Cycle>) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCycles(prev => prev.map(cycle => 
        cycle.id === id ? { ...cycle, ...updates } : cycle
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cycle:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour supprimer un cycle
  const deleteCycle = async (id: string) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCycles(prev => prev.filter(cycle => cycle.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du cycle:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour activer/désactiver un cycle
  const toggleCycle = async (id: string) => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCycles(prev => prev.map(cycle => 
        cycle.id === id ? { ...cycle, actif: !cycle.actif } : cycle
      ));
    } catch (error) {
      console.error('Erreur lors de la modification du cycle:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour uploader un logo
  const uploadLogo = async (file: File): Promise<string> => {
    setIsSaving(true);
    try {
      // Simulation d'un upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const logoUrl = URL.createObjectURL(file);
      setSchoolSettings(prev => ({ ...prev, logo: logoUrl }));
      return logoUrl;
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour exporter les paramètres
  const exportSettings = (format: 'json' | 'pdf') => {
    console.log(`Exporting settings in ${format} format`);
    // Ici on pourrait implémenter l'export réel
  };

  // Fonction pour réinitialiser les paramètres
  const resetSettings = async () => {
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSchoolSettings(mockSchoolSettings);
      setCycles(mockCycles);
      setNotificationSettings(mockNotificationSettings);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour obtenir les cycles actifs
  const getActiveCycles = () => {
    return cycles.filter(cycle => cycle.actif);
  };

  // Fonction pour obtenir un cycle par ID
  const getCycleById = (id: string) => {
    return cycles.find(cycle => cycle.id === id);
  };

  const value: SettingsContextType = {
    schoolSettings,
    cycles,
    userProfile,
    notificationSettings,
    isLoading,
    isSaving,
    updateSchoolSettings,
    updateUserProfile,
    updateNotificationSettings,
    addCycle,
    updateCycle,
    deleteCycle,
    toggleCycle,
    uploadLogo,
    exportSettings,
    resetSettings,
    getActiveCycles,
    getCycleById
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
