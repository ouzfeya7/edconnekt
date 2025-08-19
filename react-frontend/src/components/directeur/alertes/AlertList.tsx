import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, CheckCircle, User, Calendar } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import AlertCard from '../common/AlertCard';
import FilterPanel from '../common/FilterPanel';

const AlertList: React.FC = () => {
  const { t } = useTranslation();
  const { 
    alertesFiltrees, 
    filters, 
    setFilters, 
    resolveAlert, 
    assignAlert, 
    setSelectedAlert 
  } = useAlert();

  const filterOptions = [
    {
      key: 'niveau',
      label: t('alert_level'),
      type: 'select' as const,
      options: [
        { value: 'critical', label: t('critical') },
        { value: 'warning', label: t('important') },
        { value: 'info', label: t('normal') }
      ]
    },
    {
      key: 'statut',
      label: t('status'),
      type: 'select' as const,
      options: [
        { value: 'ouverte', label: t('new') },
        { value: 'en_cours', label: t('in_progress') },
        { value: 'resolue', label: t('resolved') }
      ]
    },
    {
      key: 'type',
      label: t('alert_type'),
      type: 'select' as const,
      options: [
        { value: 'absence', label: t('absence') },
        { value: 'comportement', label: t('behavior') },
        { value: 'academique', label: t('academic') },
        { value: 'sante', label: t('health') },
        { value: 'securite', label: t('security') }
      ]
    },
    {
      key: 'date',
      label: t('date_range'),
      type: 'dateRange' as const
    }
  ];

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'nouvelle':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'en_cours':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolue':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'nouvelle':
        return t('new');
      case 'en_cours':
        return t('in_progress');
      case 'resolue':
        return t('resolved');
      default:
        return statut;
    }
  };

  const handleResolve = (id: number) => {
    resolveAlert(id, 'Résolue par le directeur');
  };

  const handleAssign = (id: number, assignee: string) => {
    assignAlert(id, assignee);
  };

  const handleViewDetails = (alert: any) => {
    setSelectedAlert(alert);
  };

  return (
    <div className="space-y-6">
      <FilterPanel
        filters={filterOptions}
        values={{
          niveau: filters.niveau[0] || '',
          statut: filters.statut[0] || '',
          type: filters.type[0] || '',
          date: filters.dateDebut ? `${filters.dateDebut} - ${filters.dateFin || ''}` : ''
        }}
        onFilterChange={(key, value) => {
          setFilters({
            ...filters,
            [key]: value ? [value] : []
          });
        }}
        onClearAll={() => setFilters({
          type: [],
          niveau: [],
          statut: [],
          priorite: [],
          classe: []
        })}
        onClearFilter={(key) => setFilters({ ...filters, [key]: [] })}
        title={t('filter_alerts')}
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('alerts')} ({alertesFiltrees.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('showing_filtered_results')}</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {alertesFiltrees.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('no_alerts_found')}</p>
            </div>
          ) : (
            alertesFiltrees.map((alerte) => (
              <div key={alerte.id} className="p-4 hover:bg-gray-50 transition-colors">
                <AlertCard
                  alert={alerte}
                  onResolve={() => handleResolve(alerte.id)}
                  onAssign={(assignee) => handleAssign(alerte.id, assignee)}
                  onViewDetails={() => handleViewDetails(alerte)}
                  showActions={true}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertList;
