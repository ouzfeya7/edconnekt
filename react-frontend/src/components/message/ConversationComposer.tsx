import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useSendMessage } from '../../hooks/useMessageMessages';
import { useUploadMessageFile } from '../../hooks/useMessageUploads';

interface Props {
  conversationId?: string;
}

const ConversationComposer: React.FC<Props> = ({ conversationId }) => {
  const { sendMessage, setTyping } = useChat();
  const apiSend = useSendMessage(conversationId || '');
  const uploadMutation = useUploadMessageFile();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!conversationId || !text.trim()) return;
    // Envoi API si dispo, sinon fallback mock
    try {
      await apiSend.mutateAsync({ type: 'TEXT', content: { text: text.trim() } as unknown as object });
    } catch {
      // Récupérer l'ID utilisateur actuel
      const currentUserId = (() => {
        try {
          const raw = sessionStorage.getItem('keycloak-token');
          if (!raw) return 'mock-user-123';
          const parts = raw.split('.');
          if (parts.length < 2) return 'mock-user-123';
          const payload = JSON.parse(atob(parts[1]));
          return payload?.sub || 'mock-user-123';
        } catch {
          return 'mock-user-123';
        }
      })();
      await sendMessage({ conversationId, senderId: currentUserId, type: 'TEXT', content: text.trim() });
    }
    setText('');
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 p-3 bg-[#f0f2f5] flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => conversationId && setTyping(conversationId, true)}
        onBlur={() => conversationId && setTyping(conversationId, false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Écrire un message…"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <label className="px-2 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">
        📎
        <input
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !conversationId) return;
            try {
              const { key } = await uploadMutation.mutateAsync({ file });
              await apiSend.mutateAsync({ type: 'FILE', content: { key, filename: file.name, contentType: file.type } as unknown as object });
            } catch {}
          }}
        />
      </label>
      <button onClick={handleSend} className="px-3 py-2 bg-green-400 text-white rounded-full hover:bg-green-500">
        <Send size={16} />
      </button>
    </div>
  );
};

export default ConversationComposer;


