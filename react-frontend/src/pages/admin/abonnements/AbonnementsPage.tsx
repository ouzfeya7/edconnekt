import React, { useState, useMemo } from 'react';
import { abonnementsData, Abonnement } from './mock-abonnements';
import { plansData } from '../plans/mock-plans';
import { FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';
import AbonnementFormModal from './AbonnementFormModal';
import { FaExclamationTriangle } from 'react-icons/fa';

const AbonnementsPage: React.FC = () => {
  const [abonnements, setAbonnements] = useState<Abonnement[]>(abonnementsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAbonnement, setEditingAbonnement] = useState<Abonnement | null>(null);

  const filteredAbonnements = useMemo(() => {
    return abonnements
      .filter(sub => sub.etablissementNom.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(sub => planFilter === 'all' || sub.planId === planFilter)
      .filter(sub => statusFilter === 'all' || sub.statut === statusFilter);
  }, [abonnements, searchTerm, planFilter, statusFilter]);
  
  const getDaysRemaining = (dateFin: string) => {
    const diff = new Date(dateFin).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleOpenModal = (abonnement: Abonnement | null = null) => {
    setEditingAbonnement(abonnement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAbonnement(null);
  };

  const handleSaveAbonnement = (abonnement: Abonnement) => {
    if (editingAbonnement) {
      setAbonnements(prev => prev.map(sub => sub.id === abonnement.id ? abonnement : sub));
    } else {
      setAbonnements(prev => [...prev, abonnement]);
    }
  };


  return (
    <div className="p-8 bg-white min-h-screen">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Abonnements Clients</h1>
          <p className="text-gray-600">Suivez et gérez les abonnements de chaque établissement.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          Ajouter un abonnement
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Rechercher un établissement..."
              className="w-full pl-10 p-2 border rounded-md"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="p-2 border rounded-md" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="all">Tous les plans</option>
            {plansData.map(plan => <option key={plan.id} value={plan.id}>{plan.nom}</option>)}
          </select>
          <select className="p-2 border rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="expiré">Expiré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-4">Établissement</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Période</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbonnements.map((abonnement) => {
                const daysRemaining = getDaysRemaining(abonnement.dateFin);
                const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

                return (
                  <tr key={abonnement.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{abonnement.etablissementNom}</td>
                    <td className="p-4 text-gray-700">{abonnement.planNom}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Badge
                          text={abonnement.statut}
                          bgColor={abonnement.statut === 'actif' ? 'bg-green-100' : abonnement.statut === 'expiré' ? 'bg-red-100' : 'bg-gray-100'}
                          color={abonnement.statut === 'actif' ? 'text-green-800' : abonnement.statut === 'expiré' ? 'text-red-800' : 'text-gray-800'}
                        />
                        {isExpiringSoon && (
                          <span title={`${daysRemaining} jours restants`} className="ml-2 text-yellow-500">
                            <FaExclamationTriangle />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(abonnement.dateDebut).toLocaleDateString('fr-SN')} - {new Date(abonnement.dateFin).toLocaleDateString('fr-SN')}
                    </td>
                    <td className="p-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(abonnement)}>
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AbonnementFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAbonnement}
        abonnementToEdit={editingAbonnement}
      />
    </div>
  );
};

export default AbonnementsPage;
