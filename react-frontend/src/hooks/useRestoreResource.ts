import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { ResourceStatus } from '../api/resource-service/api';

export function useRestoreResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => {
      return resourcesApi.updateResourceResourcesResourceIdPatch(
        resourceId,
        undefined, // title
        undefined, // description
        undefined, // visibility
        undefined, // subjectId
        undefined, // competenceId
        ResourceStatus.Active, // status
        undefined, // file
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
