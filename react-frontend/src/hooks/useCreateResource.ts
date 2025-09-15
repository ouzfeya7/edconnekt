import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';
import { Visibility } from '../api/resource-service/api';

interface CreateResourceVariables {
  title: string;
  visibility: Visibility;
  subjectId: string; // OpenAPI expects UUID string
  competenceId?: string | null;
  file: File;
  description?: string | null;
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateResourceVariables) => {
      const { title, visibility, subjectId, competenceId, file, description } = variables;
      // Generated client signature: (title, visibility, subjectId, file, description?, competenceId?)
      return resourcesApi.createResourceResourcesPost(
        title,
        visibility,
        subjectId,
        file,
        description,
        competenceId ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    // No onError here, it will be handled in the component
  });
}
