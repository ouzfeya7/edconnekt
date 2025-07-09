import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import ChildSelectorModal from './ChildSelectorModal';
import { StudentNote } from '../../lib/notes-data';

interface ChildSelectorCardProps {
  children: StudentNote[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
}

const ChildSelectorCard: React.FC<ChildSelectorCardProps> = ({ children, selectedChildId, onSelectChild }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedChild = children.find(c => c.studentId === selectedChildId);

  const handleApply = (value: string) => {
    onSelectChild(value);
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center h-full border border-gray-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div>
          <p className="text-sm text-gray-500">{t('child', 'Mon Enfant')}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl text-gray-800">
              {selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : t('select_a_child', 'Sélectionner un enfant')}
            </p>
            <ChevronDown className="text-gray-500" />
          </div>
        </div>
      </div>

      <ChildSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={selectedChildId}
        children={children}
      />
    </>
  );
};

export default ChildSelectorCard; 