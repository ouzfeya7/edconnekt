import React, { useEffect, useMemo, useRef, useState } from 'react';
import edcLogo from '../../assets/logo.svg';
import { useChat } from '../../contexts/ChatContext';
import { useConversationMessages, useEditMessage, useDeleteMessage } from '../../hooks/useMessageMessages';

interface Props {
  conversationId?: string;
  onClose?: () => void;
}

const ConversationThread: React.FC<Props> = ({ conversationId, onClose }) => {
  const { messagesByConversation, typingByConversation, conversations, presenceByUser } = useChat();
  const { data: apiMessages } = useConversationMessages(conversationId);
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
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
          <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between bg-[#f0f2f5]">
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{convo?.title || 'Conversation'}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {convo?.type === 'GROUP' ? (
                  <span>Groupe</span>
                ) : (
                  (() => {
                    const other = convo?.members.find(m => m.userId !== currentUserId);
                    const p = other ? presenceByUser[other.userId] : undefined;
                    return p ? (
                      <span className={`inline-flex items-center gap-1 ${p.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${p.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {p.status}
                      </span>
                    ) : <span className="text-gray-400">hors-ligne</span>;
                  })()
                )}
                {someoneTyping && <span className="text-orange-600">écrit…</span>}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm md:hidden">
              ← Retour
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm hidden md:block">
              Fermer
            </button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-2 md:p-4" style={{ backgroundColor: '#efeae2', backgroundImage: 'radial-gradient(circle, rgba(229, 221, 213, 0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
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
                  <div key={m.id} className={`group relative max-w-[85%] md:max-w-[70%] ${isMe ? 'ml-auto' : ''} ${isFirstInGroup ? 'mt-4' : 'mt-0.5'}`}>
                    <div className={`relative px-3 py-2 pr-16 text-sm shadow-sm ${
                      isMe 
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white' 
                        : 'bg-white text-gray-800 border border-gray-100'
                    } ${
                      isFirstInGroup && isLastInGroup 
                        ? 'rounded-2xl' 
                        : isFirstInGroup 
                          ? (isMe ? 'rounded-t-2xl rounded-bl-2xl rounded-br-md' : 'rounded-t-2xl rounded-br-2xl rounded-bl-md')
                          : isLastInGroup 
                            ? (isMe ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-md' : 'rounded-b-2xl rounded-tr-2xl rounded-tl-md')
                            : (isMe ? 'rounded-tl-2xl rounded-tr-md rounded-bl-2xl rounded-br-md' : 'rounded-tr-2xl rounded-tl-md rounded-br-2xl rounded-bl-md')
                    }`}>
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
                      <span className={`absolute bottom-1 right-2 text-[10px] font-medium ${isMe ? 'text-white/90' : 'text-gray-500'}`}>
                        {time}{isEdited ? ' (modifié)' : ''}
                      </span>
                    </div>
                    {!isEditing && !isDeleted && (
                      <div className="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <button
                          onClick={() => { setEditingId(m.id); setEditingText(String(m.content)); }}
                          className="text-xs text-gray-500 hover:text-gray-700 mr-2"
                        >Éditer</button>
                        <button
                          onClick={async () => {
                            try {
                              await deleteMutation.mutateAsync({ messageId: m.id });
                            } catch {
                              // ignore, erreur déjà gérée par mutation
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >Supprimer</button>
                      </div>
                    )}
                    {/* Actions tactiles pour mobile */}
                    {!isEditing && !isDeleted && (
                      <div className="mt-1 flex gap-2 md:hidden">
                        <button
                          onClick={() => { setEditingId(m.id); setEditingText(String(m.content)); }}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                        >Éditer</button>
                        <button
                          onClick={async () => {
                            try {
                              await deleteMutation.mutateAsync({ messageId: m.id });
                            } catch {
                              // ignore, erreur déjà gérée par mutation
                            }
                          }}
                          className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                        >Supprimer</button>
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
                <div className="max-w-[85%] md:max-w-[70%] mt-4">
                  <div className="rounded-2xl px-3 py-2 text-sm bg-gray-200 text-gray-600 inline-flex items-center gap-2 shadow-sm">
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
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <img src={edcLogo} alt="logo edconnekt" className="mx-auto mb-4 opacity-20" width={80} height={80} />
            <div className="text-lg font-medium text-gray-700">Messagerie EdConnekt</div>
            <div className="text-sm text-gray-500">Envoyez et recevez des messages en temps réel.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationThread;


