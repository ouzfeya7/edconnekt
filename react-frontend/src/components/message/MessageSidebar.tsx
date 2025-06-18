// components/MessageSidebar.tsx

import React from "react";
import { Inbox, GraduationCap, Users, UserCog, Building2, Star, FileEdit, Send } from "lucide-react";

type UserRole = 'eleve' | 'parent' | 'enseignant' | 'admin';

interface Message {
  id: string;
  sender: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
}

interface MessageSidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onNewMessage: () => void;
  messages: Message[];
  sentMessages: Message[];
  userRole: UserRole;
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  onNewMessage,
  messages,
  sentMessages,
  userRole
}) => {
  // Configuration des catégories par rôle
  const getCategoriesForRole = (role: UserRole) => {
    // Catégories de base communes à tous les rôles
    const baseCategories = [
      { 
        id: 'inbox', 
        name: 'Boîte de reception',
        icon: <Inbox className="w-5 h-5" />
      },
      { 
        id: 'sent', 
        name: 'Boîte d\'envoi',
        icon: <Send className="w-5 h-5" />
      },
    ];

    // Catégories spécifiques selon le rôle
    const roleCategories = {
      eleve: [
        { 
          id: 'teachers', 
          name: 'Professeurs',
          icon: <Users className="w-5 h-5" />
        },
        { 
          id: 'admin', 
          name: 'Administration',
          icon: <Building2 className="w-5 h-5" />
        },
      ],
      parent: [
        { 
          id: 'teachers', 
          name: 'Professeurs',
          icon: <Users className="w-5 h-5" />
        },
        { 
          id: 'admin', 
          name: 'Administration',
          icon: <Building2 className="w-5 h-5" />
        },
      ],
      enseignant: [
        { 
          id: 'students', 
          name: 'Eleve',
          icon: <GraduationCap className="w-5 h-5" />
        },
        { 
          id: 'parents', 
          name: 'Parent',
          icon: <Users className="w-5 h-5" />
        },
        { 
          id: 'facilitators', 
          name: 'Facilitateurs',
          icon: <UserCog className="w-5 h-5" />
        },
        { 
          id: 'admin', 
          name: 'Administration',
          icon: <Building2 className="w-5 h-5" />
        },
      ],
      admin: [
        { 
          id: 'teachers', 
          name: 'Professeurs',
          icon: <Users className="w-5 h-5" />
        },
        { 
          id: 'admin', 
          name: 'Administration',
          icon: <Building2 className="w-5 h-5" />
        },
      ],
    };

    // Catégories finales communes à tous les rôles
    const finalCategories = [
      { 
        id: 'important', 
        name: 'Important',
        icon: <Star className="w-5 h-5" />
      },
      { 
        id: 'draft', 
        name: 'Brouillon',
        icon: <FileEdit className="w-5 h-5" />
      },
    ];

    return [...baseCategories, ...roleCategories[role], ...finalCategories];
  };

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
      case 'important':
        const starredInInbox = messages.filter(msg => msg.isStarred).length;
        const starredInSent = sentMessages.filter(msg => msg.isStarred).length;
        return starredInInbox + starredInSent;
      case 'draft':
        return messages.filter(msg => msg.category === 'Brouillon').length;
      default:
        return 0;
    }
  };

  const categories = getCategoriesForRole(userRole);

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      <button 
        onClick={onNewMessage}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mb-6 cursor-pointer"
      >
        <span className="text-lg">+</span>
        <span>Nouveau message</span>
      </button>

      <div className="space-y-1">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-colors
              ${selectedCategory === category.id 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </div>
            <span className="text-xs text-gray-500 tabular-nums">{getCategoryCount(category.id).toString().padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar; 