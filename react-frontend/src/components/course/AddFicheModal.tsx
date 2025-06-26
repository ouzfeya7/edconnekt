import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

export interface NewFicheData {
  title: string;
  subject: string;
  time: string;
}

interface AddFicheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: NewFicheData) => void;
}

const AddFicheModal: React.FC<AddFicheModalProps> = ({ isOpen, onClose, onApply }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');

  const handleApply = () => {
    if (!title || !subject || !time) {
      alert("Veuillez remplir tous les champs."); // Remplacer par un meilleur système de notification si disponible
      return;
    }
    onApply({ title, subject, time });
    onClose();
    // Réinitialiser les champs pour la prochaine ouverture
    setTitle('');
    setSubject('');
    setTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('add_a_sheet', 'Ajouter une fiche')}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">{t('title', 'Titre')}</label>
            <input
              type="text"
              id="title"
              placeholder={t('fiche_title_placeholder', "Titre de la fiche")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">{t('subject', 'Matière')}</label>
            <input
              type="text"
              id="subject"
              placeholder={t('subject_placeholder', "Ex: Mathématiques")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">{t('time', 'Heure')}</label>
            <input
              type="text"
              id="time"
              placeholder={t('time_placeholder', "Ex: 10H00 - 11H00")}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <DialogFooter className="pt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            {t('cancel')}
          </button>
          <button onClick={handleApply} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600">
            {t('apply', 'Appliquer')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFicheModal; 