import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { cn } from '../../lib/utils';
import { StudentNote } from '../../lib/notes-data';

interface ChildSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (value: string) => void;
  currentValue: string;
  children: StudentNote[];
}

const ChildSelectorModal: React.FC<ChildSelectorModalProps> = ({ isOpen, onClose, onApply, currentValue, children }) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const childOptions = children.map(c => ({
      value: c.studentId,
      label: `${c.firstName} ${c.lastName}`
  }));

  const handleApply = () => {
    onApply(selectedValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('select_a_child', 'Sélectionner un enfant')}</DialogTitle>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {childOptions.map((option: { value: string; label: string }) => (
            <button
              key={option.value}
              onClick={() => setSelectedValue(option.value)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium truncate',
                selectedValue === option.value
                  ? 'bg-[#184867] text-white border-[#184867]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              )}
              title={option.label}
            >
              {option.label}
            </button>
          ))}
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

export default ChildSelectorModal; 