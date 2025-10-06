import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { Visibility } from '../api/resource-service/api';

interface CreateResourceVariables {
  title: string;
  visibility: Visibility;
  subjectId: number;
  competenceId: number;
  file: File;
  description?: string | null;
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateResourceVariables) => {
      const { title, visibility, subjectId, competenceId, file, description } = variables;

      const sId = Number(subjectId);
      const cId = Number(competenceId);
      if (!Number.isFinite(sId) || !Number.isFinite(cId)) {
        return Promise.reject(new Error('IDs de matière/compétence invalides'));
      }

      return resourcesApi.createResourceResourcesPost(
        title,
        visibility,
        sId,
        cId,
        file,
        description ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
