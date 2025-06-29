// src/components/message/MessageDetailView.tsx
import React, { useState } from 'react';
import { ArrowLeft, Star, Reply, ReplyAll, Forward, Trash2, Archive, MoreVertical, Paperclip, Download, Printer, Clock, AlertCircle } from 'lucide-react';
import { UserRole } from '../../lib/mock-message-data';

interface Message {
  id: string;
  sender: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
  subject?: string;
  fullContent?: string;
  recipient?: string;
  avatarUrl?: string;
  isRead?: boolean;
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

interface MessageDetailViewProps {
  message: Message;
  onClose: () => void;
  onReply: (sender: string, subject?: string, originalContent?: string) => void;
  userRole: UserRole;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({ 
  message, 
  onClose, 
  onReply,
  userRole 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  
  // Utiliser un avatar par défaut plus fiable
  const getAvatarSrc = () => {
    if (message.avatarUrl && !avatarError) {
      return message.avatarUrl;
    }
    // Utiliser DiceBear pour des avatars plus fiables
    const seed = encodeURIComponent(message.sender);
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=f59e0b&textColor=ffffff`;
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const getPriorityBadge = () => {
    switch (message.priority) {
      case 'high':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
            <AlertCircle size={12} />
            <span>Priorité haute</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full text-xs">
            <Clock size={12} />
            <span>Priorité basse</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Eleve':
        return 'bg-orange-100 text-orange-800';
      case 'Parent':
        return 'bg-pink-100 text-pink-800';
      case 'Professeur':
        return 'bg-blue-100 text-blue-800';
      case 'Facilitateur':
        return 'bg-green-100 text-green-800';
      case 'Administration':
        return 'bg-purple-100 text-purple-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Barre d'outils supérieure style Gmail - FIXE */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        {/* Ligne de navigation */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {message.subject || 'Sans objet'}
              </h2>
              <p className="text-sm text-gray-500">
                De {message.sender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Badges de priorité et catégorie */}
            <div className="flex items-center gap-2">
              {getPriorityBadge()}
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(message.category)}`}>
                {message.category}
              </span>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Boutons d'action principaux */}
            <button 
              onClick={() => onReply(message.sender, message.subject, message.fullContent || message.content)}
              className="text-orange-600 hover:text-orange-700 px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Reply size={16} />
              Répondre
            </button>
            <button className="text-gray-600 hover:text-gray-700 px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1">
              <Forward size={16} />
              Transférer
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Autres actions */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Archive size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Trash2 size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Printer size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Informations expéditeur simplifiées */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={getAvatarSrc()} 
                alt={message.sender}
                className="w-10 h-10 rounded-full"
                onError={handleAvatarError}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{message.sender}</span>
                  <span className="text-sm text-gray-500">
                    &lt;{message.sender.toLowerCase().replace(' ', '.')}@edconnekt.com&gt;
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  à moi • {message.time}
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Star 
                size={18} 
                className={message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Zone scrollable - SEULEMENT LE CONTENU */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="h-full">
          {/* Pièces jointes */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {message.attachments.length} pièce{message.attachments.length > 1 ? 's' : ''} jointe{message.attachments.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <Paperclip size={14} className="text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700 truncate">{attachment}</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Download size={14} className="text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contenu du message */}
          <div className="p-6 flex-1">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                {message.fullContent || message.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailView; 