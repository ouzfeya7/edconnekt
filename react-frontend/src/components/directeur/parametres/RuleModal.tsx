import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Rule {
  id: string;
  event: string;
  templateId: string;
  recipients: string[];
}

interface Template {
  id: string;
  name: string;
}

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Rule) => void;
  rule: Rule | null;
  templates: Template[];
}

const allEvents = ['Absence d\'un professeur', 'Nouvelle réunion planifiée', 'Rappel de paiement des frais', 'Annonce générale'];
const allRecipients = ['Parents', 'Élèves', 'Enseignants', 'Personnel administratif'];

const RuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose, onSave, rule, templates }) => {
  const { t } = useTranslation();
  const [event, setEvent] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    if (rule) {
      setEvent(rule.event);
      setTemplateId(rule.templateId);
      setRecipients(rule.recipients);
    } else {
      setEvent('');
      setTemplateId('');
      setRecipients([]);
    }
  }, [rule]);

  if (!isOpen) return null;

  const handleRecipientChange = (recipient: string) => {
    setRecipients(prev => 
      prev.includes(recipient) 
        ? prev.filter(r => r !== recipient) 
        : [...prev, recipient]
    );
  };

  const handleSave = () => {
    const newRule: Rule = {
      id: rule ? rule.id : `rule_${Date.now()}`,
      event,
      templateId,
      recipients,
    };
    onSave(newRule);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {rule ? t('edit_rule', 'Modifier la règle') : t('create_rule', 'Créer une règle')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="rule-event" className="block text-sm font-medium text-gray-700">{t('event_trigger', 'Événement déclencheur')}</label>
            <select id="rule-event" value={event} onChange={(e) => setEvent(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>{t('select_event', 'Sélectionner un événement')}</option>
              {allEvents.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rule-template" className="block text-sm font-medium text-gray-700">{t('template_to_send', 'Modèle à envoyer')}</label>
            <select id="rule-template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>{t('select_template', 'Sélectionner un modèle')}</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('recipients', 'Destinataires')}</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {allRecipients.map(r => (
                <label key={r} className="flex items-center space-x-2">
                  <input type="checkbox" checked={recipients.includes(r)} onChange={() => handleRecipientChange(r)} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span>{r}</span>
                </label>
              ))}
            </div>
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

export default RuleModal;
