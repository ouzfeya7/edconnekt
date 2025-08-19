
import React, { useState, useEffect } from 'react';
import { ReferentielItem, Referentiel } from './mock-referentiels';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';

interface ReferentielFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ReferentielItem, 'id'>, id?: string) => void;
  itemToEdit?: ReferentielItem | null;
  activeReferentielId: string; // Pour savoir quel type d'item on édite
  referentiels: Referentiel[]; // Pour peupler les listes de parents
}

const ReferentielFormModal: React.FC<ReferentielFormModalProps> = ({ isOpen, onClose, onSave, itemToEdit, activeReferentielId, referentiels }) => {
  const [formData, setFormData] = useState({ code: '', libelle: '', domaineId: '', matiereId: '' });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        code: itemToEdit.code,
        libelle: itemToEdit.libelle,
        domaineId: itemToEdit.domaineId || '',
        matiereId: itemToEdit.matiereId || '',
      });
    } else {
      setFormData({ code: '', libelle: '', domaineId: '', matiereId: '' });
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { code, libelle, domaineId, matiereId } = formData;
    onSave({ code, libelle, domaineId, matiereId }, itemToEdit?.id);
    onClose();
  };

  if (!isOpen) return null;

  const domaines = referentiels.find(r => r.id === 'domaines_competences')?.items || [];
  const matieres = referentiels.find(r => r.id === 'matieres')?.items || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-8 relative shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{itemToEdit ? 'Modifier' : 'Ajouter'} une entrée</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeReferentielId === 'matieres' && (
            <div>
              <label htmlFor="domaineId" className="block text-sm font-medium text-gray-700">Domaine de Compétence</label>
              <select name="domaineId" id="domaineId" value={formData.domaineId} onChange={handleChange} required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Sélectionnez un domaine</option>
                {domaines.map(d => <option key={d.id} value={d.id}>{d.libelle}</option>)}
              </select>
            </div>
          )}
           {activeReferentielId === 'competences' && (
            <div>
              <label htmlFor="matiereId" className="block text-sm font-medium text-gray-700">Matière</label>
              <select name="matiereId" id="matiereId" value={formData.matiereId} onChange={handleChange} required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                 <option value="">Sélectionnez une matière</option>
                {matieres.map(m => <option key={m.id} value={m.id}>{m.libelle}</option>)}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required 
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="libelle" className="block text-sm font-medium text-gray-700">Libellé</label>
            <input type="text" name="libelle" id="libelle" value={formData.libelle} onChange={handleChange} required 
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div className="flex justify-end pt-6">
            <Button type="button" variant="secondary" onClick={onClose} className="mr-2">Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferentielFormModal;
