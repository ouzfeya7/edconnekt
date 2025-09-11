import React from "react";
// import MessageContainer from "../../components/message/MessageContainer";
import type { UserRole } from "../../lib/mock-message-data";
import { useAuth } from "../authentification/useAuth";
import { ChatProvider } from "../../contexts/ChatContext";
import ConversationSidebar from "../../components/message/ConversationSidebar";
import ConversationThread from "../../components/message/ConversationThread";
import ConversationComposer from "../../components/message/ConversationComposer";

const Layout: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined);
  const [showSidebar, setShowSidebar] = React.useState(true);

  // Sur mobile, masquer la sidebar quand une conversation est sélectionnée
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(!selectedId);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedId]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    // Sur mobile, masquer la sidebar quand on sélectionne une conversation
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleCloseConversation = () => {
    setSelectedId(undefined);
    // Sur mobile, afficher la sidebar quand on ferme une conversation
    if (window.innerWidth < 768) {
      setShowSidebar(true);
    }
  };

  return (
    <div className="h-full flex relative">
      {/* Sidebar - masquée sur mobile quand une conversation est sélectionnée */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
        <ConversationSidebar selectedId={selectedId} onSelect={handleSelectConversation} />
      </div>
      
      {/* Thread de conversation - affiché seulement quand une conversation est sélectionnée */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        <ConversationThread conversationId={selectedId} onClose={handleCloseConversation} />
        <ConversationComposer conversationId={selectedId} />
      </div>
    </div>
  );
};

// Page unique de messagerie qui s'adapte à tous les rôles
const MessagePage: React.FC = () => {
  const { roles } = useAuth();

  // Mapper les rôles d'app vers le type UserRole attendu par MessageContainer
  // UserRole: 'eleve' | 'parent' | 'enseignant' | 'admin'
  let userRole: UserRole | undefined;

  if (roles.includes('enseignant')) {
    userRole = 'enseignant';
  } else if (roles.includes('parent')) {
    userRole = 'parent';
  } else if (roles.includes('directeur')) {
    // Le rôle directeur est aligné sur 'admin' côté UI existante
    userRole = 'directeur';
  } else if (roles.includes('eleve')) {
    userRole = 'eleve';
  }

  if (!userRole) {
    return <div>Rôle non supporté pour la messagerie.</div>;
  }

  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  );
};

export default MessagePage;


