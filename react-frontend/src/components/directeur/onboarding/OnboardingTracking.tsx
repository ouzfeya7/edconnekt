import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDirector } from '../../../contexts/DirectorContext';
import { useIdentityBatches, useIdentityBatchItems, useIdentityBulkProgress, useIdentityBatchErrors } from '../../../hooks/useIdentity';
import { useProvisioningBatches, useProvisioningCreateBatch, useProvisioningRunBatch, useProvisioningBatchItems, useProvisioningGenerateUsername } from '../../../hooks/useProvisioning';
import type { ProvisioningItem } from '../../../api/provisioning-service/api';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { IDENTITY_API_BASE_URL } from '../../../api/identity-service/http';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { downloadIdentityTemplate } from '../../../utils/downloadTemplate';

import {
  Database,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Play,
  BarChart3,
  Clock,
  FileDown,
  Radio,
  Wand2,
} from 'lucide-react';

const OnboardingTracking: React.FC = () => {
  const { t } = useTranslation();
  const { currentEtablissementId } = useDirector();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<'identity' | 'provisioning'>('identity');
  const [batchSearch, setBatchSearch] = useState<string>('');
  const [selectedIdentityBatchId, setSelectedIdentityBatchId] = useState<string | undefined>(undefined);
  const [selectedProvBatchId, setSelectedProvBatchId] = useState<string | undefined>(undefined);
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [provDomainFilter, setProvDomainFilter] = useState<string | undefined>(undefined);
  const [provStatusFilter, setProvStatusFilter] = useState<string | undefined>(undefined);
  // removed legacy identity search in favor of unified batchSearch
  const [templateDomain, setTemplateDomain] = useState<'student' | 'parent' | 'teacher' | 'admin_staff'>('student');

  // Pagination/filters for identity items & errors
  const [identityItemsPage, setIdentityItemsPage] = useState(1);
  const [identityItemsSize, setIdentityItemsSize] = useState(50);
  const [identityErrorsPage, setIdentityErrorsPage] = useState(1);
  const [identityErrorsSize, setIdentityErrorsSize] = useState(50);
  const [identityErrorType, setIdentityErrorType] = useState<string | undefined>(undefined);


  const effectiveEtabId = currentEtablissementId || undefined;
  const { data: idBatches } = useIdentityBatches({ page, size });
  const { data: idItems } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, domain: domainFilter, itemStatus: statusFilter, page: identityItemsPage, size: identityItemsSize },
    { refetchInterval: 2000 }
  );
  // Server-side totals per status (fast: size=1) for accurate counts regardless of current page
  const { data: idTotalPending } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, itemStatus: 'PENDING', page: 1, size: 1 },
    { refetchInterval: 2000 }
  );
  const { data: idTotalProcessing } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, itemStatus: 'PROCESSING', page: 1, size: 1 },
    { refetchInterval: 2000 }
  );
  const { data: idTotalSuccess } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, itemStatus: 'SUCCESS', page: 1, size: 1 },
    { refetchInterval: 2000 }
  );
  const { data: idTotalError } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, itemStatus: 'ERROR', page: 1, size: 1 },
    { refetchInterval: 2000 }
  );
  const { data: idTotalSkipped } = useIdentityBatchItems(
    { batchId: selectedIdentityBatchId, itemStatus: 'SKIPPED', page: 1, size: 1 },
    { refetchInterval: 2000 }
  );
  const { data: idProgress } = useIdentityBulkProgress(selectedIdentityBatchId, { refetchInterval: 2000 });
  // Annulation non supportée par l'API actuelle -> bouton masqué




  const { data: provBatches } = useProvisioningBatches({ skip: (page - 1) * size, limit: size });
  const { data: idErrors } = useIdentityBatchErrors(
    { batchId: selectedIdentityBatchId, page: identityErrorsPage, size: identityErrorsSize, errorType: identityErrorType ?? undefined },
    { refetchInterval: 5000 }
  );
  const provCreate = useProvisioningCreateBatch();
  const provRun = useProvisioningRunBatch();
  const { data: provItems } = useProvisioningBatchItems(
    { batchId: selectedProvBatchId, limit: 100 },
    { refetchInterval: 2000 }
  );
  const genUsername = useProvisioningGenerateUsername();

  // SSE live progress (fallback to polling already above)
  const [liveSSE, setLiveSSE] = useState<boolean>(false);
  const [sseProgress, setSseProgress] = useState<any | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!liveSSE || !selectedIdentityBatchId) {
      if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
      setSseProgress(null);
      return;
    }
    try {
      const token = sessionStorage.getItem('keycloak-token');
      // Extract user_id from JWT token (prefer 'sub') for SSE as per API spec
      let userId: string | undefined;
      try {
        if (token && token.includes('.')) {
          const payload = JSON.parse(atob(token.split('.')[1] ?? ''));
          userId = payload?.sub || payload?.user_id || payload?.uid || undefined;
        }
      } catch {}
      const params: string[] = [];
      if (userId) params.push(`user_id=${encodeURIComponent(userId)}`);
      params.push(`timeout=${encodeURIComponent('300')}`);
      const url = `${IDENTITY_API_BASE_URL}api/v1/identity/bulkimport/sse/${selectedIdentityBatchId}${params.length ? `?${params.join('&')}` : ''}`;
      const es = new EventSource(url);
      sseRef.current = es;
      es.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          setSseProgress(data);
        } catch {}
      };
      es.onerror = () => {
        // Fallback to polling
        setLiveSSE(false);
        if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
      };
    } catch {
      setLiveSSE(false);
    }
    return () => {
      if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
    };
  }, [liveSSE, selectedIdentityBatchId]);

  const effectiveProgress = sseProgress ?? idProgress;

  type IdentityBatchRow = { id: string; establishment_id?: string; source_file_url?: string; created_at?: string };
  const identityBatchList: IdentityBatchRow[] = useMemo(() => {
    const list = (idBatches as { data?: IdentityBatchRow[] } | undefined)?.data ?? [];
    return Array.isArray(list) ? list : [];
  }, [idBatches]);

  const filteredIdentityBatchList: IdentityBatchRow[] = useMemo(() => {
    const q = batchSearch.trim().toLowerCase();
    if (!q) return identityBatchList;
    return identityBatchList.filter((b) => {
      const id = String(b.id ?? '').toLowerCase();
      const src = String(b.source_file_url ?? '').toLowerCase();
      const est = String(b.establishment_id ?? '').toLowerCase();
      return id.includes(q) || src.includes(q) || est.includes(q);
    });
  }, [identityBatchList, batchSearch]);

  type ProvBatchRow = { id: string; source_identity_batch_id?: string; created_at?: string };
  const provBySourceId = useMemo(() => {
    const map = new Map<string, ProvBatchRow>();
    ((provBatches as ProvBatchRow[] | undefined) ?? []).forEach((pb) => {
      if (pb.source_identity_batch_id) map.set(pb.source_identity_batch_id, pb);
    });
    return map;
  }, [provBatches]);



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

  // Template download via centralized helper
  type Domain = 'student' | 'parent' | 'teacher' | 'admin_staff';
  const downloadServerTemplate = async (domain: Domain, format: 'csv' | 'xlsx') => {
    try {
      await downloadIdentityTemplate(domain, format);
    } catch {
      toast.error('Téléchargement du template impossible');
    }
  };

  type IdentityItemRow = {
    // Current API fields
    id?: string;
    row_number?: number;
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    role_principal?: string | null;
    role_effectif?: string | null;
    cycle_codes?: any;
    status?: string;
    processed_at?: string;
    identity_id?: string;
    error_message?: string | null;
    // Legacy fields (compat)
    domain?: string;
    establishment_id?: string;
    external_id?: string;
    target_uuid?: string;
    item_status?: string;
    message?: string;
    created_at?: string;
    updated_at?: string;
  };
  const identityItemsArray: IdentityItemRow[] = useMemo(() => {
    return Array.isArray(idItems?.items) ? (idItems?.items as IdentityItemRow[]) : [];
  }, [idItems]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('[OnboardingTracking] identity items', {
        selectedIdentityBatchId,
        count: identityItemsArray.length,
        domainFilter,
        statusFilter,
      });
    }
  }, [selectedIdentityBatchId, identityItemsArray.length, domainFilter, statusFilter]);

  const identityCounters = useMemo(() => {
    const counters: Record<string, number> = { PENDING: 0, PROCESSING: 0, SUCCESS: 0, ERROR: 0, SKIPPED: 0 };
    identityItemsArray.forEach((it) => {
      const key = ((it.status ?? it.item_status) ?? '').toUpperCase();
      if (counters[key] !== undefined) counters[key] += 1;
    });
    return counters;
  }, [identityItemsArray]);

  const provItemsArray: ProvisioningItem[] = useMemo(() => (provItems as ProvisioningItem[] | undefined) ?? [], [provItems]);

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

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('[OnboardingTracking] provisioning items', {
        selectedProvBatchId,
        count: provItemsArray.length,
        provDomainFilter,
        provStatusFilter,
      });
    }
  }, [selectedProvBatchId, provItemsArray.length, provDomainFilter, provStatusFilter]);

  const handleGenerateUsername = async (it: ProvisioningItem) => {
    try {
      const username = await genUsername.mutateAsync({
        firstname: (it.firstname ?? '') as string,
        lastname: (it.lastname ?? '') as string,
        email: it.email ?? undefined,
      });
      try { await navigator.clipboard.writeText(username); } catch {}
      toast.success(`Username généré: ${username}${username ? ' (copié)' : ''}`);
    } catch {
      toast.error('Génération du username impossible');
    }
  };



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




  // const handleCancel = async (batchId: string) => {
  //   try {
  //     await cancelBulk.mutateAsync({ batchId });
  //     toast.success('Import annulé');
  //   } catch {
  //     toast.error("Échec de l'annulation");
  //   }
  // };

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
      {/* Header amélioré */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Suivi de l'Onboarding
            </h2>
            <p className="text-gray-600 mt-2">
              Surveillez l'état de vos imports et du provisioning des utilisateurs
            </p>
          </div>
          {/* Shortcuts: API Templates download */}
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              value={templateDomain}
              onChange={(e) => setTemplateDomain(e.target.value as any)}
            >
              <option value="student">Élève</option>
              <option value="parent">Parent</option>
              <option value="teacher">Enseignant</option>
              <option value="admin_staff">Admin Staff</option>
            </select>
            <button
              className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={() => downloadServerTemplate(templateDomain, 'csv')}
              title="Télécharger le template CSV depuis l'API"
            >
              <FileDown className="w-4 h-4" /> CSV
            </button>
            <button
              className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100"
              onClick={() => downloadServerTemplate(templateDomain, 'xlsx')}
              title="Télécharger le template XLSX depuis l'API"
            >
              <FileDown className="w-4 h-4" /> XLSX
            </button>
          </div>
        </div>



        {/* Navigation et filtres améliorés */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-600" />
              Gestion des Batches
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sélecteur de type */}
            <div className="relative">
              <select 
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={typeFilter} 
                onChange={(e) => { setTypeFilter(e.target.value as 'identity' | 'provisioning'); setPage(1); }}
              >
                <option value="identity">📊 Identités</option>
                <option value="provisioning">🚀 Provisioning</option>
            </select>
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
              <input 
                value={batchSearch} 
                onChange={(e) => setBatchSearch(e.target.value)} 
                placeholder="Rechercher un batch..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            

          </div>
        </div>
        {/* Table des batches améliorée */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(typeFilter === 'identity' ? filteredIdentityBatchList : ((provBatches as unknown[] | undefined) ?? [])).map((rowUnknown) => {
                if (typeFilter === 'identity') {
                  const b = rowUnknown as { id: string; establishment_id?: string; created_at?: string; source_file_url?: string };
                  const linkedProv = provBySourceId.get(b.id);
                  return (
                    <tr key={`i-${b.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors" 
                          onClick={() => { setSelectedIdentityBatchId(b.id); setDomainFilter(undefined); setStatusFilter(undefined); }}
                        >
                          {b.id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          📊 Identités
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 break-all">{b.establishment_id ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {b.created_at ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(b.created_at).toLocaleString()}
                          </span>
                        ) : '—'}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-2">

                          {/* Annulation non supportée par l'API actuelle */}

                          <button 
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              linkedProv 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`} 
                            disabled={!!linkedProv || provCreate.isPending || provRun.isPending} 
                            onClick={() => handleCreateAndRunProvisioning(b.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {provCreate.isPending || provRun.isPending ? 'En cours…' : 'Créer + Lancer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  const b = rowUnknown as { id: string; source_identity_batch_id?: string; created_at?: string };
                  const createdAt = b.created_at ? new Date(b.created_at).toLocaleString() : '—';
                  return (
                    <tr key={`p-${b.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors" 
                          onClick={() => { setSelectedProvBatchId(b.id); setProvDomainFilter(undefined); setProvStatusFilter(undefined); }}
                        >
                          {b.id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🚀 Provisioning
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 break-all">
                        Source: {b.source_identity_batch_id ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {b.created_at ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {createdAt}
                          </span>
                        ) : '—'}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <button 
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            provRun.isPending 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`} 
                          disabled={provRun.isPending} 
                          onClick={() => handleRun(b.id)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {provRun.isPending ? 'Run…' : 'Lancer'}
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination et contrôles améliorés */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Taille de page:</span>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={size} 
              onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}
            >
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-sm text-gray-500">
              {typeFilter === 'identity' 
                ? `${filteredIdentityBatchList.length} batch(es) d'identités affiché(s)`
                : `${(provBatches as unknown[] | undefined)?.length || 0} batch(es) de provisioning affiché(s)`
              }
              {typeFilter === 'identity' && filteredIdentityBatchList.length > 0 && (
                <span className="text-gray-400 ml-1">
                  (page {page} sur {Math.ceil(filteredIdentityBatchList.length / size)})
                </span>
              )}
              {typeFilter === 'provisioning' && (provBatches as unknown[] | undefined)?.length && (
                <span className="text-gray-400 ml-1">
                  (page {page} sur {Math.ceil(((provBatches as unknown[] | undefined)?.length || 0) / size)})
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </button>
            <span className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">
              Page {page}
            </span>
            <button 
              disabled={
                typeFilter === 'identity' 
                  ? filteredIdentityBatchList.length < size
                  : ((provBatches as unknown[] | undefined)?.length || 0) < size
              } 
              onClick={() => setPage(p => p + 1)} 
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                typeFilter === 'identity' 
                  ? (filteredIdentityBatchList.length < size ? "Pas plus d'éléments à afficher" : "Page suivante")
                  : (((provBatches as unknown[] | undefined)?.length || 0) < size ? "Pas plus d'éléments à afficher" : "Page suivante")
              }
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Section des items d'identité améliorée */}
        {selectedIdentityBatchId && (
          <div className="mt-6 space-y-4">
            {/* Progrès du batch identité */}
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Progression de l'import</div>
                <button
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                    liveSSE ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setLiveSSE((v) => !v)}
                  disabled={!selectedIdentityBatchId}
                  title={liveSSE ? 'Désactiver le suivi en temps réel (SSE)' : 'Activer le suivi en temps réel (SSE)'}
                >
                  <Radio className={`w-3.5 h-3.5 ${liveSSE ? 'text-green-600' : 'text-gray-500'}`} />
                  {liveSSE ? 'Temps réel ON' : 'Temps réel OFF'}
                </button>
              </div>
              {(() => {
                const p = (effectiveProgress as unknown as { status?: string; total_items?: number; new_count?: number; updated_count?: number; skipped_count?: number; invalid_count?: number } | undefined);
                return (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                    <span><span className="text-gray-500">Statut:</span> {p?.status ?? '—'}</span>
                    <span><span className="text-gray-500">Total:</span> {idItems?.total ?? p?.total_items ?? '—'}</span>
                    <span><span className="text-gray-500">NEW:</span> {p?.new_count ?? 0}</span>
                    <span><span className="text-gray-500">UPDATED:</span> {p?.updated_count ?? 0}</span>
                    <span><span className="text-gray-500">SKIPPED:</span> {p?.skipped_count ?? 0}</span>
                    <span><span className="text-gray-500">INVALID:</span> {p?.invalid_count ?? 0}</span>
                    <span><span className="text-gray-500">PENDING:</span> {idTotalPending?.total ?? 0}</span>
                    <span><span className="text-gray-500">PROCESSING:</span> {idTotalProcessing?.total ?? 0}</span>
                    <span><span className="text-gray-500">SUCCESS:</span> {idTotalSuccess?.total ?? 0}</span>
                    <span><span className="text-gray-500">ERROR:</span> {idTotalError?.total ?? 0}</span>
                    <span><span className="text-gray-500">SKIPPED (total):</span> {idTotalSkipped?.total ?? 0}</span>
                  </div>
                );
              })()}
            </div>
            {/* Statistiques avec design amélioré */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">NEW</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">{(effectiveProgress as any)?.new_count ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">Nouveaux utilisateurs</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">UPDATED</div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{(effectiveProgress as any)?.updated_count ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">Mises à jour</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">SKIPPED</div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">{(effectiveProgress as any)?.skipped_count ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">Ignorés</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">INVALID</div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-red-600 mt-1">{(effectiveProgress as any)?.invalid_count ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">Erreurs</div>
              </div>
            </div>

            {/* Filtres améliorés */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                value={statusFilter ?? ''} 
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
              >
                <option value="">📊 Tous statuts</option>
                <option value="PENDING">⏳ PENDING</option>
                <option value="PROCESSING">🔄 PROCESSING</option>
                <option value="SUCCESS">✅ SUCCESS</option>
                <option value="ERROR">❌ ERROR</option>
                <option value="SKIPPED">⏭️ SKIPPED</option>
              </select>
            </div>

            <h4 className="font-medium">Items du batch {selectedIdentityBatchId}</h4>
            <div className="overflow-x-auto">
              {identityItemsArray.length === 0 && (
                <div className="p-4 text-sm text-gray-600">Aucun item d'identité pour ce batch pour le moment.</div>
              )}
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Ligne</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Email</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Prénom</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Téléphone</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Statut</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Traité le</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Identity ID</th>
                    <th className="px-3 py-2 text-left text-sm text-gray-600">Erreur</th>
                  </tr>
                </thead>
                <tbody>
                  {(identityItemsArray as unknown[]).map((itUnknown, idx: number) => {
                    const it = itUnknown as {
                      id?: string;
                      row_number?: number;
                      email?: string;
                      firstname?: string;
                      lastname?: string;
                      phone?: string;
                      status?: string; item_status?: string;
                      processed_at?: string;
                      identity_id?: string;
                      error_message?: string | null;
                    };
                    return (
                    <tr key={it.identity_id ?? it.id ?? idx} className="border-t">
                      <td className="px-3 py-2 text-sm">{it.row_number ?? '—'}</td>
                      <td className="px-3 py-2 text-sm break-all">{it.email ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.firstname ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.lastname ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.phone ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{(it.status ?? it.item_status) ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{it.processed_at ? new Date(it.processed_at).toLocaleString() : '—'}</td>
                      <td className="px-3 py-2 text-sm font-mono break-all">{it.identity_id ?? '—'}</td>
                      <td className="px-3 py-2 text-sm break-all">{it.error_message ?? '—'}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination items identité */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button 
                  disabled={identityItemsPage <= 1}
                  onClick={() => setIdentityItemsPage(p => Math.max(1, p - 1))}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-3 h-3 mr-1" /> Précédent
                </button>
                <span className="text-xs text-gray-600">Page {identityItemsPage}{idItems?.pages ? ` / ${idItems.pages}` : ''}</span>
                <button 
                  disabled={!!idItems?.pages && identityItemsPage >= (idItems?.pages || 1)}
                  onClick={() => setIdentityItemsPage(p => p + 1)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                >
                  Suivant <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>Taille:</span>
                <select 
                  className="px-2 py-1 border rounded"
                  value={identityItemsSize}
                  onChange={(e) => { setIdentityItemsPage(1); setIdentityItemsSize(Number(e.target.value)); }}
                >
                  {[25,50,100,200].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Erreurs du batch (collapsible) */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg mt-4">
              <details className="p-4 bg-gray-50" open={false}>
                <summary className="cursor-pointer text-sm text-gray-700">Voir les erreurs du batch</summary>
                <div className="flex items-center gap-3 my-3">
                  <select 
                    className="px-2 py-1 border rounded text-xs"
                    value={identityErrorType ?? ''}
                    onChange={(e) => { setIdentityErrorsPage(1); setIdentityErrorType(e.target.value || undefined); }}
                  >
                    <option value="">Tous types</option>
                    <option value="VALIDATION">VALIDATION</option>
                    <option value="DUPLICATE">DUPLICATE</option>
                    <option value="DATABASE">DATABASE</option>
                  </select>
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <button 
                      disabled={identityErrorsPage <= 1}
                      onClick={() => setIdentityErrorsPage(p => Math.max(1, p - 1))}
                      className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-3 h-3 mr-1" /> Précédent
                    </button>
                    <span>Page {identityErrorsPage}{idErrors?.pages ? ` / ${idErrors.pages}` : ''}</span>
                    <button 
                      disabled={!!idErrors?.pages && identityErrorsPage >= (idErrors?.pages || 1)}
                      onClick={() => setIdentityErrorsPage(p => p + 1)}
                      className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                    >
                      Suivant <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                    <select 
                      className="px-2 py-1 border rounded"
                      value={identityErrorsSize}
                      onChange={(e) => { setIdentityErrorsPage(1); setIdentityErrorsSize(Number(e.target.value)); }}
                    >
                      {[25,50,100,200].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {Array.isArray(idErrors?.errors) && idErrors?.errors.length > 0 ? (
                    <table className="min-w-full border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs text-gray-600">Type</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600">Message</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-600">Contexte</th>
                        </tr>
                      </thead>
                      <tbody>
                        {idErrors.errors.map((e, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2 text-xs">{(e?.type ?? e?.error_type ?? '—').toString()}</td>
                            <td className="px-3 py-2 text-xs break-all">{(e?.message ?? e?.msg ?? '—').toString()}</td>
                            <td className="px-3 py-2 text-xs"><pre className="whitespace-pre-wrap break-all">{JSON.stringify(e, null, 2)}</pre></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-sm text-gray-600">Aucune erreur trouvée.</div>
                  )}
                </div>
              </details>
            </div>

            {/* Audit non supporté par l'API actuelle */}
          </div>
        )}
      </div>

      {/* Panneau de détails provisioning (items) */}
      {selectedProvBatchId && (
        <div className="mt-6 space-y-4">
          {/* Statistiques avec design amélioré */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { key: 'ENQUEUED', label: 'ENQUEUED', color: 'bg-gray-500', textColor: 'text-gray-600', description: 'En attente' },
              { key: 'KC_CREATED', label: 'KC_CREATED', color: 'bg-blue-500', textColor: 'text-blue-600', description: 'Créé dans KC' },
              { key: 'KC_UPDATED', label: 'KC_UPDATED', color: 'bg-blue-600', textColor: 'text-blue-700', description: 'Mis à jour KC' },
              { key: 'INVITE_SENT', label: 'INVITE_SENT', color: 'bg-indigo-500', textColor: 'text-indigo-600', description: 'Invitation envoyée' },
              { key: 'PENDING_ACTIVATION', label: 'PENDING', color: 'bg-yellow-500', textColor: 'text-yellow-600', description: 'Activation en attente' },
              { key: 'ACTIVATED', label: 'ACTIVATED', color: 'bg-green-500', textColor: 'text-green-600', description: 'Activé' },
              { key: 'EXPIRED', label: 'EXPIRED', color: 'bg-orange-500', textColor: 'text-orange-600', description: 'Expiré' },
              { key: 'DISABLED', label: 'DISABLED', color: 'bg-gray-600', textColor: 'text-gray-700', description: 'Désactivé' },
              { key: 'ERROR', label: 'ERROR', color: 'bg-red-500', textColor: 'text-red-600', description: 'Erreur' }
            ].map(({ key, label, color, textColor, description }) => (
              <div key={key} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
                  <div className={`w-2 h-2 ${color} rounded-full`}></div>
                </div>
                <div className={`text-2xl font-bold ${textColor} mt-1`}>{provCounters[key] ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">{description}</div>
              </div>
              ))}
            </div>

          {/* Filtres améliorés */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={provDomainFilter ?? ''} 
              onChange={(e) => setProvDomainFilter(e.target.value || undefined)}
            >
              <option value="">🌐 Tous domaines</option>
              <option value="student">👨‍🎓 Élève</option>
              <option value="parent">👨‍👩‍👧‍👦 Parent</option>
              <option value="teacher">👨‍🏫 Enseignant</option>
              <option value="admin_staff">👨‍💼 Admin Staff</option>
              </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={provStatusFilter ?? ''} 
              onChange={(e) => setProvStatusFilter(e.target.value || undefined)}
            >
              <option value="">📊 Tous statuts</option>
              <option value="ENQUEUED">⏳ ENQUEUED</option>
              <option value="KC_CREATED">🔵 KC_CREATED</option>
              <option value="KC_UPDATED">🔷 KC_UPDATED</option>
              <option value="INVITE_SENT">📧 INVITE_SENT</option>
              <option value="PENDING_ACTIVATION">⏸️ PENDING</option>
              <option value="ACTIVATED">✅ ACTIVATED</option>
              <option value="EXPIRED">⏰ EXPIRED</option>
              <option value="DISABLED">🚫 DISABLED</option>
              <option value="ERROR">❌ ERROR</option>
              </select>
            </div>

            {/* Barre de progression et légendes améliorées */}
            {provItemsArray.length > 0 && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Répartition des statuts</h5>
                  <div className="w-full h-4 rounded-lg bg-gray-200 overflow-hidden flex shadow-inner">
                  {(() => {
                    const total = provItemsArray.length;
                    const parts = [
                        { key: 'ENQUEUED', color: 'bg-gray-500' },
                        { key: 'KC_CREATED', color: 'bg-blue-500' },
                      { key: 'KC_UPDATED', color: 'bg-blue-600' },
                        { key: 'INVITE_SENT', color: 'bg-indigo-500' },
                        { key: 'PENDING_ACTIVATION', color: 'bg-yellow-500' },
                      { key: 'ACTIVATED', color: 'bg-green-500' },
                        { key: 'EXPIRED', color: 'bg-orange-500' },
                      { key: 'DISABLED', color: 'bg-gray-600' },
                      { key: 'ERROR', color: 'bg-red-500' },
                    ] as const;
                    return parts
                      .map(p => ({ ...p, count: provCounters[p.key] ?? 0 }))
                      .filter(p => p.count > 0)
                      .map(p => (
                          <div key={p.key} className={`${p.color} transition-all duration-300`} style={{ width: `${(p.count / total) * 100}%` }} />
                      ));
                  })()}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { key: 'ENQUEUED', label: 'ENQUEUED', dot: 'bg-gray-500', description: 'En attente' },
                    { key: 'KC_CREATED', label: 'KC_CREATED', dot: 'bg-blue-500', description: 'Créé KC' },
                    { key: 'KC_UPDATED', label: 'KC_UPDATED', dot: 'bg-blue-600', description: 'Mis à jour KC' },
                    { key: 'INVITE_SENT', label: 'INVITE_SENT', dot: 'bg-indigo-500', description: 'Invitation' },
                    { key: 'PENDING_ACTIVATION', label: 'PENDING', dot: 'bg-yellow-500', description: 'Activation' },
                    { key: 'ACTIVATED', label: 'ACTIVATED', dot: 'bg-green-500', description: 'Activé' },
                    { key: 'EXPIRED', label: 'EXPIRED', dot: 'bg-orange-500', description: 'Expiré' },
                    { key: 'DISABLED', label: 'DISABLED', dot: 'bg-gray-600', description: 'Désactivé' },
                    { key: 'ERROR', label: 'ERROR', dot: 'bg-red-500', description: 'Erreur' }
                  ].map(l => (
                    <div key={l.key} className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block w-3 h-3 rounded-full ${l.dot}`} />
                        <span className="text-xs font-medium text-gray-700">{l.label}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{provCounters[l.key] ?? 0}</div>
                      <div className="text-xs text-gray-500">{l.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Titre et tableau des items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Items du provisioning {selectedProvBatchId}
                </h4>
                <span className="text-sm text-gray-500">
                  {filteredProvItems.length} item(s) affiché(s)
                </span>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                {filteredProvItems.length === 0 && (
                  <div className="p-4 text-sm text-gray-600">Aucun item de provisioning pour ce batch pour le moment.</div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identity ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etablissement</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">External ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KC Username</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KC User ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière erreur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAJ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProvItems.map((it) => (
                      <tr key={it.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{it.identity_id ?? '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            it.domain === 'student' ? 'bg-blue-100 text-blue-800' :
                            it.domain === 'parent' ? 'bg-green-100 text-green-800' :
                            it.domain === 'teacher' ? 'bg-purple-100 text-purple-800' :
                            it.domain === 'admin_staff' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {it.domain === 'student' ? '👨‍🎓' : 
                             it.domain === 'parent' ? '👨‍👩‍👧‍👦' : 
                             it.domain === 'teacher' ? '👨‍🏫' : 
                             it.domain === 'admin_staff' ? '👨‍💼' : '👤'}
                            {it.domain ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{it.establishment_id ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{it.external_id ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{it.kc_username ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{it.kc_user_id ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{`${(it.firstname ?? '') || ''} ${(it.lastname ?? '') || ''}`.trim() || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{it.email ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{it.role_principal_code ?? '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            it.prov_status === 'ACTIVATED' ? 'bg-green-100 text-green-800' :
                            it.prov_status === 'ERROR' ? 'bg-red-100 text-red-800' :
                            it.prov_status === 'PENDING_ACTIVATION' ? 'bg-yellow-100 text-yellow-800' :
                            it.prov_status === 'EXPIRED' ? 'bg-orange-100 text-orange-800' :
                            it.prov_status === 'DISABLED' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {it.prov_status ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 break-all max-w-xs">
                          {it.last_error ? (
                            <span className="text-red-600 font-medium" title={it.last_error}>
                              {it.last_error.length > 50 ? `${it.last_error.substring(0, 50)}...` : it.last_error}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{it.created_at ? new Date(it.created_at).toLocaleString() : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{it.updated_at ? new Date(it.updated_at).toLocaleString() : '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          {!it.kc_username && (
                            <button
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                              onClick={() => handleGenerateUsername(it)}
                              disabled={genUsername.isPending}
                              title="Générer un username (copie automatique)"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              {genUsername.isPending ? '...' : 'Générer username'}
                            </button>
                          )}
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default OnboardingTracking;
