import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Circular {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface CircularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (circular: Circular) => void;
  circular: Circular | null;
}

const CircularModal: React.FC<CircularModalProps> = ({ isOpen, onClose, onSave, circular }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (circular) {
      setTitle(circular.title);
      setContent(circular.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [circular]);

  if (!isOpen) return null;

  const handleSave = () => {
    const newCircular: Circular = {
      id: circular ? circular.id : `circ_${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0], // Date du jour
    };
    onSave(newCircular);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {circular ? t('edit_circular', 'Modifier la circulaire') : t('write_circular', 'Rédiger une circulaire')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="circular-title" className="block text-sm font-medium text-gray-700">{t('title', 'Titre')}</label>
            <input type="text" id="circular-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="circular-content" className="block text-sm font-medium text-gray-700">{t('content', 'Contenu')}</label>
            <textarea id="circular-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel', 'Annuler')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('save_and_publish', 'Enregistrer et Publier')}</button>
        </div>
      </div>
    </div>
  );
};

export default CircularModal;
