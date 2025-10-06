import { useMutation, useQueryClient } from '@tanstack/react-query';
import resourceAxios from '../api/resource-service/http';
import { Visibility, ResourceStatus } from '../api/resource-service/api';

export interface UpdateResourceVariables {
  resourceId: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  subjectId?: number | null;
  competenceId?: number | null;
  status?: ResourceStatus;
  file?: File;
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateResourceVariables) => {
      const { resourceId, title, description, visibility, subjectId, competenceId, status, file } = variables;

      const form = new FormData();
      if (title !== undefined) form.append('title', title);
      if (description !== undefined) form.append('description', description);
      if (visibility !== undefined) form.append('visibility', visibility);

      if (subjectId !== undefined) {
        const n = Number(subjectId);
        if (Number.isFinite(n)) form.append('subject_id', String(n));
      }

      if (competenceId !== undefined) {
        const n = Number(competenceId);
        if (Number.isFinite(n)) form.append('competence_id', String(n));
      }

      if (status !== undefined) form.append('status', status);
      if (file !== undefined) form.append('file', file);

      const { data } = await resourceAxios.patch(`/resources/${resourceId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}