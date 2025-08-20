import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: string;
  body: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
  template: Template | null;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave, template }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.name);
      setType(template.type);
      setBody(template.body);
    } else {
      setName('');
      setType('');
      setBody('');
    }
  }, [template]);

  if (!isOpen) return null;

  const handleSave = () => {
    const newTemplate: Template = {
      id: template ? template.id : `tpl_${Date.now()}`,
      name,
      type,
      body,
    };
    onSave(newTemplate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {template ? t('edit_template', 'Modifier le modèle') : t('create_template', 'Créer un modèle')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">{t('template_name', 'Nom du modèle')}</label>
            <input type="text" id="template-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="template-type" className="block text-sm font-medium text-gray-700">{t('type', 'Type')}</label>
            <input type="text" id="template-type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={t('template_type_placeholder', 'Ex: Annonce, Rappel, Alerte')} />
          </div>
          <div>
            <label htmlFor="template-body" className="block text-sm font-medium text-gray-700">{t('body', 'Corps du message')}</label>
            <textarea id="template-body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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

export default TemplateModal;
