
import React, { useState, useMemo } from 'react';
import { etablissementsData, Etablissement } from './mock-etablissements';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaSearch } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';
import EtablissementFormModal from './EtablissementFormModal';

const EtablissementsPage: React.FC = () => {
  const [etablissements, setEtablissements] = useState<Etablissement[]>(etablissementsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtablissement, setEditingEtablissement] = useState<Etablissement | null>(null);


  const filteredEtablissements = useMemo(() => {
    return etablissements
      .filter(etab => etab.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(etab => planFilter === 'all' || etab.plan === planFilter)
      .filter(etab => statusFilter === 'all' || etab.status === statusFilter);
  }, [etablissements, searchTerm, planFilter, statusFilter]);

  const handleToggleStatus = (id: string) => {
    setEtablissements(prev =>
      prev.map(etab =>
        etab.id === id ? { ...etab, status: etab.status === 'actif' ? 'inactif' : 'actif' } : etab
      )
    );
  };

  const handleOpenModal = (etablissement: Etablissement | null = null) => {
    setEditingEtablissement(etablissement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtablissement(null);
  };

  const handleSaveEtablissement = (etablissement: Etablissement) => {
    if (editingEtablissement) {
      // Update
      setEtablissements(prev => prev.map(etab => etab.id === etablissement.id ? etablissement : etab));
    } else {
      // Create
      setEtablissements(prev => [...prev, etablissement]);
    }
  };


  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Établissements</h1>
          <p className="text-gray-600 mt-1">Recherchez, filtrez et gérez les établissements de la plateforme.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          Ajouter un établissement
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select 
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
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
                  <td className="p-4 flex items-center">
                    {etab.logoUrl && <img src={etab.logoUrl} alt={`Logo ${etab.name}`} className="w-10 h-10 rounded-full mr-4" />}
                    <div>
                      <div className="font-medium text-gray-900">{etab.name}</div>
                      <div className="text-sm text-gray-500">{etab.address}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      text={etab.plan}
                      bgColor={etab.plan === 'Premium' ? 'bg-blue-100' : etab.plan === 'Enterprise' ? 'bg-red-100' : 'bg-gray-100'}
                      color={etab.plan === 'Premium' ? 'text-blue-800' : etab.plan === 'Enterprise' ? 'text-red-800' : 'text-gray-800'}
                    />
                  </td>
                  <td className="p-4">
                     <Badge 
                      text={etab.status}
                      bgColor={etab.status === 'actif' ? 'bg-green-100' : 'bg-gray-100'}
                      color={etab.status === 'actif' ? 'text-green-800' : 'text-gray-800'}
                    />
                  </td>
                  <td className="p-4 text-gray-700">{etab.contact}</td>
                  <td className="p-4 text-gray-700">{new Date(etab.dateCreation).toLocaleDateString('fr-SN')}</td>
                  <td className="p-4 text-center">
                    <div className="flex item-center justify-center">
                      <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenModal(etab)}>
                        <FaEdit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(etab.id)} className={etab.status === 'actif' ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}>
                        {etab.status === 'actif' ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       <EtablissementFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEtablissement}
        etablissementToEdit={editingEtablissement}
      />
    </div>
  );
};

export default EtablissementsPage;
