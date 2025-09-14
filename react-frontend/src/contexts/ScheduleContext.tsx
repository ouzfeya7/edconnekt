import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour l'emploi du temps
interface Course {
  id: number;
  matiere: string;
  enseignant: string;
  classe: string;
  salle: string;
  jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi';
  heureDebut: string; // Format "HH:MM"
  heure: string; // Format "HH:MM" (alias pour compatibilité)
  duree: number; // Durée en heures
  type: 'cours' | 'td' | 'tp' | 'evaluation' | 'reunion';
  cycle: '6eme' | '5eme' | '4eme' | '3eme';
  couleur?: string;
}

interface Conflict {
  id: string;
  type: 'enseignant' | 'salle' | 'classe';
  message: string;
  description?: string;
  jour?: string;
  heureDebut?: string;
  classe?: string;
  existingCourse: Course;
  newCourse: Course;
  severity: 'warning' | 'error';
}

interface ScheduleFilters {
  classe: string[];
  enseignant: string[];
  matiere: string[];
  jour: string[];
  cycle: string[];
}

interface ScheduleContextType {
  // État des données
  courses: Course[];
  conflicts: Conflict[];
  filters: ScheduleFilters;
  showConflicts: boolean;
  selectedCourse: Course | null;
  
  // Actions
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: number, updates: Partial<Course>) => void;
  deleteCourse: (id: number) => void;
  setFilters: (filters: ScheduleFilters) => void;
  setShowConflicts: (show: boolean) => void;
  setSelectedCourse: (course: Course | null) => void;
  detectConflicts: (newCourse: Omit<Course, 'id'>) => Conflict[];
  resolveConflict: (conflictId: string) => void;
  getCoursesByDay: (day: string) => Course[];
  getCoursesByClasse: (classe: string) => Course[];
  getCoursesByEnseignant: (enseignant: string) => Course[];
  exportSchedule: (format: 'pdf' | 'excel') => void;
  getScheduleStats: () => {
    totalCourses: number;
    parJour: Record<string, number>;
    parClasse: Record<string, number>;
    parEnseignant: Record<string, number>;
    heuresParJour: Record<string, number>;
  };
}

// Données mockées pour les cours
const mockCourses: Course[] = [
  {
    id: 1,
    matiere: 'Mathématiques',
    enseignant: 'Marie Dubois',
    classe: '6ème A',
    salle: 'Salle 101',
    jour: 'lundi',
    heureDebut: '08:00',
    heure: '08:00',
    duree: 1,
    type: 'cours',
    cycle: '6eme',
    couleur: '#3B82F6'
  },
  {
    id: 2,
    matiere: 'Français',
    enseignant: 'Jean Martin',
    classe: '6ème A',
    salle: 'Salle 102',
    jour: 'lundi',
    heureDebut: '09:00',
    heure: '09:00',
    duree: 1,
    type: 'cours',
    cycle: '6eme',
    couleur: '#10B981'
  },
  {
    id: 3,
    matiere: 'Histoire-Géo',
    enseignant: 'Pierre Durand',
    classe: '5ème B',
    salle: 'Salle 201',
    jour: 'mardi',
    heureDebut: '10:00',
    heure: '10:00',
    duree: 1,
    type: 'cours',
    cycle: '5eme',
    couleur: '#F59E0B'
  },
  {
    id: 4,
    matiere: 'SVT',
    enseignant: 'Sophie Bernard',
    classe: '4ème A',
    salle: 'Labo SVT',
    jour: 'mercredi',
    heureDebut: '14:00',
    heure: '14:00',
    duree: 2,
    type: 'tp',
    cycle: '4eme',
    couleur: '#EF4444'
  }
];

// Création du contexte
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

// Props pour le provider
interface ScheduleProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [filters, setFilters] = useState<ScheduleFilters>({
    classe: [],
    enseignant: [],
    matiere: [],
    jour: [],
    cycle: []
  });
  const [showConflicts, setShowConflicts] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Fonction pour détecter les conflits
  const detectConflicts = (newCourse: Omit<Course, 'id'>): Conflict[] => {
    const detectedConflicts: Conflict[] = [];
    
    courses.forEach(existingCourse => {
      if (existingCourse.jour === newCourse.jour) {
        const existingStart = parseInt(existingCourse.heure.split(':')[0]);
        const existingEnd = existingStart + existingCourse.duree;
        const newStart = parseInt(newCourse.heure.split(':')[0]);
        const newEnd = newStart + newCourse.duree;
        
        if ((newStart < existingEnd && newEnd > existingStart)) {
          // Conflit d'enseignant
          if (existingCourse.enseignant === newCourse.enseignant) {
            detectedConflicts.push({
              id: `teacher-${existingCourse.id}-${Date.now()}`,
              type: 'enseignant',
              message: `Conflit enseignant : ${existingCourse.enseignant} a déjà un cours`,
              existingCourse,
              newCourse: newCourse as Course,
              severity: 'error'
            });
          }
          
          // Conflit de salle
          if (existingCourse.salle === newCourse.salle) {
            detectedConflicts.push({
              id: `room-${existingCourse.id}-${Date.now()}`,
              type: 'salle',
              message: `Conflit salle : ${existingCourse.salle} est déjà occupée`,
              existingCourse,
              newCourse: newCourse as Course,
              severity: 'error'
            });
          }
          
          // Conflit de classe
          if (existingCourse.classe === newCourse.classe) {
            detectedConflicts.push({
              id: `class-${existingCourse.id}-${Date.now()}`,
              type: 'classe',
              message: `Conflit classe : ${existingCourse.classe} a déjà un cours`,
              existingCourse,
              newCourse: newCourse as Course,
              severity: 'error'
            });
          }
        }
      }
    });
    
    return detectedConflicts;
  };

  // Fonction pour ajouter un cours
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newConflicts = detectConflicts(course);
    
    if (newConflicts.length > 0) {
      setConflicts(prev => [...prev, ...newConflicts]);
      setShowConflicts(true);
      return false; // Indique qu'il y a des conflits
    }
    
    const newCourse: Course = {
      ...course,
      id: Math.max(...courses.map(c => c.id)) + 1
    };
    
    setCourses(prev => [...prev, newCourse]);
    return true; // Indique que l'ajout a réussi
  };

  // Fonction pour mettre à jour un cours
  const updateCourse = (id: number, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };

  // Fonction pour supprimer un cours
  const deleteCourse = (id: number) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  // Fonction pour résoudre un conflit
  const resolveConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(conflict => conflict.id !== conflictId));
  };

  // Fonction pour obtenir les cours par jour
  const getCoursesByDay = (day: string) => {
    return courses.filter(course => course.jour === day);
  };

  // Fonction pour obtenir les cours par classe
  const getCoursesByClasse = (classe: string) => {
    return courses.filter(course => course.classe === classe);
  };

  // Fonction pour obtenir les cours par enseignant
  const getCoursesByEnseignant = (enseignant: string) => {
    return courses.filter(course => course.enseignant === enseignant);
  };

  // Fonction pour exporter l'emploi du temps
  const exportSchedule = (format: 'pdf' | 'excel') => {
    console.log(`Exporting schedule in ${format} format`);
    // Ici on pourrait implémenter l'export réel
  };

  // Fonction pour obtenir les statistiques
  const getScheduleStats = () => {
    const stats = {
      totalCourses: courses.length,
      parJour: {} as Record<string, number>,
      parClasse: {} as Record<string, number>,
      parEnseignant: {} as Record<string, number>,
      heuresParJour: {} as Record<string, number>
    };

    courses.forEach(course => {
      stats.parJour[course.jour] = (stats.parJour[course.jour] || 0) + 1;
      stats.parClasse[course.classe] = (stats.parClasse[course.classe] || 0) + 1;
      stats.parEnseignant[course.enseignant] = (stats.parEnseignant[course.enseignant] || 0) + 1;
      stats.heuresParJour[course.jour] = (stats.heuresParJour[course.jour] || 0) + course.duree;
    });

    return stats;
  };

  const value: ScheduleContextType = {
    courses,
    conflicts,
    filters,
    showConflicts,
    selectedCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    setFilters,
    setShowConflicts,
    setSelectedCourse,
    detectConflicts,
    resolveConflict,
    getCoursesByDay,
    getCoursesByClasse,
    getCoursesByEnseignant,
    exportSchedule,
    getScheduleStats
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
