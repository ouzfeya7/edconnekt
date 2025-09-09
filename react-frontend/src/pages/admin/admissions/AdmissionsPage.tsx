import { useEffect, useMemo, useState } from 'react';
import { useAdmissions } from '../../../hooks/useAdmissions';
import { useUpdateAdmissionStatus } from '../../../hooks/useAdmissionMutations';
import type { AdmissionListResponse, AdmissionResponse, AdmissionStatus } from '../../../api/admission-service/api';
import toast from 'react-hot-toast';
import { useAdmissionStats } from '../../../hooks/useAdmissionStats';

const STATUS_OPTIONS: AdmissionStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED', 'WAITLIST'];

export default function AdmissionsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<AdmissionStatus | null | undefined>(undefined);
  const [classRequested, setClassRequested] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');

  const params = useMemo(() => ({
    page,
    limit,
    status: status ?? undefined,
    classRequested: classRequested || undefined,
    studentName: studentName || undefined,
    parentName: parentName || undefined,
  }), [page, limit, status, classRequested, studentName, parentName]);

  const { data, isLoading, isError, error, refetch } = useAdmissions(params);
  const { data: stats } = useAdmissionStats();

  const [pendingStatus, setPendingStatus] = useState<Record<number, AdmissionStatus>>({});
  const updateStatusMutation = useUpdateAdmissionStatus();

  useEffect(() => {
    if (isError) {
      const msg = (error instanceof Error && error.message) ? error.message : 'Erreur de chargement';
      toast.error(msg);
    }
  }, [isError, error]);

  const onChangeStatusLocal = (id: number, newStatus: AdmissionStatus) => {
    setPendingStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  const onApplyStatus = async (row: AdmissionResponse) => {
    const newStatus = pendingStatus[row.id];
    if (!newStatus || newStatus === row.status) {
      toast('Aucun changement de statut');
      return;
    }
    try {
      await updateStatusMutation.mutateAsync({ status: newStatus });
      toast.success('Statut mis à jour');
      void refetch();
    } catch (e: unknown) {
      const msg = (e instanceof Error && e.message) ? e.message : 'Mise à jour échouée';
      toast.error(msg);
    }
  };

  const items = (data as AdmissionListResponse | undefined)?.items ?? [];
  const total = (data as AdmissionListResponse | undefined)?.total ?? 0;
  const pages = (data as AdmissionListResponse | undefined)?.pages ?? 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'WAITLIST': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Admissions</h1>
            <p className="text-gray-600">Gérez les demandes d'admission des élèves</p>
          </div>
        </div>
      </div>

      {/* Widget Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{typeof stats?.total === 'number' ? stats.total : '-'}</div>
            </div>
          </div>
        </div>
        {[
          { 
            status: 'PENDING', 
            label: 'En attente', 
            color: 'yellow', 
            icon: (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            status: 'ACCEPTED', 
            label: 'Accepté', 
            color: 'green', 
            icon: (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            status: 'REJECTED', 
            label: 'Rejeté', 
            color: 'red', 
            icon: (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            status: 'WAITLIST', 
            label: 'Liste d\'attente', 
            color: 'blue', 
            icon: (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            )
          }
        ].map(({ status, label, color, icon }) => {
          const count = (stats && typeof stats.by_status === 'object' && stats.by_status && status in stats.by_status)
            ? (stats.by_status as Record<string, number>)[status]
            : undefined;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 bg-${color}-100 rounded-lg flex-shrink-0`}>
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 truncate">{label}</div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{typeof count === 'number' ? count : '-'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={status ?? ''}
              onChange={(e) => setStatus((e.target.value || undefined) as AdmissionStatus | undefined)}
            >
              <option value="">Tous les statuts</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Ex: 6ème A"
              value={classRequested} 
              onChange={(e) => setClassRequested(e.target.value)} 
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom élève</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Rechercher un élève"
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom parent</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Rechercher un parent"
              value={parentName} 
              onChange={(e) => setParentName(e.target.value)} 
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              onClick={() => { setPage(1); void refetch(); }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Chargement des admissions...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">Aucune admission trouvée</div>
            <div className="text-gray-600">Aucune demande d'admission ne correspond à vos critères.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{row.id}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 font-medium">
                      <div className="truncate max-w-[120px] sm:max-w-none" title={row.student_name}>
                        {row.student_name}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 truncate max-w-[120px]" title={row.class_requested}>
                        {row.class_requested}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.class_requested}</td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="truncate max-w-[150px]" title={row.parent_name}>
                        {row.parent_name}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(row.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(row.status)}`}>
                        <span className="hidden sm:inline">{row.status}</span>
                        <span className="sm:hidden">{row.status.slice(0, 3)}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <select
                          className="w-full sm:w-auto border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={pendingStatus[row.id] ?? row.status}
                          onChange={(e) => onChangeStatusLocal(row.id, e.target.value as AdmissionStatus)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                          onClick={() => void onApplyStatus(row)}
                          disabled={updateStatusMutation.isPending}
                        >
                          {updateStatusMutation.isPending ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className="hidden sm:inline">Mettre à jour</span>
                          <span className="sm:hidden">MAJ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{items.length}</span> résultats sur <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Précédent
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> sur <span className="font-medium">{pages}</span>
            </span>
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant →
            </button>
            <select 
              className="border border-gray-300 rounded-md px-2 py-1 text-sm ml-2"
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n} par page</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}


