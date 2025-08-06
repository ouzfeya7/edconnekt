import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, Target } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { RemediationSession } from '../../lib/mock-data';
import Badge from '../ui/Badge';

interface RemediationCardProps {
  remediation?: RemediationSession;
  // Props alternatives pour les remédiations de leçons
  title?: string;
  subject?: string;
  time?: string;
  teacher?: string;
  statusText?: string;
  statusColor?: string;
  onClick?: () => void;
  // Props pour la personnalisation parent
  isParentView?: boolean;
  teacherMessage?: string;
  requiresIntervention?: boolean;
  interventionType?: 'requested' | 'urgent' | 'optional';
}

const statusConfig = {
  completed: { label: 'Terminé', textColor: 'text-green-700', bgColor: 'bg-green-100' },
  upcoming: { label: 'Planifiée', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
  'in_progress': { label: 'En cours', textColor: 'text-orange-700', bgColor: 'bg-orange-100' },
};

const RemediationCard: React.FC<RemediationCardProps> = ({ 
  remediation, 
  title: propTitle, 
  subject: propSubject, 
  time: propTime, 
  teacher: propTeacher, 
  statusText: propStatusText, 
  statusColor: propStatusColor, 
  onClick,
  isParentView = false,
  teacherMessage,
  requiresIntervention = false,
  interventionType = 'optional'
}) => {
  const { i18n } = useTranslation();
  dayjs.locale(i18n.language);
  const { t } = useTranslation();

  // Gérer les deux types de données : RemediationSession ou props directes
  const isRemediationSession = !!remediation;
  
  const displayTitle = isRemediationSession ? remediation!.title : propTitle;
  const displaySubject = isRemediationSession ? remediation!.subject : propSubject;
  const displayTeacher = isRemediationSession ? remediation!.teacher : propTeacher;
  const displayDate = isRemediationSession ? remediation!.date : null;
  const displayStudentCount = isRemediationSession ? remediation!.studentCount : null;
  const displayTime = isRemediationSession ? null : propTime;
  const displayDuration = isRemediationSession ? remediation!.duration : null;
  
  // Pour les status
  let currentStatus;
  if (isRemediationSession) {
    currentStatus = statusConfig[remediation!.status];
  } else {
    // Pour les remédiations de leçons, utiliser les props directes
    currentStatus = {
      label: propStatusText || 'En attente',
      textColor: propStatusColor || 'text-blue-700',
      bgColor: 'bg-blue-100'
    };
  }

  // Fonction pour obtenir la couleur d'alerte selon le type d'intervention
  const getInterventionColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'requested': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'optional': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <p className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
            {displayTitle}
          </p>
          <Badge 
            text={currentStatus.label}
            bgColor={currentStatus.bgColor}
            color={currentStatus.textColor}
          />
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <Target className="w-4 h-4 mr-2 text-gray-400"/>
          <p className="text-sm font-medium">
            {isRemediationSession ? remediation!.theme : displaySubject}
          </p>
        </div>

        {/* Section spécifique aux parents */}
        {isParentView && (
          <div className="space-y-3 mb-4">
            {/* Message de l'enseignant - seulement pour les sessions en cours ou terminées */}
            {teacherMessage && (isRemediationSession ? (remediation!.status === 'in_progress' || remediation!.status === 'completed') : true) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-800 mb-1">Message de l'enseignant</p>
                    <p className="text-sm text-blue-700 line-clamp-2">{teacherMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alerte d'intervention - seulement pour les sessions en cours ou terminées */}
            {requiresIntervention && (isRemediationSession ? (remediation!.status === 'in_progress' || remediation!.status === 'completed') : true) && (
              <div className={`border rounded-lg p-3 ${getInterventionColor(interventionType)}`}>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1">
                      {interventionType === 'urgent' && 'Intervention urgente requise'}
                      {interventionType === 'requested' && 'Intervention demandée'}
                      {interventionType === 'optional' && 'Intervention suggérée'}
                    </p>
                    <p className="text-sm">
                      {interventionType === 'urgent' && 'Votre enfant a besoin d\'un soutien immédiat'}
                      {interventionType === 'requested' && 'L\'enseignant demande votre intervention'}
                      {interventionType === 'optional' && 'Un suivi à domicile pourrait être bénéfique'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Information pour les sessions à venir */}
            {isRemediationSession && remediation!.status === 'upcoming' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-800 mb-1">Session programmée</p>
                    <p className="text-sm text-green-700">Cette session de remédiation est prévue pour votre enfant</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm text-gray-600">
        {isRemediationSession ? (
          <>
            {!isParentView ? (
              <>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{t('students_concerned', { count: displayStudentCount || 0 })}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{dayjs(displayDate).format('D MMMM YYYY')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{dayjs(displayDate).format('D MMMM YYYY')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{displayDuration || remediation?.duration || 0} min</span>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>{displayTeacher}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{displayTime}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RemediationCard; 