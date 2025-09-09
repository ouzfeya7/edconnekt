import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '../api/admission-service/client';
import type { AdmissionListResponse, AdmissionResponse, AdmissionStatus } from '../api/admission-service/api';

export interface UseAdmissionsParams {
  page?: number;
  limit?: number;
  status?: AdmissionStatus | null;
  classRequested?: string | null;
  studentName?: string | null;
  parentName?: string | null;
}

export function useAdmissions(params: UseAdmissionsParams = {}) {
  const {
    page = 1,
    limit = 10,
    status = undefined,
    classRequested = undefined,
    studentName = undefined,
    parentName = undefined,
  } = params;

  return useQuery<AdmissionListResponse, Error>({
    queryKey: ['admission-service', 'admissions', { page, limit, status, classRequested, studentName, parentName }],
    queryFn: async () => {
      const { data } = await admissionsApi.getAdmissionsApiV1AdmissionsGet(
        page,
        limit,
        status,
        classRequested,
        studentName,
        parentName,
      );
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAdmission(admissionId?: number) {
  return useQuery<AdmissionResponse, Error>({
    queryKey: ['admission-service', 'admissions', admissionId],
    queryFn: async () => {
      if (typeof admissionId !== 'number') throw new Error('admissionId requis');
      const { data } = await admissionsApi.getAdmissionApiV1AdmissionsAdmissionIdGet(admissionId);
      return data;
    },
    enabled: typeof admissionId === 'number',
    retry: false,
    refetchOnWindowFocus: false,
  });
}


