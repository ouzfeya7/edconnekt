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
    <div className="border-t border-gray-200 p-3 bg-[#f0f2f5] flex-shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end bg-white rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 min-h-[44px]">
          <textarea
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
            placeholder="Tapez un message"
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500 resize-none min-h-[20px] max-h-[120px]"
            rows={1}
            style={{
              height: 'auto',
              overflow: 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <label className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
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
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ConversationComposer;


