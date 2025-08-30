import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi, competencePublicApi } from '../../api/competence-service/client';
import type { SubjectListResponse, SubjectResponse } from '../../api/competence-service/api';

export interface UseSubjectsParams {
  referentialId: string;
  versionNumber: number;
  page?: number;
  size?: number;
  domainId?: string | null;
  q?: string | null;
}

export function useSubjects(params: UseSubjectsParams) {
  const { referentialId, versionNumber, page = 1, size = 20, domainId = null, q = null } = params;

  return useQuery<SubjectListResponse, Error>({
    queryKey: ['competence:subjects', { referentialId, versionNumber, page, size, domainId, q }],
    enabled: Boolean(referentialId) && Boolean(versionNumber || versionNumber === 0),
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listSubjectsApiCompetenceReferentialsReferentialIdSubjectsGet(
        referentialId,
        versionNumber,
        page,
        size,
        domainId,
        q
      );
      return data;
    },
    placeholderData: (prev: SubjectListResponse | undefined) => prev,
    staleTime: 60_000,
  });
}

export function usePublicSubjectsByScope(params: { cycle: string; level: string }) {
  const { cycle, level } = params;
  return useQuery<SubjectResponse[], Error>({
    queryKey: ['competence:public-subjects', { cycle, level }],
    enabled: Boolean(cycle) && Boolean(level),
    queryFn: async () => {
      const { data } = await competencePublicApi.listSubjectsByScopeApiCompetencePublicSubjectsGet(cycle as unknown as 'PRESCOLAIRE' | 'PRIMAIRE' | 'COLLEGE' | 'LYCEE' | 'UNIVERSITE', level);
      return data;
    },
    staleTime: 60_000,
  });
}


