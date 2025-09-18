import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { absencesApi } from '../api/timetable-service/client';
import type { AbsenceCreate, AbsenceRead } from '../api/timetable-service/api';

export function useAbsencesList(params?: { skip?: number; limit?: number }) {
  const { skip = 0, limit = 100 } = params || {};
  return useQuery<AbsenceRead[], Error>({
    queryKey: ['absences', { skip, limit }],
    queryFn: async () => {
      const res = await absencesApi.listAbsencesAbsencesGet(skip, limit);
      return res.data;
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


