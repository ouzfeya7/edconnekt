import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';
import type { ClasseCreate } from '../../../api/classe-service/api';
import { useCreateClasse } from '../../../hooks/useCreateClasse';

interface CreateClasseModalProps {
  isOpen: boolean;
  onClose: () => void;
  etablissementId: string;
}

const CreateClasseModal: React.FC<CreateClasseModalProps> = ({ isOpen, onClose, etablissementId }) => {
  const [formData, setFormData] = useState<ClasseCreate>({
    code: '',
    nom: '',
    niveau: '',
    annee_scolaire: '',
    etablissement_id: '' as unknown as string,
    capacity: 0,
  });

  const createMutation = useCreateClasse();

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, etablissement_id: etablissementId }));
    }
  }, [isOpen, etablissementId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      onClose();
    } catch (err) {
      console.error('Erreur création classe:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Créer une classe</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input type="text" id="code" name="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau</label>
            <input type="text" id="niveau" name="niveau" value={formData.niveau} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="annee_scolaire" className="block text-sm font-medium text-gray-700">Année scolaire</label>
            <input type="text" id="annee_scolaire" name="annee_scolaire" placeholder="2024-2025" value={formData.annee_scolaire} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacité (optionnel)</label>
            <input type="number" min={0} id="capacity" name="capacity" value={formData.capacity ?? 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div className="flex justify-end pt-6">
            <Button type="button" variant="secondary" onClick={onClose} className="mr-2">Annuler</Button>
            <Button type="submit" disabled={!etablissementId || createMutation.isPending}>Créer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClasseModal;


