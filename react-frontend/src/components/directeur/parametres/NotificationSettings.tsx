import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AtSign, MessageSquare, Smartphone, Save, Plus, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import TemplateModal from './TemplateModal';
import RuleModal from './RuleModal'; // Import de la modale des règles

// Interfaces
interface Channel {
  id: 'email' | 'sms' | 'push';
  label: string;
  icon: React.ElementType;
}

interface Template {
  id: string;
  name: string;
  type: string;
  body: string;
}

interface Rule {
  id: string;
  event: string;
  templateId: string;
  recipients: string[];
}

// Données Mock
const mockTemplates: Template[] = [
    {
    id: 'tpl_001',
    name: "Absence d'un professeur",
    type: 'Information Scolaire',
    body: 'Bonjour, nous vous informons que le professeur {{Nom du professeur}} sera absent le {{Date}}. Les cours de {{Matière}} sont annulés.',
    },
    {
    id: 'tpl_002',
    name: 'Réunion parents-professeurs',
    type: 'Événement',
    body: 'Chers parents, vous êtes cordialement invités à notre réunion parents-professeurs qui se tiendra le {{Date}} à {{Heure}} dans la salle {{Salle}}.',
    },
    {
    id: 'tpl_003',
    name: 'Rappel de paiement',
    type: 'Administratif',
    body: 'Ceci est un rappel amical concernant le paiement des frais de scolarité pour le mois de {{Mois}}. Veuillez régulariser la situation dès que possible.',
    },
    {
    id: 'tpl_004',
    name: 'Annonce de la kermesse de fin d\'année',
    type: 'Événement',
    body: 'Notez la date ! Notre grande kermesse annuelle aura lieu le [Date] dans la cour de l\'école. Venez nombreux !',
  },
  {
    id: 'tpl_005',
    name: 'Alerte Météo - fermeture anticipée',
    type: 'Urgence',
    body: 'En raison des conditions météorologiques exceptionnelles, l\'école fermera ses portes à [Heure] aujourd\'hui. Veuillez prendre vos dispositions pour récupérer vos enfants.',
  },
];

const mockRules: Rule[] = [
  {
    id: 'rule_001',
    event: 'Absence d\'un professeur',
    templateId: 'tpl_001',
    recipients: ['Parents', 'Élèves concernés'],
  },
  {
    id: 'rule_002',
    event: 'Nouvelle réunion planifiée',
    templateId: 'tpl_002',
    recipients: ['Parents'],
  },
  {
    id: 'rule_003',
    event: 'Fermeture exceptionnelle de l\'école',
    templateId: 'tpl_005',
    recipients: ['Parents', 'Enseignants', 'Personnel administratif'],
  },
  {
    id: 'rule_004',
    event: 'Annonce d\'un événement scolaire',
    templateId: 'tpl_004',
    recipients: ['Parents', 'Élèves'],
  },
];

// Helper pour les couleurs des tags
const recipientColors: { [key: string]: string } = {
  'Parents': 'bg-green-100 text-green-800',
  'Élèves': 'bg-yellow-100 text-yellow-800',
  'Enseignants': 'bg-purple-100 text-purple-800',
  'Personnel administratif': 'bg-gray-200 text-gray-800',
  'default': 'bg-blue-100 text-blue-800',
};

const NotificationSettings: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('channels'); // Onglet actif par défaut
    
    // États pour l'onglet Canaux
    const [initialChannelState, setInitialChannelState] = useState(() => {
        const savedChannels = localStorage.getItem('enabledChannels');
        return savedChannels ? JSON.parse(savedChannels) : { email: true, sms: false, push: true };
    });
    const [enabledChannels, setEnabledChannels] = useState(initialChannelState);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [templates, setTemplates] = useState<Template[]>(mockTemplates);
    const [rules, setRules] = useState<Rule[]>(mockRules);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [templateSearch, setTemplateSearch] = useState('');
    const [ruleSearch, setRuleSearch] = useState('');

    const filteredTemplates = templates.filter(template =>
      template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      template.type.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const filteredRules = rules.filter(rule =>
      rule.event.toLowerCase().includes(ruleSearch.toLowerCase())
    );

    const tabs = [
        { id: 'channels', label: t('channels', 'Canaux') },
        { id: 'templates', label: t('templates', 'Modèles') },
        { id: 'rules', label: t('rules', 'Règles') },
    ];

    const channels: Channel[] = [
        { id: 'email', label: 'Email', icon: AtSign },
        { id: 'sms', label: 'SMS', icon: MessageSquare },
        { id: 'push', label: 'Push Mobile', icon: Smartphone },
    ];

    const hasChanges = JSON.stringify(initialChannelState) !== JSON.stringify(enabledChannels);
    const handleToggleChannel = (channelId: keyof typeof enabledChannels) => {
      setEnabledChannels((prevState: typeof enabledChannels) => ({ ...prevState, [channelId]: !prevState[channelId] }));
    };

    const handleSaveChanges = () => {
        if (!hasChanges) return;

        setIsSaving(true);
        // Simulation d'un appel API
        setTimeout(() => {
            localStorage.setItem('enabledChannels', JSON.stringify(enabledChannels));
            setInitialChannelState(enabledChannels); // Met à jour l'état initial après sauvegarde
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000); // Cache le message après 2s
        }, 1500);
    };

    const handleOpenModal = (template: Template | null) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
    };

    const handleSaveTemplate = (template: Template) => {
        if (editingTemplate) {
            setTemplates(templates.map(t => t.id === template.id ? template : t));
        } else {
            const newTemplateWithId = { ...template, id: `tpl_${Date.now()}` };
            setTemplates([...templates, newTemplateWithId]);
        }
        handleCloseModal();
    };

    const handleDeleteTemplate = (templateId: string) => {
        if (window.confirm(t('confirm_delete_template', 'Êtes-vous sûr de vouloir supprimer ce modèle ?'))) {
            setTemplates(templates.filter(t => t.id !== templateId));
        }
    };

    const handleOpenRuleModal = (rule: Rule | null) => {
      setEditingRule(rule);
      setIsRuleModalOpen(true);
    };

    const handleCloseRuleModal = () => {
      setIsRuleModalOpen(false);
      setEditingRule(null);
    };

    const handleSaveRule = (rule: Rule) => {
      if (editingRule) {
        setRules(rules.map(r => r.id === rule.id ? rule : r));
      } else {
        setRules([...rules, rule]);
      }
      handleCloseRuleModal();
    };

    const handleDeleteRule = (ruleId: string) => {
      if (window.confirm(t('confirm_delete_rule', 'Êtes-vous sûr de vouloir supprimer cette règle ?'))) {
        setRules(rules.filter(r => r.id !== ruleId));
      }
    };

    const getTemplateNameById = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        return template ? template.name : t('unknown_template', 'Modèle inconnu');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'channels':
                return (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {t('manage_notification_channels', 'Gérer les canaux de notification')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {t('channels_description', 'Activez ou désactivez les canaux par lesquels votre établissement enverra des communications.')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {showSuccess && <CheckCircle className="text-green-500 w-5 h-5" />}
                        <button
                          onClick={handleSaveChanges}
                          disabled={!hasChanges || isSaving}
                          className="flex items-center justify-center px-4 py-2 w-32 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              {t('save_changes', 'Enregistrer')}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      {channels.map((channel) => {
                        const isEnabled = enabledChannels[channel.id];
                        return (
                          <div key={channel.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                              <channel.icon className="w-5 h-5 text-gray-500 mr-3" />
                              <span className="font-medium text-gray-800">{channel.label}</span>
                            </div>
                            <label htmlFor={`toggle-${channel.id}`} className="flex items-center cursor-pointer">
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  id={`toggle-${channel.id}`} 
                                  className="sr-only" 
                                  checked={isEnabled}
                                  onChange={() => handleToggleChannel(channel.id)} 
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${isEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
            case 'templates':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{t('manage_notification_templates', 'Gérer les modèles de notification')}</h3>
                                <p className="text-sm text-gray-500 mt-1">{t('templates_description', 'Créez et modifiez des modèles pour vos communications récurrentes.')}</p>
                            </div>
                            <button onClick={() => handleOpenModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                {t('create_template', 'Créer un modèle')}
                            </button>
                        </div>
                        <div className="mb-4">
                          <input 
                            type="text"
                            value={templateSearch}
                            onChange={(e) => setTemplateSearch(e.target.value)}
                            placeholder={t('search_templates', 'Rechercher des modèles...')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="bg-white border rounded-lg">
                            <ul className="divide-y">
                                {filteredTemplates.map((template) => (
                                <li key={template.id} className="p-4 flex justify-between items-center group">
                                    <div>
                                        <p className="font-semibold text-gray-800">{template.name}</p>
                                        <p className="text-sm text-gray-600 truncate max-w-md">{template.type}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(template)} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg">
                                          <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg">
                                          <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'rules':
                return (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{t('manage_notification_rules', 'Gérer les règles de notification')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('rules_description', 'Automatisez vos communications en définissant des règles.')}</p>
                      </div>
                      <button onClick={() => handleOpenRuleModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('create_rule', 'Créer une règle')}
                      </button>
                    </div>
                    <div className="mb-4">
                      <input 
                        type="text"
                        value={ruleSearch}
                        onChange={(e) => setRuleSearch(e.target.value)}
                        placeholder={t('search_rules', 'Rechercher des règles par événement...')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="bg-white border rounded-lg">
                      <ul className="divide-y">
                        {filteredRules.map((rule) => (
                          <li key={rule.id} className="p-4 flex justify-between items-center group">
                            <div>
                              <p className="font-semibold text-gray-800">{rule.event}</p>
                              <p className="text-sm text-gray-600">
                                {t('sends_template', 'Envoie le modèle')}: "{getTemplateNameById(rule.templateId)}"
                              </p>
                              <div className="mt-2 flex items-center flex-wrap gap-2">
                                <span className="text-sm text-gray-500">{t('to_recipients', 'Destinataires')}:</span>
                                {rule.recipients.map(recipient => (
                                  <span 
                                    key={recipient} 
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${recipientColors[recipient] || recipientColors.default}`}
                                  >
                                    {recipient}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleOpenRuleModal(rule)} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg">
                                <Edit className="w-5 h-5 text-blue-600" />
                              </button>
                              <button onClick={() => handleDeleteRule(rule.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('notification_settings', 'Paramètres des notifications')}</h2>
            <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div>{renderContent()}</div>
            <TemplateModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTemplate} template={editingTemplate} />
            <RuleModal 
              isOpen={isRuleModalOpen} 
              onClose={handleCloseRuleModal} 
              onSave={handleSaveRule} 
              rule={editingRule} 
              templates={templates} 
            />
        </div>
    );
};

export default NotificationSettings;
