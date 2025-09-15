import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, Users, FileText, Share2, CheckCircle, AlertTriangle, List, Target, Save, Check } from 'lucide-react';
import { PdiSession } from '../../types/pdi';
import WorkflowBreadcrumb from './WorkflowBreadcrumb';
import SessionAlerts from './SessionAlerts';
import SessionKPIs from './SessionKPIs';
import ReportPreview from './ReportPreview';

interface SessionDetailViewProps {
  session: PdiSession;
  onBack: () => void;
  onSessionAction: (action: 'start' | 'complete' | 'generate_report' | 'publish') => void;
}

const SessionDetailView: React.FC<SessionDetailViewProps> = ({
  session,
  onBack,
  onSessionAction
}) => {
  const [viewMode, setViewMode] = useState<'difficulty' | 'complete'>('difficulty');
  const [editableObservations, setEditableObservations] = useState(
    session.students.reduce((acc, student) => ({
      ...acc,
      [student.id]: student.observations || ''
    }), {} as Record<string, string>)
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fonction de sauvegarde
  const saveObservations = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ici, on appellerait l'API pour sauvegarder
      console.log('Observations sauvegardées:', editableObservations);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [editableObservations]);

  // Auto-save avec debounce
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      if (session.status !== 'published') {
        saveObservations();
      }
    }, 2000); // Sauvegarde après 2 secondes d'inactivité

    setAutoSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [editableObservations, saveObservations, session.status, autoSaveTimeout]);

  // Fonction de génération de rapport
  const handleGenerateReport = useCallback(() => {
    console.log('Génération du rapport pour la séance:', session.id);
    onSessionAction('generate_report');
  }, [session.id, onSessionAction]);

  // Fonction de téléchargement PDF
  const handleDownloadPDF = useCallback(() => {
    console.log('Téléchargement du rapport PDF pour la séance:', session.id);
    
    // Simulation du téléchargement
    const link = document.createElement('a');
    link.href = '#'; // Ici, on mettrait l'URL du PDF généré
    link.download = `rapport-pdi-${session.className}-${session.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Dans une vraie application, on ferait un appel API pour récupérer le PDF
  }, [session.className, session.date, session.id]);
  const getActionButton = () => {
    switch (session.status) {
      case 'scheduled':
        return (
          <button
            onClick={() => onSessionAction('start')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Calendar size={18} />
            Démarrer la séance
          </button>
        );
      
      case 'in_progress':
        return (
          <button
            onClick={() => onSessionAction('complete')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Users size={18} />
            Terminer la saisie
          </button>
        );
      
      case 'completed':
        if (!session.reportGenerated) {
          return (
            <button
              onClick={() => onSessionAction('generate_report')}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <FileText size={18} />
              Générer le rapport
            </button>
          );
        } else {
          return (
            <button
              onClick={() => onSessionAction('publish')}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <Share2 size={18} />
              Publier la séance
            </button>
          );
        }
      
      case 'published':
        return (
          <div className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} />
            Séance publiée
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour à la liste</span>
          </button>
          
          <div className="border-l border-slate-300 pl-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Séance PDI - {session.className}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {session.date} • {session.students.length} élèves
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getActionButton()}
        </div>
      </div>

      {/* Fil d'Ariane du workflow */}
      <WorkflowBreadcrumb session={session} />

      {/* Alertes et validations */}
      <SessionAlerts session={session} />

      {/* Mini-KPIs */}
      <SessionKPIs session={session} />

      {/* Toggle entre vue difficultés et vue complète */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* En-tête avec toggle */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Élèves de la séance</h3>
            
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('difficulty')}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                  viewMode === 'difficulty' 
                    ? 'bg-white text-red-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <AlertTriangle size={16} />
                En difficulté
              </button>
              <button
                onClick={() => setViewMode('complete')}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                  viewMode === 'complete' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List size={16} />
                Liste complète
              </button>
            </div>
          </div>
        </div>

        {/* Contenu selon le mode */}
        <div className="p-4">
          {viewMode === 'difficulty' ? (
            <div>
              <div className="text-sm text-slate-600 mb-4">
                Élèves nécessitant une attention particulière (score &lt; 70% ou en baisse)
              </div>
              
              {/* Légende des couleurs */}
              <div className="mb-4 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="text-xs font-medium text-slate-700 mb-2">Code couleur des scores :</div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">25%</span>
                    <span className="text-slate-600">&lt; 30% - Critique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">45%</span>
                    <span className="text-slate-600">30-49% - Urgent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">65%</span>
                    <span className="text-slate-600">50-69% - Attention</span>
                  </div>
                </div>
              </div>
              {session.students.filter(student => student.needsAssistance).length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Target className="mx-auto mb-2" size={24} />
                  <p>Aucun élève en difficulté détecté</p>
                  <p className="text-sm">Excellent travail de classe !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {session.students
                    .filter(student => student.needsAssistance)
                    .map(student => {
                      // Badge de score avec couleurs douces
                      const getScoreBadge = (score: number) => {
                        if (score < 30) return 'bg-red-200 text-red-800';        // Rouge doux - Critique
                        if (score < 50) return 'bg-orange-200 text-orange-800';  // Orange doux - Urgent  
                        if (score < 70) return 'bg-yellow-200 text-yellow-800';  // Jaune doux - Attention
                        return 'bg-slate-200 text-slate-800';
                      };
                      
                      return (
                      <div key={student.id} className="border border-slate-200 bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800">{student.name}</h4>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreBadge(student.globalScore)}`}>
                            {student.globalScore}%
                          </span>
                        </div>
                        <div className="text-sm text-slate-700 mb-2">
                          <strong>Alertes:</strong> {student.alerts.map(alert => alert.message).join(', ')}
                        </div>
                        <div className="text-sm text-slate-600">
                          {student.observations || 'Aucune observation spécifique'}
                        </div>
                      </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-600">
                  Liste complète des élèves avec observations éditables
                  {session.status === 'published' && (
                    <span className="text-amber-600 ml-2">(lecture seule - séance publiée)</span>
                  )}
                </div>
                
                {/* Indicateur de sauvegarde */}
                {session.status !== 'published' && (
                  <div className="flex items-center gap-2 text-xs">
                    {saveStatus === 'saving' && (
                      <>
                        <Save className="animate-pulse" size={14} />
                        <span className="text-blue-600">Sauvegarde...</span>
                      </>
                    )}
                    {saveStatus === 'saved' && (
                      <>
                        <Check size={14} />
                        <span className="text-green-600">Sauvegardé</span>
                      </>
                    )}
                    {saveStatus === 'error' && (
                      <>
                        <AlertTriangle size={14} />
                        <span className="text-red-600">Erreur de sauvegarde</span>
                      </>
                    )}
                    {saveStatus === 'idle' && (
                      <>
                        <span className="text-slate-500">Auto-save activé</span>
                        <button
                          onClick={saveObservations}
                          className="text-blue-600 hover:text-blue-800 underline ml-2"
                          title="Sauvegarder manuellement"
                        >
                          Sauvegarder maintenant
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {session.students.map(student => (
                  <div key={student.id} className={`border rounded-lg p-4 ${
                    student.needsAssistance ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-slate-800">{student.name}</h4>
                        {student.needsAssistance && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Difficulté
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        student.globalScore >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.globalScore}%
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Observations
                      </label>
                      <textarea
                        value={editableObservations[student.id]}
                        onChange={(e) => setEditableObservations(prev => ({
                          ...prev,
                          [student.id]: e.target.value
                        }))}
                        disabled={session.status === 'published'}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm resize-none ${
                          session.status === 'published' 
                            ? 'bg-slate-50 text-slate-500 cursor-not-allowed' 
                            : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        rows={2}
                        placeholder="Ajouter des observations pour cet élève..."
                      />
                    </div>
                    
                    {student.alerts.length > 0 && (
                      <div className="text-xs text-slate-600">
                        <strong>Alertes:</strong> {student.alerts.map(alert => alert.message).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu selon l'état */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {session.status === 'scheduled' && 'Préparation de la séance'}
          {session.status === 'in_progress' && 'Saisie des données'}
          {session.status === 'completed' && 'Révision et validation'}
          {session.status === 'published' && 'Séance finalisée'}
        </h3>

        {session.status === 'scheduled' && (
          <div className="space-y-4">
            <p className="text-slate-600">
              La séance est programmée et prête à être démarrée. Les données des élèves seront 
              automatiquement chargées lors du démarrage.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Préparatifs</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Vérifier la liste des élèves présents</li>
                <li>• Préparer les supports pédagogiques</li>
                <li>• S'assurer que l'environnement est propice</li>
              </ul>
            </div>
          </div>
        )}

        {session.status === 'in_progress' && (
          <div className="space-y-4">
            <p className="text-slate-600">
              Séance en cours. Procédez à la saisie des observations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-700 mb-2">Actions à effectuer</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Noter les observations individuelles</li>
                  <li>• Rédiger des observations générales</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 mb-2">Rappels</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Focus sur les élèves en difficulté</li>
                  <li>• Documenter les progrès observés</li>
                  <li>• Noter les recommandations</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {session.status === 'completed' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Mode révision
              </h4>
              <p className="text-sm text-orange-600">
                Vous êtes en mode révision. Vérifiez toutes les données saisies avant de générer le rapport.
              </p>
            </div>
            
            {/* Prévisualisation du rapport */}
            <ReportPreview
              session={session}
              onGenerate={handleGenerateReport}
              onDownload={handleDownloadPDF}
            />
          </div>
        )}

        {session.status === 'published' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-medium text-emerald-700 mb-2">Publication réussie</h4>
              <p className="text-sm text-emerald-600">
                Les parents ont été notifiés par email et peuvent consulter le rapport 
                détaillé de la séance.
              </p>
              
              <div className="mt-3 pt-3 border-t border-emerald-100">
                <p className="text-xs text-emerald-600">
                  Publié le {session.publishedAt || new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            {/* Rapport final publié */}
            <ReportPreview
              session={session}
              onGenerate={handleGenerateReport}
              onDownload={handleDownloadPDF}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetailView;
