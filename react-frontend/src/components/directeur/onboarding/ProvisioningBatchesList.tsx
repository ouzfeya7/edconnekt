import React, { useMemo, useState } from 'react';
import { useProvisioningBatches } from '../../../hooks/useProvisioning';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ProvisioningBatchesList: React.FC = () => {
  // const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');

  const { data, isLoading, isError } = useProvisioningBatches({ limit });
  const { focusProvisioningBatch, setShouldFocusTracking } = useOnboarding();

  const rows = useMemo(() => {
    const list = data ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((b) => {
      const id = String(b.id || '').toLowerCase();
      const src = String(b.source_identity_batch_id || '').toLowerCase();
      return id.includes(query) || src.includes(query);
    });
  }, [data, q]);

  const handleView = (id: string) => {
    focusProvisioningBatch(id);
    setShouldFocusTracking(true);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lots de provisioning</h3>
        <div className="flex items-center gap-3">
          <input className="p-2 border rounded text-sm" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." />
          <div className="flex items-center gap-2 text-sm">
            <span>Taille</span>
            <select className="p-1 border rounded" value={limit} onChange={(e) => { setSkip(0); setLimit(Number(e.target.value)); }}>
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
                <th className="px-3 py-2 text-left text-sm text-gray-600">Source Identity Batch</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Créé le</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm">{b.id}</td>
                  <td className="px-3 py-2 text-sm">{b.source_identity_batch_id}</td>
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
    </div>
  );
};

export default ProvisioningBatchesList;
