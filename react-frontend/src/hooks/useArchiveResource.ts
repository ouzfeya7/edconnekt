import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';

export function useArchiveResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => {
      // Utilise la méthode DELETE pour archiver, comme demandé
      return resourcesApi.deleteResourceResourcesResourceIdDelete(resourceId);
    },
    onSuccess: () => {
      // Invalide et rafraîchit la liste des ressources pour refléter le changement
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error) => {
      // Optionnel : gérer l'erreur, par ex. afficher une notification
      console.error("Erreur lors de l'archivage de la ressource:", error);
    },
  });
}
