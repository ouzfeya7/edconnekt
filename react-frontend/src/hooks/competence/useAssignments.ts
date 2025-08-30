import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { AssignmentResponse, AssignmentCreate } from '../../api/competence-service/api';

export function useAssignments(params: { referentialId?: string; versionNumber?: number }) {
  const { referentialId, versionNumber } = params;
  return useQuery<AssignmentResponse[], Error>({
    queryKey: ['competence:assignments', { referentialId, versionNumber }],
    enabled: Boolean(referentialId) && (versionNumber !== undefined && versionNumber !== null),
    queryFn: async () => {
      if (!referentialId || versionNumber === undefined || versionNumber === null) throw new Error('referentialId et versionNumber requis');
      const { data } = await competenceReferentialsApi.listAssignmentsApiCompetenceAssignmentsGet(referentialId, versionNumber);
      return data;
    },
    staleTime: 60_000,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation<AssignmentResponse[], Error, AssignmentCreate>({
    mutationKey: ['competence:assignment:create'],
    mutationFn: async (payload: AssignmentCreate) => {
      const { data } = await competenceReferentialsApi.createAssignmentApiCompetenceAssignmentsPost(payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:assignments'] });
    },
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation<void, Error, { assignmentId: string }>({
    mutationKey: ['competence:assignment:delete'],
    mutationFn: async ({ assignmentId }) => {
      await competenceReferentialsApi.deleteAssignmentApiCompetenceAssignmentsAssignmentIdDelete(assignmentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:assignments'] });
    },
  });
}


