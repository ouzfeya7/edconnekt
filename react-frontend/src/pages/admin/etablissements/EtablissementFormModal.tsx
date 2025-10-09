
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';
import { useModal } from '../../../hooks/useModal';
import type { EtablissementOut, PlanEnum, StatusEnum } from '../../../api/establishment-service/api';
import { useCreateEstablishment } from '../../../hooks/useCreateEstablishment';
import { useUpdateEstablishment } from '../../../hooks/useUpdateEstablishment';
import { useUpdateEstablishmentCoordinates } from '../../../hooks/useUpdateEstablishmentCoordinates';
import { useUpdateEstablishmentStatus } from '../../../hooks/useUpdateEstablishmentStatus';
import { useEstablishment } from '../../../hooks/useEstablishment';
import { useEstablishmentLastCode } from '../../../hooks/useEstablishmentLastCode';
import toast from 'react-hot-toast';

interface EtablissementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (etablissement: unknown) => void;
  etablissementToEdit?: EtablissementOut | null;
}

const EtablissementFormModal: React.FC<EtablissementFormModalProps> = ({ isOpen, onClose, onSave, etablissementToEdit }) => {
  const [formData, setFormData] = useState<{
    nom: string;
    adresse: string;
    email: string;
    telephone: string;
    code_etablissement: string;
    ville?: string;
    pays?: string;
    plan: PlanEnum;
    status: StatusEnum;
  }>({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    code_etablissement: '',
    ville: '',
    pays: '',
    plan: 'BASIC',
    status: 'TRIAL',
  });
  const [manualCode, setManualCode] = useState<boolean>(false);
  
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);

  const createMutation = useCreateEstablishment();
  const updateMutation = useUpdateEstablishment();
  const updateCoordsMutation = useUpdateEstablishmentCoordinates();
  const updateStatusMutation = useUpdateEstablishmentStatus();
  const { data: current, isLoading: isLoadingCurrent } = useEstablishment(etablissementToEdit?.id);
  const { data: lastCode } = useEstablishmentLastCode();

  const computeNextCode = (code?: string) => {
    if (!code || typeof code !== 'string') return '';
    const match = code.match(/^(.*?)(\d+)$/);
    if (!match) return code;
    const prefix = match[1];
    const num = match[2];
    const next = String(Number(num) + 1).padStart(num.length, '0');
    return `${prefix}${next}`;
  };

  useEffect(() => {
    if (current) {
      setFormData({
        nom: current.nom ?? '',
        adresse: current.adresse ?? '',
        email: current.email ?? '',
        telephone: current.telephone ?? '',
        code_etablissement: current.code_etablissement ?? '',
        ville: current.ville ?? '',
        pays: current.pays ?? '',
        plan: (current.plan ?? 'BASIC') as PlanEnum,
        status: (current.status ?? 'TRIAL') as StatusEnum,
      });
    } else if (etablissementToEdit) {
      setFormData({
        nom: etablissementToEdit.nom ?? '',
        adresse: etablissementToEdit.adresse ?? '',
        email: etablissementToEdit.email ?? '',
        telephone: etablissementToEdit.telephone ?? '',
        code_etablissement: etablissementToEdit.code_etablissement ?? '',
        ville: etablissementToEdit.ville ?? '',
        pays: etablissementToEdit.pays ?? '',
        plan: (etablissementToEdit.plan ?? 'BASIC') as PlanEnum,
        status: (etablissementToEdit.status ?? 'TRIAL') as StatusEnum,
      });
    } else {
      setFormData({ nom: '', adresse: '', email: '', telephone: '', code_etablissement: computeNextCode(lastCode) || 'ETB0001', ville: '', pays: '', plan: 'BASIC', status: 'TRIAL' });
      setManualCode(false);
    }
  }, [current, etablissementToEdit, isOpen, lastCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (etablissementToEdit?.id) {
        const id = etablissementToEdit.id;
        const ops: Promise<unknown>[] = [];

        // Comparer et mettre à jour coordonnées (adresse, email, telephone, ville, pays)
        const coordsPayload: Record<string, unknown> = {};
        if (formData.adresse !== (etablissementToEdit.adresse ?? '')) coordsPayload.adresse = formData.adresse;
        if (formData.email !== (etablissementToEdit.email ?? '')) coordsPayload.email = formData.email;
        if (formData.telephone !== (etablissementToEdit.telephone ?? '')) coordsPayload.telephone = formData.telephone;
        if ((formData.ville || '') !== (etablissementToEdit.ville ?? '')) coordsPayload.ville = formData.ville || null;
        if ((formData.pays || '') !== (etablissementToEdit.pays ?? '')) coordsPayload.pays = formData.pays || null;
        if (Object.keys(coordsPayload).length > 0) {
          ops.push(updateCoordsMutation.mutateAsync({ establishmentId: id, update: coordsPayload }));
        }

        // Mettre à jour les champs généraux via PATCH et statut via endpoint dédié
        const generalUpdate: Record<string, unknown> = {};
        if (formData.nom !== (etablissementToEdit.nom ?? '')) generalUpdate.nom = formData.nom;
        if ((formData.plan) !== etablissementToEdit.plan) generalUpdate.plan = formData.plan;
        // Ne pas envoyer code_etablissement sur Update (non supporté par EtablissementUpdate)
        // Ne pas envoyer subscription_start/subscription_end sur Update (non présents dans EtablissementUpdate)
        if (Object.keys(generalUpdate).length > 0) {
          ops.push(updateMutation.mutateAsync({ establishmentId: id, update: generalUpdate }));
        }
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
          code_etablissement: (formData.code_etablissement || '').toUpperCase(),
          ville: formData.ville || undefined,
          pays: formData.pays || undefined,
          plan: formData.plan,
          status: formData.status,
          // Ne pas envoyer subscription_start/end: non présents dans EtablissementCreate
        });
        onSave(null);
        onClose();
      }
    } catch (err) {
      const anyErr = err as { response?: { status?: number; data?: unknown } };
      const msg = (anyErr?.response?.data as { detail?: string } | undefined)?.detail || (anyErr?.response?.data as string | undefined) || (anyErr as { message?: string }).message || 'Erreur inconnue';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay séparé */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg w-full max-w-2xl p-6 md:p-8 shadow-xl max-h-[85vh] overflow-y-auto z-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{etablissementToEdit ? 'Modifier' : 'Ajouter'} un établissement</h2>
        {etablissementToEdit && (
          <p className="text-sm text-gray-500 mb-4">{isLoadingCurrent ? 'Chargement des données…' : ''}</p>
        )}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
            <input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="code_etablissement" className="block text-sm font-medium text-gray-700">Code établissement</label>
            <input
              type="text"
              name="code_etablissement"
              id="code_etablissement"
              value={formData.code_etablissement}
              onChange={handleChange}
              required
              disabled={!!etablissementToEdit?.id || !manualCode}
              className={`mt-1 block w-full border ${(!manualCode || etablissementToEdit?.id) ? 'bg-gray-100 border-gray-200' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {(!etablissementToEdit || !etablissementToEdit.id) && (
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 mt-1">Dernier code: {lastCode ?? '—'}{!manualCode ? ' • sera auto-généré' : ''}</div>
                <label className="text-xs text-gray-700 mt-1 inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={manualCode}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setManualCode(checked);
                      if (!checked) {
                        // repasser en auto: recalculer
                        setFormData(prev => ({ ...prev, code_etablissement: computeNextCode(lastCode) || 'ETB0001' }));
                      }
                    }}
                  />
                  Saisir manuellement
                </label>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" name="adresse" id="adresse" value={formData.adresse} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700">Ville</label>
              <input type="text" name="ville" id="ville" value={formData.ville} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="pays" className="block text-sm font-medium text-gray-700">Pays</label>
              <input type="text" name="pays" id="pays" value={formData.pays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input type="text" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
          </div>
          {/* Champs date_debut/date_fin retirés car non supportés par EtablissementCreate */}
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

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
};

export default EtablissementFormModal;
