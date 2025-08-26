
import React, { useState, useMemo } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaSearch, FaFileImport } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';
import EtablissementFormModal from './EtablissementFormModal';
import ImportEstablishmentsModal from './ImportEstablishmentsModal';
import { useEstablishments } from '../../../hooks/useEstablishments';
import { useUpdateEstablishmentStatus } from '../../../hooks/useUpdateEstablishmentStatus';
import type { EtablissementOut, PlanEnum, StatusEnum } from '../../../api/establishment-service/api';
import ClassesAdminPage from '../classes/ClassesAdminPage';
import CreateClasseModal from '../classes/CreateClasseModal';
import ImportClassesModal from '../classes/ImportClassesModal';
import { useRooms, useCreateRoom } from '../../../hooks/useRooms';
import { useTimeslots, useCreateTimeslot } from '../../../hooks/useTimeslots';
import toast from 'react-hot-toast';

const EtablissementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingEtablissement, setEditingEtablissement] = useState<EtablissementOut | null>(null);
  const [activeTab, setActiveTab] = useState<'etabs' | 'classes' | 'rooms' | 'timeslots'>('etabs');
  const [isCreateClasseOpen, setIsCreateClasseOpen] = useState(false);
  const [isImportClassesOpen, setIsImportClassesOpen] = useState(false);
  const [selectedEtablissementIdForClasses, setSelectedEtablissementIdForClasses] = useState<string>('');

  const { data: establishments, isLoading, isError } = useEstablishments({
    limit: 100,
    offset: 0,
    status: statusFilter !== 'all' ? (statusFilter as StatusEnum) : undefined,
  });
  const updateStatusMutation = useUpdateEstablishmentStatus();

  const { data: rooms, isLoading: roomsLoading, isError: roomsError } = useRooms();
  const createRoom = useCreateRoom();
  const { data: timeslots, isLoading: tsLoading, isError: tsError } = useTimeslots();
  const createTimeslot = useCreateTimeslot();

  const filteredEtablissements = useMemo(() => {
    const list = establishments ?? [];
    return list
      .filter(etab => etab.nom.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(etab => planFilter === 'all' || etab.plan === (planFilter as PlanEnum))
      .filter(etab => statusFilter === 'all' || etab.status === (statusFilter as StatusEnum));
  }, [establishments, searchTerm, planFilter, statusFilter]);

  const handleToggleStatus = (id: string, current: StatusEnum) => {
    const next: StatusEnum = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateStatusMutation.mutate({ establishmentId: id, status: next });
  };

  const handleOpenModal = (etablissement: EtablissementOut | null = null) => {
    setEditingEtablissement(etablissement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtablissement(null);
  };

  const handleSaveEtablissement = () => {
    console.info('Enregistrement via API à l’étape suivante.');
  };

  const pageTitle = activeTab === 'etabs'
    ? 'Gestion des Établissements'
    : activeTab === 'classes'
      ? 'Gestion des Classes'
      : activeTab === 'rooms'
        ? 'Gestion des Salles'
        : 'Gestion des Créneaux';

  const pageSubtitle = activeTab === 'etabs'
    ? 'Recherchez, filtrez et gérez les établissements de la plateforme.'
    : activeTab === 'classes'
      ? 'Lister et gérer les classes par établissement.'
      : activeTab === 'rooms'
        ? 'Gérez les salles de vos établissements.'
        : 'Gérez les créneaux horaires.';

  const renderHeaderActions = () => {
    if (activeTab === 'etabs') {
      return (
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()}>
            <FaPlus className="mr-2" />
            Ajouter un établissement
          </Button>
          <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
            <FaFileImport className="mr-2" />
            Importer des établissements
          </Button>
        </div>
      );
    }
    if (activeTab === 'classes') {
      return (
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateClasseOpen(true)} disabled={!selectedEtablissementIdForClasses}>
            <FaPlus className="mr-2" />
            Nouvelle classe
          </Button>
          <Button variant="secondary" onClick={() => setIsImportClassesOpen(true)} disabled={!selectedEtablissementIdForClasses}>
            <FaFileImport className="mr-2" />
            Importer des classes
          </Button>
        </div>
      );
    }
    // Salles/Créneaux: actions dans le contenu
    return null;
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
          <p className="text-gray-600 mt-1">{pageSubtitle}</p>
        </div>
        {renderHeaderActions()}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-4 md:space-x-8">
            <button onClick={() => setActiveTab('etabs')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'etabs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Établissements</button>
            <button onClick={() => setActiveTab('classes')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'classes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Classes</button>
            <button onClick={() => setActiveTab('rooms')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'rooms' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Salles</button>
            <button onClick={() => setActiveTab('timeslots')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeslots' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Créneaux</button>
          </nav>
        </div>
      </div>

      {activeTab === 'etabs' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {isLoading && <div className="text-gray-600">Chargement des établissements…</div>}
          {isError && <div className="text-red-600">Erreur lors du chargement des établissements.</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" 
              value={planFilter} 
              onChange={e => setPlanFilter(e.target.value)}
            >
              <option value="all">Tous les plans</option>
              <option value="BASIC">Basic</option>
              <option value="PRO">Pro</option>
              <option value="ENTREPRISE">Enterprise</option>
            </select>
            <select 
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="TRIAL">Essai</option>
              <option value="ACTIVE">Actif</option>
              <option value="SUSPENDED">Suspendu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date de Création</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEtablissements.map((etab) => (
                  <tr key={etab.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{etab.nom}</div>
                        <div className="text-sm text-gray-500">{etab.adresse}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        text={etab.plan === 'BASIC' ? 'Basic' : etab.plan === 'PRO' ? 'Pro' : 'Enterprise'}
                        bgColor={etab.plan === 'PRO' ? 'bg-blue-100' : etab.plan === 'ENTREPRISE' ? 'bg-red-100' : 'bg-gray-100'}
                        color={etab.plan === 'PRO' ? 'text-blue-800' : etab.plan === 'ENTREPRISE' ? 'text-red-800' : 'text-gray-800'}
                      />
                    </td>
                    <td className="p-4">
                      <Badge 
                        text={etab.status === 'ACTIVE' ? 'Actif' : etab.status === 'SUSPENDED' ? 'Suspendu' : etab.status === 'TRIAL' ? 'Essai' : 'Fermé'}
                        bgColor={etab.status === 'ACTIVE' ? 'bg-green-100' : etab.status === 'SUSPENDED' ? 'bg-yellow-100' : etab.status === 'TRIAL' ? 'bg-blue-100' : 'bg-gray-100'}
                        color={etab.status === 'ACTIVE' ? 'text-green-800' : etab.status === 'SUSPENDED' ? 'text-yellow-800' : etab.status === 'TRIAL' ? 'text-blue-800' : 'text-gray-800'}
                      />
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="text-sm">{etab.email}</div>
                      {etab.telephone && <div className="text-sm text-gray-500">{etab.telephone}</div>}
                    </td>
                    <td className="p-4 text-gray-700">{etab.created_at ? new Date(etab.created_at).toLocaleDateString('fr-SN') : '-'}</td>
                    <td className="p-4 text-center">
                      <div className="flex item-center justify-center">
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenModal(etab)}>
                          <FaEdit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(etab.id, etab.status)} className={etab.status === 'ACTIVE' ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}>
                          {etab.status === 'ACTIVE' ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ClassesAdminPage embedded onSelectedEtablissementChange={setSelectedEtablissementIdForClasses} />
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const name = String(data.get('name') || '').trim();
              const capacityStr = String(data.get('capacity') || '').trim();
              const capacity = Number(capacityStr);
              if (!name || !capacityStr || Number.isNaN(capacity)) {
                toast.error('Veuillez remplir les champs obligatoires');
                return;
              }
              try {
                await createRoom.mutateAsync({ name, capacity });
                toast.success('Salle créée');
                form.reset();
              } catch (err: unknown) {
                const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label><input name="name" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Capacité *</label><input name="capacity" type="number" min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-1 flex items-end"><button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={createRoom.isPending}>{createRoom.isPending ? 'Enregistrement…' : 'Créer la salle'}</button></div>
          </form>

          {roomsLoading && <div className="text-gray-500">Chargement…</div>}
          {roomsError && <div className="text-red-600">Erreur lors du chargement des salles</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-sm text-gray-600">Nom</th><th className="px-4 py-2 text-left text-sm text-gray-600">Capacité</th><th className="px-4 py-2 text-left text-sm text-gray-600">ID</th></tr></thead>
              <tbody>
                {(rooms ?? []).map((r) => (
                  <tr key={r.id} className="border-t"><td className="px-4 py-2">{r.name}</td><td className="px-4 py-2">{r.capacity}</td><td className="px-4 py-2 text-gray-500 text-xs">{r.id}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timeslots' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const start_time = String(data.get('start_time') || '').trim();
              const end_time = String(data.get('end_time') || '').trim();
              if (!start_time || !end_time) {
                toast.error('Veuillez remplir les champs obligatoires');
                return;
              }
              try {
                await createTimeslot.mutateAsync({ start_time, end_time });
                toast.success('Créneau créé');
                form.reset();
              } catch (err: unknown) {
                const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Début *</label><input name="start_time" type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label><input name="end_time" type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-1 flex items-end"><button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={createTimeslot.isPending}>{createTimeslot.isPending ? 'Enregistrement…' : 'Créer le créneau'}</button></div>
          </form>

          {tsLoading && <div className="text-gray-500">Chargement…</div>}
          {tsError && <div className="text-red-600">Erreur lors du chargement des créneaux</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-sm text-gray-600">ID</th><th className="px-4 py-2 text-left text-sm text-gray-600">Début</th><th className="px-4 py-2 text-left text-sm text-gray-600">Fin</th></tr></thead>
              <tbody>
                {(timeslots ?? []).map((ts) => (
                  <tr key={ts.id} className="border-t"><td className="px-4 py-2 text-gray-500 text-xs">{ts.id}</td><td className="px-4 py-2">{ts.start_time}</td><td className="px-4 py-2">{ts.end_time}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EtablissementFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEtablissement}
        etablissementToEdit={editingEtablissement}
      />
      <ImportEstablishmentsModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <CreateClasseModal isOpen={isCreateClasseOpen} onClose={() => setIsCreateClasseOpen(false)} etablissementId={selectedEtablissementIdForClasses} />
      <ImportClassesModal isOpen={isImportClassesOpen} onClose={() => setIsImportClassesOpen(false)} etablissementId={selectedEtablissementIdForClasses} />
    </div>
  );
};

export default EtablissementsPage;