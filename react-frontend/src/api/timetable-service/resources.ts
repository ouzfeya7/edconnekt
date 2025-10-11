import { timetableAxios } from './http';

// Types minimalistes basés sur la spec OpenAPI (schemas non détaillés)
export interface AttachResourcesRequest {
  resource_ids: string[];
}

/**
 * Attacher 1..N ressources à une leçon.
 * POST /lessons/{lesson_id}/resources
 */
export async function attachLessonResources(lessonId: string, resourceIds: string[]): Promise<void> {
  await timetableAxios.post(`lessons/${lessonId}/resources`, {
    resource_ids: resourceIds,
  } as AttachResourcesRequest);
}

/**
 * Lister les ressources d'une leçon (option enrich via resource-service).
 * GET /lessons/{lesson_id}/resources?enrich=bool
 */
export async function listLessonResources<T = unknown>(lessonId: string, enrich = false): Promise<T> {
  const res = await timetableAxios.get(`lessons/${lessonId}/resources`, {
    params: { enrich },
  });
  return res.data as T;
}

/**
 * Détacher une ressource d'une leçon.
 * DELETE /lessons/{lesson_id}/resources/{resource_id}
 */
export async function detachLessonResource(lessonId: string, resourceId: string): Promise<void> {
  await timetableAxios.delete(`lessons/${lessonId}/resources/${resourceId}`);
}
