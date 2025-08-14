import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import type { ResourceOut, Visibility, ResourceStatus } from '../api/resource-service/api';

export interface UseResourcesParams {
	authorUserId?: string | null;
	visibility?: Visibility | null;
	subjectId?: number | null;
	competenceId?: number | null;
	status?: ResourceStatus | null;
	limit?: number;
	offset?: number;
}

export function useResources(params: UseResourcesParams = {}) {
	const {
		authorUserId = undefined,
		visibility = undefined,
		subjectId = undefined,
		competenceId = undefined,
		status = undefined,
		limit = 10,
		offset = 0,
	} = params;

	return useQuery({
		queryKey: ['resources', { limit, offset, visibility, subjectId, competenceId, status, authorUserId }],
		queryFn: async (): Promise<ResourceOut[]> => {
			const { data } = await resourcesApi.listResourcesResourcesGet(
				authorUserId,
				visibility,
				subjectId,
				competenceId,
				status,
				limit,
				offset
			);
			return data;
		},
	});
}


