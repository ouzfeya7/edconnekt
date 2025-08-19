import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';

export function useResourceAudit(resourceId: string) {
  return useQuery({
    queryKey: ['resourceAudit', resourceId],
    queryFn: async () => {
      const { data } = await resourcesApi.getResourceAuditLogResourcesResourceIdAuditGet(resourceId, 20, 0);
      return data;
    },
    enabled: !!resourceId,
    retry: false,
  });
}
