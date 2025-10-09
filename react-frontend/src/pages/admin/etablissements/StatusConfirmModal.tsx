import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../../../hooks/useModal';

interface StatusConfirmModalProps {
  isOpen: boolean;
  mode: 'activate' | 'suspend';
  etablissementName?: string;
  onConfirm: (payload: { reasons: string[]; details: string }) => void;
  onCancel: () => void;
}

const StatusConfirmModal: React.FC<StatusConfirmModalProps> = ({ isOpen, mode, etablissementName, onConfirm, onCancel }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [details, setDetails] = useState<string>('');
  
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onCancel);

  const reasons = useMemo(() => {
    if (mode === 'suspend') {
      return [
        'Retard de paiement',
        'Non-conformité aux règles',
        'Demande de la direction',
        'Maintenance/Changement de plan',
      ];
    }
    return [
      'Problème résolu',
      'Paiement reçu',
      'Validation direction',
      'Réactivation suite à maintenance',
    ];
  }, [mode]);

  if (!isOpen) return null;

  const toggleReason = (r: string) => {
    setSelectedReasons((prev) => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const handleConfirm = () => {
    onConfirm({ reasons: selectedReasons, details });
    // reset local state for next open
    setSelectedReasons([]);
    setDetails('');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay séparé */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {mode === 'suspend' ? 'Suspendre l’établissement' : 'Activer l’établissement'}{etablissementName ? ` : ${etablissementName}` : ''}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {mode === 'suspend' ? 'Sélectionnez au moins une raison de suspension.' : 'Sélectionnez au moins une raison d’activation.'}
        </p>

        <div className="space-y-2 mb-4">
          {reasons.map((r) => (
            <label key={r} className="flex items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={selectedReasons.includes(r)}
                onChange={() => toggleReason(r)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              {r}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Détails (optionnel)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ajoutez des précisions si nécessaire"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedReasons.length === 0}
            className={`px-4 py-2 rounded-md text-white ${selectedReasons.length === 0 ? 'bg-gray-300 cursor-not-allowed' : mode === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {mode === 'suspend' ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
};

export default StatusConfirmModal;
