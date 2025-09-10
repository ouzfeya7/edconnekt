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
  return (
    <div className="h-full flex">
      <ConversationSidebar selectedId={selectedId} onSelect={setSelectedId} />
      <div className="flex-1 flex flex-col">
        <ConversationThread conversationId={selectedId} onClose={() => setSelectedId(undefined)} />
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


