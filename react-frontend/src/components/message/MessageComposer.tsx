import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';

// Doit correspondre à l'interface dans MessageContainer.tsx
interface ReplyToMessageDetails {
  sender: string; 
  subject?: string;
  originalContent?: string;
}

interface MessageComposerProps {
  onClose: () => void;
  onSendMessage: (newMessage: { recipient: string; subject: string; content: string; category: string; sender: string }) => void;
  replyToDetails?: ReplyToMessageDetails | null;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onClose, onSendMessage, replyToDetails }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (replyToDetails) {
      setRecipient(replyToDetails.sender);
      setSubject(replyToDetails.subject ? `Re: ${replyToDetails.subject}` : 'Re:');
      setContent(''); 
    } else {
      // Réinitialiser les champs si pas de replyToDetails (nouveau message)
      setRecipient('');
      setSubject('');
      setContent('');
    }
  }, [replyToDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La catégorie pourrait être déterminée dynamiquement
    // Pour l'instant, on la met en dur pour l'exemple
    onSendMessage({ 
        recipient, 
        subject, 
        content, 
        category: 'Eleve', // Exemple, à rendre dynamique
        sender: 'Moi' 
    });
  };

  return (
    <div className="flex-1 bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Nouveau Message</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destinataire
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nom du destinataire"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sujet
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Sujet du message"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px]"
            placeholder="Écrivez votre réponse ici..."
            required
          />
        </div>

        {/* Bloc pour afficher le message original en lecture seule */}
        {replyToDetails && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 space-y-2">
            <p className="font-semibold border-b pb-2 mb-2">Message original</p>
            <p><strong>De :</strong> {replyToDetails.sender}</p>
            <p><strong>Sujet :</strong> {replyToDetails.subject || '(pas de sujet)'}</p>
            <blockquote className="mt-2 pl-3 border-l-2 border-gray-300 italic text-gray-600">
              {replyToDetails.originalContent}
            </blockquote>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer; 