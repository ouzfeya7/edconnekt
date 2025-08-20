
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';
import type { EtablissementOut, PlanEnum, StatusEnum } from '../../../api/establishment-service/api';
import { useCreateEstablishment } from '../../../hooks/useCreateEstablishment';
import { useUpdateEstablishment } from '../../../hooks/useUpdateEstablishment';
import { useUpdateEstablishmentCoordinates } from '../../../hooks/useUpdateEstablishmentCoordinates';
import { useUpdateEstablishmentStatus } from '../../../hooks/useUpdateEstablishmentStatus';
import { useEstablishment } from '../../../hooks/useEstablishment';

interface EtablissementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (etablissement: any) => void;
  etablissementToEdit?: EtablissementOut | null;
}

const EtablissementFormModal: React.FC<EtablissementFormModalProps> = ({ isOpen, onClose, onSave, etablissementToEdit }) => {
  const [formData, setFormData] = useState<{
    nom: string;
    adresse: string;
    email: string;
    telephone: string;
    plan: PlanEnum;
    status: StatusEnum;
  }>({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    plan: 'BASIC',
    status: 'TRIAL',
  });

  const createMutation = useCreateEstablishment();
  const updateMutation = useUpdateEstablishment();
  const updateCoordsMutation = useUpdateEstablishmentCoordinates();
  const updateStatusMutation = useUpdateEstablishmentStatus();
  const { data: current, isLoading: isLoadingCurrent } = useEstablishment(etablissementToEdit?.id);

  useEffect(() => {
    if (current) {
      setFormData({
        nom: current.nom ?? '',
        adresse: (current as any).adresse ?? '',
        email: current.email ?? '',
        telephone: current.telephone ?? '',
        plan: current.plan,
        status: current.status,
      });
    } else if (etablissementToEdit) {
      setFormData({
        nom: etablissementToEdit.nom ?? '',
        adresse: (etablissementToEdit as any).adresse ?? '',
        email: etablissementToEdit.email ?? '',
        telephone: etablissementToEdit.telephone ?? '',
        plan: etablissementToEdit.plan,
        status: etablissementToEdit.status,
      });
    } else {
      setFormData({ nom: '', adresse: '', email: '', telephone: '', plan: 'BASIC', status: 'TRIAL' });
    }
  }, [current, etablissementToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (etablissementToEdit?.id) {
        const id = etablissementToEdit.id;
        const ops: Promise<any>[] = [];

        // Comparer et mettre à jour coordonnées (nom, adresse, email, telephone)
        const coordsPayload: Record<string, any> = {};
        if (formData.nom !== (etablissementToEdit.nom ?? '')) coordsPayload.nom = formData.nom;
        if (formData.adresse !== ((etablissementToEdit as any).adresse ?? '')) coordsPayload.adresse = formData.adresse;
        if (formData.email !== (etablissementToEdit.email ?? '')) coordsPayload.email = formData.email;
        if (formData.telephone !== (etablissementToEdit.telephone ?? '')) coordsPayload.telephone = formData.telephone;
        if (Object.keys(coordsPayload).length > 0) {
          ops.push(updateCoordsMutation.mutateAsync({ establishmentId: id, update: coordsPayload }));
        }

        // Mettre à jour le plan si changé
        if (formData.plan !== etablissementToEdit.plan) {
          ops.push(updateMutation.mutateAsync({ establishmentId: id, update: { plan: formData.plan } }));
        }

        // Mettre à jour le statut si changé
        if (formData.status !== etablissementToEdit.status) {
          ops.push(updateStatusMutation.mutateAsync({ establishmentId: id, status: formData.status }));
        }

        await Promise.all(ops);
        onSave(null);
        onClose();
      } else {
        await createMutation.mutateAsync({
          nom: formData.nom,
          adresse: formData.adresse,
          email: formData.email,
          telephone: formData.telephone,
          plan: formData.plan,
          status: formData.status,
        });
        onSave(null);
        onClose();
      }
    } catch (err) {
      console.error('Erreur soumission établissement:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{etablissementToEdit ? 'Modifier' : 'Ajouter'} un établissement</h2>
        {etablissementToEdit && (
          <p className="text-sm text-gray-500 mb-4">{isLoadingCurrent ? 'Chargement des données…' : ''}</p>
        )}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
            <input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" name="adresse" id="adresse" value={formData.adresse} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="text" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
              <select name="plan" id="plan" value={formData.plan} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTREPRISE">Enterprise</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="TRIAL">Essai</option>
                <option value="ACTIVE">Actif</option>
                <option value="SUSPENDED">Suspendu</option>
                <option value="CLOSED">Fermé</option>
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
