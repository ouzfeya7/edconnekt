import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEstablishment } from '../../../hooks/useEstablishment';
// Retire l'ancien flux rooms (timetable-service) au profit d'establishment-service
import { useTimeslots, useCreateTimeslot, useUpdateTimeslot, useDeleteTimeslot } from '../../../hooks/useTimeslots';
import { useUpdateEstablishmentStatus } from '../../../hooks/useUpdateEstablishmentStatus';
import type { StatusEnum } from '../../../api/establishment-service/api';
import ClassesAdminPage from '../classes/ClassesAdminPage';
import StatusConfirmModal from './StatusConfirmModal';
import EtablissementFormModal from './EtablissementFormModal';
import CreateClasseModal from '../classes/CreateClasseModal';
import ImportClassesModal from '../classes/ImportClassesModal';
import { FaPlus, FaFileImport } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import { useEstablishmentAudit, useEstablishmentAuditStatistics, useExportEstablishmentAudit, useCreateManualAuditEntry, useEstablishmentAuditSummary } from '../../../hooks/useEstablishmentAudit';
import { useClasses } from '../../../hooks/useClasses';
import { FaChalkboard, FaDoorOpen, FaClock, FaListAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import EventsManager from '../../../components/events/EventsManager';
import { roomsFromEstablishment } from '../../../config/featureFlags';
import { useBuildings, useCreateBuilding, useUpdateBuilding, useDeleteBuilding } from '../../../hooks/useBuildings';
import { useRoomsByBuilding, useCreateRoomEstablishment, useUpdateRoomEstablishment, useDeleteRoomEstablishment } from '../../../hooks/useEstablishmentRooms';
import { useAllRoomsForEstablishment } from '../../../hooks/useAllEstablishmentRooms';

const EtablissementDetailPage: React.FC = () => {
  const { etabId } = useParams<{ etabId: string }>();
  const { data: etab, isLoading, isError } = useEstablishment(etabId);
  // Legacy rooms pagination (supprimé)
  const [timeslotsLimit, setTimeslotsLimit] = useState(20);
  const [timeslotsSkip, setTimeslotsSkip] = useState(0);
  // Legacy rooms source supprimée (migration)
  const { data: timeslots } = useTimeslots({ establishmentId: etabId, skip: timeslotsSkip, limit: timeslotsLimit });
  const updateStatus = useUpdateEstablishmentStatus();
  const { data: auditStats } = useEstablishmentAuditStatistics(etabId);
  const [auditLimit, setAuditLimit] = useState(10);
  const [auditOffset, setAuditOffset] = useState(0);
  const [auditOperation, setAuditOperation] = useState<string | undefined>(undefined);
  const [auditAuteurId, setAuditAuteurId] = useState<string>('');
  const [auditAuteurNom, setAuditAuteurNom] = useState<string>('');
  const [auditDateFrom, setAuditDateFrom] = useState<string>('');
  const [auditDateTo, setAuditDateTo] = useState<string>('');
  const [auditSortBy, setAuditSortBy] = useState<string>('date_operation');
  const [auditSortOrder, setAuditSortOrder] = useState<string>('desc');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const { data: auditList } = useEstablishmentAudit({
    establishmentId: etabId,
    operation: (auditOperation as 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'INSERT' | 'ACCESS_DENIED' | undefined) ?? null,
    auteurId: auditAuteurId ? auditAuteurId : null,
    auteurNom: auditAuteurNom ? auditAuteurNom : null,
    dateFrom: auditDateFrom ? new Date(auditDateFrom).toISOString() : null,
    dateTo: auditDateTo ? new Date(auditDateTo).toISOString() : null,
    limit: auditLimit,
    offset: auditOffset,
    sortBy: auditSortBy,
    sortOrder: auditSortOrder,
  });
  const createManualAudit = useCreateManualAuditEntry();
  const [manualOpen, setManualOpen] = useState(false);
  const [manualPayload, setManualPayload] = useState<{ operation: string; motif?: string; auteur_id?: string; auteur_nom?: string }>({ operation: '', motif: '', auteur_id: '', auteur_nom: '' });
  const exportAudit = useExportEstablishmentAudit();
  const { data: classesResp } = useClasses({ etablissementId: etabId || '', limit: 1, skip: 0 });
  const { data: allRooms } = useAllRoomsForEstablishment(etabId);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'rooms' | 'timeslots' | 'events' | 'subscription' | 'audit'>('overview');
  const [isCreateClasseOpen, setIsCreateClasseOpen] = useState(false);
  const [isImportClassesOpen, setIsImportClassesOpen] = useState(false);
  const [editEtabOpen, setEditEtabOpen] = useState(false);
  // Legacy rooms modals (supprimé)
  const [createTimeslotOpen, setCreateTimeslotOpen] = useState(false);
  const [newTimeslot, setNewTimeslot] = useState<{ start_time: string; end_time: string }>({ start_time: '', end_time: '' });
  const createTimeslot = useCreateTimeslot();
  const updateTimeslot = useUpdateTimeslot();
  const deleteTimeslot = useDeleteTimeslot();
  const [editTimeslotOpen, setEditTimeslotOpen] = useState(false);
  const [timeslotToEdit, setTimeslotToEdit] = useState<{ id: string; start_time: string; end_time: string } | null>(null);
  

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'overview' || tab === 'classes' || tab === 'rooms' || tab === 'timeslots' || tab === 'events' || tab === 'subscription' || tab === 'audit') {
      setActiveTab(tab as typeof activeTab);
    }
  }, [location.search]);

  const statusBadge = useMemo(() => {
    const s = etab?.status;
    if (!s) return null;
    const color = s === 'ACTIVE' ? 'bg-green-100 text-green-800' : s === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' : s === 'TRIAL' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    const label = s === 'ACTIVE' ? 'Actif' : s === 'SUSPENDED' ? 'Suspendu' : s === 'TRIAL' ? 'Essai' : 'Fermé';
    return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{label}</span>;
  }, [etab?.status]);


  if (isLoading) return <div className="p-8">Chargement…</div>;
  if (isError || !etab) return <div className="p-8 text-red-600">Établissement introuvable.</div>;

  const handleStatusConfirm = async ({ reasons, details }: { reasons: string[]; details: string }) => {
    const next: StatusEnum = etab.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const motif = [reasons.join(', '), details].filter(Boolean).join(' | ');
    await updateStatus.mutateAsync({ establishmentId: etab.id, status: next, motif });
    setStatusModalOpen(false);
  };

  return (
    <div className="p-8 bg-white min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{etab.nom}</h1>
          <div className="mt-2 flex items-center gap-2">
            {statusBadge}
            <span className="text-sm text-gray-500">Plan: {etab.plan}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setStatusModalOpen(true)} className={`px-4 py-2 rounded text-white ${etab.status === 'ACTIVE' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {etab.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
          </button>
          <button onClick={() => setEditEtabOpen(true)} className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700">Modifier</button>
          <Link to="/etablissements" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4 md:space-x-8">
          <button onClick={() => setActiveTab('overview')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Aperçu</button>
          <button onClick={() => setActiveTab('classes')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'classes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Classes</button>
          <button onClick={() => setActiveTab('rooms')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'rooms' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Salles</button>
          {roomsFromEstablishment && (
            <button onClick={() => setActiveTab('buildings' as 'overview' | 'classes' | 'rooms' | 'timeslots' | 'events' | 'subscription' | 'audit')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === ('buildings' as 'overview' | 'classes' | 'rooms' | 'timeslots' | 'events' | 'subscription' | 'audit') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Bâtiments</button>
          )}
          <button onClick={() => setActiveTab('timeslots')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeslots' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Créneaux</button>
          <button onClick={() => setActiveTab('events')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Événements</button>
          <button onClick={() => setActiveTab('subscription')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscription' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Abonnement</button>
          <button onClick={() => setActiveTab('audit')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Audit</button>
        </nav>
      {activeTab === 'events' && (
        <div className="border rounded p-4">
          <EventsManager etablissementId={etab.id} showHeaderTitle={false} />
        </div>
      )}
      </div>

      {/* Contextual actions for Classes */}
      {activeTab === 'classes' && (
        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsCreateClasseOpen(true)}>
            <FaPlus className="mr-2" />
            Nouvelle classe
          </Button>
          <Button variant="secondary" onClick={() => setIsImportClassesOpen(true)}>
            <FaFileImport className="mr-2" />
            Importer des classes
          </Button>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-3">Informations</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="text-gray-500">Nom:</span> {etab.nom}</div>
              <div><span className="text-gray-500">Code établissement:</span> {etab.code_etablissement ?? '—'}</div>
              <div><span className="text-gray-500">Adresse:</span> {etab.adresse}</div>
              <div><span className="text-gray-500">Email:</span> {etab.email}</div>
              <div><span className="text-gray-500">Téléphone:</span> {etab.telephone ?? '—'}</div>
              <div><span className="text-gray-500">Ville:</span> {etab.ville ?? '—'}</div>
              <div><span className="text-gray-500">Pays:</span> {etab.pays ?? '—'}</div>
              <div><span className="text-gray-500">Plan:</span> {etab.plan}</div>
              <div><span className="text-gray-500">Statut:</span> {etab.status}</div>
              <div><span className="text-gray-500">Créé le:</span> {etab.created_at ? new Date(etab.created_at).toLocaleString() : '—'}</div>
              <div><span className="text-gray-500">Mis à jour le:</span> {etab.updated_at ? new Date(etab.updated_at).toLocaleString() : '—'}</div>
              <div><span className="text-gray-500">Supprimé le:</span> {etab.deleted_at ? new Date(etab.deleted_at).toLocaleString() : '—'}</div>
              <div><span className="text-gray-500">Groupe:</span> {etab.etablissement_group ?? '—'}</div>
              <div><span className="text-gray-500">Etablissement ID:</span> {etab.etablissement_id ?? '—'}</div>
              <div><span className="text-gray-500">Date début abonnement:</span> {etab.subscription_start ?? '—'}</div>
              <div><span className="text-gray-500">Date fin abonnement:</span> {etab.subscription_end ?? '—'}</div>
            </div>
          </div>
          <div className="border rounded-lg p-4 md:p-5">
            <h3 className="font-semibold text-gray-800 mb-3">KPIs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaChalkboard />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Nombre de classes</div>
                  <div className="text-xl font-semibold text-gray-900">{classesResp?.meta?.total ?? classesResp?.data?.length ?? '—'}</div>
                </div>
              </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-lg shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <FaDoorOpen />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Nombre de salles</div>
              <div className="text-xl font-semibold text-gray-900">—</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-lg shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <FaClock />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Nombre de créneaux</div>
                  <div className="text-xl font-semibold text-gray-900">{timeslots?.length ?? '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <FaListAlt />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Opérations d’audit (mois)</div>
                  <div className="text-xl font-semibold text-gray-900">{auditStats?.operations_this_month ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="border rounded p-4">
          <ClassesAdminPage embedded forcedEtablissementId={etab.id} />
        </div>
      )}

      {/* Legacy salles (timetable-service) */}
      {/* Flux legacy salles supprimé (migration vers establishment-service) */}

      {/* Bâtiments & Salles (establishment-service) */}
      {roomsFromEstablishment && activeTab === ('buildings' as 'overview' | 'classes' | 'rooms' | 'timeslots' | 'events' | 'subscription' | 'audit') && (
        <EstablishmentBuildingsSection etabId={etab.id} />
      )}
      {roomsFromEstablishment && activeTab === 'rooms' && (
        <EstablishmentRoomsSection etabId={etab.id} />
      )}

      {activeTab === 'timeslots' && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCreateTimeslotOpen(true)}>
              <FaPlus className="mr-2" />
              Nouveau créneau
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Début</th><th className="px-3 py-2 text-left text-sm text-gray-600">Fin</th><th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th></tr></thead>
              <tbody>
                {(timeslots ?? []).map((ts) => (
                  <tr key={ts.id} className="border-t">
                    <td className="px-3 py-2">{ts.start_time}</td>
                    <td className="px-3 py-2">{ts.end_time}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setTimeslotToEdit({ id: ts.id, start_time: ts.start_time, end_time: ts.end_time });
                            setEditTimeslotOpen(true);
                          }}
                        >Modifier</Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={async () => {
                            if (window.confirm(`Supprimer le créneau ${ts.start_time} - ${ts.end_time} ?`)) {
                              try {
                                await deleteTimeslot.mutateAsync(ts.id);
                                toast.success('Créneau supprimé');
                              } catch (err: unknown) {
                                const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                              }
                            }
                          }}
                          disabled={deleteTimeslot.isPending}
                        >Supprimer</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-gray-600">
              Page: {Math.floor(timeslotsSkip / timeslotsLimit) + 1}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={timeslotsLimit}
                onChange={(e) => { const next = Number(e.target.value); setTimeslotsLimit(next); setTimeslotsSkip(0); }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <Button
                variant="secondary"
                onClick={() => setTimeslotsSkip((s) => Math.max(0, s - timeslotsLimit))}
                disabled={timeslotsSkip <= 0}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                onClick={() => setTimeslotsSkip((s) => s + timeslotsLimit)}
                disabled={(timeslots?.length ?? 0) < timeslotsLimit}
              >
                Suivant
              </Button>
            </div>
          </div>
          {createTimeslotOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Créer un créneau</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newTimeslot.start_time || !newTimeslot.end_time) return;
                    try {
                      await createTimeslot.mutateAsync({ start_time: newTimeslot.start_time, end_time: newTimeslot.end_time, establishment_id: etab.id });
                      toast.success('Créneau créé');
                      setCreateTimeslotOpen(false);
                      setNewTimeslot({ start_time: '', end_time: '' });
                    } catch (err: unknown) {
                      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Début</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={newTimeslot.start_time}
                      onChange={(e) => setNewTimeslot((p) => ({ ...p, start_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fin</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={newTimeslot.end_time}
                      onChange={(e) => setNewTimeslot((p) => ({ ...p, end_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setCreateTimeslotOpen(false)}>Annuler</Button>
                    <Button type="submit" disabled={createTimeslot.isPending}>Créer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {editTimeslotOpen && timeslotToEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Modifier le créneau</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const { id, start_time, end_time } = timeslotToEdit;
                    if (!start_time || !end_time) return;
                    try {
                      await updateTimeslot.mutateAsync({ timeslotId: id, update: { start_time, end_time } });
                      toast.success('Créneau mis à jour');
                      setEditTimeslotOpen(false);
                      setTimeslotToEdit(null);
                    } catch (err: unknown) {
                      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Début</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={timeslotToEdit.start_time}
                      onChange={(e) => setTimeslotToEdit((p) => (p ? { ...p, start_time: e.target.value } : p))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fin</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={timeslotToEdit.end_time}
                      onChange={(e) => setTimeslotToEdit((p) => (p ? { ...p, end_time: e.target.value } : p))}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => { setEditTimeslotOpen(false); setTimeslotToEdit(null); }}>Annuler</Button>
                    <Button type="submit" disabled={updateTimeslot.isPending}>Enregistrer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="border rounded p-4 text-sm text-gray-600 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Audit</h3>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={(exportFormat as 'csv' | 'json')}
                onChange={(e) => setExportFormat((e.target.value as 'csv' | 'json'))}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
              <Button
                variant="secondary"
                onClick={() => exportAudit.mutate({
                  establishmentId: etab.id,
                  format: exportFormat,
                  dateFrom: auditDateFrom ? new Date(auditDateFrom).toISOString() : undefined,
                  dateTo: auditDateTo ? new Date(auditDateTo).toISOString() : undefined,
                })}
                disabled={exportAudit.isPending}
              >
                {exportAudit.isPending ? 'Export…' : `Exporter (${exportFormat.toUpperCase()})`}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Opération</label>
              <select className="w-full border rounded px-2 py-1" value={auditOperation || ''} onChange={(e) => { setAuditOperation(e.target.value || undefined); setAuditOffset(0); }}>
                <option value="">Toutes</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="STATUS_CHANGE">STATUS_CHANGE</option>
                <option value="INSERT">INSERT</option>
                <option value="ACCESS_DENIED">ACCESS_DENIED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Auteur ID</label>
              <input className="w-full border rounded px-2 py-1" value={auditAuteurId} onChange={(e) => { setAuditAuteurId(e.target.value); setAuditOffset(0); }} placeholder="user-123" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Auteur Nom</label>
              <input className="w-full border rounded px-2 py-1" value={auditAuteurNom} onChange={(e) => { setAuditAuteurNom(e.target.value); setAuditOffset(0); }} placeholder="Dupont" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Du</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={auditDateFrom} onChange={(e) => { setAuditDateFrom(e.target.value); setAuditOffset(0); }} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Au</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={auditDateTo} onChange={(e) => { setAuditDateTo(e.target.value); setAuditOffset(0); }} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Trier par</label>
              <select className="w-full border rounded px-2 py-1" value={auditSortBy} onChange={(e) => { setAuditSortBy(e.target.value); setAuditOffset(0); }}>
                <option value="date_operation">date_operation</option>
                <option value="operation">operation</option>
                <option value="auteur_nom">auteur_nom</option>
                <option value="id">id</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ordre</label>
              <select className="w-full border rounded px-2 py-1" value={auditSortOrder} onChange={(e) => { setAuditSortOrder(e.target.value); setAuditOffset(0); }}>
                <option value="desc">desc</option>
                <option value="asc">asc</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={() => { setAuditOperation(undefined); setAuditAuteurId(''); setAuditAuteurNom(''); setAuditDateFrom(''); setAuditDateTo(''); setAuditSortBy('date_operation'); setAuditSortOrder('desc'); setAuditOffset(0); }}>Réinitialiser</Button>
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={() => setManualOpen(true)}>Nouvelle entrée manuelle</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Total opérations</div>
              <div className="text-lg font-semibold">{auditStats?.total_operations ?? '—'}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Dernière opération</div>
              <div className="text-lg font-semibold">{auditStats?.last_operation_date ? new Date(auditStats.last_operation_date).toLocaleString() : '—'}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Auteur le plus actif</div>
              <div className="text-lg font-semibold">{auditStats?.most_active_user ?? '—'}</div>
            </div>
          </div>
          {/* Résumé d'audit (N jours) */}
          <AuditSummaryPanel establishmentId={etab.id} />
          {manualOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Créer une entrée d'audit</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await createManualAudit.mutateAsync({ establishmentId: etab.id, body: {
                        operation: manualPayload.operation,
                        motif: manualPayload.motif ? manualPayload.motif : undefined,
                        auteur_id: manualPayload.auteur_id ? manualPayload.auteur_id : undefined,
                        auteur_nom: manualPayload.auteur_nom ? manualPayload.auteur_nom : undefined,
                      } });
                      toast.success('Entrée d\'audit créée');
                      setManualOpen(false);
                      setManualPayload({ operation: '', motif: '', auteur_id: '', auteur_nom: '' });
                    } catch (err: unknown) {
                      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opération *</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={manualPayload.operation} onChange={(e) => setManualPayload((p) => ({ ...p, operation: e.target.value }))} required>
                      <option value="">Sélectionner</option>
                      <option value="CUSTOM_OPERATION">CUSTOM_OPERATION</option>
                      <option value="CREATE">CREATE</option>
                      <option value="UPDATE">UPDATE</option>
                      <option value="DELETE">DELETE</option>
                      <option value="STATUS_CHANGE">STATUS_CHANGE</option>
                      <option value="INSERT">INSERT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motif</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={manualPayload.motif || ''} onChange={(e) => setManualPayload((p) => ({ ...p, motif: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Auteur ID</label>
                      <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={manualPayload.auteur_id || ''} onChange={(e) => setManualPayload((p) => ({ ...p, auteur_id: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Auteur Nom</label>
                      <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={manualPayload.auteur_nom || ''} onChange={(e) => setManualPayload((p) => ({ ...p, auteur_nom: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setManualOpen(false)}>Annuler</Button>
                    <Button type="submit" disabled={createManualAudit.isPending}>Créer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">#</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Date</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Opération</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Motif</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Auteur ID</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Auteur Nom</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Etablissement ID</th>
                </tr>
              </thead>
              <tbody>
                {(auditList?.items ?? []).map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">{a.id}</td>
                    <td className="px-3 py-2">{new Date(a.date_operation).toLocaleString()}</td>
                    <td className="px-3 py-2">{a.operation}</td>
                    <td className="px-3 py-2">{a.motif ?? '—'}</td>
                    <td className="px-3 py-2">{a.auteur_id ?? '—'}</td>
                    <td className="px-3 py-2">{a.auteur_nom ?? '—'}</td>
                    <td className="px-3 py-2">{a.etablissement_id}</td>
                  </tr>
                ))}
                {(!auditList || (auditList.items ?? []).length === 0) && (
                  <tr className="border-t">
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>Aucun audit pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-gray-600">
              Total: {auditList?.total ?? 0}
              <span className="ml-2">Page: {Math.floor(auditOffset / auditLimit) + 1}{typeof auditList?.total === 'number' && auditLimit > 0 ? ` / ${Math.max(1, Math.ceil(auditList.total / auditLimit))}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={auditLimit}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setAuditLimit(next);
                  setAuditOffset(0);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <Button
                variant="secondary"
                onClick={() => setAuditOffset((o) => Math.max(0, o - auditLimit))}
                disabled={auditOffset <= 0}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                onClick={() => setAuditOffset((o) => o + auditLimit)}
                disabled={!(auditList?.has_more ?? false)}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}

      <StatusConfirmModal
        isOpen={statusModalOpen}
        mode={etab.status === 'ACTIVE' ? 'suspend' : 'activate'}
        etablissementName={etab.nom}
        onConfirm={handleStatusConfirm}
        onCancel={() => setStatusModalOpen(false)}
      />

      {/* Modals for Classes */}
      <CreateClasseModal isOpen={isCreateClasseOpen} onClose={() => setIsCreateClasseOpen(false)} etablissementId={etab.id} />
      <ImportClassesModal isOpen={isImportClassesOpen} onClose={() => setIsImportClassesOpen(false)} etablissementId={etab.id} />
      <EtablissementFormModal isOpen={editEtabOpen} onClose={() => setEditEtabOpen(false)} onSave={() => {}} etablissementToEdit={etab} />
    </div>
  );
};

export default EtablissementDetailPage;

function AuditSummaryPanel({ establishmentId }: { establishmentId: string }) {
  const [days, setDays] = useState<number>(30);
  const summaryQuery = useEstablishmentAuditSummary(establishmentId, days);

  return (
    <div className="p-3 border rounded">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-800">Résumé d'audit</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Jours</label>
          <input type="number" min={1} max={365} className="border rounded px-2 py-1 text-sm w-20" value={days} onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 30)))} />
        </div>
      </div>
      {summaryQuery.isLoading && <div className="text-xs text-gray-500">Chargement…</div>}
      {summaryQuery.isError && <div className="text-xs text-red-600">Erreur de chargement</div>}
      {!summaryQuery.isLoading && !summaryQuery.isError && (
        <pre className="text-xs bg-gray-50 border rounded p-2 overflow-auto max-h-48">{JSON.stringify(summaryQuery.data ?? {}, null, 2)}</pre>
      )}
    </div>
  );
}

function EstablishmentBuildingsSection({ etabId }: { etabId: string }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [q, setQ] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDir, setOrderDir] = useState<string>('desc');
  const { data } = useBuildings({ establishmentId: etabId, page, size, q: q ? q : null, orderBy, orderDir });
  const createB = useCreateBuilding();
  const updateB = useUpdateBuilding();
  const deleteB = useDeleteBuilding();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<{ id: string; nom: string; code_batiment: string; description?: string; nombre_etages?: number | ''; active?: boolean } | null>(null);

  return (
    <div className="border rounded p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            placeholder="Recherche par nom..."
            className="border rounded px-2 py-1 text-sm"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select className="border rounded px-2 py-1 text-sm" value={orderBy} onChange={(e) => { setOrderBy(e.target.value); setPage(1); }}>
            <option value="created_at">created_at</option>
            <option value="nom">nom</option>
          </select>
          <select className="border rounded px-2 py-1 text-sm" value={orderDir} onChange={(e) => { setOrderDir(e.target.value); setPage(1); }}>
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </div>
        <Button onClick={() => setOpen(true)}>
          <FaPlus className="mr-2" /> Nouveau bâtiment
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Code</th><th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th><th className="px-3 py-2 text-left text-sm text-gray-600">Étages</th><th className="px-3 py-2 text-left text-sm text-gray-600">Actif</th><th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th></tr></thead>
          <tbody>
            {(data?.items ?? []).map(b => (
              <tr key={b.id} className="border-t">
                <td className="px-3 py-2">{b.code_batiment}</td>
                <td className="px-3 py-2">{b.nom}</td>
                <td className="px-3 py-2">{b.nombre_etages ?? '—'}</td>
                <td className="px-3 py-2">{b.active ? 'Oui' : 'Non'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setEdit({ id: b.id, nom: b.nom, code_batiment: b.code_batiment, description: b.description ?? '', nombre_etages: (b.nombre_etages ?? undefined) as number | undefined, active: !!b.active })}>Modifier</Button>
                    <Button variant="destructive" onClick={async () => { if (window.confirm('Supprimer ce bâtiment ?')) { await deleteB.mutateAsync({ establishmentId: etabId, buildingId: b.id }); } }}>Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-600">Page: {page}</div>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1 text-sm" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Précédent</Button>
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={!data?.has_next}>Suivant</Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Créer un bâtiment</h3>
            <BuildingForm onClose={() => setOpen(false)} onSubmit={async (v) => { await createB.mutateAsync({ establishmentId: etabId, payload: v as { code_batiment: string; nom: string; description?: string | null; nombre_etages?: number | null } }); setOpen(false); }} />
          </div>
        </div>
      )}
      {edit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Modifier le bâtiment</h3>
            <BuildingForm initial={edit} onClose={() => setEdit(null)} onSubmit={async (v) => { await updateB.mutateAsync({ establishmentId: etabId, buildingId: edit.id, update: v }); setEdit(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function BuildingForm({ initial, onClose, onSubmit }: { initial?: { id?: string; nom: string; code_batiment: string; description?: string; nombre_etages?: number | ''; active?: boolean }; onClose: () => void; onSubmit: (v: { code_batiment?: string; nom?: string; description?: string | null; nombre_etages?: number | null; active?: boolean | null }) => Promise<void> }) {
  const [form, setForm] = useState<{ code_batiment: string; nom: string; description?: string; nombre_etages?: number | ''; active: boolean }>(() => ({ code_batiment: initial?.code_batiment || '', nom: initial?.nom || '', description: initial?.description || '', nombre_etages: initial?.nombre_etages ?? '', active: initial?.active ?? true }));
  const isEdit = Boolean(initial?.id);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const base = { description: form.description || null, nombre_etages: form.nombre_etages === '' ? null : Number(form.nombre_etages), active: form.active }; const payload = isEdit ? { nom: form.nom.trim(), ...base } : { code_batiment: form.code_batiment.trim(), nom: form.nom.trim(), ...base }; await onSubmit(payload); onClose(); }} className="space-y-4">
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Code bâtiment</label>
          <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.code_batiment} onChange={(e) => setForm((p) => ({ ...p, code_batiment: e.target.value }))} required />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.nom} onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre d'étages</label>
        <input type="number" min={0} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.nombre_etages === '' ? '' : form.nombre_etages} onChange={(e) => setForm((p) => ({ ...p, nombre_etages: e.target.value === '' ? '' : Number(e.target.value) }))} />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
        Actif
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}

function EstablishmentRoomsSection({ etabId }: { etabId: string }) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
  const { data: buildings } = useBuildings({ establishmentId: etabId, page: 1, size: 100, q: null, orderBy: 'created_at', orderDir: 'desc' });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [q, setQ] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDir, setOrderDir] = useState<string>('desc');
  const { data } = useRoomsByBuilding({ establishmentId: etabId, buildingId: selectedBuildingId || undefined, page, size, q: q ? q : null, orderBy, orderDir });
  const createR = useCreateRoomEstablishment();
  const updateR = useUpdateRoomEstablishment();
  const deleteR = useDeleteRoomEstablishment();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<{ id: string; nom: string; code_salle: string; capacite?: number | ''; etage?: number | ''; type_salle?: RoomTypeEnum | ''; active?: boolean } | null>(null);

  useEffect(() => {
    if (!selectedBuildingId && (buildings?.items?.[0]?.id)) {
      setSelectedBuildingId(buildings.items[0].id);
    }
  }, [buildings?.items, selectedBuildingId]);

  return (
    <div className="border rounded p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm">Bâtiment</label>
          <select className="border rounded px-2 py-1" value={selectedBuildingId} onChange={(e) => { setSelectedBuildingId(e.target.value); setPage(1); }}>
            {(buildings?.items ?? []).map(b => (
              <option key={b.id} value={b.id}>{b.code_batiment} — {b.nom}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Recherche par nom..."
            className="border rounded px-2 py-1 text-sm"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select className="border rounded px-2 py-1 text-sm" value={orderBy} onChange={(e) => { setOrderBy(e.target.value); setPage(1); }}>
            <option value="created_at">created_at</option>
            <option value="nom">nom</option>
          </select>
          <select className="border rounded px-2 py-1 text-sm" value={orderDir} onChange={(e) => { setOrderDir(e.target.value); setPage(1); }}>
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
          <Button onClick={() => setOpen(true)}><FaPlus className="mr-2" /> Nouvelle salle</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Code</th><th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th><th className="px-3 py-2 text-left text-sm text-gray-600">Capacité</th><th className="px-3 py-2 text-left text-sm text-gray-600">Étage</th><th className="px-3 py-2 text-left text-sm text-gray-600">Active</th><th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th></tr></thead>
          <tbody>
            {(data?.items ?? []).map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.code_salle}</td>
                <td className="px-3 py-2">{r.nom}</td>
                <td className="px-3 py-2">{r.capacite ?? '—'}</td>
                <td className="px-3 py-2">{r.etage ?? '—'}</td>
                <td className="px-3 py-2">{r.active ? 'Oui' : 'Non'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setEdit({ id: r.id, nom: r.nom, code_salle: r.code_salle, capacite: (r.capacite ?? undefined) as number | undefined, etage: (r.etage ?? undefined) as number | undefined, type_salle: (r.type_salle as RoomTypeEnum | ''), active: !!r.active })}>Modifier</Button>
                    <Button variant="destructive" onClick={async () => { if (window.confirm('Supprimer cette salle ?')) { await deleteR.mutateAsync({ establishmentId: etabId, buildingId: selectedBuildingId, roomId: r.id }); } }}>Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-600">Page: {page}</div>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1 text-sm" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Précédent</Button>
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={!data?.has_next}>Suivant</Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Créer une salle</h3>
            <RoomForm onClose={() => setOpen(false)} onSubmit={async (v) => { await createR.mutateAsync({ establishmentId: etabId, buildingId: selectedBuildingId, payload: v as { code_salle: string; nom: string; capacite?: number | null; etage?: number | null; type_salle?: RoomTypeEnum | null } }); setOpen(false); }} />
          </div>
        </div>
      )}
      {edit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Modifier la salle</h3>
            <RoomForm initial={edit} onClose={() => setEdit(null)} onSubmit={async (v) => { await updateR.mutateAsync({ establishmentId: etabId, buildingId: selectedBuildingId, roomId: edit.id, update: v }); setEdit(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}

type RoomTypeEnum = 'CLASSROOM' | 'LAB' | 'OFFICE' | 'OTHER';
type RoomFormState = { code_salle: string; nom: string; capacite?: number | ''; etage?: number | ''; type_salle?: RoomTypeEnum | ''; active: boolean };
type RoomSubmit = { code_salle?: string; nom?: string; capacite?: number | null; etage?: number | null; type_salle?: RoomTypeEnum | null; active?: boolean | null };

function RoomForm({ initial, onClose, onSubmit }: { initial?: { id?: string; nom: string; code_salle: string; capacite?: number | ''; etage?: number | ''; type_salle?: RoomTypeEnum | ''; active?: boolean }; onClose: () => void; onSubmit: (v: RoomSubmit) => Promise<void> }) {
  const [form, setForm] = useState<RoomFormState>(() => ({ code_salle: initial?.code_salle || '', nom: initial?.nom || '', capacite: initial?.capacite ?? '', etage: initial?.etage ?? '', type_salle: (initial?.type_salle as RoomTypeEnum | '') ?? '', active: initial?.active ?? true }));
  const isEdit = Boolean(initial?.id);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const base: RoomSubmit = { capacite: form.capacite === '' ? null : Number(form.capacite), etage: form.etage === '' ? null : Number(form.etage), type_salle: form.type_salle ? form.type_salle : null, active: form.active }; const payload: RoomSubmit = isEdit ? { nom: form.nom.trim(), ...base } : { code_salle: form.code_salle.trim(), nom: form.nom.trim(), ...base }; await onSubmit(payload); onClose(); }} className="space-y-4">
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Code salle</label>
          <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.code_salle} onChange={(e) => setForm((p) => ({ ...p, code_salle: e.target.value }))} required />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.nom} onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacité</label>
          <input type="number" min={0} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.capacite === '' ? '' : form.capacite} onChange={(e) => setForm((p) => ({ ...p, capacite: e.target.value === '' ? '' : Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Étage</label>
          <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.etage === '' ? '' : form.etage} onChange={(e) => setForm((p) => ({ ...p, etage: e.target.value === '' ? '' : Number(e.target.value) }))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type de salle</label>
        <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" value={form.type_salle || ''} onChange={(e) => setForm((p) => ({ ...p, type_salle: (e.target.value || '') as RoomTypeEnum | '' }))}>
          <option value="">—</option>
          <option value="CLASSROOM">Salle de cours</option>
          <option value="LAB">Laboratoire</option>
          <option value="OFFICE">Bureau</option>
          <option value="OTHER">Autre</option>
        </select>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
        Actif
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
