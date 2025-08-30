import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour les données du directeur
interface KPIData {
  totalEleves: number;
  tauxAbsenteisme: number;
  alertesActives: number;
  moyenneGenerale: number;
  // Nouvelles propriétés pour l'emploi du temps
  absencesEnAttente: number;
  remplacementsEnCours: number;
  coursModifiesCetteSemaine: number;
  conflitsEmploiTemps: number;
}

interface LevelStats {
  niveau: string;
  classes: number;
  eleves: number;
  moyenne: number;
  tauxPresence: number;
  alertes: number;
  tendance: string;
}

interface DirectorContextType {
  // État des données
  kpiData: KPIData;
  levelStats: LevelStats[];
  isRefreshing: boolean;
  lastUpdate: Date;

  // Sélection d'établissement
  currentEtablissementId: string | undefined;
  setCurrentEtablissementId: (id: string | undefined) => void;
  
  // Actions
  refreshData: () => void;
  isKPICritical: (type: string, value: number) => boolean;
}

// Données mockées pour les KPIs
const mockKPIData = {
  totalEleves: 1250,
  tauxAbsenteisme: 3.2,
  alertesActives: 8,
  moyenneGenerale: 14.2,
  // Nouvelles données pour l'emploi du temps
  absencesEnAttente: 5,
  remplacementsEnCours: 3,
  coursModifiesCetteSemaine: 12,
  conflitsEmploiTemps: 2
};

const mockLevelStats: LevelStats[] = [
  {
    niveau: '6ème',
    classes: 4,
    eleves: 120,
    moyenne: 13.8,
    tauxPresence: 96.2,
    alertes: 8,
    tendance: '+2.1%'
  },
  {
    niveau: '5ème',
    classes: 4,
    eleves: 118,
    moyenne: 14.1,
    tauxPresence: 95.8,
    alertes: 12,
    tendance: '+1.5%'
  },
  {
    niveau: '4ème',
    classes: 4,
    eleves: 115,
    moyenne: 13.9,
    tauxPresence: 94.5,
    alertes: 15,
    tendance: '-0.8%'
  },
  {
    niveau: '3ème',
    classes: 4,
    eleves: 112,
    moyenne: 14.3,
    tauxPresence: 96.8,
    alertes: 10,
    tendance: '+3.2%'
  }
];

// Création du contexte
const DirectorContext = createContext<DirectorContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useDirector = () => {
  const context = useContext(DirectorContext);
  if (context === undefined) {
    throw new Error('useDirector must be used within a DirectorProvider');
  }
  return context;
};

// Props pour le provider
interface DirectorProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const DirectorProvider: React.FC<DirectorProviderProps> = ({ children }) => {
  const [kpiData, setKpiData] = useState<KPIData>(mockKPIData);
  const [levelStats, setLevelStats] = useState<LevelStats[]>(mockLevelStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentEtablissementId, setCurrentEtablissementIdState] = useState<string | undefined>(() => {
    const stored = localStorage.getItem('current-etab-id') || '';
    if (stored) return stored;
    const fromEnv = (import.meta as any).env?.VITE_DEFAULT_ETAB_ID as string | undefined;
    if (fromEnv) {
      // Persist for axios interceptors and consumers without context
      localStorage.setItem('current-etab-id', fromEnv);
    }
    return fromEnv;
  });

  useEffect(() => {
    if (currentEtablissementId) {
      localStorage.setItem('current-etab-id', currentEtablissementId);
    } else {
      localStorage.removeItem('current-etab-id');
    }
  }, [currentEtablissementId]);

  // Actualisation automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Fonction pour actualiser les données
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulation d'une actualisation des données
    setTimeout(() => {
      setKpiData(mockKPIData);
      setLevelStats(mockLevelStats);
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Fonction pour déterminer si un KPI est critique
  const isKPICritical = (type: string, value: number): boolean => {
    switch (type) {
      case 'tauxAbsenteisme':
        return value > 5; // Critique si > 5%
      case 'alertesActives':
        return value > 10; // Critique si > 10 alertes
      case 'moyenneGenerale':
        return value < 12; // Critique si < 12/20
      default:
        return false;
    }
  };

  const setCurrentEtablissementId = (id: string | undefined) => {
    setCurrentEtablissementIdState(id);
  };

  const value: DirectorContextType = {
    kpiData,
    levelStats,
    isRefreshing,
    lastUpdate,
    currentEtablissementId,
    setCurrentEtablissementId,
    refreshData,
    isKPICritical
  };

  return (
    <DirectorContext.Provider value={value}>
      {children}
    </DirectorContext.Provider>
  );
};
