import React, { useState } from 'react';
import { Calendar, Search, Plus } from 'lucide-react';
import { PdiSession } from '../../types/pdi';
import PdiSessionCard from './PdiSessionCard';
import CreateSessionModal from './CreateSessionModal';

interface PdiSessionsListProps {
  sessions: PdiSession[];
  selectedSession: PdiSession | null;
  onSessionSelect: (session: PdiSession) => void;
  onSessionOpen: (session: PdiSession) => void;
  onSessionPublish: (session: PdiSession) => void;
  onSessionDetails: (session: PdiSession) => void;
  onCreateSession: (session: Omit<PdiSession, 'id'>) => void;
  facilitatorClasses: string[];
}

const PdiSessionsList: React.FC<PdiSessionsListProps> = ({
  sessions,
  selectedSession,
  onSessionPublish,
  onSessionDetails,
  onCreateSession,
  facilitatorClasses
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'published'>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtrage des séances
  const filteredSessions = sessions.filter(session => {
    const statusMatch = filterStatus === 'all' || session.status === filterStatus;
    const classMatch = filterClass === 'all' || session.className === filterClass;
    const searchMatch = searchTerm === '' || 
      session.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.date.includes(searchTerm);
    
    return statusMatch && classMatch && searchMatch;
  });

  // Obtenir les classes uniques
  const uniqueClasses = Array.from(new Set(sessions.map(session => session.className)));

  // Statistiques rapides
  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    inProgress: sessions.filter(s => s.status === 'in_progress').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    published: sessions.filter(s => s.status === 'published').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
            <Calendar className="text-slate-600" size={24} />
            Liste des séances
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos séances PDI avec des cartes colorées selon leur statut
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Statistiques rapides */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-slate-600">{stats.scheduled}</div>
              <div className="text-slate-400">Programmées</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{stats.inProgress}</div>
              <div className="text-slate-400">En cours</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-emerald-600">{stats.completed}</div>
              <div className="text-slate-400">Terminées</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-violet-600">{stats.published}</div>
              <div className="text-slate-400">Publiées</div>
            </div>
          </div>
          
          {/* Bouton de création */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Nouvelle séance
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher une classe ou une date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          {/* Filtre par statut */}
          <div className="min-w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'scheduled' | 'in_progress' | 'completed' | 'published')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Programmées</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
              <option value="published">Publiées</option>
            </select>
          </div>
          
          {/* Filtre par classe */}
          <div className="min-w-32">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Toutes les classes</option>
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grille des séances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => (
            <PdiSessionCard
              key={session.id}
              session={session}
              isSelected={selectedSession?.id === session.id}
              onPublish={() => onSessionPublish(session)}
              onViewDetails={() => onSessionDetails(session)}
            />
        ))}
      </div>

      {/* Message si aucune séance */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
          <h4 className="text-lg font-medium text-slate-600 mb-2">Aucune séance trouvée</h4>
          <p className="text-sm text-slate-500 mb-4">
            {searchTerm || filterStatus !== 'all' || filterClass !== 'all' 
              ? 'Modifiez vos critères de recherche ou filtres' 
              : 'Créez votre première séance PDI'}
          </p>
          {(!searchTerm && filterStatus === 'all' && filterClass === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Créer une séance
            </button>
          )}
        </div>
      )}

      {/* Modal de création */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSession={onCreateSession}
        facilitatorClasses={facilitatorClasses}
      />
    </div>
  );
};

export default PdiSessionsList;
