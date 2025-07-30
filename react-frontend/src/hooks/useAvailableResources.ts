import { useMemo } from 'react';
import { useResources } from '../contexts/ResourceContext';

export interface AvailableResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  imageUrl: string;
  fileType?: string;
  fileSize?: number;
  visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  isPaid?: boolean;
  isArchived?: boolean;
}

export const useAvailableResources = () => {
  const { resources } = useResources();

  const availableResources = useMemo(() => {
    return resources
      .filter(resource => !resource.isArchived) // Exclure les ressources archivées
      .map(resource => ({
        id: resource.id.toString(),
        title: resource.title,
        description: resource.description,
        subject: resource.subject,
        imageUrl: resource.imageUrl,
        fileType: resource.fileType,
        fileSize: resource.fileSize,
        visibility: resource.visibility,
        isPaid: resource.isPaid,
        isArchived: resource.isArchived
      }));
  }, [resources]);

  const searchResources = (query: string, subject?: string): AvailableResource[] => {
    return availableResources.filter(resource => {
      const matchesQuery = query === '' || 
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesSubject = !subject || resource.subject === subject;
      
      return matchesQuery && matchesSubject;
    });
  };

  const getResourcesBySubject = (subject: string): AvailableResource[] => {
    return availableResources.filter(resource => resource.subject === subject);
  };

  const getResourcesByVisibility = (visibility: 'PRIVATE' | 'CLASS' | 'SCHOOL'): AvailableResource[] => {
    return availableResources.filter(resource => resource.visibility === visibility);
  };

  return {
    availableResources,
    searchResources,
    getResourcesBySubject,
    getResourcesByVisibility
  };
}; 