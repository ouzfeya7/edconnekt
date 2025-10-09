
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Abonnement } from './mock-abonnements';
import { etablissementsData } from '../etablissements/mock-etablissements';
import { plansData } from '../plans/mock-plans';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';
import { useModal } from '../../../hooks/useModal';

interface AbonnementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (abonnement: Abonnement) => void;
  abonnementToEdit?: Abonnement | null;
}

const AbonnementFormModal: React.FC<AbonnementFormModalProps> = ({ isOpen, onClose, onSave, abonnementToEdit }) => {
  const [formData, setFormData] = useState({
    etablissementId: '',
    planId: '',
    dateDebut: '',
    dateFin: '',
    statut: 'actif' as 'actif' | 'expiré' | 'annulé',
  });
  
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);

  const isCreation = !abonnementToEdit;

  useEffect(() => {
    if (abonnementToEdit) {
      setFormData({
        etablissementId: abonnementToEdit.etablissementId,
        planId: abonnementToEdit.planId,
        dateDebut: abonnementToEdit.dateDebut,
        dateFin: abonnementToEdit.dateFin,
        statut: abonnementToEdit.statut,
      });
    } else {
      setFormData({
        etablissementId: etablissementsData[0]?.id || '',
        planId: plansData[0]?.id || '',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        statut: 'actif',
      });
    }
  }, [abonnementToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const etablissement = etablissementsData.find(etab => etab.id === formData.etablissementId);
    const plan = plansData.find(p => p.id === formData.planId);

    if (!etablissement || !plan) return;

    onSave({
      ...formData,
      id: abonnementToEdit?.id || `sub-${Date.now()}`,
      etablissementNom: etablissement.name,
      planNom: plan.nom,
    });
    onClose();
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
      <div className="relative bg-white rounded-lg w-full max-w-lg p-8 shadow-xl z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isCreation ? 'Créer un nouvel' : 'Modifier l\'\''} abonnement</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="etablissementId" className="block text-sm font-medium text-gray-700">Établissement</label>
            <select name="etablissementId" id="etablissementId" value={formData.etablissementId} onChange={handleChange} required disabled={!isCreation}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500">
              {etablissementsData.map(etab => <option key={etab.id} value={etab.id}>{etab.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="planId" className="block text-sm font-medium text-gray-700">Plan d'abonnement</label>
            <select name="planId" id="planId" value={formData.planId} onChange={handleChange} required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              {plansData.filter(p => p.status === 'actif').map(plan => <option key={plan.id} value={plan.id}>{plan.nom} ({plan.tarif} XOF/{plan.duree})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700">Date de début</label>
              <input type="date" name="dateDebut" id="dateDebut" value={formData.dateDebut} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input type="date" name="dateFin" id="dateFin" value={formData.dateFin} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
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

export default AbonnementFormModal;
