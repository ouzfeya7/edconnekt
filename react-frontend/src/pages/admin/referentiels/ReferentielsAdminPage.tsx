import React, { useState } from 'react';
import { referentielsData, Referentiel, ReferentielItem } from './mock-referentiels';
import { Button } from '../../../components/ui/button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ReferentielFormModal from './ReferentielFormModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';


const ReferentielsAdminPage: React.FC = () => {
  const [referentiels, setReferentiels] = useState<Referentiel[]>(referentielsData);
  const [activeTab, setActiveTab] = useState<string>(referentielsData[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ReferentielItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ReferentielItem | null>(null);

  const activeReferentiel = referentiels.find(r => r.id === activeTab);
  
  const getParentName = (item: ReferentielItem) => {
    let parentName: string | undefined;

    if (item.domaineId) {
      parentName = referentiels
        .find(r => r.id === 'domaines_competences')
        ?.items.find(d => d.id === item.domaineId)
        ?.libelle;
    } else if (item.matiereId) {
      parentName = referentiels
        .find(r => r.id === 'matieres')
        ?.items.find(m => m.id === item.matiereId)
        ?.libelle;
    }

    return parentName || 'N/A';
  };

  const handleOpenModal = (item: ReferentielItem | null = null) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToEdit(null);
  };

  const handleSaveItem = (itemData: Omit<ReferentielItem, 'id'>, id?: string) => {
    setReferentiels(prevRefs => prevRefs.map(ref => {
      if (ref.id === activeTab) {
        if (id) { // Edition
          return { ...ref, items: ref.items.map(it => it.id === id ? { ...it, ...itemData } : it) };
        } else { // Création
          const newItem = { ...itemData, id: `${ref.id}-${Date.now()}` };
          return { ...ref, items: [...ref.items, newItem] };
        }
      }
      return ref;
    }));
  };
  
  const handleOpenConfirm = (item: ReferentielItem) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setItemToDelete(null);
    setIsConfirmOpen(false);
  };
  
  const handleDelete = () => {
    if (!itemToDelete) return;
    setReferentiels(prevRefs => prevRefs.map(ref => {
      if (ref.id === activeTab) {
        return { ...ref, items: ref.items.filter(it => it.id !== itemToDelete.id) };
      }
      return ref;
    }));
    handleCloseConfirm();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Référentiels Globaux</h1>
          <p className="text-gray-600">Administrez les nomenclatures communes à toute la plateforme.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          Ajouter une entrée
        </Button>
      </div>

      <div className="flex border-b mb-6">
        {referentiels.map(ref => (
          <button
            key={ref.id}
            className={`py-2 px-4 text-sm font-medium ${activeTab === ref.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(ref.id)}
          >
            {ref.nom}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="p-4 w-1/4">Code</th>
              <th className="p-4">Libellé</th>
              {activeTab === 'matieres' && <th className="p-4">Domaine de Compétence</th>}
              {activeTab === 'competences' && <th className="p-4">Matière</th>}
              <th className="p-4 w-1/4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeReferentiel?.items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-700">{item.code}</td>
                <td className="p-4 font-medium text-gray-800">{item.libelle}</td>
                {activeTab === 'matieres' && <td className="p-4 text-gray-600">{getParentName(item)}</td>}
                {activeTab === 'competences' && <td className="p-4 text-gray-600">{getParentName(item)}</td>}
                <td className="p-4 text-center">
                   <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenModal(item)}>
                    <FaEdit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleOpenConfirm(item)}>
                    <FaTrash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <ReferentielFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        activeReferentielId={activeTab}
        referentiels={referentiels}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onCancel={handleCloseConfirm}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'entrée "${itemToDelete?.libelle}" ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default ReferentielsAdminPage;
