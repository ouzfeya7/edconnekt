// components/MessageSidebar.tsx

import React from "react";
import { Inbox, GraduationCap, Users, UserCog, Building2, Star, FileEdit, Send, Mail, Edit3, Archive } from "lucide-react";
import { UserRole, getCategoriesForRole } from '../../lib/mock-message-data';

interface Message {
  id: string;
  sender: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
  isRead?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

interface MessageSidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onNewMessage: () => void;
  messages: Message[];
  sentMessages: Message[];
  archivedMessages: Message[];
  userRole: UserRole;
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  onNewMessage,
  messages,
  sentMessages,
  archivedMessages,
  userRole
}) => {
  
  // Obtenir le nombre de messages pour une catégorie
  const getCategoryCount = (categoryId: string): number => {
    switch (categoryId) {
      case 'inbox':
        return messages.filter(m => m.category !== 'Brouillon').length;
      case 'sent':
        return sentMessages.length;
      case 'teachers':
        return messages.filter(msg => msg.category === 'Professeur').length;
      case 'students':
        return messages.filter(msg => msg.category === 'Eleve').length;
      case 'parents':
        return messages.filter(msg => msg.category === 'Parent').length;
      case 'facilitators':
        return messages.filter(msg => msg.category === 'Facilitateur').length;
      case 'admin':
        return messages.filter(msg => msg.category === 'Administration').length;
      case 'important': {
        const starredInInbox = messages.filter(msg => msg.isStarred).length;
        const starredInSent = sentMessages.filter(msg => msg.isStarred).length;
        return starredInInbox + starredInSent;
      }
      case 'archives':
        return archivedMessages.length;
      case 'draft':
        return messages.filter(msg => msg.category === 'Brouillon').length;
      default:
        return 0;
    }
  };

  // Obtenir le nombre de messages non lus pour une catégorie
  const getUnreadCount = (categoryId: string): number => {
    switch (categoryId) {
      case 'inbox':
        return messages.filter(m => !m.isRead && m.category !== 'Brouillon').length;
      case 'teachers':
        return messages.filter(msg => msg.category === 'Professeur' && !msg.isRead).length;
      case 'students':
        return messages.filter(msg => msg.category === 'Eleve' && !msg.isRead).length;
      case 'parents':
        return messages.filter(msg => msg.category === 'Parent' && !msg.isRead).length;
      case 'facilitators':
        return messages.filter(msg => msg.category === 'Facilitateur' && !msg.isRead).length;
      case 'admin':
        return messages.filter(msg => msg.category === 'Administration' && !msg.isRead).length;
      case 'important':
        return messages.filter(msg => msg.isStarred && !msg.isRead).length;
      case 'archives':
        return archivedMessages.filter(msg => !msg.isRead).length;
      default:
        return 0;
    }
  };

  const getIcon = (iconName: string) => {
    const iconProps = { size: 20 };
    switch (iconName) {
      case 'Inbox': return <Inbox {...iconProps} />;
      case 'Send': return <Send {...iconProps} />;
      case 'GraduationCap': return <GraduationCap {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'UserCog': return <UserCog {...iconProps} />;
      case 'Building2': return <Building2 {...iconProps} />;
      case 'Star': return <Star {...iconProps} />;
      case 'Archive': return <Archive {...iconProps} />;
      case 'FileEdit': return <FileEdit {...iconProps} />;
      default: return <Mail {...iconProps} />;
    }
  };

  const categories = getCategoriesForRole(userRole);

  return (
    <div className="flex flex-col h-screen">
      {/* Bouton Nouveau message style Gmail */}
      <div className="p-6 flex-shrink-0">
        <button 
          onClick={onNewMessage}
          className="w-full bg-white border border-gray-300 hover:shadow-md text-gray-700 py-3 px-4 rounded-full flex items-center gap-3 font-medium transition-all duration-200 hover:bg-gray-50"
        >
          <Edit3 size={20} className="text-orange-500" />
          <span>Nouveau message</span>
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium">{messages.length + sentMessages.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Non lus</span>
              <span className="font-medium text-orange-600">
                {messages.filter(m => !m.isRead && m.category !== 'Brouillon').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des catégories style Gmail */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {categories.map((category) => {
            const count = getCategoryCount(category.id);
            const unreadCount = getUnreadCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`group flex items-center justify-between py-2 px-4 rounded-r-full cursor-pointer transition-all duration-150 ${
                  isSelected 
                    ? 'bg-orange-100 text-orange-700 border-r-4 border-orange-500 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className={`${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                    {getIcon(category.icon)}
                  </span>
                  <span className="text-sm truncate">{category.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                  {!unreadCount && count > 0 && (
                    <span className="text-xs text-gray-500">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar; 