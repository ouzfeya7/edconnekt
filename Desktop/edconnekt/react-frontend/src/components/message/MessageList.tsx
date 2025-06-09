// components/MessageList.tsx

import React, { useState } from 'react';
import { Star, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

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
  const messagesPerPage = 10;

  // Filtrer les messages par catégorie et recherche
  const filteredMessages = initialMessages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    switch (selectedCategory) {
      case 'inbox':
        // Afficher tous les messages dans la boîte de réception
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

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm">
      {/* Header avec recherche et pagination */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100">
        <div className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche mail"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full text-sm border-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="font-medium">Page {currentPage}-{String(totalPages).padStart(2, '0')}</span>
          <div className="flex items-center gap-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2"
              onClick={onDeleteSelected}
            >
              <Trash2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="overflow-y-auto">
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectMessage(message)}
          >
            <input
              type="checkbox"
              checked={message.isSelected}
              onChange={() => onToggleSelect(message.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 mr-4"
            />
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                onToggleStar(message.id); 
              }}
              className="mr-4"
            >
              <Star 
                size={16} 
                className={message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{message.sender}</span>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate mt-0.5">{message.content}</p>
            </div>
            <span className={`ml-4 text-xs px-2 py-1 rounded ${
              message.category === 'Eleve' ? 'bg-orange-100 text-orange-800' :
              message.category === 'Parent' ? 'bg-pink-100 text-pink-800' :
              message.category === 'Professeur' ? 'bg-blue-100 text-blue-800' :
              message.category === 'Facilitateur' ? 'bg-green-100 text-green-800' :
              message.category === 'Administration' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {message.category}
            </span>
          </div>
        ))}
        {displayedMessages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun message dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 