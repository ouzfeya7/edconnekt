import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour les alertes
interface Alert {
  id: number;
  type: 'absence' | 'comportement' | 'academique' | 'sante' | 'securite';
  niveau: 'info' | 'warning' | 'critical';
  titre: string;
  description: string;
  eleve?: string;
  classe?: string;
  enseignant?: string;
  dateCreation: string;
  dateResolution?: string;
  statut: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  assignee?: string;
  actions: AlertAction[];
}

interface AlertAction {
  id: number;
  type: 'appel_parent' | 'convocation' | 'sanction' | 'remise_niveau' | 'autre';
  description: string;
  dateAction: string;
  responsable: string;
  statut: 'planifiee' | 'en_cours' | 'terminee';
}

interface AlertFilters {
  type: string[];
  niveau: string[];
  statut: string[];
  priorite: string[];
  classe: string[];
  dateDebut?: string;
  dateFin?: string;
}

interface AlertContextType {
  // État des données
  alertes: Alert[];
  alertesFiltrees: Alert[];
  filters: AlertFilters;
  isLoading: boolean;
  selectedAlert: Alert | null;
  
  // Actions
  setFilters: (filters: AlertFilters) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  updateAlert: (id: number, updates: Partial<Alert>) => void;
  deleteAlert: (id: number) => void;
  resolveAlert: (id: number, resolution: string) => void;
  assignAlert: (id: number, assignee: string) => void;
  addAction: (alertId: number, action: Omit<AlertAction, 'id'>) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  getAlertStats: () => {
    total: number;
    nouvelles: number;
    enCours: number;
    resolues: number;
    parNiveau: {
      critique: number;
      important: number;
      normal: number;
    };
    parType: {
      securite: number;
      academique: number;
      administrative: number;
      technique: number;
    };
    trend: number;
    trendNouvelles: number;
    trendEnCours: number;
    trendResolues: number;
    tempsReponseMoyen: number;
    tauxResolution: number;
    alertesParJour: number;
  };
}

// Données mockées pour les alertes
const mockAlertes: Alert[] = [
  {
    id: 1,
    type: 'absence',
    niveau: 'warning',
    titre: 'Absence répétée',
    description: 'L\'élève Martin Dupont a été absent 3 fois cette semaine',
    eleve: 'Martin Dupont',
    classe: '4ème A',
    enseignant: 'Marie Dubois',
    dateCreation: '2024-01-15T08:30:00',
    statut: 'ouverte',
    priorite: 'moyenne',
    assignee: 'Conseiller Principal',
    actions: [
      {
        id: 1,
        type: 'appel_parent',
        description: 'Appel aux parents prévu',
        dateAction: '2024-01-16T10:00:00',
        responsable: 'Conseiller Principal',
        statut: 'planifiee'
      }
    ]
  },
  {
    id: 2,
    type: 'comportement',
    niveau: 'critical',
    titre: 'Incident en classe',
    description: 'Bagarre entre deux élèves en cours de récréation',
    eleve: 'Thomas Leroy',
    classe: '5ème B',
    enseignant: 'Jean Martin',
    dateCreation: '2024-01-15T10:15:00',
    statut: 'en_cours',
    priorite: 'urgente',
    assignee: 'Directeur',
    actions: [
      {
        id: 2,
        type: 'convocation',
        description: 'Convocation des parents',
        dateAction: '2024-01-15T14:00:00',
        responsable: 'Directeur',
        statut: 'en_cours'
      },
      {
        id: 3,
        type: 'sanction',
        description: 'Retenue de 2h',
        dateAction: '2024-01-16T13:00:00',
        responsable: 'Directeur',
        statut: 'planifiee'
      }
    ]
  },
  {
    id: 3,
    type: 'academique',
    niveau: 'info',
    titre: 'Baisse des notes',
    description: 'Dégradation des résultats en mathématiques',
    eleve: 'Sophie Bernard',
    classe: '3ème C',
    enseignant: 'Pierre Durand',
    dateCreation: '2024-01-14T16:45:00',
    statut: 'ouverte',
    priorite: 'basse',
    assignee: 'Prof Principal',
    actions: [
      {
        id: 4,
        type: 'remise_niveau',
        description: 'Soutien scolaire proposé',
        dateAction: '2024-01-17T15:00:00',
        responsable: 'Prof Principal',
        statut: 'planifiee'
      }
    ]
  }
];

// Création du contexte
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Props pour le provider
interface AlertProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertes, setAlertes] = useState<Alert[]>(mockAlertes);
  const [alertesFiltrees, setAlertesFiltrees] = useState<Alert[]>(mockAlertes);
  const [filters, setFilters] = useState<AlertFilters>({
    type: [],
    niveau: [],
    statut: [],
    priorite: [],
    classe: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    let filtered = [...alertes];

    if (filters.type.length > 0) {
      filtered = filtered.filter(alert => filters.type.includes(alert.type));
    }

    if (filters.niveau.length > 0) {
      filtered = filtered.filter(alert => filters.niveau.includes(alert.niveau));
    }

    if (filters.statut.length > 0) {
      filtered = filtered.filter(alert => filters.statut.includes(alert.statut));
    }

    if (filters.priorite.length > 0) {
      filtered = filtered.filter(alert => filters.priorite.includes(alert.priorite));
    }

    if (filters.classe.length > 0) {
      filtered = filtered.filter(alert => alert.classe && filters.classe.includes(alert.classe));
    }

    if (filters.dateDebut) {
      filtered = filtered.filter(alert => alert.dateCreation >= filters.dateDebut!);
    }

    if (filters.dateFin) {
      filtered = filtered.filter(alert => alert.dateCreation <= filters.dateFin!);
    }

    setAlertesFiltrees(filtered);
  }, [alertes, filters]);

  // Fonction pour ajouter une alerte
  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.max(...alertes.map(a => a.id)) + 1
    };
    setAlertes(prev => [...prev, newAlert]);
  };

  // Fonction pour mettre à jour une alerte
  const updateAlert = (id: number, updates: Partial<Alert>) => {
    setAlertes(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  // Fonction pour supprimer une alerte
  const deleteAlert = (id: number) => {
    setAlertes(prev => prev.filter(alert => alert.id !== id));
  };

  // Fonction pour résoudre une alerte
  const resolveAlert = (id: number, resolution: string) => {
    updateAlert(id, {
      statut: 'resolue',
      dateResolution: new Date().toISOString()
    });
  };

  // Fonction pour assigner une alerte
  const assignAlert = (id: number, assignee: string) => {
    updateAlert(id, { assignee });
  };

  // Fonction pour ajouter une action
  const addAction = (alertId: number, action: Omit<AlertAction, 'id'>) => {
    const newAction: AlertAction = {
      ...action,
      id: Math.max(...alertes.flatMap(a => a.actions).map(act => act.id)) + 1
    };

    setAlertes(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, actions: [...alert.actions, newAction] }
        : alert
    ));
  };

  // Fonction pour obtenir les statistiques
  const getAlertStats = () => {
    const stats = {
      total: alertes.length,
      nouvelles: alertes.filter(a => a.statut === 'ouverte').length,
      enCours: alertes.filter(a => a.statut === 'en_cours').length,
      resolues: alertes.filter(a => a.statut === 'resolue').length,
      parNiveau: {
        critique: alertes.filter(a => a.niveau === 'critical').length,
        important: alertes.filter(a => a.niveau === 'warning').length,
        normal: alertes.filter(a => a.niveau === 'info').length
      },
      parType: {
        securite: alertes.filter(a => a.type === 'securite').length,
        academique: alertes.filter(a => a.type === 'academique').length,
        administrative: alertes.filter(a => a.type === 'absence').length,
        technique: alertes.filter(a => a.type === 'comportement').length
      },
      trend: 0,
      trendNouvelles: 0,
      trendEnCours: 0,
      trendResolues: 0,
      tempsReponseMoyen: 2.5,
      tauxResolution: 85,
      alertesParJour: 3.2
    };

    return stats;
  };

  const value: AlertContextType = {
    alertes,
    alertesFiltrees,
    filters,
    isLoading,
    selectedAlert,
    setFilters,
    addAlert,
    updateAlert,
    deleteAlert,
    resolveAlert,
    assignAlert,
    addAction,
    setSelectedAlert,
    getAlertStats
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
