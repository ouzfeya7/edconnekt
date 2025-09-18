import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEstablishment } from '../../../hooks/useEstablishment';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../../hooks/useRooms';
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
import { useEstablishmentAudit, useEstablishmentAuditStatistics, useExportEstablishmentAudit } from '../../../hooks/useEstablishmentAudit';
import { useClasses } from '../../../hooks/useClasses';
import { FaChalkboard, FaDoorOpen, FaClock, FaListAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import EventsManager from '../../../components/events/EventsManager';

const EtablissementDetailPage: React.FC = () => {
  const { etabId } = useParams<{ etabId: string }>();
  const { data: etab, isLoading, isError } = useEstablishment(etabId);
  const [roomsLimit, setRoomsLimit] = useState(20);
  const [roomsSkip, setRoomsSkip] = useState(0);
  const [timeslotsLimit, setTimeslotsLimit] = useState(20);
  const [timeslotsSkip, setTimeslotsSkip] = useState(0);
  const { data: rooms } = useRooms({ establishmentId: etabId, skip: roomsSkip, limit: roomsLimit });
  const { data: timeslots } = useTimeslots({ establishmentId: etabId, skip: timeslotsSkip, limit: timeslotsLimit });
  const updateStatus = useUpdateEstablishmentStatus();
  const { data: auditStats } = useEstablishmentAuditStatistics(etabId);
  const [auditLimit, setAuditLimit] = useState(10);
  const [auditOffset, setAuditOffset] = useState(0);
  const { data: auditList } = useEstablishmentAudit({ establishmentId: etabId, limit: auditLimit, offset: auditOffset });
  const exportAudit = useExportEstablishmentAudit();
  const { data: classesResp } = useClasses({ etablissementId: etabId || '', limit: 1, skip: 0 });

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'rooms' | 'timeslots' | 'events' | 'subscription' | 'audit'>('overview');
  const [isCreateClasseOpen, setIsCreateClasseOpen] = useState(false);
  const [isImportClassesOpen, setIsImportClassesOpen] = useState(false);
  const [editEtabOpen, setEditEtabOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<{ name: string; capacity: number | '' }>({ name: '', capacity: '' });
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<{ id: string; name: string; capacity: number } | null>(null);
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
              <div><span className="text-gray-500">Adresse:</span> {etab.adresse}</div>
              <div><span className="text-gray-500">Email:</span> {etab.email}</div>
              <div><span className="text-gray-500">Téléphone:</span> {etab.telephone ?? '—'}</div>
              <div><span className="text-gray-500">Ville:</span> {etab.ville ?? '—'}</div>
              <div><span className="text-gray-500">Pays:</span> {etab.pays ?? '—'}</div>
              <div><span className="text-gray-500">Plan:</span> {etab.plan}</div>
              <div><span className="text-gray-500">Statut:</span> {etab.status}</div>
              <div><span className="text-gray-500">Créé le:</span> {etab.created_at ? new Date(etab.created_at).toLocaleString() : '—'}</div>
              <div><span className="text-gray-500">Mis à jour le:</span> {etab.updated_at ?? '—'}</div>
              <div><span className="text-gray-500">Supprimé le:</span> {etab.deleted_at ?? '—'}</div>
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
                  <div className="text-xl font-semibold text-gray-900">{rooms?.length ?? '—'}</div>
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

      {activeTab === 'rooms' && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCreateRoomOpen(true)}>
              <FaPlus className="mr-2" />
              Nouvelle salle
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Capacité</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(rooms ?? []).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.capacity}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setRoomToEdit({ id: r.id, name: r.name, capacity: r.capacity });
                            setEditRoomOpen(true);
                          }}
                        >Modifier</Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={async () => {
                            if (window.confirm(`Supprimer la salle « ${r.name} » ?`)) {
                              try {
                                await deleteRoom.mutateAsync(r.id);
                                toast.success('Salle supprimée');
                              } catch (err: unknown) {
                                const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                              }
                            }
                          }}
                          disabled={deleteRoom.isPending}
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
              Page: {Math.floor(roomsSkip / roomsLimit) + 1}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={roomsLimit}
                onChange={(e) => { const next = Number(e.target.value); setRoomsLimit(next); setRoomsSkip(0); }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <Button
                variant="secondary"
                onClick={() => setRoomsSkip((s) => Math.max(0, s - roomsLimit))}
                disabled={roomsSkip <= 0}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                onClick={() => setRoomsSkip((s) => s + roomsLimit)}
                disabled={(rooms?.length ?? 0) < roomsLimit}
              >
                Suivant
              </Button>
            </div>
          </div>
          {createRoomOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Créer une salle</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newRoom.name || newRoom.capacity === '' || Number(newRoom.capacity) <= 0) return;
                    try {
                      await createRoom.mutateAsync({ name: newRoom.name.trim(), capacity: Number(newRoom.capacity), establishment_id: etab.id });
                      toast.success('Salle créée');
                      setCreateRoomOpen(false);
                      setNewRoom({ name: '', capacity: '' });
                    } catch (err: unknown) {
                      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacité</label>
                    <input
                      type="number"
                      min={1}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom((p) => ({ ...p, capacity: e.target.value === '' ? '' : Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setCreateRoomOpen(false)}>Annuler</Button>
                    <Button type="submit" disabled={createRoom.isPending}>Créer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {editRoomOpen && roomToEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Modifier la salle</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const { id, name, capacity } = roomToEdit;
                    if (!name || !capacity || Number(capacity) <= 0) return;
                    try {
                      await updateRoom.mutateAsync({ roomId: id, update: { name: name.trim(), capacity: Number(capacity) } });
                      toast.success('Salle mise à jour');
                      setEditRoomOpen(false);
                      setRoomToEdit(null);
                    } catch (err: unknown) {
                      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={roomToEdit.name}
                      onChange={(e) => setRoomToEdit((p) => (p ? { ...p, name: e.target.value } : p))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacité</label>
                    <input
                      type="number"
                      min={1}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                      value={roomToEdit.capacity}
                      onChange={(e) => setRoomToEdit((p) => (p ? { ...p, capacity: e.target.value === '' ? 0 : Number(e.target.value) } : p))}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => { setEditRoomOpen(false); setRoomToEdit(null); }}>Annuler</Button>
                    <Button type="submit" disabled={updateRoom.isPending}>Enregistrer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
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
            <Button
              variant="secondary"
              onClick={() => exportAudit.mutate({ establishmentId: etab.id, format: 'csv' })}
              disabled={exportAudit.isPending}
            >
              {exportAudit.isPending ? 'Export…' : 'Exporter (CSV)'}
            </Button>
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
