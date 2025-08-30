import React, { useMemo, useState, useEffect } from 'react';
import { useDirector } from '../../../contexts/DirectorContext';
import { useIdentityBatches, useIdentityBatchItems, useIdentityCommitBatch } from '../../../hooks/useIdentity';
import { useProvisioningBatches, useProvisioningCreateBatch, useProvisioningRunBatch, useProvisioningBatchItems } from '../../../hooks/useProvisioning';
import toast from 'react-hot-toast';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useAuth } from '../../../pages/authentification/useAuth';
import { useEstablishments } from '../../../hooks/useEstablishments';

const OnboardingTracking: React.FC = () => {
  const { currentEtablissementId } = useDirector();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selectedIdentityBatchId, setSelectedIdentityBatchId] = useState<string | undefined>(undefined);
  const [selectedProvBatchId, setSelectedProvBatchId] = useState<string | undefined>(undefined);
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [provDomainFilter, setProvDomainFilter] = useState<string | undefined>(undefined);
  const [provStatusFilter, setProvStatusFilter] = useState<string | undefined>(undefined);
  const [identitySearch, setIdentitySearch] = useState<string>('');
  const { roles } = useAuth();
  const isAdmin = roles.includes('administrateur');
  const { data: establishments } = useEstablishments({ limit: 100, offset: 0 });
  const [adminEtabId, setAdminEtabId] = useState<string>('');

  const effectiveEtabId = isAdmin ? (adminEtabId || currentEtablissementId || undefined) : (currentEtablissementId || undefined);
  const { data: idBatches, isLoading: idLoading } = useIdentityBatches({ establishmentId: effectiveEtabId, page, size });
  const { data: idItems } = useIdentityBatchItems({ batchId: selectedIdentityBatchId, domain: domainFilter, itemStatus: statusFilter, page: 1, size: 50 });
  const commitBatch = useIdentityCommitBatch();

  const { data: provBatches, isLoading: provLoading } = useProvisioningBatches({ limit: 100 });
  const provCreate = useProvisioningCreateBatch();
  const provRun = useProvisioningRunBatch();
  const { data: provItems } = useProvisioningBatchItems({ batchId: selectedProvBatchId, limit: 100 });

  const identityBatchList: any[] = useMemo(() => {
    if (!idBatches) return [];
    if (Array.isArray(idBatches)) return idBatches;
    if (idBatches.items) return idBatches.items;
    return [];
  }, [idBatches]);

  const filteredIdentityBatchList = useMemo(() => {
    const q = identitySearch.trim().toLowerCase();
    if (!q) return identityBatchList;
    return identityBatchList.filter((b: any) => {
      const id = String(b.id || '').toLowerCase();
      const src = String(b.source_file_url || '').toLowerCase();
      const est = String(b.establishment_id || '').toLowerCase();
      return id.includes(q) || src.includes(q) || est.includes(q);
    });
  }, [identityBatchList, identitySearch]);

  const provBySourceId = useMemo(() => {
    const map = new Map<string, any>();
    (provBatches ?? []).forEach((pb) => {
      if (pb.source_identity_batch_id) map.set(pb.source_identity_batch_id, pb);
    });
    return map;
  }, [provBatches]);

  const handleCreateProvisioning = async (identityBatchId: string) => {
    try {
      const created = await provCreate.mutateAsync({ sourceIdentityBatchId: identityBatchId });
      toast.success('Batch provisioning créé');
      setSelectedProvBatchId(created.id);
    } catch {
      toast.error('Échec de création du batch provisioning');
    }
  };

  const handleCreateAndRunProvisioning = async (identityBatchId: string) => {
    try {
      const created = await provCreate.mutateAsync({ sourceIdentityBatchId: identityBatchId });
      await provRun.mutateAsync({ batchId: created.id });
      toast.success('Provisioning lancé');
      setSelectedProvBatchId(created.id);
    } catch {
      toast.error('Échec de création/lancement du provisioning');
    }
  };

  const identityItemsArray: any[] = useMemo(() => {
    if (!idItems) return [];
    if (Array.isArray(idItems)) return idItems;
    if (idItems.items) return idItems.items;
    return [];
  }, [idItems]);

  const identityCounters = useMemo(() => {
    const counters: Record<string, number> = { NEW: 0, UPDATED: 0, SKIPPED: 0, INVALID: 0 };
    identityItemsArray.forEach((it) => {
      const key = (it.item_status ?? '').toUpperCase();
      if (counters[key] !== undefined) counters[key] += 1;
    });
    return counters;
  }, [identityItemsArray]);

  const provItemsArray: any[] = useMemo(() => provItems ?? [], [provItems]);

  const filteredProvItems = useMemo(() => {
    return provItemsArray.filter((it) => {
      if (provDomainFilter && it.domain !== provDomainFilter) return false;
      if (provStatusFilter && it.prov_status !== provStatusFilter) return false;
      return true;
    });
  }, [provItemsArray, provDomainFilter, provStatusFilter]);

  const provCounters = useMemo(() => {
    const keys = ['ENQUEUED','KC_CREATED','KC_UPDATED','INVITE_SENT','PENDING_ACTIVATION','ACTIVATED','EXPIRED','DISABLED','ERROR'] as const;
    const counters: Record<string, number> = {} as Record<string, number>;
    keys.forEach(k => counters[k] = 0);
    provItemsArray.forEach((it) => {
      const key = (it.prov_status ?? '').toUpperCase();
      if (counters[key] !== undefined) counters[key] += 1;
    });
    return counters;
  }, [provItemsArray]);

  const { lastIdentityBatchId, lastProvisioningBatchId, shouldFocusTracking, setShouldFocusTracking } = useOnboarding();
  useEffect(() => {
    if (shouldFocusTracking && lastIdentityBatchId) {
      setSelectedIdentityBatchId(lastIdentityBatchId);
      setDomainFilter(undefined);
      setStatusFilter(undefined);
    }
    if (shouldFocusTracking && lastProvisioningBatchId) {
      setSelectedProvBatchId(lastProvisioningBatchId);
      setProvDomainFilter(undefined);
      setProvStatusFilter(undefined);
    }
    if (shouldFocusTracking && (lastIdentityBatchId || lastProvisioningBatchId)) {
      setShouldFocusTracking(false);
    }
  }, [shouldFocusTracking, lastIdentityBatchId, lastProvisioningBatchId, setShouldFocusTracking]);


  const handleCommit = async (batchId: string) => {
    try {
      await commitBatch.mutateAsync({ batchId });
      toast.success('Batch identity commit effectué');
    } catch {
      toast.error("Échec du commit du batch d'identités");
    }
  };

  const handleRun = async (batchId: string) => {
    try {
      await provRun.mutateAsync({ batchId });
      toast.success('Provisioning en cours');
    } catch {
      toast.error('Échec du lancement du provisioning');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        {isAdmin && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={adminEtabId}
              onChange={(e) => {
                const id = e.target.value;
                setAdminEtabId(id);
                if (id) localStorage.setItem('current-etab-id', id);
              }}
            >
              <option value="">Sélectionner…</option>
              {(establishments ?? []).map((etab) => (
                <option key={etab.id} value={etab.id}>{etab.nom}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Batches d'identités</h3>
          <div className="flex items-center gap-3">
            <input value={identitySearch} onChange={(e) => setIdentitySearch(e.target.value)} placeholder="Rechercher..." className="p-2 border rounded text-sm" />
            <div className="text-sm text-gray-500">Établissement: {effectiveEtabId ?? '—'}</div>
          </div>
        </div>
        {idLoading ? (
          <div className="text-gray-500">Chargement…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Batch ID</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Establishment</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Fichier source</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Créé le</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Provisioning lié</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdentityBatchList.map((b: any) => {
                  const linkedProv = provBySourceId.get(b.id);
                  return (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">
                        <button className="text-blue-600 hover:underline" onClick={() => { setSelectedIdentityBatchId(b.id); setDomainFilter(undefined); setStatusFilter(undefined); }}>{b.id}</button>
                      </td>
                      <td className="px-3 py-2 text-sm">{b.establishment_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm break-all">{b.source_file_url ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{b.created_at ? new Date(b.created_at).toLocaleString() : '—'}</td>
                      <td className="px-3 py-2 text-sm">
                        {provLoading ? '—' : linkedProv ? (
                          <button className="text-blue-600 hover:underline" onClick={() => { setSelectedProvBatchId(linkedProv.id); setProvDomainFilter(undefined); setProvStatusFilter(undefined); }}>{linkedProv.id}</button>
                        ) : (
                          <span className="text-gray-400">Aucun</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm space-x-2">
                        <button className={`px-2 py-1 text-xs rounded ${commitBatch.isPending ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'}`} disabled={commitBatch.isPending} onClick={() => handleCommit(b.id)}>
                          {commitBatch.isPending ? 'Commit…' : 'Commit'}
                        </button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${linkedProv ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                          disabled={!!linkedProv || provCreate.isPending}
                          onClick={() => handleCreateProvisioning(b.id)}
                        >
                          Créer provisioning
                        </button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${linkedProv ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                          disabled={!!linkedProv || provCreate.isPending || provRun.isPending}
                          onClick={() => handleCreateAndRunProvisioning(b.id)}
                        >
                          {provCreate.isPending || provRun.isPending ? 'En cours…' : 'Créer + Lancer'}
                        </button>
                      </td>
                    </tr>
                  );})}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center gap-2 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <span>Page size</span>
            <select className="p-1 border rounded" value={size} onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}>
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 text-sm rounded bg-gray-100 disabled:opacity-50">Précédent</button>
            <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm rounded bg-gray-100">Suivant</button>
          </div>
        </div>

        {selectedIdentityBatchId && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 border rounded bg-white"><div className="text-xs text-gray-500">NEW</div><div className="text-xl font-semibold">{identityCounters.NEW}</div></div>
              <div className="p-3 border rounded bg-white"><div className="text-xs text-gray-500">UPDATED</div><div className="text-xl font-semibold">{identityCounters.UPDATED}</div></div>
              <div className="p-3 border rounded bg-white"><div className="text-xs text-gray-500">SKIPPED</div><div className="text-xl font-semibold">{identityCounters.SKIPPED}</div></div>
              <div className="p-3 border rounded bg-white"><div className="text-xs text-gray-500">INVALID</div><div className="text-xl font-semibold">{identityCounters.INVALID}</div></div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select className="p-2 border rounded text-sm" value={domainFilter ?? ''} onChange={(e) => setDomainFilter(e.target.value || undefined)}>
                <option value="">Tous domaines</option>
                <option value="student">Élève</option>
                <option value="parent">Parent</option>
                <option value="teacher">Enseignant</option>
                <option value="admin_staff">Admin Staff</option>
              </select>
              <select className="p-2 border rounded text-sm" value={statusFilter ?? ''} onChange={(e) => setStatusFilter(e.target.value || undefined)}>
                <option value="">Tous statuts</option>
                <option value="NEW">NEW</option>
                <option value="UPDATED">UPDATED</option>
                <option value="SKIPPED">SKIPPED</option>
                <option value="INVALID">INVALID</option>
              </select>
            </div>

            <h4 className="font-medium">Items du batch {selectedIdentityBatchId}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Domaine</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Etablissement</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">External ID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Target UUID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Statut</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Message</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Créé</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">MAJ</th>
                  </tr>
                </thead>
                <tbody>
                  {identityItemsArray.map((it: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2 text-sm">{it.domain ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.establishment_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.external_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.target_uuid ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.item_status ?? '—'}</td>
                      <td className="px-3 py-2 text-sm break-all">{it.message ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.created_at ? new Date(it.created_at).toLocaleString() : '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.updated_at ? new Date(it.updated_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Batches de provisioning</h3>
        </div>
        {provLoading ? (
          <div className="text-gray-500">Chargement…</div>
        ) : (
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
                {(provBatches ?? []).map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:underline" onClick={() => { setSelectedProvBatchId(b.id); setProvDomainFilter(undefined); setProvStatusFilter(undefined); }}>{b.id}</button>
                    </td>
                    <td className="px-3 py-2 text-sm">{b.source_identity_batch_id}</td>
                    <td className="px-3 py-2 text-sm">{b.created_at ? new Date(b.created_at).toLocaleString() : '—'}</td>
                    <td className="px-3 py-2 text-sm space-x-2">
                      <button className={`px-2 py-1 text-xs rounded ${provRun.isPending ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} disabled={provRun.isPending} onClick={() => handleRun(b.id)}>
                        {provRun.isPending ? 'Run…' : 'Run'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedProvBatchId && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['ENQUEUED','KC_CREATED','KC_UPDATED','INVITE_SENT','PENDING_ACTIVATION','ACTIVATED','EXPIRED','DISABLED','ERROR'].map((k) => (
                <div key={k} className="p-3 border rounded bg-white"><div className="text-xs text-gray-500">{k}</div><div className="text-xl font-semibold">{provCounters[k] ?? 0}</div></div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select className="p-2 border rounded text-sm" value={provDomainFilter ?? ''} onChange={(e) => setProvDomainFilter(e.target.value || undefined)}>
                <option value="">Tous domaines</option>
                <option value="student">Élève</option>
                <option value="parent">Parent</option>
                <option value="teacher">Enseignant</option>
                <option value="admin_staff">Admin Staff</option>
              </select>
              <select className="p-2 border rounded text-sm" value={provStatusFilter ?? ''} onChange={(e) => setProvStatusFilter(e.target.value || undefined)}>
                <option value="">Tous statuts</option>
                {['ENQUEUED','KC_CREATED','KC_UPDATED','INVITE_SENT','PENDING_ACTIVATION','ACTIVATED','EXPIRED','DISABLED','ERROR'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {provItemsArray.length > 0 && (
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-gray-100 overflow-hidden flex">
                  {(() => {
                    const total = provItemsArray.length;
                    const parts = [
                      { key: 'ENQUEUED', color: 'bg-gray-400' },
                      { key: 'KC_CREATED', color: 'bg-blue-400' },
                      { key: 'KC_UPDATED', color: 'bg-blue-600' },
                      { key: 'INVITE_SENT', color: 'bg-indigo-400' },
                      { key: 'PENDING_ACTIVATION', color: 'bg-yellow-400' },
                      { key: 'ACTIVATED', color: 'bg-green-500' },
                      { key: 'EXPIRED', color: 'bg-orange-400' },
                      { key: 'DISABLED', color: 'bg-gray-600' },
                      { key: 'ERROR', color: 'bg-red-500' },
                    ] as const;
                    return parts
                      .map(p => ({ ...p, count: provCounters[p.key] ?? 0 }))
                      .filter(p => p.count > 0)
                      .map(p => (
                        <div key={p.key} className={`${p.color}`} style={{ width: `${(p.count / total) * 100}%` }} />
                      ));
                  })()}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  {[
                    { key: 'ENQUEUED', label: 'ENQUEUED', dot: 'bg-gray-400' },
                    { key: 'KC_CREATED', label: 'KC_CREATED', dot: 'bg-blue-400' },
                    { key: 'KC_UPDATED', label: 'KC_UPDATED', dot: 'bg-blue-600' },
                    { key: 'INVITE_SENT', label: 'INVITE_SENT', dot: 'bg-indigo-400' },
                    { key: 'PENDING_ACTIVATION', label: 'PENDING', dot: 'bg-yellow-400' },
                    { key: 'ACTIVATED', label: 'ACTIVATED', dot: 'bg-green-500' },
                    { key: 'EXPIRED', label: 'EXPIRED', dot: 'bg-orange-400' },
                    { key: 'DISABLED', label: 'DISABLED', dot: 'bg-gray-600' },
                    { key: 'ERROR', label: 'ERROR', dot: 'bg-red-500' },
                  ].map(l => (
                    <div key={l.key} className="flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded ${l.dot}`} />
                      <span>{l.label} ({provCounters[l.key] ?? 0})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 className="font-medium mb-2">Items du provisioning {selectedProvBatchId}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Identity ID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Domaine</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Etablissement</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">External ID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">KC Username</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">KC User ID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Statut</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Dernière erreur</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Créé</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">MAJ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProvItems.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="px-3 py-2 text-sm">{it.identity_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.domain ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.establishment_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.external_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.kc_username ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.kc_user_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.prov_status ?? '—'}</td>
                      <td className="px-3 py-2 text-sm break-all">{it.last_error ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.created_at ? new Date(it.created_at).toLocaleString() : '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.updated_at ? new Date(it.updated_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingTracking;
