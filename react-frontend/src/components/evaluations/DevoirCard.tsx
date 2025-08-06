import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DevoirCardProps {
  id: string;
  title: string;
  subject: string;
  startDate: string;
  endDate: string;
  submitted: number;
  notSubmitted: number;
}

const DevoirCard: React.FC<DevoirCardProps> = ({ id, title, subject, startDate, endDate, submitted, notSubmitted }) => {
  const { t } = useTranslation();
  const total = submitted + notSubmitted;
  const submittedPercentage = total > 0 ? (submitted / total) * 100 : 0;
  const notSubmittedPercentage = total > 0 ? (notSubmitted / total) * 100 : 0;

  // Déterminer le statut du devoir basé sur la date de fin
  const isOverdue = new Date(endDate) < new Date();
  const isDueSoon = new Date(endDate) < new Date(Date.now() + 24 * 60 * 60 * 1000); // Dans les 24h

  return (
    <Link to={`/devoirs/${id}`} className="block h-full">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 relative overflow-hidden h-full hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
        {/* Header avec icône de matière */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition-colors">{title}</h3>
              <p className="text-sm text-slate-600 font-medium">{subject}</p>
            </div>
          </div>
          {/* Badge de statut */}
          {isOverdue && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              En retard
            </span>
          )}
          {!isOverdue && isDueSoon && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock className="w-3 h-3 mr-1" />
              Bientôt dû
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Début: {startDate}</span>
          </div>
          <div className={`flex items-center gap-2 font-semibold ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-slate-600'}`}>
            <Clock className="w-4 h-4" />
            <span>Fin: {endDate}</span>
          </div>
        </div>

        {/* Statistiques des soumissions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800">{submitted}</span>
                <span className="text-xs text-slate-500">{t('submitted', 'Soumis')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800">{notSubmitted}</span>
                <span className="text-xs text-slate-500">{t('not_submitted', 'Non soumis')}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{total}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>

        {/* Barre de progression améliorée */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progression</span>
            <span className="font-medium">{Math.round(submittedPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${submittedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Indicateur de survol */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>
    </Link>
  );
};

export default DevoirCard; 