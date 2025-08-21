import React from 'react';
import { FaTimes } from 'react-icons/fa';
import ClassesBulkImport from '../../../components/directeur/parametres/ClassesBulkImport';

interface ImportClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  etablissementId: string;
}

const ImportClassesModal: React.FC<ImportClassesModalProps> = ({ isOpen, onClose, etablissementId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Importer des classes (CSV)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>
        <ClassesBulkImport etablissementId={etablissementId} />
      </div>
    </div>
  );
};

export default ImportClassesModal;


