import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEstablishment } from '../../../hooks/useEstablishment';
import { useRooms, useCreateRoom } from '../../../hooks/useRooms';
import { useTimeslots, useCreateTimeslot } from '../../../hooks/useTimeslots';
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
import { useEvents } from '../../../hooks/useEvents';
import { useCreateEvent, usePublishEventById } from '../../../hooks/useEventMutations';
import type { EventCreateCategoryEnum } from '../../../api/event-service/api';

const EtablissementDetailPage: React.FC = () => {
  const { etabId } = useParams<{ etabId: string }>();
  const { data: etab, isLoading, isError } = useEstablishment(etabId);
  const { data: rooms } = useRooms();
  const { data: timeslots } = useTimeslots();
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
  const [createTimeslotOpen, setCreateTimeslotOpen] = useState(false);
  const [newTimeslot, setNewTimeslot] = useState<{ start_time: string; end_time: string }>({ start_time: '', end_time: '' });
  const createTimeslot = useCreateTimeslot();
  const { data: eventsList } = useEvents({ page: 1, size: 50 });
  const createEvent = useCreateEvent();
  const publishEventById = usePublishEventById();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'overview' || tab === 'classes' || tab === 'rooms' || tab === 'timeslots' || tab === 'subscription' || tab === 'audit') {
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
        <div className="border rounded p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Événements</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Total: {(() => {
                const asArr = eventsList as unknown[] | undefined;
                if (Array.isArray(asArr)) return asArr.length;
                const asObj = eventsList as { total?: number } | undefined;
                return asObj?.total ?? 0;
              })()}</span>
              <Button onClick={() => setIsCreateEventOpen(true)}>Créer</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Titre</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Catégorie</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Début</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Fin</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Statut</th>
                  <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray((eventsList as { items?: unknown } | undefined)?.items) && (eventsList as { items: unknown[] }).items.length > 0 ? (
                  (eventsList as { items: unknown[] }).items.map((evUnknown) => {
                    const ev = evUnknown as { id: string; title: string; category?: string | null; start_time?: string | null; end_time?: string | null; status?: string | null };
                    const id = ev?.id;
                    return (
                      <tr key={id} className="border-t">
                        <td className="px-3 py-2 text-sm text-gray-800">{ev.title}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{ev.category ?? '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{ev.start_time ? new Date(ev.start_time).toLocaleString() : '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{ev.end_time ? new Date(ev.end_time).toLocaleString() : '—'}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${ev.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : ev.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{ev.status}</span>
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {ev.status !== 'PUBLISHED' && id && (
                            <button
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                              onClick={async () => {
                                await publishEventById.mutateAsync(id);
                              }}
                            >Publier</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-t"><td className="px-3 py-6 text-center text-gray-500" colSpan={6}>Aucun événement</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {isCreateEventOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl p-4 relative shadow-xl max-h-[70vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Créer un événement</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(form);
                  const title = String(fd.get('title') || '').trim();
                  const category = String(fd.get('category') || '').trim() || 'Autre';
                  const start_time = String(fd.get('start_time') || '').trim();
                  const end_time = String(fd.get('end_time') || '').trim();
                  const description = String(fd.get('description') || '').trim() || undefined;
                  const location = String(fd.get('location') || '').trim() || undefined;
                  const capacityStr = String(fd.get('capacity') || '').trim();
                  const capacity = capacityStr !== '' && !Number.isNaN(Number(capacityStr)) ? Number(capacityStr) : undefined;
                  if (!title || !category || !start_time || !end_time) return;
                  await createEvent.mutateAsync({ title, category: category as EventCreateCategoryEnum, start_time, end_time, description, location, capacity });
                  setIsCreateEventOpen(false);
                  form.reset();
                }} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                    <input name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                    <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="Sortie">Sortie</option>
                      <option value="Cérémonie">Cérémonie</option>
                      <option value="Club">Club</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                      <input type="datetime-local" name="start_time" className="w-full border border-gray-300 rounded-lg px-3 py-2" step="1" />
                      <p className="text-xs text-gray-500 mt-1">Le fuseau sera normalisé automatiquement (UTC)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                      <input type="datetime-local" name="end_time" className="w-full border border-gray-300 rounded-lg px-3 py-2" step="1" />
                      <p className="text-xs text-gray-500 mt-1">Le fuseau sera normalisé automatiquement (UTC)</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                    <input name="location" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                    <input type="number" min={0} step={1} name="capacity" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setIsCreateEventOpen(false)}>Annuler</Button>
                    <Button type="submit" disabled={createEvent.isPending}>Créer</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
              <div><span className="text-gray-500">Date début:</span> {etab.date_debut ?? '—'}</div>
              <div><span className="text-gray-500">Date fin:</span> {etab.date_fin ?? '—'}</div>
              <div><span className="text-gray-500">Subscription start:</span> {etab.subscription_start ?? '—'}</div>
              <div><span className="text-gray-500">Subscription end:</span> {etab.subscription_end ?? '—'}</div>
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
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th><th className="px-3 py-2 text-left text-sm text-gray-600">Capacité</th></tr></thead>
              <tbody>
                {(rooms ?? []).map((r) => (<tr key={r.id} className="border-t"><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.capacity}</td></tr>))}
              </tbody>
            </table>
          </div>
          {createRoomOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Créer une salle</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newRoom.name || newRoom.capacity === '' || Number(newRoom.capacity) <= 0) return;
                    await createRoom.mutateAsync({ name: newRoom.name.trim(), capacity: Number(newRoom.capacity) });
                    setCreateRoomOpen(false);
                    setNewRoom({ name: '', capacity: '' });
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
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Début</th><th className="px-3 py-2 text-left text-sm text-gray-600">Fin</th></tr></thead>
              <tbody>
                {(timeslots ?? []).map((ts) => (<tr key={ts.id} className="border-t"><td className="px-3 py-2">{ts.start_time}</td><td className="px-3 py-2">{ts.end_time}</td></tr>))}
              </tbody>
            </table>
          </div>
          {createTimeslotOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Créer un créneau</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newTimeslot.start_time || !newTimeslot.end_time) return;
                    await createTimeslot.mutateAsync({ start_time: newTimeslot.start_time, end_time: newTimeslot.end_time });
                    setCreateTimeslotOpen(false);
                    setNewTimeslot({ start_time: '', end_time: '' });
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
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="border rounded p-4 text-sm text-gray-700 space-y-1">
          <div>Plan: {etab.plan}</div>
          <div>Statut: {etab.status}</div>
          <div>Période: {etab.date_debut ?? '—'} → {etab.date_fin ?? '—'}</div>
          <div>Subscription start: {etab.subscription_start ?? '—'}</div>
          <div>Subscription end: {etab.subscription_end ?? '—'}</div>
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
