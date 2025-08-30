import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { absencesApi } from '../api/timetable-service/client';
import type { AbsenceCreate, AbsenceRead } from '../api/timetable-service/api';

export function useAbsencesList(params?: { teacherId?: string | null; fromDate?: string | null; toDate?: string | null }) {
  // Pas d'endpoint list dans l'API fournie, à ajouter quand dispo
  return useQuery<AbsenceRead[], Error>({
    queryKey: ['absences', params],
    queryFn: async () => {
      // Placeholder: retourner un tableau vide tant que l'API list n'existe pas
      return [];
    },
    staleTime: 30_000,
  });
}

export function useCreateAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['absence:create'],
    mutationFn: async (payload: AbsenceCreate) => {
      const res = await absencesApi.createAbsenceAbsencesPost(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useValidateAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['absence:validate'],
    mutationFn: async (absenceId: string) => {
      const res = await absencesApi.validateAbsenceAbsencesAbsenceIdValidatePost(absenceId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['timetable:audit'] });
    },
  });
}

export function useDeleteAbsence() {
  const queryClient = useQueryClient();
  return useMutation<AbsenceRead, Error, string>({
    mutationKey: ['absence:delete'],
    mutationFn: async (absenceId: string) => {
      const res = await absencesApi.deleteAbsenceAbsencesAbsenceIdDelete(absenceId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['timetable:audit'] });
    },
  });
}


