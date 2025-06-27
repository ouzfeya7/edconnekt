import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { cn } from '../../lib/utils';

interface MonthSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (value: string) => void;
  currentValue: string;
}

const MONTHS = [
  "Septembre", "Octobre", "Novembre", "Décembre", 
  "Janvier", "Février", "Mars", "Avril", 
  "Mai", "Juin", "Juillet", "Août"
];

const MonthSelectorModal: React.FC<MonthSelectorModalProps> = ({ isOpen, onClose, onApply, currentValue }) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const handleApply = () => {
    onApply(selectedValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('select_month', 'Sélectionner un mois')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedValue(month)}
                className={cn(
                  'px-4 py-2 rounded-md border text-sm font-medium transition-colors',
                  selectedValue === month
                    ? 'bg-sky-700 text-white border-sky-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200" />
        <DialogFooter className="pt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            {t('cancel', 'Annuler')}
          </button>
          <button onClick={handleApply} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600">
            {t('apply', 'Appliquer')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MonthSelectorModal; 