// MessageContainer.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MessageSidebar from './MessageSidebar';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import MessageDetailView from './MessageDetailView';

type UserRole = 'eleve' | 'parent' | 'enseignant' | 'admin';

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

interface MessageContainerProps {
  userRole: UserRole;
}

// Messages pour les élèves
const studentMessages: Message[] = [
  {
    id: '1',
    sender: 'M. Diallo - Mathématiques',
    content: 'Devoir de mathématiques pour lundi prochain',
    category: 'Professeur',
    time: '8:38 AM',
    isStarred: true,
    isSelected: false
  },
  {
    id: '2',
    sender: 'Mme Sow - Français',
    content: 'Notes du contrôle de français disponibles',
    category: 'Professeur',
    time: '8:13 AM',
    isStarred: false,
    isSelected: false
  },
  {
    id: '3',
    sender: 'Administration',
    content: 'Rappel : Réunion parents-professeurs le 15 mars',
    category: 'Administration',
    time: '7:52 PM',
    isStarred: true,
    isSelected: false
  },
  {
    id: '4',
    sender: 'M. Ba - Sciences',
    content: 'Préparation pour l\'examen pratique de sciences',
    category: 'Professeur',
    time: '7:30 PM',
    isStarred: false,
    isSelected: false
  },
  {
    id: '5',
    sender: 'Administration',
    content: 'Emploi du temps modifié pour la semaine prochaine',
    category: 'Administration',
    time: '4:20 PM',
    isStarred: false,
    isSelected: false
  },
  {
    id: '6',
    sender: 'Brouillon',
    content: 'Demande d\'absence pour rendez-vous médical...',
    category: 'Brouillon',
    time: '2:15 PM',
    isStarred: false,
    isSelected: false
  }
];

// Messages pour les enseignants
const teacherMessages: Message[] = [
  {
    id: '1',
    sender: 'Fatima Thiam',
    subject: 'Question Exercice 3 Maths',
    content: 'Question sur l\'exercice 3 du devoir de mathématiques',
    fullContent: 'Bonjour Monsieur,\n\nJ\'ai une petite question concernant l\'exercice 3 du devoir de mathématiques que vous nous avez donné.\nPourriez-vous clarifier si nous devons utiliser la méthode de substitution ou celle par combinaison ?\n\nMerci d\'avance,\nFatima Thiam.',
    category: 'Eleve',
    time: '8:38 AM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Fatima+Thiam&background=E0BBE4&color=fff'
  },
  {
    id: '2',
    sender: 'M. Diop (Parent de Moussa)',
    subject: 'Rendez-vous Résultats Trimestre',
    content: 'Demande de rendez-vous concernant les résultats du trimestre',
    fullContent: 'Bonjour,\n\nJe souhaiterais prendre rendez-vous avec vous afin de discuter des résultats trimestriels de mon fils Moussa.\nSeriez-vous disponible la semaine prochaine ?\n\nCordialement,\nM. Diop.',
    category: 'Parent',
    time: '8:13 AM',
    isStarred: true,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=M+Diop&background=C5E1A5&color=fff'
  },
  {
    id: '3',
    sender: 'Amadou Diop (Facilitateur)',
    subject: 'Support TP Sciences',
    content: 'Support pour la préparation du TP de sciences',
    fullContent: 'Bonjour,\n\nJe vous confirme ma disponibilité pour vous aider à préparer le matériel pour le prochain TP de sciences.\nN\'hésitez pas à me solliciter si besoin.\n\nAmadou Diop.',
    category: 'Facilitateur',
    time: '7:52 PM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Amadou+Diop&background=B2DFDB&color=fff'
  },
  {
    id: '4',
    sender: 'Administration',
    subject: 'Réunion Pédagogique',
    content: 'Réunion pédagogique - Ordre du jour',
    fullContent: 'Rappel : La réunion pédagogique se tiendra demain à 10h en salle B12. Ordre du jour : ...',
    category: 'Administration',
    time: '7:30 PM',
    isStarred: true,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=D1C4E9&color=fff'
  },
  {
    id: '5',
    sender: 'Mariam Ba',
    subject: 'Absence Cours Demain',
    content: 'Absence justifiée pour le cours de demain',
    fullContent: 'Bonjour, je serai absente demain pour cause de rendez-vous médical. Ci-joint mon justificatif.',
    category: 'Eleve',
    time: '6:45 PM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Mariam+Ba&background=E0BBE4&color=fff'
  },
  {
    id: '6',
    sender: 'Mme Sall (Parent de Aïcha)',
    subject: 'Suivi Devoirs Aïcha',
    content: 'Suivi des devoirs à la maison',
    fullContent: 'Je voudrais faire un point sur le suivi des devoirs à la maison pour Aïcha.',
    category: 'Parent',
    time: '4:20 PM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Mme+Sall&background=C5E1A5&color=fff'
  },
  {
    id: '7',
    sender: 'M. Ndiaye (Facilitateur)',
    subject: 'Matériel TP Disponible',
    content: 'Matériel disponible pour le prochain TP',
    fullContent: 'Le matériel pour le prochain TP est prêt et disponible dans le laboratoire.',
    category: 'Facilitateur',
    time: '2:15 PM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=M+Ndiaye&background=B2DFDB&color=fff'
  },
  {
    id: '8',
    sender: 'Administration',
    subject: 'Rappel Remise Notes',
    content: 'Rappel : Remise des notes pour le conseil de classe',
    fullContent: 'N\'oubliez pas de finaliser la saisie des notes avant le conseil de classe de vendredi.',
    category: 'Administration',
    time: '11:45 AM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=D1C4E9&color=fff'
  },
  {
    id: '9',
    sender: 'Brouillon',
    subject: 'Programme Cours XYZ (Brouillon)',
    content: 'Programme du prochain cours...',
    fullContent: 'Ceci est un brouillon pour le programme du cours XYZ...',
    category: 'Brouillon',
    time: '10:30 AM',
    isStarred: false,
    isSelected: false,
    avatarUrl: 'https://ui-avatars.com/api/?name=B&background=CFD8DC&color=fff'
  }
];

interface ReplyToMessageDetails {
  sender: string;
  subject?: string;
  originalContent?: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState('inbox');
  const [showComposer, setShowComposer] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    userRole === 'enseignant' ? teacherMessages : studentMessages
  );
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyToMessageDetails, setReplyToMessageDetails] = useState<ReplyToMessageDetails | null>(null);

  const location = useLocation();

  const handleToggleSelect = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isSelected: !msg.isSelected } : msg
    ));
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleDeleteSelected = () => {
    setMessages(messages.filter(msg => !msg.isSelected));
  };

  const handleNewMessage = () => {
    setReplyToMessageDetails(null);
    setShowComposer(true);
    setSelectedMessage(null);
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowComposer(false);
    setReplyToMessageDetails(null);
  };

  const handleCloseMessageDetail = () => {
    setSelectedMessage(null);
  };

  const handleReply = (sender: string, subject?: string, originalContent?: string) => {
    setReplyToMessageDetails({ sender, subject, originalContent });
    setShowComposer(true);
    setSelectedMessage(null);
  };

  useEffect(() => {
    if (location.state?.composeNew) {
      handleNewMessage();
    }
  }, [location.state]);

  if (showComposer) {
    return (
      <div className="h-full flex gap-6 bg-gray-50 p-6">
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
          userRole={userRole}
        />
        <MessageComposer 
          onClose={() => {
            setShowComposer(false); 
            setReplyToMessageDetails(null);
          }} 
          initialData={replyToMessageDetails}
        />
      </div>
    );
  }

  if (selectedMessage) {
    return (
      <div className="h-full flex gap-6 bg-gray-50 p-6">
        <MessageSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setSelectedMessage(null);
            setReplyToMessageDetails(null);
          }}
          onNewMessage={handleNewMessage}
          messages={messages}
          userRole={userRole}
        />
        <MessageDetailView 
          message={selectedMessage} 
          onClose={handleCloseMessageDetail} 
          onReply={handleReply}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex gap-6 bg-gray-50 p-6">
      <MessageSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
            setSelectedCategory(category);
            setReplyToMessageDetails(null);
        }}
        onNewMessage={handleNewMessage}
        messages={messages}
        userRole={userRole}
      />
      <MessageList
        selectedCategory={selectedCategory}
        messages={messages}
        onToggleSelect={handleToggleSelect}
        onToggleStar={handleToggleStar}
        onDeleteSelected={handleDeleteSelected}
        onSelectMessage={handleSelectMessage}
      />
    </div>
  );
};

export default MessageContainer; 