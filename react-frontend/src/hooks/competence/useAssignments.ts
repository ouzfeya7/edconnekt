import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { AssignmentResponse, AssignmentCreate, AssignmentListResponse } from '../../api/competence-service/api';

export function useAssignments(params: { referentialId?: string; versionNumber?: number }) {
  const { referentialId, versionNumber } = params;
  return useQuery<AssignmentResponse[], Error>({
    queryKey: ['competence:assignments', { referentialId, versionNumber }],
    enabled: Boolean(referentialId) && (versionNumber !== undefined && versionNumber !== null),
    queryFn: async () => {
      if (!referentialId || versionNumber === undefined || versionNumber === null) throw new Error('referentialId et versionNumber requis');
      const { data } = await competenceReferentialsApi.listAssignmentsApiV1ReferentialsReferentialIdAssignmentsGet(referentialId, versionNumber);
      const list = data as unknown as AssignmentListResponse | AssignmentResponse[];
      if (Array.isArray(list)) return list as AssignmentResponse[];
      if (list && Array.isArray((list as AssignmentListResponse).items)) {
        return (list as AssignmentListResponse).items as AssignmentResponse[];
      }
      return [] as AssignmentResponse[];
    },
    staleTime: 60_000,
  });
}

export function useAssignment(assignmentId?: string) {
  return useQuery<AssignmentResponse, Error>({
    queryKey: ['competence:assignment', assignmentId],
    enabled: Boolean(assignmentId),
    queryFn: async () => {
      if (!assignmentId) throw new Error('assignmentId requis');
      const { data } = await competenceReferentialsApi.getAssignmentApiV1AssignmentsAssignmentIdGet(assignmentId);
      return data;
    },
    staleTime: 60_000,
    retry: 0,
  });
}

export function useCreateAssignment(params: { referentialId: string; versionNumber: number }) {
  const { referentialId, versionNumber } = params;
  const qc = useQueryClient();
  return useMutation<AssignmentResponse, Error, AssignmentCreate>({
    mutationKey: ['competence:assignment:create', { referentialId, versionNumber }],
    mutationFn: async (payload: AssignmentCreate) => {
      const { data } = await competenceReferentialsApi.createAssignmentApiV1ReferentialsReferentialIdAssignmentsPost(referentialId, versionNumber, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:assignments', { referentialId, versionNumber }] });
    },
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation<void, Error, { assignmentId: string }>({
    mutationKey: ['competence:assignment:delete'],
    mutationFn: async ({ assignmentId }) => {
      await competenceReferentialsApi.deleteAssignmentApiV1AssignmentsAssignmentIdDelete(assignmentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:assignments'] });
    },
  });
}


