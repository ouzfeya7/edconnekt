import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Calendar, Users } from 'lucide-react';
import { PdiSession } from '../../types/pdi';
import { useModal } from '../../hooks/useModal';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: Omit<PdiSession, 'id'>) => void;
  facilitatorClasses: string[];
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onCreateSession,
  facilitatorClasses
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [observations, setObservations] = useState('');
  
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);

  if (!isOpen) return null;

  // Convertir la date de YYYY-MM-DD vers DD/MM/YYYY
  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClass || !selectedDate) {
      alert('Veuillez sélectionner une classe et une date');
      return;
    }

    const newSession: Omit<PdiSession, 'id'> = {
      date: formatDateForDisplay(selectedDate), // Convertir au format d'affichage
      classId: `class-${selectedClass}`,
      className: selectedClass,
      status: 'scheduled',
      students: [],
      observations: observations || `Séance PDI programmée pour la classe ${selectedClass}`,
      reportGenerated: false,
      published: false
    };

    onCreateSession(newSession);
    
    // Réinitialiser le formulaire
    setSelectedClass('');
    setSelectedDate('');
    setObservations('');
    onClose();
  };

  // Obtenir la date de demain au format YYYY-MM-DD (date minimum)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay séparé */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Plus className="text-slate-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Nouvelle séance PDI</h3>
              <p className="text-sm text-slate-500">Programmer une séance pour une classe</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection de classe */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Users size={16} className="inline mr-2" />
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Sélectionner une classe</option>
              {facilitatorClasses.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Date de la séance
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTomorrowDate()}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Choisissez la date qui convient à votre planning d'établissement
            </p>
          </div>

          {/* Observations préliminaires */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Observations préliminaires (optionnel)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Objectifs ou notes pour cette séance..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer la séance
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
};

export default CreateSessionModal;
