import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';

export function useResourceDetail(resourceId: string) {
  return useQuery({
    queryKey: ['resources', resourceId],
    queryFn: async () => {
      const { data } = await resourcesApi.getResourceResourcesResourceIdGet(resourceId);
      return data;
    },
    enabled: !!resourceId, // The query will not execute until the resourceId exists
  });
}
