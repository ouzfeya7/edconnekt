import React, { useEffect, useMemo, useRef, useState } from 'react';
import edcLogo from '../../assets/logo.svg';
import { useChat } from '../../contexts/ChatContext';
import { useConversationMessages, useEditMessage, useDeleteMessage } from '../../hooks/useMessageMessages';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import type { ChatMessage } from '../../types/chat';

interface Props {
  conversationId?: string;
  onClose?: () => void;
}

const ConversationThread: React.FC<Props> = ({ conversationId, onClose }) => {
  const { messagesByConversation, typingByConversation, conversations, presenceByUser, wsStatus } = useChat();
  const { data: apiMessages } = useConversationMessages(conversationId);
  const { isPolling } = useRealtimeSync(conversationId);
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

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
  
  // Récupérer l'ID de l'utilisateur connecté depuis le token Keycloak
  const currentUserId = (() => {
    try {
      const raw = sessionStorage.getItem('keycloak-token');
      if (!raw) return undefined;
      const parts = raw.split('.');
      if (parts.length < 2) return undefined;
      const payload = JSON.parse(atob(parts[1]));
      return payload?.sub;
    } catch {
      return undefined;
    }
  })();
  const messages = useMemo(() => {
    if (!conversationId) return [];
    if (apiMessages && apiMessages.length > 0) {
      return apiMessages.map(m => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        type: 'TEXT' as const,
        content: typeof m.content === 'object' && m.content && 'text' in (m.content as Record<string, unknown>) ? String((m.content as Record<string, unknown>).text) : JSON.stringify(m.content),
        createdAt: new Date().toISOString(),
      }));
    }
    return messagesByConversation[conversationId] || [];
  }, [conversationId, apiMessages, messagesByConversation]);
  const convo = conversationId ? conversations[conversationId] : undefined;

  const convTyping = conversationId ? typingByConversation[conversationId] : undefined;
  const someoneTyping = !!(convTyping && Object.entries(convTyping).some(([uid, v]) => uid !== currentUserId && v));

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [conversationId, messages.length, someoneTyping]);

  return (
    <div className="flex-1 bg-white flex flex-col">
      {conversationId ? (
        <>
          <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-[#f0f2f5] flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 ${conversationId ? getAvatarColor(conversationId) : 'bg-gray-300'} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}>
                <span className="text-white font-medium text-sm">
                  {(convo?.title || (convo?.type === 'GROUP' ? 'Groupe' : 'Message direct') || 'Conversation').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-medium text-gray-900 truncate">
                  {convo?.title || (convo?.type === 'GROUP' ? 'Groupe' : 'Message direct') || 'Conversation'}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  {convo?.type === 'GROUP' ? (
                    <span>Groupe</span>
                  ) : (
                    (() => {
                      const other = convo?.members.find(m => m.userId !== currentUserId);
                      const p = other ? presenceByUser[other.userId] : undefined;
                      return p ? (
                        <span className={`inline-flex items-center gap-1 ${p.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${p.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {p.status === 'online' ? 'en ligne' : 'hors-ligne'}
                        </span>
                      ) : <span className="text-gray-400">hors-ligne</span>;
                    })()
                  )}
                  {someoneTyping && <span className="text-orange-600">écrit…</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Indicateur de statut de connexion */}
              <div className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  wsStatus === 'connected' ? 'bg-green-500' : 
                  wsStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className="text-gray-500">
                  {wsStatus === 'connected' ? 'En ligne' : 
                   isPolling ? 'Synchronisation...' :
                   'Hors ligne'}
                </span>
              </div>
              
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm md:hidden">
                ← Retour
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm hidden md:block">
                Fermer
              </button>
            </div>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-1 md:p-2" style={{ 
            backgroundColor: '#efeae2', 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d1d5db" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}>
            <div className="space-y-1">
              {messages.map((m, index) => {
                const isMe = currentUserId && m.senderId === currentUserId;
                const time = new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const isEditing = editingId === m.id;
                const isDeleted = (m as unknown as { deleted?: boolean }).deleted === true;
                const isEdited = (m as unknown as { edited?: boolean }).edited === true;
                
                // Groupement des messages consécutifs
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
                const isFirstInGroup = !prevMessage || prevMessage.senderId !== m.senderId;
                const isLastInGroup = !nextMessage || nextMessage.senderId !== m.senderId;
                
                return (
                  <div key={m.id} className={`group relative flex ${isMe ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}>
                    <div className={`relative px-3 py-2 pr-16 text-sm shadow-sm inline-block max-w-[85%] md:max-w-[70%] ${
                      isMe 
                        ? 'bg-gradient-to-br from-[#dcf8c6] to-[#dcf8c6] text-gray-800' 
                        : 'bg-white text-gray-800'
                    } ${
                      isFirstInGroup && isLastInGroup 
                        ? 'rounded-2xl' 
                        : isFirstInGroup 
                          ? (isMe ? 'rounded-t-2xl rounded-bl-2xl rounded-br-md' : 'rounded-t-2xl rounded-br-2xl rounded-bl-md')
                          : isLastInGroup 
                            ? (isMe ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-md' : 'rounded-b-2xl rounded-tr-2xl rounded-tl-md')
                            : (isMe ? 'rounded-tl-2xl rounded-tr-md rounded-bl-2xl rounded-br-md' : 'rounded-tr-2xl rounded-tl-md rounded-br-2xl rounded-bl-md')
                    }`} style={{
                      boxShadow: isMe 
                        ? '0 1px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1)' 
                        : '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {isDeleted ? (
                        <span className={`${isMe ? 'text-white/80' : 'text-gray-500'}`}>Ce message a été supprimé</span>
                      ) : isEditing ? (
                        <input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className={`w-full bg-transparent outline-none ${isMe ? 'placeholder-white/70' : 'placeholder-gray-400'}`}
                        />
                      ) : (
                        <span>
                          {(() => {
                            const mc = m as unknown as { type?: string; content?: unknown };
                            if (mc.type === 'FILE' && mc.content && typeof mc.content === 'object') {
                              const obj = mc.content as Record<string, unknown>;
                              const key = typeof obj.key === 'string' ? obj.key : undefined;
                              const filename = typeof obj.filename === 'string' ? obj.filename : 'fichier';
                              const contentType = typeof obj.contentType === 'string' ? obj.contentType : '';
                              if (contentType.startsWith('image/') && key) {
                                return <img src={`/files/${key}`} alt={filename} className="max-w-[220px] rounded" />;
                              }
                              if (key) {
                                return <a href={`/files/${key}`} target="_blank" rel="noreferrer" className="underline">{filename}</a>;
                              }
                            }
                            return String(m.content);
                          })()}
                        </span>
                      )}
                      <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[11px] ${isMe ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="font-normal">{time}</span>
                        {isEdited && <span className="text-gray-400">(modifié)</span>}
                        {/* Indicateurs de statut pour les messages optimistes */}
                        {(m as ChatMessage).isOptimistic && (
                          <div className="flex items-center ml-1">
                            {(m as ChatMessage).sendingStatus === 'sending' && (
                              <div className="w-3 h-3 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
                            )}
                            {(m as ChatMessage).sendingStatus === 'sent' && (
                              <div className="w-3 h-3 text-gray-400">✓</div>
                            )}
                            {(m as ChatMessage).sendingStatus === 'failed' && (
                              <div className="w-3 h-3 text-red-500">⚠</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!isEditing && !isDeleted && isMe && (
                      <div className="absolute top-0 -right-8 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingId(m.id); setEditingText(String(m.content)); }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Éditer
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await deleteMutation.mutateAsync({ messageId: m.id });
                                } catch {
                                  // ignore, erreur déjà gérée par mutation
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Actions tactiles pour mobile */}
                    {!isEditing && !isDeleted && isMe && (
                      <div className="mt-1 flex justify-end md:hidden">
                        <div className="relative">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-10">
                            <button
                              onClick={() => { setEditingId(m.id); setEditingText(String(m.content)); }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Éditer
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await deleteMutation.mutateAsync({ messageId: m.id });
                                } catch {
                                  // ignore, erreur déjà gérée par mutation
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isEditing && (
                      <div className="mt-1 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await editMutation.mutateAsync({ messageId: m.id, payload: { content: { text: editingText } as unknown as object } });
                              setEditingId(null);
                            } catch {
                              // ignore, erreur déjà gérée par mutation
                            }
                          }}
                          className="text-xs px-2 py-1 bg-green-400 text-white rounded"
                        >Enregistrer</button>
                        <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 border rounded">Annuler</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {someoneTyping && (
                <div className="mt-4 flex justify-start">
                  <div className="rounded-2xl px-3 py-2 text-sm bg-gray-200 text-gray-600 inline-flex items-center gap-2 shadow-sm max-w-[85%] md:max-w-[70%]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500" style={{ 
          backgroundColor: '#efeae2', 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d1d5db" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <img src={edcLogo} alt="logo edconnekt" className="w-12 h-12 opacity-60" />
            </div>
            <div className="text-xl font-medium text-gray-700 mb-2">Messagerie EdConnekt</div>
            <div className="text-sm text-gray-500 max-w-sm">Sélectionnez une conversation pour commencer à discuter ou créez une nouvelle conversation.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationThread;


