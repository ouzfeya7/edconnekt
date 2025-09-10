import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFacilitators, Facilitator } from '../lib/mock-data';
import { PdiSession } from '../types/pdi';
import { createPdiSessionsForFacilitator } from '../lib/pdi-session-utils';

// Import des nouveaux composants
import PdiNavigationSidebar from '../components/pdi/PdiNavigationSidebar';
import PdiSessionsList from '../components/pdi/PdiSessionsList';
import SessionDetailView from '../components/pdi/SessionDetailView';
import ReportHistory from '../components/pdi/ReportHistory';
import HelpDocumentation from '../components/pdi/HelpDocumentation';
import {
  ArrowLeft
} from 'lucide-react';


const PdiDetailPage: React.FC = () => {
  const { facilitatorId } = useParams<{ facilitatorId: string }>();
  const navigate = useNavigate();
  const facilitator = mockFacilitators.find((f: Facilitator) => f.id === facilitatorId);

  // États pour la navigation et la gestion des séances
  const [activeView, setActiveView] = useState<'sessions' | 'history' | 'help'>('sessions');
  const [sessions, setSessions] = useState<PdiSession[]>(facilitator ? createPdiSessionsForFacilitator(facilitator) : []);
  const [selectedSession, setSelectedSession] = useState<PdiSession | null>(null);
  const [detailSession, setDetailSession] = useState<PdiSession | null>(null);

  // Mettre à jour les sessions quand le facilitateur change
  useEffect(() => {
    if (facilitator) {
      const newSessions = createPdiSessionsForFacilitator(facilitator);
      setSessions(newSessions);
      setSelectedSession(null); // Réinitialiser la sélection
    }
  }, [facilitator]);

  if (!facilitator) {
    return <div className="p-6">Facilitateur non trouvé.</div>;
  }

  // Fonctions de gestion des séances
  const handleSessionSelect = (session: PdiSession) => {
    setSelectedSession(session);
  };

  const handleSessionOpen = (session: PdiSession) => {
    // Transition automatique du statut selon la tactique UX
    let newStatus = session.status;
    
    if (session.status === 'scheduled') {
      newStatus = 'in_progress';
    }
    
    // Mettre à jour le statut de la séance
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, status: newStatus } : s
    ));
    
    setSelectedSession({ ...session, status: newStatus });
    console.log(`Séance ${session.id} ouverte avec statut: ${newStatus}`);
  };

  const handleSessionPublish = (session: PdiSession) => {
    if (session.published) {
      if (window.confirm('Cette séance a déjà été publiée. Une nouvelle version nécessite l\'accord de la direction. Continuer ?')) {
        console.log('Demande d\'accord direction pour nouvelle version');
        alert('Demande d\'accord direction envoyée. Vous serez notifié de la réponse.');
      }
    } else {
      // Publier la séance avec génération automatique du rapport
        setSessions(prev => prev.map(s => 
        s.id === session.id ? { 
          ...s, 
          status: 'published' as const,
          reportGenerated: true, 
          published: true 
        } : s
      ));
      
      if (selectedSession?.id === session.id) {
        setSelectedSession({ 
          ...session, 
          status: 'published' as const,
          reportGenerated: true, 
          published: true 
        });
      }
      
      console.log(`Séance ${session.id} publiée avec succès`);
    }
  };

  const handleCreateSession = (newSessionData: Omit<PdiSession, 'id'>) => {
    const newSession: PdiSession = {
      ...newSessionData,
      id: `session-${Date.now()}` // ID unique basé sur le timestamp
    };
    
    setSessions(prev => [...prev, newSession]);
    console.log('Nouvelle séance créée:', newSession);
  };

  const handleSessionDetails = (session: PdiSession) => {
    setDetailSession(session);
  };

  const handleSessionAction = (action: 'start' | 'complete' | 'generate_report' | 'publish') => {
    if (!detailSession) return;

    const updatedSession = { ...detailSession };

    switch (action) {
      case 'start':
        updatedSession.status = 'in_progress';
        break;
      case 'complete':
        updatedSession.status = 'completed';
        break;
      case 'generate_report':
        updatedSession.reportGenerated = true;
        break;
      case 'publish':
        updatedSession.status = 'published';
        updatedSession.published = true;
        break;
    }

    // Mettre à jour la session dans la liste
    setSessions(prev => prev.map(s => 
      s.id === detailSession.id ? updatedSession : s
    ));
    
    // Mettre à jour la session de détail
    setDetailSession(updatedSession);
    
    console.log(`Action ${action} effectuée sur la séance ${detailSession.id}`);
  };

  const handleDownloadReport = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      console.log('Téléchargement du rapport pour:', session.className);
      // Simulation du téléchargement
      const link = document.createElement('a');
      link.href = '#';
      link.download = `rapport-pdi-${session.className}-${session.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Navigation latérale persistante */}
      <PdiNavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        facilitatorName={facilitator.name}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête avec fil d'Ariane */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/pdi')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Retour aux facilitateurs</span>
            </button>
            <div className="text-sm text-slate-300">•</div>
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">{facilitator.name}</span>
              <span className="ml-2">({facilitator.classes.join(', ')})</span>
            </div>
          </div>
          </div>
          
        {/* Zone de contenu avec défilement */}
        <div className="flex-1 overflow-auto">
        <div className="p-6">
            {/* Vue "Séances en cours" */}
            {activeView === 'sessions' && !detailSession && (
              <PdiSessionsList
                sessions={sessions}
                selectedSession={selectedSession}
                onSessionSelect={handleSessionSelect}
                onSessionOpen={handleSessionOpen}
                onSessionPublish={handleSessionPublish}
                onSessionDetails={handleSessionDetails}
                onCreateSession={handleCreateSession}
                facilitatorClasses={facilitator.classes}
              />
            )}

            {/* Vue détaillée d'une séance */}
            {activeView === 'sessions' && detailSession && (
              <SessionDetailView
                session={detailSession}
                onBack={() => setDetailSession(null)}
                onSessionAction={handleSessionAction}
              />
            )}

            {/* Vue "Historique & rapports" */}
            {activeView === 'history' && (
            <div className="space-y-6">
              <div>
                  <h2 className="text-2xl font-bold text-slate-800">Historique & Rapports</h2>
                  <p className="text-slate-600 mt-1">Consultez l'historique complet et les rapports publiés</p>
              </div>
              
              <ReportHistory
                sessions={sessions}
                onDownloadReport={handleDownloadReport}
                onViewSession={handleSessionDetails}
              />
                      </div>
                    )}
                    
            {/* Vue "Aide" */}
            {activeView === 'help' && <HelpDocumentation />}
            </div>
          </div>
      </div>
    </div>
  );
};

export default PdiDetailPage; 