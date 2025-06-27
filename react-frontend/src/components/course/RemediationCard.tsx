import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, Target } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { RemediationSession } from '../../lib/mock-data';
import Badge from '../ui/Badge';

interface RemediationCardProps {
  remediation: RemediationSession;
  onClick: () => void;
}

const statusConfig = {
  completed: { label: 'Terminé', textColor: 'text-green-700', bgColor: 'bg-green-100' },
  upcoming: { label: 'À venir', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
  'in_progress': { label: 'En cours', textColor: 'text-orange-700', bgColor: 'bg-orange-100' },
};

const RemediationCard: React.FC<RemediationCardProps> = ({ remediation, onClick }) => {
  const { i18n } = useTranslation();
  dayjs.locale(i18n.language);
  const { t } = useTranslation();

  const { status, title, theme, studentCount, date } = remediation;
  const currentStatus = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <p className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{title}</p>
          <Badge 
            text={t(currentStatus.label)}
            bgColor={currentStatus.bgColor}
            color={currentStatus.textColor}
          />
        </div>
        <div className="flex items-center text-gray-500 mb-4">
            <Target className="w-4 h-4 mr-2 text-gray-400"/>
            <p className="text-sm font-medium">{theme}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span>{t('students_concerned', { count: studentCount })}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{dayjs(date).format('D MMMM YYYY')}</span>
        </div>
      </div>
    </div>
  );
};

export default RemediationCard; 