import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import type { ResourceOut, Visibility, ResourceStatus } from '../api/resource-service/api';

export interface UseResourcesParams {
	authorUserId?: string | null;
	visibility?: Visibility | null;
	subjectId?: string | number | null;
	competenceId?: string | number | null;
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
			const toNumberOrUndefined = (v: string | number | null | undefined) => {
				if (v === null || v === undefined) return undefined;
				const n = typeof v === 'string' ? Number(v) : v;
				return Number.isFinite(n) ? (n as number) : undefined;
			};
			const subjectIdNum = toNumberOrUndefined(subjectId);
			const competenceIdNum = toNumberOrUndefined(competenceId);

			const { data } = await resourcesApi.listResourcesResourcesGet(
				authorUserId,
				visibility,
				subjectIdNum ?? null,
				competenceIdNum ?? null,
				status,
				limit,
				offset
			);
			return data;
		},
	});
}


