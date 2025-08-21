import React from 'react';
import { FaTimes } from 'react-icons/fa';
import EstablishmentsBulkImport from '../../..//components/admin/etablissements/EstablishmentsBulkImport';

interface ImportEstablishmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportEstablishmentsModal: React.FC<ImportEstablishmentsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 relative shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Importer des établissements via CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
        </div>
        <EstablishmentsBulkImport />
      </div>
    </div>
  );
};

export default ImportEstablishmentsModal;


