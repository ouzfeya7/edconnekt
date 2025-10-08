import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemType: 'référentiel' | 'domaine' | 'matière' | 'compétence' | 'affectation';
  isLoading?: boolean;
  warningMessage?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType,
  isLoading = false,
  warningMessage
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'référentiel': return 'text-purple-600 bg-purple-100';
      case 'domaine': return 'text-blue-600 bg-blue-100';
      case 'matière': return 'text-green-600 bg-green-100';
      case 'compétence': return 'text-orange-600 bg-orange-100';
      case 'affectation': return 'text-gray-600 bg-gray-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'référentiel': return '📚';
      case 'domaine': return '🏷️';
      case 'matière': return '📖';
      case 'compétence': return '🎯';
      case 'affectation': return '👥';
      default: return '🗑️';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Cette action est irréversible</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Élément à supprimer */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{getTypeIcon(itemType)}</span>
              <div>
                <div className="text-sm font-medium text-gray-700 capitalize">{itemType} à supprimer :</div>
                <div className="font-semibold text-gray-900">{itemName}</div>
              </div>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(itemType)}`}>
              {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </div>
          </div>

          {/* Avertissement */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-800 mb-1">Attention !</div>
                <div className="text-sm text-red-700">
                  {warningMessage || `Cette ${itemType} sera définitivement supprimée et ne pourra pas être récupérée.`}
                </div>
                {itemType === 'référentiel' && (
                  <div className="text-sm text-red-700 mt-2">
                    <strong>Toutes les données associées seront également supprimées :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Domaines</li>
                      <li>Matières</li>
                      <li>Compétences</li>
                      <li>Affectations</li>
                    </ul>
                  </div>
                )}
                {itemType === 'domaine' && (
                  <div className="text-sm text-red-700 mt-2">
                    <strong>Toutes les matières et compétences de ce domaine seront également supprimées.</strong>
                  </div>
                )}
                {itemType === 'matière' && (
                  <div className="text-sm text-red-700 mt-2">
                    <strong>Toutes les compétences de cette matière seront également supprimées.</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Êtes-vous absolument certain de vouloir supprimer <strong>"{itemName}"</strong> ?
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Suppression...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Supprimer définitivement
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
