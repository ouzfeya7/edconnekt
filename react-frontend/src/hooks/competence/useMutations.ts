import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type {
  ReferentialCreate,
  ReferentialUpdate,
  ReferentialCloneRequest,
  ReferentialCloneFromGlobalRequest,
  DomainCreate,
  DomainUpdate,
  SubjectCreate,
  SubjectUpdate,
  CompetencyCreate,
  CompetencyUpdate,
} from '../../api/competence-service/api';

// Referentials
export function useCreateReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:create'],
    mutationFn: async (payload: ReferentialCreate) => {
      const { data } = await competenceReferentialsApi.createReferentialApiV1ReferentialsPost(payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
    },
  });
}

export function useUpdateReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:update'],
    mutationFn: async (params: { referentialId: string; versionNumber: number; update: ReferentialUpdate }) => {
      const { referentialId, versionNumber, update } = params;
      const { data } = await competenceReferentialsApi.updateReferentialApiV1ReferentialsReferentialIdPatch(referentialId, versionNumber, update);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
      qc.invalidateQueries({ queryKey: ['competence:referential', { referentialId: vars.referentialId }] });
    },
  });
}

export function usePublishReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:publish'],
    mutationFn: async (params: { referentialId: string; versionNumber: number }) => {
      const { referentialId, versionNumber } = params;
      const { data } = await competenceReferentialsApi.publishReferentialApiV1ReferentialsReferentialIdPublishPost(referentialId, versionNumber);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
    },
  });
}

export function useCloneReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:clone'],
    mutationFn: async (params: { referentialId: string; payload: ReferentialCloneRequest }) => {
      const { referentialId, payload } = params;
      const { data } = await competenceReferentialsApi.cloneReferentialApiV1ReferentialsReferentialIdClonePost(referentialId, payload);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
      qc.invalidateQueries({ queryKey: ['competence:referential', { referentialId: vars.referentialId }] });
    },
  });
}

export function useCloneFromGlobalReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:clone-from-global'],
    mutationFn: async (params: { globalReferentialId: string; payload: ReferentialCloneFromGlobalRequest }) => {
      const { globalReferentialId, payload } = params;
      const { data } = await competenceReferentialsApi.cloneFromGlobalReferentialApiV1GlobalReferentialsGlobalReferentialIdClonePost(
        globalReferentialId,
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
    },
  });
}

export function useDeleteReferential() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:referential:delete'],
    mutationFn: async (params: { referentialId: string; versionNumber: number }) => {
      const { referentialId, versionNumber } = params;
      const { data } = await competenceReferentialsApi.deleteReferentialApiV1ReferentialsReferentialIdDelete(referentialId, versionNumber);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:referentials'] });
    },
  });
}

// Subjects
export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:subject:create'],
    mutationFn: async (params: { referentialId: string; versionNumber: number; payload: SubjectCreate }) => {
      const { referentialId, versionNumber, payload } = params;
      const { data } = await competenceReferentialsApi.createSubjectApiV1ReferentialsReferentialIdSubjectsPost(referentialId, versionNumber, payload);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['competence:subjects', { referentialId: vars.referentialId, versionNumber: vars.versionNumber }] });
    },
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:subject:update'],
    mutationFn: async (params: { subjectId: string; update: SubjectUpdate }) => {
      const { subjectId, update } = params;
      const { data } = await competenceReferentialsApi.updateSubjectApiV1SubjectsSubjectIdPatch(subjectId, update);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:subjects'] });
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:subject:delete'],
    mutationFn: async (params: { subjectId: string }) => {
      await competenceReferentialsApi.deleteSubjectApiV1SubjectsSubjectIdDelete(params.subjectId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:subjects'] });
    },
  });
}

// Domains
export function useCreateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:domain:create'],
    mutationFn: async (params: { referentialId: string; versionNumber: number; payload: DomainCreate }) => {
      const { referentialId, versionNumber, payload } = params;
      const { data } = await competenceReferentialsApi.createDomainApiV1ReferentialsReferentialIdDomainsPost(referentialId, versionNumber, payload);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['competence:domains', { referentialId: vars.referentialId, versionNumber: vars.versionNumber }] });
    },
  });
}

export function useUpdateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:domain:update'],
    mutationFn: async (params: { domainId: string; update: DomainUpdate }) => {
      const { domainId, update } = params;
      const { data } = await competenceReferentialsApi.updateDomainApiV1DomainsDomainIdPatch(domainId, update);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:domains'] });
    },
  });
}

export function useDeleteDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:domain:delete'],
    mutationFn: async (params: { domainId: string }) => {
      await competenceReferentialsApi.deleteDomainApiV1DomainsDomainIdDelete(params.domainId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:domains'] });
    },
  });
}

// Competencies
export function useCreateCompetency() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:competency:create'],
    mutationFn: async (params: { referentialId: string; versionNumber: number; payload: CompetencyCreate }) => {
      const { referentialId, versionNumber, payload } = params;
      const { data } = await competenceReferentialsApi.createCompetencyApiV1ReferentialsReferentialIdCompetenciesPost(referentialId, versionNumber, payload);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['competence:competencies', { referentialId: vars.referentialId, versionNumber: vars.versionNumber }] });
    },
  });
}

export function useUpdateCompetency() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:competency:update'],
    mutationFn: async (params: { competencyId: string; update: CompetencyUpdate }) => {
      const { competencyId, update } = params;
      const { data } = await competenceReferentialsApi.updateCompetencyApiV1CompetenciesCompetencyIdPatch(competencyId, update);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:competencies'] });
    },
  });
}

export function useDeleteCompetency() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:competency:delete'],
    mutationFn: async (params: { competencyId: string }) => {
      await competenceReferentialsApi.deleteCompetencyApiV1CompetenciesCompetencyIdDelete(params.competencyId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:competencies'] });
    },
  });
}


