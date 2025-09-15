// src/components/message/MessageDetailView.tsx
import React, { useState } from 'react';
import { Reply, Forward, Trash2, Star, MoreHorizontal, Send, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderEmail?: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
  subject?: string;
  fullContent?: string;
  recipient?: string;
  recipientEmail?: string;
  avatarUrl?: string;
  isRead?: boolean;
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

interface MessageDetailViewProps {
  message: Message;
  onClose: () => void;
  onReply: (sender: string, senderEmail?: string, subject?: string, originalContent?: string) => void;
  userRole: string; // Assuming UserRole is removed or replaced by a string
  onToggleStar?: (messageId: string) => void;
  onArchive?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onRestore?: (messageId: string) => void;
  isFromArchives?: boolean;
  isOpen?: boolean;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({
  message,
  onClose,
  onReply,
  onToggleStar,
  onArchive,
  onDelete,
  onRestore,
  isFromArchives
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const moreOptionsRef = React.useRef<HTMLDivElement>(null);

  // Fermer le menu "Plus d'options" quand on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreOptions]);
  
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

  // Fonction pour transférer le message
  const handleForward = () => {
    const forwardSubject = message.subject?.startsWith('Fwd: ') 
      ? message.subject 
      : `Fwd: ${message.subject || 'Sans objet'}`;
    
    const forwardContent = `
---------- Message transféré ----------
De : ${message.sender} <${message.senderEmail || message.sender.toLowerCase().replace(' ', '.') + '@edconnekt.com'}>
Date : ${message.time}
Objet : ${message.subject || 'Sans objet'}

${message.fullContent || message.content}
`;
    
    onReply('', '', forwardSubject, forwardContent);
  };

  // Fonction pour archiver le message
  const handleArchive = () => {
    if (onArchive) {
      onArchive(message.id);
      // Assuming showSuccess, showError, showInfo are removed or replaced
      alert('Message archivé avec succès'); // Placeholder for notification
      onClose();
    } else {
      alert('Fonctionnalité d\'archivage en cours de développement'); // Placeholder for notification
    }
  };

  // Fonction pour restaurer le message depuis les archives
  const handleRestore = () => {
    if (onRestore) {
      onRestore(message.id);
      // Assuming showSuccess, showError, showInfo are removed or replaced
      alert('Message restauré dans la boîte de réception'); // Placeholder for notification
      onClose();
    } else {
      alert('Fonctionnalité de restauration en cours de développement'); // Placeholder for notification
    }
  };

  // Fonction pour supprimer le message
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(message.id);
      // Assuming showSuccess, showError, showInfo are removed or replaced
      alert('Message supprimé avec succès'); // Placeholder for notification
      onClose();
    } else {
      alert('Fonctionnalité de suppression en cours de développement'); // Placeholder for notification
    }
    setShowDeleteConfirm(false);
  };

  // Fonction pour imprimer le message
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimer - ${message.subject || 'Sans objet'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 20px; }
              .from { font-weight: bold; margin-bottom: 10px; }
              .subject { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .date { color: #666; margin-bottom: 20px; }
              .content { line-height: 1.6; }
              .attachments { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="subject">${message.subject || 'Sans objet'}</div>
              <div class="from">De : ${message.sender}</div>
              <div class="date">Date : ${message.time}</div>
            </div>
            <div class="content">
              ${(message.fullContent || message.content).replace(/\n/g, '<br>')}
            </div>
            ${message.attachments && message.attachments.length > 0 ? `
              <div class="attachments">
                <strong>Pièces jointes :</strong>
                <ul>
                  ${message.attachments.map(att => `<li>${att}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Fonction pour basculer l'étoile
  const handleToggleStar = () => {
    if (onToggleStar) {
      onToggleStar(message.id);
    }
  };

  // Fonction pour télécharger une pièce jointe
  const handleDownloadAttachment = (attachmentName: string) => {
    // Simuler le téléchargement d'une pièce jointe
    const link = document.createElement('a');
    // En production, ceci serait l'URL réelle du fichier
    link.href = `#download-${attachmentName}`;
    link.download = attachmentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Assuming showSuccess is removed or replaced
    alert(`Téléchargement de "${attachmentName}" commencé !`); // Placeholder for notification
  };

  // Menu des options supplémentaires
  const renderMoreOptionsMenu = () => {
    if (!showMoreOptions) return null;

    return (
      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
        <div className="py-2">
          <button 
            onClick={() => {
              handlePrint();
              setShowMoreOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <Send size={16} />
            Imprimer
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(message.fullContent || message.content);
              setShowMoreOptions(false);
              // Assuming showSuccess is removed or replaced
              alert('Contenu copié dans le presse-papiers'); // Placeholder for notification
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <Paperclip size={16} />
            Copier le contenu
          </button>
          <button 
            onClick={() => {
              // Pour un message envoyé, on veut contacter le destinataire
              // Pour un message reçu, on veut contacter l'expéditeur
              const isReceivedMessage = message.category !== 'Envoyé';
              const targetEmail = isReceivedMessage 
                ? (message.senderEmail || message.sender.toLowerCase().replace(' ', '.') + '@edconnekt.com')
                : (message.recipientEmail || message.recipient || 'destinataire@exemple.com');
              
              const mailtoLink = `mailto:${targetEmail}?subject=Re: ${message.subject}&body=${encodeURIComponent('Message original:\n' + (message.fullContent || message.content))}`;
              window.open(mailtoLink);
              setShowMoreOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <Send size={16} />
            Ouvrir avec client email
          </button>
          <div className="border-t border-gray-200 my-2"></div>
          <button 
            onClick={() => {
              handleDelete();
              setShowMoreOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
    );
  };

  const getPriorityBadge = () => {
    switch (message.priority) {
      case 'high':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><path d="m12 8-4 4 4 4"/><path d="m12 16 4-4-4-4"/></svg>
            <span>Priorité haute</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="m12 8-4 4 4 4"/><path d="m12 16 4-4-4-4"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="m19 12H5"/></svg>
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
              onClick={() => onReply(message.sender, message.senderEmail, message.subject, message.fullContent || message.content)}
              className="text-orange-600 hover:text-orange-700 px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Reply size={16} />
              Répondre
            </button>
            <button 
              onClick={handleForward}
              className="text-gray-600 hover:text-gray-700 px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1"
              title="Transférer"
            >
              <Forward size={16} />
              Transférer
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Autres actions */}
            {isFromArchives ? (
              <button 
                onClick={handleRestore}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Restaurer dans la boîte de réception"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive-restore"><path d="M12 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8"/><path d="M15 12 12 15 9 12"/><path d="M12 15V3"/></svg>
              </button>
            ) : (
              <button 
                onClick={handleArchive}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Archiver"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive"><path d="M21 8v13H3V8"/><path d="M18 16V8H6v8"/><path d="M14 12v7"/><path d="M10 12v7"/></svg>
            </button>
            )}
            <button 
              onClick={handleDelete}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Supprimer"
            >
              <Trash2 size={18} className="text-gray-600" />
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Imprimer"
            >
              <Send size={18} className="text-gray-600" />
            </button>
            <div className="relative" ref={moreOptionsRef}>
              <button 
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Plus d'options"
              >
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>
              {renderMoreOptionsMenu()}
            </div>
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
                    &lt;{message.senderEmail || message.sender.toLowerCase().replace(' ', '.') + '@edconnekt.com'}&gt;
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  à moi • {message.time}
                </div>
              </div>
            </div>

            <button 
              onClick={handleToggleStar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={message.isStarred ? "Retirer l'étoile" : "Marquer comme important"}
            >
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
                    <button 
                      onClick={() => handleDownloadAttachment(attachment)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Télécharger"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10V3a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v7"/><path d="M12 17 12 21"/><path d="M12 17 12 21"/></svg>
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
      
      {/* Modal de confirmation pour la suppression */}
      {/* Assuming ConfirmModal is removed or replaced */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Supprimer le message</h3>
            <p className="text-sm text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetailView; 