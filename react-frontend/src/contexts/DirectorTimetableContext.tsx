/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { absencesApi, replacementsApi, auditApi } from '../api/timetable-service/client';
import { useAuth } from '../pages/authentification/useAuth';

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
  const { user: authUser } = useAuth();
  const validatedBy = (authUser as unknown as { sub?: string })?.sub || authUser?.username || 'unknown';

  // Valider une absence
  const validateAbsence = async (absenceId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await absencesApi.validateAbsenceAbsencesAbsenceIdValidatePost(absenceId);
      setAbsencesEnAttente(prev => prev.map(a => a.id === absenceId ? { ...a, status: 'VALIDATED' as const } : a));
    } catch (error) {
      console.error('Erreur lors de la validation de l\'absence:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh au montage pour remplacer les données mockées
  useEffect(() => {
    refreshData().catch(() => {/* no-op */});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Créer un remplacement
  const createReplacement = async (lessonId: string, newTeacherId: string) => {
    setIsLoading(true);
    try {
      const res = await replacementsApi.createReplacementReplacementsPost({
        lesson_id: lessonId,
        new_teacher_id: newTeacherId,
        validated_by: validatedBy,
      });
      const r = res.data;
      const created: Replacement = {
        id: r.id,
        lesson_id: r.lesson_id,
        old_teacher_id: r.old_teacher_id,
        new_teacher_id: r.new_teacher_id,
        validated_by: r.validated_by ?? validatedBy,
        validated_at: r.validated_at ?? undefined,
      };
      setRemplacementsEnCours(prev => [...prev, created]);
    } catch (error) {
      console.error('Erreur lors de la création du remplacement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir l'audit d'un cours
  const getLessonAudit = async (lessonId: string) => {
    setIsLoading(true);
    try {
      const res = await auditApi.getLessonAuditLessonsLessonIdAuditGet(lessonId);
      const data = res.data as unknown as LessonAudit[];
      setAuditTrail(data);
      return data;
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
      const [absRes, replRes] = await Promise.all([
        absencesApi.listAbsencesAbsencesGet(0, 100),
        replacementsApi.listReplacementsReplacementsGet(0, 100),
      ]);
      const abs = (absRes.data || [])
        .filter((a: { status?: string }) => a.status === 'REPORTED')
        .map((a: { id: string; teacher_id: string; date: string; timeslot_id: string; reason: string; status: 'REPORTED' | 'VALIDATED'; created_at: string }) => ({
          id: a.id,
          teacher_id: a.teacher_id,
          date: a.date,
          timeslot_id: a.timeslot_id,
          reason: a.reason,
          status: a.status as 'REPORTED' | 'VALIDATED',
          created_at: a.created_at,
        })) as Absence[];
      const repl = (replRes.data || []).map((r: { id: string; lesson_id: string; old_teacher_id: string; new_teacher_id: string; validated_by?: string | null; validated_at?: string | null }) => ({
        id: r.id,
        lesson_id: r.lesson_id,
        old_teacher_id: r.old_teacher_id,
        new_teacher_id: r.new_teacher_id,
        validated_by: (r.validated_by ?? validatedBy) as string,
        validated_at: r.validated_at ?? undefined,
      })) as Replacement[];

      setAbsencesEnAttente(abs);
      setRemplacementsEnCours(repl);
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
