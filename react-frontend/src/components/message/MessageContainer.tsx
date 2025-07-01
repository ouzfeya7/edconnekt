// MessageContainer.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MessageSidebar from './MessageSidebar';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import MessageDetailView from './MessageDetailView';
import { 
  Message, 
  UserRole, 
  getMessagesForRole, 
  getSentMessages 
} from '../../lib/mock-message-data';

interface MessageContainerProps {
  userRole: UserRole;
}

interface ReplyToMessageDetails {
  sender: string;
  senderEmail?: string;
  subject?: string;
  originalContent?: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState('inbox');
  const [showComposer, setShowComposer] = useState(false);
  const [messages, setMessages] = useState<Message[]>(getMessagesForRole(userRole));
  const [sentMessagesState, setSentMessagesState] = useState<Message[]>(getSentMessages());
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyToMessageDetails, setReplyToMessageDetails] = useState<ReplyToMessageDetails | null>(null);

  const location = useLocation();

  // Mettre à jour les messages quand le rôle change
  useEffect(() => {
    setMessages(getMessagesForRole(userRole));
  }, [userRole]);

  const handleToggleSelect = (messageId: string) => {
    const listToUpdate = selectedCategory === 'sent' ? setSentMessagesState : setMessages;
    listToUpdate(prevMessages => 
        prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, isSelected: !msg.isSelected } : msg
        )
    );
  };

  const handleToggleStar = (messageId: string) => {
    const listToUpdate = selectedCategory === 'sent' ? setSentMessagesState : setMessages;
    listToUpdate(prevMessages => 
        prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
        )
    );
  };

  const handleArchiveMessage = (messageId: string) => {
    // Déplacer le message vers les archives
    if (selectedCategory === 'sent') {
      setSentMessagesState(prev => {
        const messageToArchive = prev.find(msg => msg.id === messageId);
        if (messageToArchive) {
          setArchivedMessages(prevArchived => [...prevArchived, messageToArchive]);
        }
        return prev.filter(msg => msg.id !== messageId);
      });
    } else {
      setMessages(prev => {
        const messageToArchive = prev.find(msg => msg.id === messageId);
        if (messageToArchive) {
          setArchivedMessages(prevArchived => [...prevArchived, messageToArchive]);
        }
        return prev.filter(msg => msg.id !== messageId);
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    // Supprimer définitivement le message
    if (selectedCategory === 'sent') {
      setSentMessagesState(prev => prev.filter(msg => msg.id !== messageId));
    } else {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCategory === 'sent') {
        setSentMessagesState(prev => prev.filter(msg => !msg.isSelected));
    } else {
        setMessages(prev => prev.filter(msg => !msg.isSelected));
    }
  };

  const handleArchiveSelected = () => {
    if (selectedCategory === 'sent') {
      setSentMessagesState(prev => {
        const messagesToArchive = prev.filter(msg => msg.isSelected);
        setArchivedMessages(prevArchived => [...prevArchived, ...messagesToArchive]);
        return prev.filter(msg => !msg.isSelected);
      });
    } else {
      setMessages(prev => {
        const messagesToArchive = prev.filter(msg => msg.isSelected);
        setArchivedMessages(prevArchived => [...prevArchived, ...messagesToArchive]);
        return prev.filter(msg => !msg.isSelected);
      });
    }
  };

  const handleRefresh = () => {
    // Recharger les messages en fonction du rôle
    setMessages(getMessagesForRole(userRole));
    setSentMessagesState(getSentMessages());
  };

  // Fonction pour restaurer un message depuis les archives
  const handleRestoreFromArchive = (messageId: string) => {
    setArchivedMessages(prev => {
      const messageToRestore = prev.find(msg => msg.id === messageId);
      if (messageToRestore) {
        // Restaurer le message dans sa liste d'origine
        if (messageToRestore.category === 'Envoyé') {
          setSentMessagesState(prevSent => [...prevSent, messageToRestore]);
        } else {
          setMessages(prevMessages => [...prevMessages, messageToRestore]);
        }
      }
      return prev.filter(msg => msg.id !== messageId);
    });
  };

  const handleNewMessage = () => {
    setReplyToMessageDetails(null);
    setShowComposer(true);
    setSelectedMessage(null);
  };

  const handleSelectMessage = (message: Message) => {
    // Marquer le message comme lu
    if (!message.isRead) {
      const listToUpdate = selectedCategory === 'sent' ? setSentMessagesState : setMessages;
      listToUpdate(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id ? { ...msg, isRead: true } : msg
        )
      );
    }
    
    setSelectedMessage(message);
    setShowComposer(false);
    setReplyToMessageDetails(null);
  };

  const handleCloseMessageDetail = () => {
    setSelectedMessage(null);
  };

  const handleReply = (sender: string, senderEmail?: string, subject?: string, originalContent?: string) => {
    setReplyToMessageDetails({ sender, senderEmail, subject, originalContent });
    setShowComposer(true);
    setSelectedMessage(null);
  };

  const handleSendMessage = (newMessage: Omit<Message, 'id' | 'time' | 'isStarred' | 'isSelected'>) => {
    const messageToSend: Message = {
      ...newMessage,
      id: `sent-${Date.now()}`,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStarred: false,
      isSelected: false,
      isRead: true,
      priority: 'normal'
    };
    setSentMessagesState(prev => [messageToSend, ...prev]);
    setShowComposer(false);
    setReplyToMessageDetails(null);
  };

  useEffect(() => {
    if (location.state?.composeNew) {
      handleNewMessage(); 
    }
  }, [location.state]);

  // Messages à afficher en fonction de la catégorie sélectionnée
  const getFilteredMessages = () => {
    switch (selectedCategory) {
      case 'sent':
        return sentMessagesState;
      case 'important':
        return [...messages, ...sentMessagesState];
      case 'archives':
        return archivedMessages;
      default:
        return messages;
    }
  };

  if (showComposer) {
    return (
      <div className="relative h-full bg-gray-50">
        {/* Sidebar absolument fixe avec offset pour topbar */}
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-10">
          <MessageSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setShowComposer(false);
              setSelectedMessage(null);
              setReplyToMessageDetails(null);
            }}
            onNewMessage={handleNewMessage}
            messages={messages}
            sentMessages={sentMessagesState}
            archivedMessages={archivedMessages}
            userRole={userRole}
          />
        </div>
        
        {/* Contenu principal avec marge pour la sidebar et scrollable */}
        <div className="ml-64 h-full overflow-auto bg-white">
          <MessageComposer 
            onClose={() => {
              setShowComposer(false); 
              setReplyToMessageDetails(null);
            }} 
            onSendMessage={handleSendMessage}
            replyToDetails={replyToMessageDetails}
            userRole={userRole}
          />
        </div>
      </div>
    );
  }

  if (selectedMessage) {
    return (
      <div className="relative h-full bg-gray-50">
        {/* Sidebar absolument fixe avec offset pour topbar */}
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-10">
          <MessageSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSelectedMessage(null);
              setReplyToMessageDetails(null);
            }}
            onNewMessage={handleNewMessage}
            messages={messages}
            sentMessages={sentMessagesState}
            archivedMessages={archivedMessages}
            userRole={userRole}
          />
        </div>
        
        {/* Contenu principal avec marge pour la sidebar et scrollable */}
        <div className="ml-64 h-full overflow-auto bg-white">
          <MessageDetailView 
            message={selectedMessage} 
            onClose={handleCloseMessageDetail} 
            onReply={handleReply}
            onToggleStar={handleToggleStar}
            onArchive={handleArchiveMessage}
            onDelete={handleDeleteMessage}
            onRestore={handleRestoreFromArchive}
            isFromArchives={selectedCategory === 'archives'}
            userRole={userRole}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-gray-50">
      {/* Sidebar absolument fixe avec offset pour topbar */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-10">
        <MessageSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
              setSelectedCategory(category);
              setReplyToMessageDetails(null);
          }}
          onNewMessage={handleNewMessage}
          messages={messages}
          sentMessages={sentMessagesState}
          archivedMessages={archivedMessages}
          userRole={userRole}
        />
      </div>
      
      {/* Contenu principal avec marge pour la sidebar et scrollable */}
      <div className="ml-64 h-full overflow-auto bg-white">
        <MessageList
          selectedCategory={selectedCategory}
          messages={getFilteredMessages()}
          onToggleSelect={handleToggleSelect}
          onToggleStar={handleToggleStar}
          onDeleteSelected={handleDeleteSelected}
          onSelectMessage={handleSelectMessage}
          onArchiveSelected={handleArchiveSelected}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default MessageContainer; 