
import React, { useState, useEffect } from 'react';
import { Plan } from './mock-plans';
import { Button } from '../../../components/ui/button';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  planToEdit?: Plan | null;
}

const PlanFormModal: React.FC<PlanFormModalProps> = ({ isOpen, onClose, onSave, planToEdit }) => {
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    nom: '',
    description: '',
    tarif: 0,
    duree: 'mensuel',
    limitations: { utilisateursMax: 0, fonctionnalites: [''] },
    status: 'actif',
  });

  useEffect(() => {
    if (planToEdit) {
      setFormData(planToEdit);
    } else {
      setFormData({
        nom: '', description: '', tarif: 0, duree: 'mensuel',
        limitations: { utilisateursMax: 0, fonctionnalites: [''] }, status: 'actif'
      });
    }
  }, [planToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'utilisateursMax') {
      setFormData(prev => ({ ...prev, limitations: { ...prev.limitations, utilisateursMax: parseInt(value) || 0 }}));
    } else if (name === 'tarif') {
        setFormData(prev => ({ ...prev, tarif: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.limitations.fonctionnalites];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, limitations: { ...prev.limitations, fonctionnalites: newFeatures } }));
  };
  
  const addFeature = () => {
    setFormData(prev => ({ ...prev, limitations: { ...prev.limitations, fonctionnalites: [...prev.limitations.fonctionnalites, ''] } }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.limitations.fonctionnalites.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, limitations: { ...prev.limitations, fonctionnalites: newFeatures } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: planToEdit?.id || `plan-${Date.now()}` });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{planToEdit ? 'Modifier' : 'Créer'} un plan d'abonnement</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du plan</label>
              <input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="tarif" className="block text-sm font-medium text-gray-700">Tarif (FCFA)</label>
              <input type="number" name="tarif" id="tarif" value={formData.tarif} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="duree" className="block text-sm font-medium text-gray-700">Durée</label>
                <select name="duree" id="duree" value={formData.duree} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                </select>
             </div>
             <div>
                <label htmlFor="utilisateursMax" className="block text-sm font-medium text-gray-700">Nombre d'utilisateurs maximum</label>
                <input type="number" name="utilisateursMax" id="utilisateursMax" value={formData.limitations.utilisateursMax} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
             </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Fonctionnalités incluses</label>
              {formData.limitations.fonctionnalites.map((feature, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)} className="ml-2 text-red-500">
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2">
                <FaPlus className="mr-2" /> Ajouter une fonctionnalité
              </Button>
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

export default PlanFormModal;
