import { useMutation } from '@tanstack/react-query';
import { resourcesApi } from '../api/resource-service/client';

interface DownloadParams {
  resourceId: string;
  suggestedFilename?: string;
}

export function useDownloadResourceFile() {
  return useMutation({
    mutationFn: async ({ resourceId, suggestedFilename }: DownloadParams) => {
      const res = await resourcesApi.downloadResourceFileResourcesResourceIdDownloadGet(
        resourceId,
        { responseType: 'blob' }
      );
      return { response: res, suggestedFilename } as {
        response: { data?: unknown; headers?: Record<string, unknown> };
        suggestedFilename?: string;
      };
    },
    onSuccess: ({ response, suggestedFilename }) => {
      const blob = response?.data as unknown;
      if (!(blob instanceof Blob)) return;

      let filename = suggestedFilename || 'resource';
      const cd = response?.headers?.['content-disposition'] as unknown;
      if (typeof cd === 'string') {
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
        const found = decodeURIComponent(match?.[1] || match?.[2] || '');
        if (found) filename = found;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

export default useDownloadResourceFile;