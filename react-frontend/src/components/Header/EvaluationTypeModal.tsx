import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { cn } from '../../lib/utils';

interface EvaluationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (value: string) => void;
  currentValue: string;
}

const EvaluationTypeModal: React.FC<EvaluationTypeModalProps> = ({ isOpen, onClose, onApply, currentValue }) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const options = [
    { value: "Continue", label: t('continuous', 'Continue') },
    { value: "Intégration", label: t('integration', 'Intégration') },
    { value: "Trimestrielle", label: t('term_based', 'Trimestrielle') },
  ];

  const handleApply = () => {
    onApply(selectedValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('evaluation_type', 'Type d\'évaluation')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center space-x-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedValue(option.value)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium',
                  selectedValue === option.value
                    ? 'bg-[#184867] text-white border-[#184867]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                )}
              >
                {option.label}
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

export default EvaluationTypeModal; 