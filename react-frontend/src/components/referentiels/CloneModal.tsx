import React, { useState, useEffect } from 'react';
import { X, Copy, Globe } from 'lucide-react';
// removed unused CycleEnum import

interface CloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  originalName: string;
  cycle?: string;
  isGlobal?: boolean;
  isLoading?: boolean;
}

const CloneModal: React.FC<CloneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  originalName,
  cycle,
  isGlobal = false,
  isLoading = false
}) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Pré-remplir avec le nom original + suffixe
      const suffix = isGlobal ? ' (Clone)' : ' - Copie';
      setNewName(originalName + suffix);
      setError('');
    }
  }, [isOpen, originalName, isGlobal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError('Le nom est requis');
      return;
    }
    
    if (trimmedName === originalName) {
      setError('Le nouveau nom doit être différent de l\'original');
      return;
    }
    
    if (trimmedName.length < 3) {
      setError('Le nom doit contenir au moins 3 caractères');
      return;
    }
    
    if (trimmedName.length > 100) {
      setError('Le nom ne peut pas dépasser 100 caractères');
      return;
    }
    
    onConfirm(trimmedName);
  };

  const getCycleLabel = (cycle?: string) => {
    switch (cycle) {
      case 'PRESCOLAIRE': return 'Préscolaire';
      case 'PRIMAIRE': return 'Primaire';
      case 'COLLEGE': return 'Collège';
      case 'LYCEE': return 'Lycée';
      case 'SECONDAIRE': return 'Secondaire';
      case 'UNIVERSITE': return 'Université';
      default: return cycle || 'Non défini';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-3">
            {isGlobal ? (
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-green-100 rounded-lg">
                <Copy className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isGlobal ? 'Cloner depuis le catalogue global' : 'Cloner le référentiel'}
              </h3>
              <p className="text-sm text-gray-600">
                {isGlobal ? 'Créer une copie locale' : 'Créer une nouvelle version'}
              </p>
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Informations sur l'original */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {isGlobal ? 'Référentiel global à cloner :' : 'Référentiel original :'}
            </div>
            <div className="text-gray-900 font-medium">{originalName}</div>
            {cycle && (
              <div className="text-sm text-gray-600 mt-1">
                Cycle : {getCycleLabel(cycle)}
              </div>
            )}
          </div>

          {/* Champ nom */}
          <div className="mb-4">
            <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du nouveau référentiel <span className="text-red-500">*</span>
            </label>
            <input
              id="newName"
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Saisissez le nom du nouveau référentiel..."
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Le nom doit contenir entre 3 et 100 caractères
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
              type="submit"
              disabled={isLoading || !newName.trim()}
              className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-colors ${
                isGlobal
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
              } disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Clonage...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Cloner
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloneModal;
