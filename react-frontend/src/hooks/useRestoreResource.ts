import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
export function useRestoreResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) =>
      resourcesApi.restoreResourceResourcesResourceIdRestorePatch(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
