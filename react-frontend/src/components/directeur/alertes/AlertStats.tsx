import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import StatsCard from '../common/StatsCard';

const AlertStats: React.FC = () => {
  const { t } = useTranslation();
  const { getAlertStats } = useAlert();
  const stats = getAlertStats();

  const statCards = [
    {
      title: t('total_alerts'),
      value: stats.total,
      icon: AlertTriangle,
      color: 'blue' as const,
      trend: { value: stats.trend, direction: 'up' as const, period: '7d' },
      subtitle: t('all_time')
    },
    {
      title: t('new_alerts'),
      value: stats.nouvelles,
      icon: AlertTriangle,
      color: 'red' as const,
      trend: { value: stats.trendNouvelles, direction: 'up' as const, period: '7d' },
      subtitle: t('requires_attention')
    },
    {
      title: t('in_progress'),
      value: stats.enCours,
      icon: Clock,
      color: 'orange' as const,
      trend: { value: stats.trendEnCours, direction: 'neutral' as const, period: '7d' },
      subtitle: t('being_handled')
    },
    {
      title: t('resolved'),
      value: stats.resolues,
      icon: CheckCircle,
      color: 'green' as const,
      trend: { value: stats.trendResolues, direction: 'up' as const, period: '7d' },
      subtitle: t('completed')
    }
  ];

  const levelStats = [
    {
      level: 'critique',
      count: stats.parNiveau.critique,
      color: 'red',
      label: t('critical')
    },
    {
      level: 'important',
      count: stats.parNiveau.important,
      color: 'orange',
      label: t('important')
    },
    {
      level: 'normal',
      count: stats.parNiveau.normal,
      color: 'blue',
      label: t('normal')
    }
  ];

  const typeStats = [
    {
      type: 'securite',
      count: stats.parType.securite,
      color: 'red',
      label: t('security')
    },
    {
      type: 'academique',
      count: stats.parType.academique,
      color: 'blue',
      label: t('academic')
    },
    {
      type: 'administrative',
      count: stats.parType.administrative,
      color: 'orange',
      label: t('administrative')
    },
    {
      type: 'technique',
      count: stats.parType.technique,
      color: 'purple',
      label: t('technical')
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Level */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('alerts_by_level')}
          </h3>
          <div className="space-y-3">
            {levelStats.map((stat) => (
              <div key={stat.level} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${stat.color}-500 mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {stat.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((stat.count / stats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('alerts_by_type')}
          </h3>
          <div className="space-y-3">
            {typeStats.map((stat) => (
              <div key={stat.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${stat.color}-500 mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {stat.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((stat.count / stats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('response_time_statistics')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.tempsReponseMoyen}h
            </div>
            <div className="text-sm text-gray-600">{t('average_response_time')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.tauxResolution}%
            </div>
            <div className="text-sm text-gray-600">{t('resolution_rate')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.alertesParJour}
            </div>
            <div className="text-sm text-gray-600">{t('alerts_per_day')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertStats;
