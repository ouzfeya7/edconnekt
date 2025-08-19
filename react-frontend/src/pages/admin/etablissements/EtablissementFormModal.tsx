
import React, { useState, useEffect } from 'react';
import { Etablissement } from './mock-etablissements';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';

interface EtablissementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (etablissement: Etablissement) => void;
  etablissementToEdit?: Etablissement | null;
}

const EtablissementFormModal: React.FC<EtablissementFormModalProps> = ({ isOpen, onClose, onSave, etablissementToEdit }) => {
  const [formData, setFormData] = useState<Omit<Etablissement, 'id' | 'dateCreation'>>({
    name: '',
    address: '',
    contact: '',
    plan: 'Basic',
    status: 'actif',
  });

  useEffect(() => {
    if (etablissementToEdit) {
      setFormData(etablissementToEdit);
    } else {
      // Reset form for new entry
      setFormData({ name: '', address: '', contact: '', plan: 'Basic', status: 'actif' });
    }
  }, [etablissementToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEtablissement: Etablissement = {
      ...formData,
      id: etablissementToEdit?.id || `etab-${Date.now()}`,
      dateCreation: etablissementToEdit?.dateCreation || new Date().toISOString().split('T')[0],
    };
    onSave(newEtablissement);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{etablissementToEdit ? 'Modifier' : 'Ajouter'} un établissement</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact (email)</label>
            <input type="email" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
              <select name="plan" id="plan" value={formData.plan} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Basic</option>
                <option>Premium</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
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

export default EtablissementFormModal;
