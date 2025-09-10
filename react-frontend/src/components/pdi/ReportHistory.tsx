import React, { useState } from 'react';
import { Download, FileText, Calendar, Eye, Filter, Search, ExternalLink } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface ReportHistoryProps {
  sessions: PdiSession[];
  onDownloadReport: (sessionId: string) => void;
  onViewSession: (session: PdiSession) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ sessions, onDownloadReport, onViewSession }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'completed'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');

  // Filtrer les séances avec rapports
  const sessionsWithReports = sessions.filter(session => 
    session.reportGenerated && (session.status === 'completed' || session.status === 'published')
  );

  // Appliquer les filtres
  const filteredSessions = sessionsWithReports.filter(session => {
    const matchesSearch = session.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.date.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    // Filtre par date (simulation)
    let matchesDate = true;
    if (dateRange !== 'all') {
      // Ici, on pourrait implémenter la logique de filtre par date
      matchesDate = true;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string, published: boolean) => {
    if (status === 'published') {
      return <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">Publié</span>;
    }
    if (status === 'completed') {
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Terminé</span>;
    }
    return <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">Autre</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* En-tête avec filtres */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="text-slate-600" size={20} />
            <div>
              <h3 className="font-semibold text-slate-800">Historique des rapports</h3>
              <p className="text-sm text-slate-600">{filteredSessions.length} rapport(s) disponible(s)</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          {/* Recherche */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher par classe ou date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Terminés</option>
            <option value="published">Publiés</option>
          </select>

          {/* Filtre par période */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les périodes</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
        </div>
      </div>

      {/* Table des rapports */}
      <div className="overflow-x-auto">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-slate-300" size={48} />
            <h4 className="text-lg font-medium text-slate-500 mb-2">Aucun rapport trouvé</h4>
            <p className="text-slate-400">
              {searchTerm || statusFilter !== 'all' || dateRange !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Les rapports générés apparaîtront ici'
              }
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-medium text-slate-700">Séance</th>
                <th className="text-left p-4 font-medium text-slate-700">Date</th>
                <th className="text-left p-4 font-medium text-slate-700">Statut</th>
                <th className="text-left p-4 font-medium text-slate-700">Élèves</th>
                <th className="text-left p-4 font-medium text-slate-700">Score moyen</th>
                <th className="text-left p-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const averageScore = Math.round(
                  session.students.reduce((sum, student) => sum + student.globalScore, 0) / session.students.length
                );
                const studentsInDifficulty = session.students.filter(student => student.needsAssistance).length;

                return (
                  <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{session.className}</p>
                          <p className="text-sm text-slate-500">ID: {session.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-slate-400" size={14} />
                        <span className="text-sm text-slate-700">{session.date}</span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(session.status, session.published)}
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-slate-700">{session.students.length} élèves</p>
                        {studentsInDifficulty > 0 && (
                          <p className="text-red-600">{studentsInDifficulty} en difficulté</p>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        averageScore >= 70 ? 'bg-green-100 text-green-800' :
                        averageScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {averageScore}%
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewSession(session)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => onDownloadReport(session.id)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Télécharger le rapport"
                        >
                          <Download size={16} />
                        </button>
                        
                        {session.status === 'published' && (
                          <button
                            className="p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                            title="Voir le rapport partagé"
                          >
                            <ExternalLink size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer avec statistiques */}
      {filteredSessions.length > 0 && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex gap-6">
              <span>
                <strong>{filteredSessions.filter(s => s.status === 'published').length}</strong> publiés
              </span>
              <span>
                <strong>{filteredSessions.filter(s => s.status === 'completed').length}</strong> en attente
              </span>
            </div>
            <div>
              <span>Total: <strong>{filteredSessions.length}</strong> rapports</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
