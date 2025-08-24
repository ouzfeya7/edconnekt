import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Practice {
  id: string;
  title: string;
  category: string;
  content: string;
}

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (practice: Practice) => void;
  practice: Practice | null;
}

const PracticeModal: React.FC<PracticeModalProps> = ({ isOpen, onClose, onSave, practice }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (practice) {
      setTitle(practice.title);
      setCategory(practice.category);
      setContent(practice.content);
    } else {
      setTitle('');
      setCategory('');
      setContent('');
    }
  }, [practice]);

  if (!isOpen) return null;

  const handleSave = () => {
    const newPractice: Practice = {
      id: practice ? practice.id : `bp_${Date.now()}`,
      title,
      category,
      content,
    };
    onSave(newPractice);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {practice ? t('edit_practice', 'Modifier la bonne pratique') : t('write_practice', 'Rédiger une bonne pratique')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="practice-title" className="block text-sm font-medium text-gray-700">{t('title', 'Titre')}</label>
            <input type="text" id="practice-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="practice-category" className="block text-sm font-medium text-gray-700">{t('category', 'Catégorie')}</label>
            <input type="text" id="practice-category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="practice-content" className="block text-sm font-medium text-gray-700">{t('content', 'Contenu')}</label>
            <textarea id="practice-content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel', 'Annuler')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('save', 'Sauvegarder')}</button>
        </div>
      </div>
    </div>
  );
};

export default PracticeModal;
