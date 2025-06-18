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
  initialData?: ReplyToMessageDetails | null; // Nouvelle prop
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onClose, initialData }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setRecipient(initialData.sender);
      setSubject(initialData.subject ? `Re: ${initialData.subject}` : 'Re:');
      if (initialData.originalContent) {
        setContent(`\n\n---------- Message original ----------\nDe : ${initialData.sender}\nSujet : ${initialData.subject || '(Pas de sujet)'}\n\n${initialData.originalContent}`);
      }
    } else {
      // Réinitialiser les champs si pas de initialData (nouveau message)
      setRecipient('');
      setSubject('');
      setContent('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer le message
    console.log('Message envoyé:', { recipient, subject, content });
    onClose();
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
            placeholder="Écrivez votre message ici..."
            required
          />
        </div>

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