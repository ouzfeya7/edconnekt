import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

export interface NewEvaluationData {
  title: string;
  date: string;
  totalPoints: number;
}

interface CreateEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: NewEvaluationData) => void;
}

const CreateEvaluationModal: React.FC<CreateEvaluationModalProps> = ({ isOpen, onClose, onApply }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPoints, setTotalPoints] = useState(20);

  const handleApply = () => {
    if (!title || !date || totalPoints <= 0) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
    onApply({ title, date, totalPoints: Number(totalPoints) });
    onClose();
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTotalPoints(20);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('create_an_evaluation', 'Créer une évaluation')}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="eval-title" className="block text-sm font-medium text-gray-700 mb-1">{t('evaluation_title', 'Titre de l\'épreuve')}</label>
            <input
              type="text"
              id="eval-title"
              placeholder={t('evaluation_title_placeholder', "Ex: Dictée N°4")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="eval-date" className="block text-sm font-medium text-gray-700 mb-1">{t('date', 'Date')}</label>
            <input
              type="date"
              id="eval-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="eval-points" className="block text-sm font-medium text-gray-700 mb-1">{t('total_points', 'Notée sur')}</label>
            <input
              type="number"
              id="eval-points"
              value={totalPoints}
              onChange={(e) => setTotalPoints(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <DialogFooter className="pt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            {t('cancel')}
          </button>
          <button onClick={handleApply} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600">
            {t('apply', 'Créer')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationModal; 