import React, { useState, useRef } from 'react';
import { X, Send, Paperclip, Smile, Bold, Italic, Underline, AlignLeft, AlignCenter, Link, Image, Minimize2, Maximize2 } from 'lucide-react';
import { UserRole } from '../../lib/mock-message-data';

interface Message {
  sender: string;
  content: string;
  category: string;
  subject?: string;
  fullContent?: string;
  recipient?: string;
  isRead: boolean;
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

interface ReplyToMessageDetails {
  sender: string;
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
  const [to, setTo] = useState(replyToDetails?.sender || '');
  const [subject, setSubject] = useState(
    replyToDetails?.subject 
      ? (replyToDetails.subject.startsWith('Re: ') ? replyToDetails.subject : `Re: ${replyToDetails.subject}`)
      : ''
  );
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!to.trim() || !content.trim()) {
      alert('Veuillez remplir au moins le destinataire et le message.');
      return;
    }

    const currentUser = userRole === 'student' ? 'Élève' : 
                       userRole === 'teacher' ? 'Professeur' : 
                       userRole === 'parent' ? 'Parent' : 
                       userRole === 'facilitator' ? 'Facilitateur' : 'Administration';

    const messageToSend: Omit<Message, 'id' | 'time' | 'isStarred' | 'isSelected'> = {
      sender: currentUser,
      recipient: to,
      content: content,
      fullContent: replyToDetails?.originalContent 
        ? `${content}\n\n--- Message original ---\n${replyToDetails.originalContent}`
        : content,
      category: 'Envoyé',
      subject: subject,
      isRead: true,
      priority: priority,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    onSendMessage(messageToSend);
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
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destinataire"
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
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Bold size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Italic size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Underline size={14} className="text-gray-600" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <AlignLeft size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <AlignCenter size={14} className="text-gray-600" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Link size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Image size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <Smile size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Zone de saisie */}
        <div className="flex-1 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tapez votre message ici..."
            className="w-full h-full resize-none border-0 focus:outline-none text-gray-700 leading-relaxed text-sm"
            style={{ minHeight: '200px' }}
          />
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