import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info, XCircle, Clock, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  alert: {
    id: number;
    type: 'absence' | 'comportement' | 'academique' | 'sante' | 'securite';
    niveau: 'info' | 'warning' | 'critical';
    titre: string;
    description: string;
    eleve?: string;
    classe?: string;
    enseignant?: string;
    dateCreation: string;
    statut: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
    priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
    assignee?: string;
    actions: unknown[];
  };
  onResolve?: () => void;
  onAssign?: (assignee: string) => void;
  onViewDetails?: () => void;
  showActions?: boolean;
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onViewDetails,
  className = ''
}) => {
  const { type, niveau, titre, description, eleve, classe, enseignant, dateCreation, statut, priorite, assignee, actions } = alert;
  const { t } = useTranslation();

  const getNiveauIcon = () => {
    switch (niveau) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatutIcon = () => {
    switch (statut) {
      case 'ouverte':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'en_cours':
        return <AlertTriangle className="w-3 h-3 text-blue-500" />;
      case 'resolue':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'fermee':
        return <XCircle className="w-3 h-3 text-gray-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const getPrioriteColor = () => {
    switch (priorite) {
      case 'basse':
        return 'border-l-green-500 bg-green-50';
      case 'moyenne':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'haute':
        return 'border-l-orange-500 bg-orange-50';
      case 'urgente':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'absence':
        return 'bg-blue-100 text-blue-800';
      case 'comportement':
        return 'bg-red-100 text-red-800';
      case 'academique':
        return 'bg-purple-100 text-purple-800';
      case 'sante':
        return 'bg-green-100 text-green-800';
      case 'securite':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`border-l-4 ${getPrioriteColor()} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getNiveauIcon()}
          <h3 className="font-semibold text-gray-900 text-sm">{titre}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {t(type, type)}
          </span>
          <div className="flex items-center space-x-1">
            {getStatutIcon()}
            <span className="text-xs text-gray-600">{t(statut, statut)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
        {eleve && (
          <div>
            <span className="font-medium">{t('student', 'Élève')}:</span> {eleve}
          </div>
        )}
        {classe && (
          <div>
            <span className="font-medium">{t('class', 'Classe')}:</span> {classe}
          </div>
        )}
        {enseignant && (
          <div>
            <span className="font-medium">{t('teacher', 'Enseignant')}:</span> {enseignant}
          </div>
        )}
        {assignee && (
          <div>
            <span className="font-medium">{t('assigned_to', 'Assigné à')}:</span> {assignee}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {t('created_on', 'Créée le')} {new Date(dateCreation).toLocaleDateString()}
        </span>
        <span className="flex items-center space-x-1">
          <span>{actions.length}</span>
          <span>{t('actions', 'actions')}</span>
        </span>
      </div>
    </div>
  );
};

export default AlertCard;
