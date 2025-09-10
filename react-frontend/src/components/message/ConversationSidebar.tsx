import React from 'react';
import { useChat } from '../../contexts/ChatContext';

interface Props {
  selectedId?: string;
  onSelect: (conversationId: string) => void;
}

const ConversationSidebar: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { conversations, presenceByUser, typingByConversation, messagesByConversation } = useChat();
  const [query, setQuery] = React.useState('');
  const list = Object.values(conversations)
    .filter(c => (c.title || '').toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.lastMessageAt || '').localeCompare(a.lastMessageAt || ''));

  return (
    <aside className="w-80 border-r border-gray-200 h-full overflow-y-auto bg-white">
      <div className="p-3">
        <div className="text-base font-semibold text-gray-800 mb-3">Discussions</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher ou démarrer une discussion"
          className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <ul>
        {list.map(c => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${selectedId === c.id ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-xs font-semibold text-green-800">
                  {(c.title || 'C').slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{c.title || 'Sans titre'}</span>
                    <span className="text-[11px] text-gray-400">
                      {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    {/* Aperçu dernier message */}
                    <span className="truncate">
                      {(() => {
                        const arr = messagesByConversation[c.id] || [];
                        const last = arr[arr.length - 1];
                        return last ? (last.senderId === 'me' ? `Vous: ${last.content}` : last.content) : (c.type === 'GROUP' ? 'Groupe' : 'Message direct');
                      })()}
                    </span>
                {/* Présence (si 1-1 on montre le contact) */}
                {c.type === 'DM' ? (() => {
                  const other = c.members.find(m => m.userId !== 'me');
                  const p = other ? presenceByUser[other.userId] : undefined;
                  return p ? (
                    <span className={`inline-flex items-center gap-1 ${p.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {p.status}
                    </span>
                  ) : null;
                })() : null}
                {/* Typing */}
                {typingByConversation[c.id] && Object.entries(typingByConversation[c.id]).some(([uid, val]) => uid !== 'me' && val) && (
                  <span className="text-green-600">écrit…</span>
                )}
                  </div>
                </div>
                {c.unreadCount ? (
                  <span className="ml-2 text-xs bg-green-500 text-white rounded-full px-2 py-0.5">{c.unreadCount}</span>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ConversationSidebar;


