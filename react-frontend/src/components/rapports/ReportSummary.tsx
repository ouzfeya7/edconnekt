import React from 'react';
import { TrimesterReport } from '../../lib/mock-report-data';
import CircularProgress from '../ui/CircularProgress';
import { CheckCircle, AlertCircle, XCircle, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const ReportSummary: React.FC<{ report: TrimesterReport }> = ({ report }) => {
  const { t } = useTranslation();
  const totalAttendance = report.attendance.present + report.attendance.late + report.attendance.absent;
  const presencePercentage = totalAttendance > 0 ? Math.round((report.attendance.present / totalAttendance) * 100) : 100;

  // Déterminer la couleur du gradient selon la moyenne
  const getGradientScheme = (average: number) => {
    if (average >= 90) return 'from-green-700 to-green-800';
    if (average >= 70) return 'from-green-500 to-green-600';
    if (average >= 50) return 'from-yellow-500 to-yellow-600';
    if (average >= 30) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const gradientScheme = getGradientScheme(report.overallAverage);

  // Configuration des statistiques d'assiduité
  const attendanceStats = [
    {
      label: 'Jours présents',
      value: report.attendance.present,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Retards',
      value: report.attendance.late,
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Absences',
      value: report.attendance.absent,
      icon: XCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Colonne Moyenne et Commentaire */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        <div className="p-6">
          {/* En-tête unifié */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center", gradientScheme)}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('trimester_summary', 'Synthèse du Trimestre')} {report.trimester}</h3>
                <p className="text-sm text-gray-600">{t('overall_performance', 'Performance générale et appréciation')}</p>
              </div>
            </div>
            
            {/* Badge de performance déplacé dans l'en-tête */}
            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border", 
              report.overallAverage >= 90 ? 'bg-green-50 text-green-700 border-green-200' :
              report.overallAverage >= 70 ? 'bg-green-50 text-green-600 border-green-200' :
              report.overallAverage >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              report.overallAverage >= 30 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'
            )}>
              <TrendingUp className="w-4 h-4" />
              {report.overallAverage >= 90 ? 'Très Bien Réussi' : 
               report.overallAverage >= 70 ? 'Bien Réussi' :
               report.overallAverage >= 50 ? 'Réussi' :
               report.overallAverage >= 30 ? 'Peu Réussi' : 'Pas Réussi'}
            </div>
          </div>
          
          {/* Section principale avec layout optimisé */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1: CircularProgress centré */}
            <div className="flex flex-col items-center justify-center">
              <CircularProgress percentage={report.overallAverage} size={110} strokeWidth={8} />
              <div className="text-center mt-3">
                <div className="text-lg font-bold text-gray-900">{t('general_average', 'Moyenne Générale')}</div>
                <div className="text-sm text-gray-500 mt-1">sur 100%</div>
              </div>
            </div>
            
            {/* Colonnes 2-3: Commentaire sur toute la largeur restante */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{t('general_appreciation', 'Appréciation générale')}</h4>
                  <p className="text-sm text-gray-500">Commentaire de l'équipe pédagogique</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                <div className="pl-6 py-4 bg-gradient-to-r from-blue-50/60 to-purple-50/40 rounded-r-xl border-l-0 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed text-base">"{report.generalComment}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne Assiduité améliorée */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        <div className="p-6">
          {/* En-tête simplifié */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center",
              presencePercentage >= 90 ? 'from-green-700 to-green-800' :
              presencePercentage >= 70 ? 'from-green-500 to-green-600' :
              presencePercentage >= 50 ? 'from-yellow-500 to-yellow-600' :
              presencePercentage >= 30 ? 'from-orange-500 to-orange-600' : 'from-red-500 to-red-600'
            )}>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('attendance', 'Assiduité')}</h3>
              <p className="text-sm text-gray-600">{t('attendance_details', 'Suivi de présence')}</p>
            </div>
          </div>
          
          {/* Indicateur de présence avec design card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <div className="text-center">
              <div className={cn("text-4xl font-bold mb-1",
                presencePercentage >= 90 ? 'text-green-700' :
                presencePercentage >= 70 ? 'text-green-500' :
                presencePercentage >= 50 ? 'text-yellow-500' :
                presencePercentage >= 30 ? 'text-orange-500' : 'text-red-600'
              )}>
                {presencePercentage}%
              </div>
              <div className="text-sm font-medium text-gray-600">{t('presence_rate', 'Taux de présence')}</div>
              <div className="text-xs text-gray-500 mt-1">
                {report.attendance.present + report.attendance.late + report.attendance.absent} jours d'école
              </div>
            </div>
          </div>
          
          {/* Statistiques détaillées compactes */}
          <div className="space-y-2">
            {attendanceStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} 
                     className={cn("flex justify-between items-center p-3 rounded-lg border transition-all duration-200 hover:shadow-sm animate-fade-in", 
                                   stat.bgColor, stat.textColor, stat.borderColor)}
                     style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm")}>
                      <IconComponent className={cn("w-3.5 h-3.5", stat.iconColor)} />
                    </div>
                    <span className="font-medium text-sm">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">{stat.value}</span>
                    <span className="text-xs opacity-70 ml-1">j</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary; 