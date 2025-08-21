import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import type { ClasseEnseignantCreate } from '../../../api/classe-service/api';
import { useAssignEnseignant } from '../../../hooks/useAssignEnseignant';
import toast from 'react-hot-toast';

interface AssignTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  classeId: string;
}

const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({ isOpen, onClose, classeId }) => {
  const [enseignantKcId, setEnseignantKcId] = useState<string>('');
  const assignMutation = useAssignEnseignant();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ClasseEnseignantCreate = { classe_id: classeId, enseignant_kc_id: enseignantKcId };
    try {
      await assignMutation.mutateAsync(payload);
      toast.success('Enseignant assigné avec succès');
      onClose();
    } catch (e) {
      toast.error("Échec de l'assignation de l'enseignant");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Assigner un enseignant</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Keycloak de l'enseignant</label>
            <input value={enseignantKcId} onChange={(e) => setEnseignantKcId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit">Assigner</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeacherModal;


