import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, AlertTriangle, TrendingUp, Clock, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { useDirector } from '../../../contexts/DirectorContext';
import KPICard from '../common/KPICard';

const DashboardKPIs: React.FC = () => {
  const { t } = useTranslation();
  const { kpiData, isKPICritical } = useDirector();

  const kpiCards = [
    {
      title: t('total_students', 'Total Élèves'),
      value: kpiData.totalEleves,
      icon: Users,
      color: 'blue' as const,
      isCritical: isKPICritical('totalEleves', kpiData.totalEleves)
    },
    {
      title: t('attendance_rate', 'Taux de Présence'),
      value: `${(100 - kpiData.tauxAbsenteisme).toFixed(1)}%`,
      icon: CheckCircle,
      color: 'green' as const,
      isCritical: isKPICritical('tauxAbsenteisme', kpiData.tauxAbsenteisme)
    },
    {
      title: t('active_alerts', 'Alertes Actives'),
      value: kpiData.alertesActives,
      icon: AlertTriangle,
      color: 'red' as const,
      isCritical: isKPICritical('alertesActives', kpiData.alertesActives)
    },
    {
      title: t('general_average', 'Moyenne Générale'),
      value: kpiData.moyenneGenerale.toFixed(1),
      icon: TrendingUp,
      color: 'purple' as const,
      isCritical: isKPICritical('moyenneGenerale', kpiData.moyenneGenerale)
    },
    // Nouvelles cartes pour l'emploi du temps
    {
      title: t('pending_absences', 'Absences en Attente'),
      value: kpiData.absencesEnAttente,
      icon: Clock,
      color: 'orange' as const,
      isCritical: kpiData.absencesEnAttente > 3
    },
    {
      title: t('ongoing_replacements', 'Remplacements en Cours'),
      value: kpiData.remplacementsEnCours,
      icon: UserCheck,
      color: 'blue' as const,
      isCritical: kpiData.remplacementsEnCours > 5
    },
    {
      title: t('modified_lessons_week', 'Cours Modifiés'),
      value: kpiData.coursModifiesCetteSemaine,
      icon: Calendar,
      color: 'green' as const,
      isCritical: kpiData.coursModifiesCetteSemaine > 15
    },
    {
      title: t('timetable_conflicts', 'Conflits EDT'),
      value: kpiData.conflitsEmploiTemps,
      icon: AlertCircle,
      color: 'red' as const,
      isCritical: kpiData.conflitsEmploiTemps > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
          isCritical={kpi.isCritical}
        />
      ))}
    </div>
  );
};

export default DashboardKPIs;
