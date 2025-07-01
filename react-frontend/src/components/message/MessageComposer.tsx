import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Send, Paperclip, Bold, Italic, Underline, AlignLeft, AlignCenter, Link, Minimize2, Maximize2, Type } from 'lucide-react';
import { UserRole } from '../../lib/mock-message-data';
import { useNotification } from '../ui/NotificationManager';

interface Message {
  sender: string;
  senderEmail?: string;
  content: string;
  category: string;
  subject?: string;
  fullContent?: string;
  recipient?: string;
  recipientEmail?: string;
  isRead: boolean;
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

interface ReplyToMessageDetails {
  sender: string;
  senderEmail?: string;
  subject?: string;
  originalContent?: string;
}

interface MessageComposerProps {
  onClose: () => void;
  onSendMessage: (message: Omit<Message, 'id' | 'time' | 'isStarred' | 'isSelected'>) => void;
  replyToDetails?: ReplyToMessageDetails | null;
  userRole: UserRole;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onClose, 
  onSendMessage, 
  replyToDetails,
  userRole 
}) => {
  const [to, setTo] = useState(replyToDetails?.senderEmail || replyToDetails?.sender || '');
  const [subject, setSubject] = useState(
    replyToDetails?.subject 
      ? (replyToDetails.subject.startsWith('Re: ') ? replyToDetails.subject : `Re: ${replyToDetails.subject}`)
      : ''
  );
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Fonction pour exécuter les commandes de formatage
  const executeCommand = useCallback((command: string, value: string | boolean = false) => {
    if (editorRef.current) {
      // S'assurer que l'éditeur a le focus avant d'exécuter la commande
      editorRef.current.focus();
      document.execCommand(command, false, value);
      // Mettre à jour le contenu après le formatage
      setContent(editorRef.current.innerHTML);
      // Mettre à jour les états de formatage
      setTimeout(() => updateFormatStates(), 0);
    }
  }, []);

  // Fonctions de formatage
  const toggleBold = () => executeCommand('bold');
  const toggleItalic = () => executeCommand('italic');
  const toggleUnderline = () => executeCommand('underline');
  const alignLeft = () => executeCommand('justifyLeft');
  const alignCenter = () => executeCommand('justifyCenter');

  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const removeFormatting = () => {
    executeCommand('removeFormat');
  };

  // Vérification de l'état du formatage
  const updateFormatStates = useCallback(() => {
    if (editorRef.current && document.activeElement === editorRef.current) {
      try {
        setFormatStates({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline')
        });
      } catch (error) {
        // Ignorer les erreurs de queryCommandState si l'éditeur n'est pas focalisé
        console.warn('Erreur lors de la vérification des états de formatage:', error);
      }
    }
  }, []);

  // Gestion du contenu de l'éditeur
  const handleEditorChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
  }, []);

  // Gestion de la sélection pour mettre à jour les états de formatage
  const handleSelectionChange = useCallback(() => {
    // Utiliser un délai pour éviter les appels trop fréquents
    setTimeout(() => updateFormatStates(), 10);
  }, [updateFormatStates]);

  // Initialisation de l'éditeur au focus
  const handleEditorFocus = useCallback(() => {
    setTimeout(() => updateFormatStates(), 10);
  }, [updateFormatStates]);

  // Initialisation de l'éditeur une seule fois
  useEffect(() => {
    if (editorRef.current && !isEditorInitialized) {
      // Initialiser avec le contenu existant s'il y en a un
      if (content && content.trim()) {
        editorRef.current.innerHTML = content;
      }
      setIsEditorInitialized(true);
    }
  }, [isEditorInitialized]);

  // Effet pour s'assurer que l'éditeur est bien initialisé au montage
  useEffect(() => {
    if (editorRef.current) {
      setIsEditorInitialized(true);
    }
  }, []);

  // Fonction pour coller du texte simple (sans formatage externe)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Gestion des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          toggleBold();
          break;
        case 'i':
          e.preventDefault();
          toggleItalic();
          break;
        case 'u':
          e.preventDefault();
          toggleUnderline();
          break;
        default:
          break;
      }
    }
  };

  const handleSend = () => {
    if (!to.trim() || !content.trim()) {
      showError('Veuillez remplir au moins le destinataire et le message.');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to.trim())) {
      showError('Veuillez saisir une adresse email valide pour le destinataire.');
      return;
    }

    const currentUser = userRole === 'student' ? 'Élève' : 
                       userRole === 'teacher' ? 'Professeur' : 
                       userRole === 'parent' ? 'Parent' : 
                       userRole === 'facilitator' ? 'Facilitateur' : 'Administration';
    
    // Générer un email pour l'utilisateur actuel basé sur son rôle
    const currentUserEmail = `${currentUser.toLowerCase().replace(' ', '.')}@edconnekt.com`;

    // Convertir le HTML en texte pour l'envoi (ou garder le HTML selon les besoins)
    const textContent = editorRef.current?.textContent || content;

    const messageToSend: Omit<Message, 'id' | 'time' | 'isStarred' | 'isSelected'> = {
      sender: currentUser,
      senderEmail: currentUserEmail,
      recipient: to, // Le nom peut être différent de l'email
      recipientEmail: to.trim(), // L'email réel saisi par l'utilisateur
      content: textContent,
      fullContent: replyToDetails?.originalContent 
        ? `${textContent}\n\n--- Message original ---\n${replyToDetails.originalContent}`
        : textContent,
      category: 'Envoyé',
      subject: subject,
      isRead: true,
      priority: priority,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    onSendMessage(messageToSend);
    showSuccess('Message envoyé avec succès !');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setAttachments(prev => [...prev, ...fileNames]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-6 w-80 bg-white border border-gray-300 rounded-t-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <span className="font-medium text-gray-700 truncate">
            {subject || 'Nouveau message'}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Maximize2 size={14} className="text-gray-600" />
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* En-tête style Gmail */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">
          {replyToDetails ? 'Répondre' : 'Nouveau message'}
        </h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Minimize2 size={16} className="text-gray-600" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 space-y-2 border-b border-gray-200">
          {/* Destinataire */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-12 flex-shrink-0">À</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="email@exemple.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Sujet */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-12 flex-shrink-0">Objet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet du message"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Priorité */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-12 flex-shrink-0">Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="low">Basse</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>

        {/* Barre d'outils de formatage */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button 
            onClick={toggleBold}
            className={`p-1.5 rounded transition-colors ${
              formatStates.bold 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Gras (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button 
            onClick={toggleItalic}
            className={`p-1.5 rounded transition-colors ${
              formatStates.italic 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Italique (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button 
            onClick={toggleUnderline}
            className={`p-1.5 rounded transition-colors ${
              formatStates.underline 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Souligné (Ctrl+U)"
          >
            <Underline size={14} />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button 
            onClick={removeFormatting}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Supprimer le formatage"
          >
            <Type size={14} className="text-gray-600" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button 
            onClick={alignLeft}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Aligner à gauche"
          >
            <AlignLeft size={14} className="text-gray-600" />
          </button>
          <button 
            onClick={alignCenter}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Centrer"
          >
            <AlignCenter size={14} className="text-gray-600" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button 
            onClick={insertLink}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Insérer un lien"
          >
            <Link size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Zone de saisie avec éditeur riche */}
        <div className="flex-1 p-4 relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onFocus={handleEditorFocus}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            className="w-full h-full resize-none border-0 focus:outline-none text-gray-700 leading-relaxed text-sm rich-editor"
            style={{ minHeight: '200px' }}
            data-placeholder="Tapez votre message ici..."
          />
          <style>{`
            .rich-editor:empty:before {
              content: attr(data-placeholder);
              color: #9CA3AF;
              pointer-events: none;
              font-style: italic;
            }
            .rich-editor:focus {
              outline: none;
            }
            .rich-editor b, .rich-editor strong {
              font-weight: bold;
            }
            .rich-editor i, .rich-editor em {
              font-style: italic;
            }
            .rich-editor u {
              text-decoration: underline;
            }
            .rich-editor a {
              color: #ea580c;
              text-decoration: underline;
            }
          `}</style>
        </div>

        {/* Pièces jointes */}
        {attachments.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <Paperclip size={12} className="text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-700">{attachment}</span>
                  </div>
                  <button 
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={12} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message original en réponse */}
        {replyToDetails?.originalContent && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 mb-2">Message original :</div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 max-h-24 overflow-y-auto">
              {replyToDetails.originalContent}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Joindre un fichier"
            >
              <Paperclip size={16} className="text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button 
              onClick={handleSend}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Send size={14} />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer; 