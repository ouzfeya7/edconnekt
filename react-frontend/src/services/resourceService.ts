// Service pour gérer les ressources (compatible microservices)
export interface ResourceVersion {
  id: number;
  resourceId: number;
  versionNumber: number;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changeDescription: string;
}

export interface ResourceUpdate {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  isPaid?: boolean;
  visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  competence?: string;
  fileType?: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK';
  fileSize?: number;
  version?: number;
  classId?: string;
  changeDescription?: string;
}

class ResourceService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';  
}

export const resourceService = new ResourceService(); 