import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '../api/admission-service/client';

export interface AdmissionStatsSummary {
  total?: number;
  by_status?: Record<string, number>;
  [key: string]: unknown;
}

export function useAdmissionStats() {
  return useQuery<AdmissionStatsSummary, Error>({
    queryKey: ['admission-service', 'stats', 'summary'],
    queryFn: async () => {
      const { data } = await admissionsApi.getAdmissionStatsApiV1AdmissionsStatsSummaryGet();
      return data as unknown as AdmissionStatsSummary;
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}


