import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import toast from 'react-hot-toast';
import type { ClasseOut, ClasseUpdate } from '../../../api/classe-service/api';
import { useUpdateClasse } from '../../../hooks/useUpdateClasse';

interface EditClasseModalProps {
  isOpen: boolean;
  onClose: () => void;
  classe: ClasseOut | null;
}

const EditClasseModal: React.FC<EditClasseModalProps> = ({ isOpen, onClose, classe }) => {
  const [form, setForm] = useState<ClasseUpdate>({ nom: '', niveau: '', annee_scolaire: '', capacity: undefined, status: undefined });
  const updateMutation = useUpdateClasse();

  useEffect(() => {
    if (classe) {
      setForm({
        nom: classe.nom ?? '',
        niveau: classe.niveau ?? '',
        annee_scolaire: classe.annee_scolaire ?? '',
        capacity: classe.capacity ?? undefined,
        status: (classe as unknown as { status?: string })?.status ?? undefined,
      });
    }
  }, [classe]);

  if (!isOpen || !classe) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ classeId: classe.id, update: form });
      toast.success('Classe mise à jour avec succès');
      onClose();
    } catch {
      toast.error("Échec de la mise à jour de la classe");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Modifier la classe</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input name="nom" value={form.nom ?? ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Niveau</label>
            <select name="niveau" value={form.niveau ?? ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="">Sélectionner…</option>
              <option value="primaire">Primaire</option>
              <option value="college">Collège</option>
              <option value="lycee">Lycée</option>
              <option value="universite">Université</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Année scolaire</label>
            <input name="annee_scolaire" value={form.annee_scolaire ?? ''} onChange={handleChange} required placeholder="2024-2025" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacité (optionnel)</label>
            <input type="number" min={0} name="capacity" value={form.capacity ?? ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select name="status" value={(form.status as unknown as string) ?? ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="">—</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClasseModal;


