import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';

export type SimpleEstablishment = {
  id: string;
  label: string;
};

function normalizeEstablishment(e: any): SimpleEstablishment | null {
  if (!e) return null;
  const id = (e.id ?? e.uuid ?? e.establishment_id ?? e.code ?? e._id);
  if (!id) return null;
  const label = (e.name ?? e.nom ?? e.libelle ?? e.label ?? String(id));
  return { id: String(id), label: String(label) };
}

export function useAllEstablishments(params?: { status?: string; limit?: number; offset?: number; enabled?: boolean }) {
  return useQuery<SimpleEstablishment[], Error>({
    queryKey: ['establishments:all', params?.status, params?.limit, params?.offset],
    enabled: params?.enabled ?? true,
    queryFn: async () => {
      const { data } = await etablissementsApi.listEstablishmentsApiEtablissementsGet(
        // status enum may differ across generators; pass through as-is or undefined
        (params?.status as any) ?? undefined,
        params?.limit ?? 50,
        params?.offset ?? 0,
      );
      const arr: any[] = Array.isArray(data) ? (data as any[]) : [];
      const mapped = arr.map(normalizeEstablishment).filter(Boolean) as SimpleEstablishment[];
      return mapped;
    },
    placeholderData: (prev) => prev,
  });
}
