import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResources } from '../../contexts/ResourceContext';
import { useAuth } from '../../pages/authentification/useAuth';
import { History, User, Calendar, FileText, Eye, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const AuditTrail: React.FC = () => {
  const { t } = useTranslation();
  const { getAuditLogs } = useResources();
  const { roles } = useAuth();
  
  // Permissions : uniquement la direction peut voir l'audit
  const canViewAudit = roles.includes('directeur') || roles.includes('administrateur');
  
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  
  const auditLogs = getAuditLogs();

  if (!canViewAudit) {
    return null; // Masquer complètement pour les autres rôles
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'ARCHIVE': return 'bg-orange-100 text-orange-800';
      case 'RESTORE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'ARCHIVE': return '📦';
      case 'RESTORE': return '🔄';
      default: return '📝';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterUser !== 'all' && log.userId !== filterUser) return false;
    return true;
  });

  const uniqueUsers = [...new Set(auditLogs.map(log => log.userId))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <History className="w-4 h-4" />
          {t('audit_trail', 'Journal d\'audit')} ({auditLogs.length})
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t('audit_trail', 'Journal d\'audit')}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {t('audit_description', 'Historique de toutes les actions effectuées sur les ressources')}
          </p>
        </DialogHeader>
        
        {/* Filtres */}
        <div className="flex gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter_by_action', 'Filtrer par action')}
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">{t('all_actions', 'Toutes les actions')}</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {t(`action_${action.toLowerCase()}`, action)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter_by_user', 'Filtrer par utilisateur')}
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">{t('all_users', 'Tous les utilisateurs')}</option>
              {uniqueUsers.map(userId => (
                <option key={userId} value={userId}>
                  {userId}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Liste des logs */}
        <div className="space-y-3 mt-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('no_audit_logs', 'Aucun log d\'audit disponible')}</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getActionIcon(log.action)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {t(`action_${log.action.toLowerCase()}`, log.action)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t('resource_id', 'Ressource')} #{log.resourceId}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900 mb-2">{log.details}</p>
                    
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {t('changes', 'Changements')}:
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          {Object.entries(log.changes).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log.userId} ({log.userRole})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Statistiques */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{auditLogs.length}</div>
              <div className="text-sm text-blue-700">{t('total_actions', 'Actions totales')}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {auditLogs.filter(log => log.action === 'CREATE').length}
              </div>
              <div className="text-sm text-green-700">{t('creations', 'Créations')}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">
                {auditLogs.filter(log => log.action === 'UPDATE').length}
              </div>
              <div className="text-sm text-orange-700">{t('modifications', 'Modifications')}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditTrail; 