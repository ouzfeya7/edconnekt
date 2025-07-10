import React from 'react';
import { SubjectReport } from '../../lib/mock-report-data';
import CircularProgress from '../ui/CircularProgress';
import { Check, Edit3, AlertTriangle, MessageSquare, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const statusConfig = {
  acquis: {
    icon: <Check className="w-3 h-3 text-white" />,
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    label: 'Acquis',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-800 border-green-200'
  },
  en_cours: {
    icon: <Edit3 className="w-3 h-3 text-white" />,
    bgColor: 'bg-gradient-to-r from-orange-400 to-orange-500',
    label: 'En progrès',
    textColor: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  a_renforcer: {
    icon: <AlertTriangle className="w-3 h-3 text-white" />,
    bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
    label: 'À renforcer',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-100 text-red-800 border-red-200'
  },
};

const CompetencyItem: React.FC<{ name: string; status: 'acquis' | 'en_cours' | 'a_renforcer' }> = ({ name, status }) => {
  const config = statusConfig[status];
  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
      <span className="text-gray-800 font-medium text-sm">{name}</span>
      <div className="flex items-center gap-2">
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border", config.badgeColor)}>
          <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", config.bgColor)}>
            {config.icon}
          </div>
          {config.label}
        </div>
      </div>
    </div>
  );
};

const SubjectReportCard: React.FC<{ report: SubjectReport }> = ({ report }) => {
  const { t } = useTranslation();
  
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      <div className="p-6">
        <div className="flex flex-col gap-6">
          
          {/* Section Moyenne avec design amélioré */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <CircularProgress percentage={report.average} size={70} strokeWidth={5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{report.subject}</h3>
            </div>
          </div>

          {/* Section Commentaires avec design amélioré */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <h4 className="font-bold text-gray-800 text-base">{t('teacher_comment', "Commentaire de l'enseignant")}</h4>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              <blockquote className="pl-4 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/30 rounded-r-xl border border-blue-100">
                <p className="text-gray-700 italic text-sm leading-relaxed">"{report.teacherComment}"</p>
              </blockquote>
            </div>
          </div>

          {/* Section Compétences avec design amélioré */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-600" />
              <h4 className="font-bold text-gray-800 text-base">{t('key_competencies', "Compétences clés évaluées")}</h4>
              <div className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {report.competencies.length} compétence{report.competencies.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid gap-2">
              {report.competencies.map((comp, index) => (
                <div key={comp.name} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <CompetencyItem {...comp} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Effet de survol subtle */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default SubjectReportCard; 