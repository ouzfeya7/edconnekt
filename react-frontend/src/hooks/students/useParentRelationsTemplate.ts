import { useMutation } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';

export function useParentRelationsTemplate() {
  return useMutation<Blob, Error, void>({
    mutationKey: ['students:parent-relations:template'],
    mutationFn: async () => {
      const { data } = await studentsApi.getParentRelationsTemplateApiStudentsParentRelationsTemplateGet({ responseType: 'blob' });
      return data as unknown as Blob;
    },
  });
}


