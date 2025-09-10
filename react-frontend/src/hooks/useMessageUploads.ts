import { useMutation } from '@tanstack/react-query';
import { uploadsApi } from '../api/message-service/client';

function getErrorMessage(error: unknown): string {
  const maybeAxios = error as { response?: { data?: unknown } } | undefined;
  const data = maybeAxios?.response?.data as unknown;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.msg === 'string') return obj.msg;
    if (typeof obj.detail === 'string') return obj.detail;
  }
  if (error instanceof Error && error.message) return error.message;
  try { return JSON.stringify(error); } catch { return 'Une erreur est survenue'; }
}

export function useUploadMessageFile() {
  return useMutation({
    mutationFn: async (params: { file: File }) => {
      const filename = params.file.name;
      const contentType = params.file.type || 'application/octet-stream';
      const size = params.file.size;
      try {
        await uploadsApi.createUploadKeyMessagesUploadPost(filename, contentType, size);
        // Dans la plupart des implémentations, on obtient une clé; ici l'API renvoie un 200 vide, donc on simule la clé par le nom
        await uploadsApi.uploadFileUploadsKeyPut(filename, params.file);
        return { key: filename };
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
}


