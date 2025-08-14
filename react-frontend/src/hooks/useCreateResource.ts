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
      return resourcesApi.createResourceResourcesPost(
        title,
        visibility,
        subjectId,
        competenceId,
        file,
        description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    // No onError here, it will be handled in the component
  });
}
