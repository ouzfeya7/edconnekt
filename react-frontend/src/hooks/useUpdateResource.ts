import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { Visibility, ResourceStatus } from '../api/resource-service/api';

export interface UpdateResourceVariables {
  resourceId: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  subjectId?: string | null; // UUID
  competenceId?: string | null; // UUID
  status?: ResourceStatus;
  file?: File;
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateResourceVariables) => {
      const { resourceId, title, description, visibility, subjectId, competenceId, status, file } = variables;
      // Ne jamais envoyer "null" dans le FormData: convertir null -> undefined
      const toUndef = <T,>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);
      const { data } = await resourcesApi.updateResourceResourcesResourceIdPatch(
        resourceId,
        toUndef(title),
        toUndef(description),
        toUndef(visibility),
        toUndef(subjectId),
        toUndef(competenceId),
        toUndef(status),
        toUndef(file),
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}