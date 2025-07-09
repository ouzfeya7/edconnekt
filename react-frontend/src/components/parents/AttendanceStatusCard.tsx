import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

type Status = 'present' | 'late' | 'absent' | 'unknown';

interface AttendanceStatusCardProps {
  status: Status;
}

const statusConfig = {
  present: {
    labelKey: 'present',
    defaultValue: 'Présent',
    color: 'text-green-600',
    icon: <CheckCircle2 />,
  },
  late: {
    labelKey: 'late',
    defaultValue: 'En retard',
    color: 'text-orange-500',
    icon: <AlertTriangle />,
  },
  absent: {
    labelKey: 'absent',
    defaultValue: 'Absent',
    color: 'text-red-600',
    icon: <XCircle />,
  },
  unknown: {
    labelKey: 'status_unknown',
    defaultValue: 'Non renseigné',
    color: 'text-gray-500',
    icon: null,
  },
};

const AttendanceStatusCard: React.FC<AttendanceStatusCardProps> = ({ status }) => {
  const { t } = useTranslation();
  const config = statusConfig[status];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center h-full border border-gray-200">
      <div>
        <p className="text-sm text-gray-500">{t('status', 'Statut')}</p>
        <div className="flex items-center justify-between mt-1">
          <p className={`text-xl text-gray-800 font-semibold ${config.color}`}>{t(config.labelKey, config.defaultValue)}</p>
          <div className={`${config.color}`}>{config.icon}</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatusCard; 