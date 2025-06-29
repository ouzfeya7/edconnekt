// components/MessageList.tsx

import React, { useState } from 'react';
import { Star, Search, ChevronLeft, ChevronRight, Trash2, Clock, AlertCircle, Paperclip, RefreshCw, Archive, MoreVertical } from 'lucide-react';

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

interface MessageListProps {
  selectedCategory: string;
  messages: Message[];
  onToggleSelect: (messageId: string) => void;
  onToggleStar: (messageId: string) => void;
  onDeleteSelected: () => void;
  onSelectMessage: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  selectedCategory,
  messages: initialMessages,
  onToggleSelect,
  onToggleStar,
  onDeleteSelected,
  onSelectMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 25;

  // Filtrer les messages par catégorie et recherche
  const filteredMessages = initialMessages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesCategory = true;
    switch (selectedCategory) {
      case 'inbox':
        matchesCategory = message.category !== 'Brouillon';
        break;
      case 'sent':
        matchesCategory = true;
        break;
      case 'teachers':
        matchesCategory = message.category === 'Professeur';
        break;
      case 'students':
        matchesCategory = message.category === 'Eleve';
        break;
      case 'parents':
        matchesCategory = message.category === 'Parent';
        break;
      case 'facilitators':
        matchesCategory = message.category === 'Facilitateur';
        break;
      case 'admin':
        matchesCategory = message.category === 'Administration';
        break;
      case 'important':
        matchesCategory = message.isStarred;
        break;
      case 'draft':
        matchesCategory = message.category === 'Brouillon';
        break;
      default:
        break;
    }

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const displayedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

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

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'low':
        return <Clock size={14} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const selectedCount = displayedMessages.filter(msg => msg.isSelected).length;
  const allSelected = displayedMessages.length > 0 && selectedCount === displayedMessages.length;

  const handleSelectAll = () => {
    displayedMessages.forEach(message => {
      if (message.isSelected !== !allSelected) {
        onToggleSelect(message.id);
      }
    });
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'inbox': return 'Boîte de réception';
      case 'sent': return 'Messages envoyés';
      case 'important': return 'Messages importants';
      case 'draft': return 'Brouillons';
      case 'teachers': return 'Professeurs';
      case 'students': return 'Élèves';
      case 'parents': return 'Parents';
      case 'facilitators': return 'Facilitateurs';
      case 'admin': return 'Administration';
      default: return 'Messages';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barre de recherche style Gmail */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher dans les messages"
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:bg-white focus:shadow-md transition-all duration-200"
          />
        </div>
      </div>

      {/* Barre d'outils style Gmail */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onDeleteSelected}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <Archive size={16} className="text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">
                  {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {startIndex + 1}–{Math.min(startIndex + messagesPerPage, filteredMessages.length)} sur {filteredMessages.length}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des messages style Gmail */}
      <div className="flex-1 overflow-y-auto">
        {displayedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun message</h3>
            <p className="text-gray-500 text-center">
              {searchQuery 
                ? 'Aucun message ne correspond à votre recherche' 
                : `Votre ${getCategoryTitle().toLowerCase()} est vide`
              }
            </p>
          </div>
        ) : (
          <div>
            {displayedMessages.map((message) => {
              // Utiliser DiceBear pour des avatars plus fiables
              const getAvatarSrc = () => {
                if (message.avatarUrl) {
                  return message.avatarUrl;
                }
                const seed = encodeURIComponent(message.sender);
                return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=f59e0b&textColor=ffffff`;
              };
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start px-4 py-3 border-b border-gray-100 hover:shadow-sm cursor-pointer transition-all duration-150 group ${
                    message.isSelected ? 'bg-orange-50' : ''
                  } ${!message.isRead ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => onSelectMessage(message)}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={message.isSelected}
                    onChange={() => onToggleSelect(message.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 mr-3 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />

                  {/* Star */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      onToggleStar(message.id); 
                    }}
                    className="mr-3 mt-1 p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Star 
                      size={16} 
                      className={message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
                    />
                  </button>

                  {/* Avatar et expéditeur */}
                  <div className="flex items-center gap-3 w-48 flex-shrink-0">
                    <img 
                      src={getAvatarSrc()} 
                      alt={message.sender}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className={`text-sm truncate ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {selectedCategory === 'sent' ? `À: ${message.recipient}` : message.sender}
                    </span>
                  </div>

                  {/* Contenu du message - Structure verticale */}
                  <div className="flex-1 min-w-0 px-4">
                    {message.subject && (
                      <div className={`text-sm truncate ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'} mb-1`}>
                        {message.subject}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 truncate">
                      {message.content}
                    </div>
                  </div>

                  {/* Indicateurs et heure */}
                  <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                    {getPriorityIcon(message.priority)}
                    {message.attachments && message.attachments.length > 0 && (
                      <Paperclip size={14} className="text-gray-400" />
                    )}
                    {selectedCategory !== 'sent' && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(message.category)}`}>
                        {message.category}
                      </span>
                    )}
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {message.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 