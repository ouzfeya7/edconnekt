// src/components/message/MessageDetailView.tsx
import React from 'react';
import { ArrowLeft, CornerUpLeft } from 'lucide-react'; // Import d'icônes

interface Message {
  id: string;
  sender: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
  subject?: string;
  fullContent?: string; // Utiliser fullContent pour le corps du message
  recipient?: string;
  avatarUrl?: string;
}

interface MessageDetailViewProps {
  message: Message;
  onClose: () => void;
  onReply: (sender: string, subject?: string, fullContent?: string) => void;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({ message, onClose, onReply }) => {
  // Utiliser message.fullContent s'il existe, sinon message.content
  const messageBody = message.fullContent || message.content;

  // Placeholder pour l'avatar si non fourni
  const avatarSrc = message.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender)}&background=random&color=fff`;

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col min-h-0"> {/* Ajout de min-h-0 */}
      {/* Barre d'outils */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200"> {/* Bordure plus visible */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Retour à la liste"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Potentiellement ajouter des infos de pagination Précédent/Suivant ici */}
      </div>

      {/* Contenu du message */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Sujet */}
        <h1 className="text-2xl font-semibold text-gray-800">{message.subject || '(Pas de sujet)'}</h1>

        {/* Informations de l'expéditeur */}
        <div className="flex items-center gap-3 pt-2">
          <img src={avatarSrc} alt={message.sender} className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <div className="font-semibold text-gray-800">{message.sender}</div>
            <div className="text-xs text-gray-500">
              À : moi {message.recipient ? `, ${message.recipient}` : ''}
            </div>
          </div>
          <div className="ml-auto text-sm text-gray-500">{message.time}</div>
        </div>
        
        {/* Corps du message */}
        <div 
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed" /* Amélioration de la lisibilité */
          dangerouslySetInnerHTML={{ __html: messageBody.replace(/\n/g, '<br />') }} // Gérer les sauts de ligne
        />
      </div>

       {/* Actions rapides en bas */}
       <div className="px-6 py-4 border-t border-gray-200">  {/* Bordure plus visible */}
         <div className="flex items-center gap-3">
            <button 
              onClick={() => onReply(message.sender, message.subject, message.fullContent)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <CornerUpLeft size={16} /> Répondre
            </button>
         </div>
       </div>
    </div>
  );
};

export default MessageDetailView; 