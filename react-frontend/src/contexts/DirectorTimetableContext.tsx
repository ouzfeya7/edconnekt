/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour l'emploi du temps du directeur
interface Absence {
  id: string;
  teacher_id: string;
  date: string;
  timeslot_id: string;
  reason: string;
  status: 'REPORTED' | 'VALIDATED';
  created_at: string;
}

interface Replacement {
  id: string;
  lesson_id: string;
  old_teacher_id: string;
  new_teacher_id: string;
  validated_by: string;
  validated_at?: string;
}

interface LessonAudit {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  diff: { [key: string]: unknown };
  created_at: string;
}

interface DirectorTimetableContextType {
  // État des données
  absencesEnAttente: Absence[];
  remplacementsEnCours: Replacement[];
  auditTrail: LessonAudit[];
  isLoading: boolean;
  
  // Actions
  validateAbsence: (absenceId: string) => Promise<void>;
  createReplacement: (lessonId: string, newTeacherId: string) => Promise<void>;
  getLessonAudit: (lessonId: string) => Promise<LessonAudit[]>;
  refreshData: () => Promise<void>;
}

// Données mockées
const mockAbsencesEnAttente: Absence[] = [
  {
    id: '1',
    teacher_id: 'teacher_1',
    date: '2024-01-20',
    timeslot_id: 'timeslot_1',
    reason: 'Maladie',
    status: 'REPORTED',
    created_at: '2024-01-19T10:00:00'
  },
  {
    id: '2',
    teacher_id: 'teacher_2',
    date: '2024-01-21',
    timeslot_id: 'timeslot_2',
    reason: 'Formation',
    status: 'REPORTED',
    created_at: '2024-01-19T14:30:00'
  }
];

const mockRemplacementsEnCours: Replacement[] = [
  {
    id: '1',
    lesson_id: 'lesson_1',
    old_teacher_id: 'teacher_1',
    new_teacher_id: 'teacher_3',
    validated_by: 'director_1',
    validated_at: '2024-01-19T11:00:00'
  }
];

// Création du contexte
const DirectorTimetableContext = createContext<DirectorTimetableContextType | undefined>(undefined);

// Hook personnalisé
export const useDirectorTimetable = () => {
  const context = useContext(DirectorTimetableContext);
  if (context === undefined) {
    throw new Error('useDirectorTimetable must be used within a DirectorTimetableProvider');
  }
  return context;
};

// Props pour le provider
interface DirectorTimetableProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const DirectorTimetableProvider: React.FC<DirectorTimetableProviderProps> = ({ children }) => {
  const [absencesEnAttente, setAbsencesEnAttente] = useState<Absence[]>(mockAbsencesEnAttente);
  const [remplacementsEnCours, setRemplacementsEnCours] = useState<Replacement[]>(mockRemplacementsEnCours);
  const [auditTrail, setAuditTrail] = useState<LessonAudit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Valider une absence
  const validateAbsence = async (absenceId: string) => {
    setIsLoading(true);
    try {
      // TODO: Appel API validateAbsenceAbsencesAbsenceIdValidatePost
      console.log(`Validation de l'absence ${absenceId}`);
      
      // Mise à jour locale
      setAbsencesEnAttente(prev => 
        prev.map(absence => 
          absence.id === absenceId 
            ? { ...absence, status: 'VALIDATED' as const }
            : absence
        )
      );
    } catch (error) {
      console.error('Erreur lors de la validation de l\'absence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un remplacement
  const createReplacement = async (lessonId: string, newTeacherId: string) => {
    setIsLoading(true);
    try {
      // TODO: Appel API createReplacementReplacementsPost
      console.log(`Création d'un remplacement pour le cours ${lessonId} avec l'enseignant ${newTeacherId}`);
      
      const newReplacement: Replacement = {
        id: `replacement_${Date.now()}`,
        lesson_id: lessonId,
        old_teacher_id: 'teacher_1', // À récupérer depuis l'API
        new_teacher_id: newTeacherId,
        validated_by: 'director_1',
        validated_at: new Date().toISOString()
      };
      
      setRemplacementsEnCours(prev => [...prev, newReplacement]);
    } catch (error) {
      console.error('Erreur lors de la création du remplacement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir l'audit d'un cours
  const getLessonAudit = async (lessonId: string) => {
    setIsLoading(true);
    try {
      // TODO: Appel API getLessonAuditLessonsLessonIdAuditGet
      console.log(`Récupération de l'audit pour le cours ${lessonId}`);
      
      // Mock data
      const mockAudit: LessonAudit[] = [
        {
          id: '1',
          entity_type: 'lesson',
          entity_id: lessonId,
          action: 'UPDATE',
          actor_id: 'teacher_1',
          actor_role: 'ENSEIGNANT',
          diff: { room_id: { old: 'room_1', new: 'room_2' } },
          created_at: '2024-01-19T15:30:00'
        }
      ];
      
      setAuditTrail(mockAudit);
      return mockAudit;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'audit:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiser les données
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // TODO: Appels API pour récupérer les données fraîches
      console.log('Actualisation des données d\'emploi du temps');
      
      // Pour l'instant, on garde les données mockées
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: DirectorTimetableContextType = {
    absencesEnAttente,
    remplacementsEnCours,
    auditTrail,
    isLoading,
    validateAbsence,
    createReplacement,
    getLessonAudit,
    refreshData
  };

  return (
    <DirectorTimetableContext.Provider value={value}>
      {children}
    </DirectorTimetableContext.Provider>
  );
};
