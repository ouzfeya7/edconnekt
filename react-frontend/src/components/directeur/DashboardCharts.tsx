import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Données mockées enrichies pour les graphiques
const attendanceData = [
  { jour: 'Lun', taux: 95.2 },
  { jour: 'Mar', taux: 94.8 },
  { jour: 'Mer', taux: 96.1 },
  { jour: 'Jeu', taux: 93.5 },
  { jour: 'Ven', taux: 97.2 },
  { jour: 'Sam', taux: 98.1 },
  { jour: 'Dim', taux: 99.0 }
];

const classAverages = [
  { classe: '6ème A', moyenne: 13.8 },
  { classe: '6ème B', moyenne: 14.2 },
  { classe: '5ème A', moyenne: 13.5 },
  { classe: '5ème B', moyenne: 14.7 },
  { classe: '4ème A', moyenne: 13.9 },
  { classe: '4ème B', moyenne: 14.1 },
  { classe: '3ème A', moyenne: 14.5 },
  { classe: '3ème B', moyenne: 13.7 }
];

const alertTypes = [
  { type: 'Absences', count: 12, color: '#3B82F6' },
  { type: 'Discipline', count: 8, color: '#EF4444' },
  { type: 'Évaluations', count: 15, color: '#10B981' },
  { type: 'Santé', count: 3, color: '#8B5CF6' }
];

const gradeEvolution = [
  { mois: 'Sept', moyenne: 13.2 },
  { mois: 'Oct', moyenne: 13.8 },
  { mois: 'Nov', moyenne: 14.1 },
  { mois: 'Déc', moyenne: 14.2 },
  { mois: 'Jan', moyenne: 14.0 },
  { mois: 'Fév', moyenne: 14.3 }
];

interface DashboardChartsProps {
  className?: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Graphique d'évolution du taux de présence */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('attendance_evolution', 'Évolution du taux de présence')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jour" />
            <YAxis domain={[90, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, t('attendance_rate', 'Taux de présence')]} />
            <Line
              type="monotone"
              dataKey="taux"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Histogramme des moyennes par classe */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('class_averages', 'Moyennes par classe')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classAverages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="classe" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[12, 16]} />
            <Tooltip formatter={(value) => [`${value}/20`, t('average', 'Moyenne')]} />
            <Bar dataKey="moyenne" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique circulaire des types d'alertes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('alert_distribution', 'Répartition des alertes')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={alertTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {alertTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, t('alerts', 'Alertes')]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique d'évolution des moyennes générales */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('grade_evolution', 'Évolution des moyennes générales')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={gradeEvolution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis domain={[12, 15]} />
            <Tooltip formatter={(value) => [`${value}/20`, t('general_average', 'Moyenne générale')]} />
            <Line
              type="monotone"
              dataKey="moyenne"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
