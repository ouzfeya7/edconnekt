import React from 'react';
import { Check, Circle, Clock, FileText, Share2 } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface WorkflowBreadcrumbProps {
  session: PdiSession;
}

const WorkflowBreadcrumb: React.FC<WorkflowBreadcrumbProps> = ({ session }) => {
  const steps = [
    {
      id: 'preparation',
      label: 'Préparation',
      icon: <Circle size={16} />,
      description: 'Séance programmée',
      isCompleted: ['in_progress', 'completed', 'published'].includes(session.status),
      isCurrent: session.status === 'scheduled'
    },
    {
      id: 'saisie',
      label: 'Saisie',
      icon: <Clock size={16} />,
      description: 'Données collectées',
      isCompleted: ['completed', 'published'].includes(session.status),
      isCurrent: session.status === 'in_progress'
    },
    {
      id: 'rapport',
      label: 'Rapport',
      icon: <FileText size={16} />,
      description: 'Rapport généré',
      isCompleted: session.reportGenerated && ['completed', 'published'].includes(session.status),
      isCurrent: session.status === 'completed' && !session.reportGenerated
    },
    {
      id: 'publication',
      label: 'Publication',
      icon: <Share2 size={16} />,
      description: 'Partagé avec parents',
      isCompleted: session.status === 'published',
      isCurrent: session.status === 'completed' && session.reportGenerated
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-slate-700 mb-3">Progression de la séance</h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Étape */}
            <div className="flex flex-col items-center">
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step.isCompleted 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : step.isCurrent
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {step.isCompleted ? (
                  <Check size={16} />
                ) : (
                  step.icon
                )}
              </div>
              
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  step.isCompleted 
                    ? 'text-emerald-600' 
                    : step.isCurrent
                      ? 'text-blue-600'
                      : 'text-slate-500'
                }`}>
                  {step.label}
                </div>
                <div className={`text-xs mt-0.5 ${
                  step.isCompleted || step.isCurrent
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}>
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connecteur */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                steps[index + 1].isCompleted || step.isCompleted
                  ? 'bg-emerald-300'
                  : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowBreadcrumb;
