import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { Visibility, ResourceStatus } from '../api/resource-service/api';

export interface UpdateResourceVariables {
  resourceId: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  subjectId?: number;
  competenceId?: number;
  status?: ResourceStatus;
  file?: File;
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateResourceVariables) => {
      const { resourceId, title, description, visibility, subjectId, competenceId, status, file } = variables;
      return resourcesApi.updateResourceResourcesResourceIdPatch(
        resourceId,
        title,
        description,
        visibility,
        subjectId,
        competenceId,
        status,
        file
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific resource query as well as the list
      queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
