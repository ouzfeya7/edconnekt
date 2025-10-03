import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi, competencePublicApi } from '../../api/competence-service/client';
import type { CompetencyListResponse, CompetencyResponse } from '../../api/competence-service/api';

export interface UseCompetenciesParams {
  referentialId: string;
  versionNumber: number;
  page?: number;
  size?: number;
  subjectId?: string | null;
  q?: string | null;
}

export function useCompetencies(params: UseCompetenciesParams) {
  const { referentialId, versionNumber, page = 1, size = 20, subjectId = null, q = null } = params;

  return useQuery<CompetencyListResponse, Error>({
    queryKey: ['competence:competencies', { referentialId, versionNumber, page, size, subjectId, q }],
    enabled: Boolean(referentialId) && Boolean(versionNumber || versionNumber === 0),
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listCompetenciesApiV1ReferentialsReferentialIdCompetenciesGet(
        referentialId,
        versionNumber,
        page,
        size,
        subjectId ?? undefined,
        q ?? undefined
      );
      return data;
    },
    placeholderData: (prev: CompetencyListResponse | undefined) => prev,
    staleTime: 60_000,
  });
}

export function useCompetency(competencyId?: string) {
  return useQuery<CompetencyResponse, Error>({
    queryKey: ['competence:competency', competencyId],
    enabled: Boolean(competencyId),
    queryFn: async () => {
      if (!competencyId) throw new Error('competencyId requis');
      const { data } = await competenceReferentialsApi.getCompetencyApiV1CompetenciesCompetencyIdGet(competencyId);
      return data;
    },
    staleTime: 60_000,
    retry: 0,
  });
}

export function usePublicCompetenciesForSubject(subjectId?: string) {
  return useQuery<CompetencyResponse[], Error>({
    queryKey: ['competence:public-competencies-by-subject', subjectId],
    enabled: Boolean(subjectId),
    queryFn: async () => {
      if (!subjectId) throw new Error('subjectId requis');
      const { data } = await competencePublicApi.getCompetenciesForSubjectApiV1PublicSubjectsSubjectIdCompetenciesGet(subjectId);
      return data;
    },
    staleTime: 60_000,
  });
}

export function useLookupCompetencyByCode(params: { code?: string; referentialId?: string; version?: number }) {
  const { code, referentialId, version } = params;
  return useQuery<CompetencyResponse, Error>({
    queryKey: ['competence:competency:lookup-by-code', { code, referentialId, version }],
    enabled: Boolean(code),
    queryFn: async () => {
      if (!code) throw new Error('code requis');
      const { data } = await competencePublicApi.lookupCompetencyByCodeApiV1PublicCompetenciesByCodeCodeGet(
        code,
        referentialId,
        version
      );
      return data;
    },
    staleTime: 60_000,
    retry: 0,
  });
}


