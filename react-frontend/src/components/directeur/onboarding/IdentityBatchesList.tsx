import React, { useMemo, useState } from 'react';
import { useIdentityBatches } from '../../../hooks/useIdentity';
import { useDirector } from '../../../contexts/DirectorContext';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const IdentityBatchesList: React.FC = () => {
  const { currentEtablissementId } = useDirector();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [q, setQ] = useState('');

  const { data, isLoading, isError } = useIdentityBatches({ establishmentId: currentEtablissementId || undefined, page, size });
  const { focusIdentityBatch, setShouldFocusTracking } = useOnboarding();

  const rows: any[] = useMemo(() => {
    const list = Array.isArray(data) ? data : data?.items ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((b: any) => {
      const id = String(b.id || '').toLowerCase();
      const src = String(b.source_file_url || '').toLowerCase();
      const est = String(b.establishment_id || '').toLowerCase();
      return id.includes(query) || src.includes(query) || est.includes(query);
    });
  }, [data, q]);

  const handleView = (id: string) => {
    focusIdentityBatch(id);
    setShouldFocusTracking(true);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lots d'identités</h3>
        <div className="flex items-center gap-3">
          <input className="p-2 border rounded text-sm" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." />
          <div className="flex items-center gap-2 text-sm">
            <span>Taille</span>
            <select className="p-1 border rounded" value={size} onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}>
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <div className="text-gray-500">Chargement…</div>}
      {isError && <div className="text-red-600">Erreur de chargement</div>}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Batch ID</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Etablissement</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Fichier source</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Créé le</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b: any) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm">{b.id}</td>
                  <td className="px-3 py-2 text-sm">{b.establishment_id ?? '—'}</td>
                  <td className="px-3 py-2 text-sm break-all">{b.source_file_url ?? '—'}</td>
                  <td className="px-3 py-2 text-sm">{b.created_at ? new Date(b.created_at).toLocaleString() : '—'}</td>
                  <td className="px-3 py-2 text-sm">
                    <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => handleView(b.id)}>Voir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-3">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 text-sm rounded bg-gray-100 disabled:opacity-50">Précédent</button>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm rounded bg-gray-100">Suivant</button>
      </div>
    </div>
  );
};

export default IdentityBatchesList;
