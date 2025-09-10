import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Users } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface SessionAlertsProps {
  session: PdiSession;
}

const SessionAlerts: React.FC<SessionAlertsProps> = ({ session }) => {
  const alerts = [];

  // Vérification des élèves en difficulté critique
  const criticalStudents = session.students.filter(s => s.difficultyLevel === 'critique').length;
  const studentsInDifficulty = session.students.filter(s => s.needsAssistance).length;
  const averageScore = Math.round(session.students.reduce((sum, s) => sum + s.globalScore, 0) / session.students.length);

  // Alertes critiques
  if (criticalStudents > 0) {
    alerts.push({
      type: 'critical',
      icon: <AlertCircle size={16} />,
      title: 'Intervention urgente requise',
      message: `${criticalStudents} élève(s) en difficulté critique (< 30%)`,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-500'
    });
  }

  // Alertes importantes
  if (studentsInDifficulty > session.students.length * 0.5) {
    alerts.push({
      type: 'warning',
      icon: <AlertTriangle size={16} />,
      title: 'Attention requise',
      message: `Plus de 50% des élèves (${studentsInDifficulty}/${session.students.length}) en difficulté`,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-500'
    });
  }

  // Alertes de workflow
  if (session.status === 'completed' && !session.reportGenerated) {
    alerts.push({
      type: 'info',
      icon: <Clock size={16} />,
      title: 'Action requise',
      message: 'Séance terminée - Générer le rapport pour poursuivre',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-500'
    });
  }

  // Validation moyenne classe
  if (averageScore < 50) {
    alerts.push({
      type: 'warning',
      icon: <Users size={16} />,
      title: 'Moyenne de classe faible',
      message: `Moyenne générale: ${averageScore}% - Révision des méthodes recommandée`,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-500'
    });
  }

  // Message de succès
  if (session.status === 'published') {
    alerts.push({
      type: 'success',
      icon: <CheckCircle size={16} />,
      title: 'Séance publiée avec succès',
      message: 'Les parents ont été notifiés et peuvent consulter le rapport',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-500'
    });
  }

  // Message d'information pour les nouvelles séances
  if (session.status === 'scheduled' && session.students.length === 0) {
    alerts.push({
      type: 'info',
      icon: <Info size={16} />,
      title: 'Séance programmée',
      message: 'Les données des élèves seront chargées automatiquement au démarrage',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      iconColor: 'text-slate-500'
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-4 rounded-lg border ${alert.bgColor} ${alert.borderColor}`}
        >
          <div className={`flex-shrink-0 ${alert.iconColor} mt-0.5`}>
            {alert.icon}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium text-sm ${alert.textColor} mb-1`}>
              {alert.title}
            </h4>
            <p className={`text-sm ${alert.textColor} opacity-90`}>
              {alert.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionAlerts;
