import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

interface Props {
  conversationId?: string;
}

const ConversationComposer: React.FC<Props> = ({ conversationId }) => {
  const { sendMessage, setTyping } = useChat();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!conversationId || !text.trim()) return;
    await sendMessage({ conversationId, senderId: 'me', type: 'TEXT', content: text.trim() });
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
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button onClick={handleSend} className="px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
        <Send size={16} />
      </button>
    </div>
  );
};

export default ConversationComposer;


