import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { Visibility } from '../api/resource-service/api';

interface CreateResourceVariables {
  title: string;
  visibility: Visibility;
  subjectId: string; // UUID
  competenceId: string; // UUID
  file: File;
  description?: string | null;
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateResourceVariables) => {
      const { title, visibility, subjectId, competenceId, file, description } = variables;
      return resourcesApi.createResourceResourcesPost(
        title,
        visibility,
        subjectId,
        competenceId,
        file,
        description ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
