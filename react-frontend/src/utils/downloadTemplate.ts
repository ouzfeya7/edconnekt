import { identityApi } from '../api/identity-service/client';

export type IdentityTemplateRole = 'student' | 'parent' | 'teacher' | 'admin_staff';
export type TemplateFormat = 'csv' | 'xlsx';

function extractFilename(headers: Record<string, string | undefined>, role: IdentityTemplateRole, format: TemplateFormat): string {
  const cd = headers?.['content-disposition'] || headers?.['Content-Disposition'] as string | undefined;
  if (cd) {
    // Try RFC 5987 and standard filename
    const utfMatch = cd.match(/filename\*=UTF-8''([^;]+)/i);
    if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
    const nameMatch = cd.match(/filename="?([^";]+)"?/i);
    if (nameMatch?.[1]) return nameMatch[1];
  }
  return `${role}_template.${format}`;
}

export async function downloadIdentityTemplate(role: IdentityTemplateRole, format: TemplateFormat): Promise<void> {
  const resp = await identityApi.getImportTemplateApiV1IdentityBulkimportTemplateRoleGet(role, format, { responseType: 'blob' as unknown as undefined });
  const blob = resp.data as Blob;
  const filename = extractFilename((resp as unknown as { headers?: Record<string, string | undefined> })?.headers ?? {}, role, format);

  const url = window.URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    window.URL.revokeObjectURL(url);
  }
}
