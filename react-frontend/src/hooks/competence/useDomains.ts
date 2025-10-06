import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { DomainResponse, DomainListResponse } from '../../api/competence-service/api';

export function useDomains(params: { referentialId?: string; versionNumber?: number }) {
  const { referentialId, versionNumber } = params;
  return useQuery<DomainResponse[], Error>({
    queryKey: ['competence:domains', { referentialId, versionNumber }],
    enabled: Boolean(referentialId) && (versionNumber !== undefined && versionNumber !== null),
    queryFn: async () => {
      if (!referentialId || versionNumber === undefined || versionNumber === null) throw new Error('referentialId et versionNumber requis');
      const { data } = await competenceReferentialsApi.listDomainsApiV1ReferentialsReferentialIdDomainsGet(referentialId, versionNumber);
      return (data as DomainListResponse).items;
    },
    staleTime: 60_000,
  });
}

export function useDomain(domainId?: string) {
  return useQuery<DomainResponse, Error>({
    queryKey: ['competence:domain', domainId],
    enabled: Boolean(domainId),
    queryFn: async () => {
      if (!domainId) throw new Error('domainId requis');
      const { data } = await competenceReferentialsApi.getDomainApiV1DomainsDomainIdGet(domainId);
      return data;
    },
    staleTime: 60_000,
  });
}


