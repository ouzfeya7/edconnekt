import React, { useState, useMemo } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaSearch, FaFileImport } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';
import EtablissementFormModal from './EtablissementFormModal';
import ImportEstablishmentsModal from './ImportEstablishmentsModal';
import { useEstablishments } from '../../../hooks/useEstablishments';
import { useUpdateEstablishmentStatus } from '../../../hooks/useUpdateEstablishmentStatus';
import type { EtablissementOut, PlanEnum, StatusEnum } from '../../../api/establishment-service/api';
import toast from 'react-hot-toast';
import StatusConfirmModal from './StatusConfirmModal';
import { useNavigate } from 'react-router-dom';

const EtablissementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingEtablissement, setEditingEtablissement] = useState<EtablissementOut | null>(null);

  const { data: establishments, isLoading, isError } = useEstablishments({
    limit: 100,
    offset: 0,
    status: statusFilter !== 'all' ? (statusFilter as StatusEnum) : undefined,
  });
  const updateStatusMutation = useUpdateEstablishmentStatus();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{ id: string; name: string; current: StatusEnum } | null>(null);

  const filteredEtablissements = useMemo(() => {
    const list = establishments ?? [];
    return list
      .filter(etab => etab.nom.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(etab => planFilter === 'all' || etab.plan === (planFilter as PlanEnum))
      .filter(etab => statusFilter === 'all' || etab.status === (statusFilter as StatusEnum));
  }, [establishments, searchTerm, planFilter, statusFilter]);

  const handleToggleStatus = (id: string, current: StatusEnum, name: string) => {
    setStatusTarget({ id, name, current });
    setStatusModalOpen(true);
  };

  const handleStatusConfirm = async ({ reasons, details }: { reasons: string[]; details: string }) => {
    if (!statusTarget) return;
    const next: StatusEnum = statusTarget.current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const motif = [reasons.join(', '), details].filter(Boolean).join(' | ');
    try {
      await updateStatusMutation.mutateAsync({ establishmentId: statusTarget.id, status: next, motif });
      toast.success(next === 'ACTIVE' ? 'Établissement activé' : 'Établissement suspendu');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setStatusModalOpen(false);
      setStatusTarget(null);
    }
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
    console.info('Enregistrement via API à l\'étape suivante.');
  };

  const navigate = useNavigate();

  const handleRowClick = (etabId: string) => {
    navigate(`/etablissements/${etabId}`);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Établissements</h1>
          <p className="text-gray-600 mt-1">Recherchez, filtrez et gérez les établissements de la plateforme.</p>
        </div>
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
      </div>

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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEtablissements.map((etab) => (
                <tr 
                  key={etab.id} 
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" 
                  onClick={() => handleRowClick(etab.id)}
                >
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
                      color={etab.status === 'ACTIVE' ? 'text-green-800' : etab.status === 'SUSPENDED' ? 'text-yellow-800' : 'text-blue-800'}
                    />
                  </td>
                  <td className="p-4 text-gray-700">
                    <div className="text-sm">{etab.email}</div>
                    {etab.telephone && <div className="text-sm text-gray-500">{etab.telephone}</div>}
                  </td>
                  <td className="p-4 text-gray-700">{etab.created_at ? new Date(etab.created_at).toLocaleDateString('fr-SN') : '-'}</td>
                  <td className="p-4 text-center">
                    <div className="flex item-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleOpenModal(etab); 
                        }}
                      >
                        <FaEdit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleToggleStatus(etab.id, etab.status, etab.nom); 
                        }} 
                        className={etab.status === 'ACTIVE' ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}
                      >
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

      <EtablissementFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEtablissement} etablissementToEdit={editingEtablissement} />
      <ImportEstablishmentsModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <StatusConfirmModal
        isOpen={statusModalOpen}
        mode={statusTarget?.current === 'ACTIVE' ? 'suspend' : 'activate'}
        etablissementName={statusTarget?.name}
        onConfirm={handleStatusConfirm}
        onCancel={() => { setStatusModalOpen(false); setStatusTarget(null); }}
      />
    </div>
  );
};

export default EtablissementsPage;
