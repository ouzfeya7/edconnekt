import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';

export type SimpleEstablishment = {
  id: string;
  label: string;
};

function normalizeEstablishment(e: unknown): SimpleEstablishment | null {
  if (!e) return null;
  const obj = e as Record<string, unknown>;
  const id = (obj.id ?? obj.uuid ?? obj.establishment_id ?? obj.code ?? (obj as { _id?: unknown })._id);
  if (!id) return null;
  const label = (obj.name ?? obj.nom ?? obj.libelle ?? obj.label ?? String(id));
  return { id: String(id), label: String(label) };
}

export function useAllEstablishments(params?: { status?: string; limit?: number; offset?: number; enabled?: boolean }) {
  return useQuery<SimpleEstablishment[], Error>({
    queryKey: ['establishments:all', params?.status, params?.limit, params?.offset],
    enabled: params?.enabled ?? true,
    queryFn: async () => {
      const { data } = await etablissementsApi.listEstablishmentsApiEtablissementsGet(
        undefined,
        params?.limit ?? 50,
        params?.offset ?? 0,
      );
      const arr: unknown[] = Array.isArray(data) ? (data as unknown[]) : [];
      const mapped = arr.map(normalizeEstablishment).filter(Boolean) as SimpleEstablishment[];
      return mapped;
    },
    placeholderData: (prev) => prev,
  });
}
