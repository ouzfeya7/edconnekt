import React, { useEffect, useMemo, useRef } from 'react';
import edcLogo from '../../assets/logo.svg';
import { useChat } from '../../contexts/ChatContext';

interface Props {
  conversationId?: string;
  onClose?: () => void;
}

const ConversationThread: React.FC<Props> = ({ conversationId, onClose }) => {
  const { messagesByConversation, typingByConversation, conversations, presenceByUser } = useChat();
  const messages = useMemo(() => (conversationId ? (messagesByConversation[conversationId] || []) : []), [messagesByConversation, conversationId]);
  const convo = conversationId ? conversations[conversationId] : undefined;

  const convTyping = conversationId ? typingByConversation[conversationId] : undefined;
  const someoneTyping = !!(convTyping && Object.entries(convTyping).some(([uid, v]) => uid !== 'me' && v));

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
                    const other = convo?.members.find(m => m.userId !== 'me');
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
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Fermer</button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
            <div className="space-y-3">
              {messages.map(m => {
                const isMe = m.senderId === 'me';
                const time = new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={m.id} className={`max-w-[70%] ${isMe ? 'ml-auto' : ''}`}>
                    <div className={`relative rounded-2xl px-3 py-2 pr-12 text-sm ${isMe ? 'bg-green-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                      {m.content}
                      <span className={`absolute bottom-1 right-2 text-[10px] ${isMe ? 'text-white/90' : 'text-gray-500'}`}>{time}</span>
                    </div>
                  </div>
                );
              })}
              {someoneTyping && (
                <div className="max-w-[70%]">
                  <div className="rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-500 inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                    écrit…
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


