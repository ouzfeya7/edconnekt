import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { StandardResponseListClasseOut } from '../api/classe-service/api';

export interface UseClassesParams {
  etablissementId: string;
  skip?: number;
  limit?: number;
  nom?: string;
  niveau?: string;
  isArchived?: boolean;
}

export function useClasses(params: UseClassesParams) {
  const {
    etablissementId,
    skip = 0,
    limit = 100,
    nom = undefined,
    niveau = undefined,
    isArchived = undefined,
  } = params;

  return useQuery<StandardResponseListClasseOut, Error>({
    queryKey: ['classes', { etablissementId, skip, limit, nom, niveau, isArchived }],
    queryFn: async () => {
      const { data } = await classesApi.getClassesApiV1ClassesGet(
        etablissementId,
        skip,
        limit,
        nom,
        niveau,
        isArchived
      );
      return data;
    },
    enabled: Boolean(etablissementId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}


