import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useModal } from '../../../hooks/useModal';
import EstablishmentsBulkImport from '../../..//components/admin/etablissements/EstablishmentsBulkImport';

interface ImportEstablishmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportEstablishmentsModal: React.FC<ImportEstablishmentsModalProps> = ({ isOpen, onClose }) => {
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);

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
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-8 shadow-xl z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Importer des établissements via CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
        </div>
        <EstablishmentsBulkImport onSuccessClose={onClose} />
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
};

export default ImportEstablishmentsModal;


