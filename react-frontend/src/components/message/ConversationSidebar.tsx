import React, { useState } from 'react';
import { useConversations, useCreateConversation } from '../../hooks/useMessageConversations';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { Plus } from 'lucide-react';
import type { ConversationCreate } from '../../api/message-service/api';

interface Props {
  selectedId?: string;
  onSelect: (conversationId: string) => void;
}

const ConversationSidebar: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { data: apiConversations, isLoading } = useConversations();
  const createMutation = useCreateConversation();
  useRealtimeSync(); // Synchronisation temps réel des conversations
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [query, setQuery] = React.useState('');
  const [newMemberIds, setNewMemberIds] = useState('');
  const [newType, setNewType] = useState<'DM' | 'GROUP'>('DM');

  // Fonction pour générer une couleur aléatoire basée sur l'ID de la conversation
  const getAvatarColor = (conversationId: string) => {
    const colors = [
      'bg-red-400',
      'bg-blue-400', 
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-indigo-400',
      'bg-teal-400',
      'bg-orange-400',
      'bg-cyan-400',
      'bg-emerald-400',
      'bg-violet-400'
    ];
    
    // Utiliser l'ID pour générer un index cohérent
    let hash = 0;
    for (let i = 0; i < conversationId.length; i++) {
      hash = conversationId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  const currentUserId = (() => {
    try {
      const raw = sessionStorage.getItem('keycloak-token');
      if (!raw) return undefined;
      const parts = raw.split('.');
      if (parts.length < 2) return undefined;
      const payload = JSON.parse(atob(parts[1]));
      const sub = payload && typeof payload.sub === 'string' ? payload.sub : undefined;
      return sub;
    } catch {
      return undefined;
    }
  })();
  const source = (apiConversations || []).map(c => ({
    id: c.id,
    type: (c.type === 'GROUP' ? 'GROUP' : 'DM') as 'GROUP' | 'DM',
    title: c.title ?? 'Conversation',
    members: [],
    lastMessageAt: undefined,
    unreadCount: 0,
  }));

  const list = source
    .filter(c => (c.title || '').toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.lastMessageAt || '').localeCompare(a.lastMessageAt || ''));

  return (
    <div className="relative h-full">
    <aside className="w-full border-r border-gray-200 h-full overflow-y-auto bg-white">
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="text-lg font-semibold text-gray-800 mb-3">Discussions</div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher ou démarrer une discussion"
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 pl-10"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <ul>
        {list.length === 0 && !isLoading && (
          <li className="px-4 py-8 text-sm text-gray-500">Aucune conversation. Commencez à discuter en créant une nouvelle conversation.</li>
        )}
        {list.map(c => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedId === c.id ? 'bg-green-50 border-r-2 border-green-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(c.id)} flex items-center justify-center text-sm font-medium text-white flex-shrink-0`}>
                  {(c.title || 'C').slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{c.title || 'Sans titre'}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-between">
                    <span className="truncate">{c.type === 'GROUP' ? 'Groupe' : 'Message direct'}</span>
                    {c.unreadCount ? (
                      <span className="ml-2 text-xs bg-green-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">{c.unreadCount}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
    {/* FAB nouvelle conversation */}
    <button
      onClick={() => setModalOpen(true)}
      className="fixed md:absolute bottom-4 right-4 w-14 h-14 md:w-14 md:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center z-10 transition-all duration-200 hover:scale-105"
      title="Nouvelle conversation"
    >
      <Plus size={24} />
    </button>

    {/* Modal création */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-lg font-semibold mb-4 text-gray-800">Nouvelle conversation</div>
          <div className="grid gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value as 'DM' | 'GROUP')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="DM">DM</option>
                <option value="GROUP">Groupe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Titre (optionnel)</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nom de la conversation"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Membres (user_id séparés par des virgules)</label>
              <input
                value={newMemberIds}
                onChange={(e) => setNewMemberIds(e.target.value)}
                placeholder="ex: 8d3c..., 9a12..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="mt-1 text-[11px] text-gray-500">Ton id est ajouté automatiquement{currentUserId ? `: ${currentUserId}` : ''}. Pour un DM, saisis l'id du contact.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => setModalOpen(false)} 
              className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                const ids = newMemberIds.split(',').map(s => s.trim()).filter(Boolean);
                if (currentUserId && !ids.includes(currentUserId)) ids.unshift(currentUserId);
                if (ids.length < 2) return;
                try {
                  const payload: ConversationCreate = {
                    type: newType,
                    title: newTitle || undefined,
                    members: ids.map(id => ({ user_id: id })),
                  };
                  await createMutation.mutateAsync(payload);
                  setNewTitle('');
                  setNewMemberIds('');
                  setModalOpen(false);
                } catch {
                  // noop
                }
              }}
              className="px-4 py-2 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default ConversationSidebar;


