import React from 'react';
import { Users, Target, AlertTriangle, FileText, Share2, Play, CheckCircle, Clock } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface PdiSessionCardProps {
  session: PdiSession;
  isSelected: boolean;
  onPublish: () => void;
  onViewDetails: () => void;
}

const PdiSessionCard: React.FC<PdiSessionCardProps> = ({
  session,
  isSelected,
  onPublish,
  onViewDetails
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return         {
          badge: <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">Programmée</span>,
          color: 'border-slate-200',
          bgColor: 'bg-slate-50',
          canOpen: true,
          buttonText: 'Démarrer',
          buttonIcon: <Play size={14} />,
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
        };
      case 'in_progress':
        return {
          badge: <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">En cours</span>,
          color: 'border-blue-200',
          bgColor: 'bg-blue-50',
          canOpen: true,
          buttonText: 'Continuer',
          buttonIcon: <Play size={14} />,
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'completed':
        return {
          badge: <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Terminée</span>,
          color: 'border-emerald-200',
          bgColor: 'bg-emerald-50',
          canOpen: true,
          buttonText: 'Réviser',
          buttonIcon: <FileText size={14} />,
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'published':
        return {
          badge: <span className="px-2 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">Publiée</span>,
          color: 'border-violet-200',
          bgColor: 'bg-violet-50',
          canOpen: false,
          buttonText: 'Consulter',
          buttonIcon: <CheckCircle size={14} />,
          buttonColor: 'bg-violet-600 hover:bg-violet-700'
        };
      default:
        return {
          badge: null,
          color: 'border-gray-200',
          bgColor: 'bg-white',
          canOpen: false,
          buttonText: 'Ouvrir',
          buttonIcon: <Play size={14} />,
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const statusConfig = getStatusConfig(session.status);
  const averageScore = Math.round(session.students.reduce((sum, s) => sum + s.globalScore, 0) / session.students.length);
  const studentsInDifficulty = session.students.filter(s => s.needsAssistance).length;

  return (
    <div 
      className={`p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? `border-blue-500 ${statusConfig.bgColor} shadow-md` 
          : `${statusConfig.color} bg-white hover:border-slate-300`
      }`}
      onClick={onViewDetails}
    >
      {/* En-tête avec date et statut */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-lg">{session.date}</h4>
          <span className="text-sm text-blue-600 font-medium">{session.className}</span>
        </div>
        {statusConfig.badge}
      </div>

      {/* Indicateurs clés */}
      <div className="space-y-2 text-sm text-slate-600 mb-4">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-500" />
          <span>{session.students.length} élèves</span>
        </div>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-emerald-500" />
          <span>Moyenne: {averageScore}%</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" />
          <span>{studentsInDifficulty} en difficulté</span>
        </div>
      </div>

      {/* Indicateurs de statut */}
      <div className="flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-2">
          {session.reportGenerated ? (
            <span className="text-green-600 flex items-center gap-1">
              <FileText size={12} />
              Rapport généré
            </span>
          ) : (
            <span className="text-orange-600 flex items-center gap-1">
              <Clock size={12} />
              Rapport en attente
            </span>
          )}
        </div>
        
        {session.published && (
          <span className="text-purple-600 flex items-center gap-1">
            <Share2 size={12} />
            Publiée
          </span>
        )}
      </div>

      {/* Actions rapides */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Cliquer pour ouvrir la séance →
        </div>
        
        {!session.published && session.status === 'completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPublish();
            }}
            className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-1 transition-colors"
            title="Publier la séance"
          >
            <Share2 size={12} />
            Publier
          </button>
        )}
      </div>

      {/* Barre de progression du statut */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-300 ${
            session.status === 'scheduled' ? 'bg-gray-400 w-1/4' :
            session.status === 'in_progress' ? 'bg-blue-500 w-2/4' :
            session.status === 'completed' ? 'bg-green-500 w-3/4' :
            session.status === 'published' ? 'bg-purple-500 w-full' :
            'bg-gray-300 w-0'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default PdiSessionCard;
