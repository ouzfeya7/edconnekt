import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClassSelectorModal from './ClassSelectorModal';
import { classes } from '../../lib/mock-data';

interface ClassNameCardProps {
  className: string;
  onClassChange: (className: string) => void;
  isEditable?: boolean;
}

const ClassNameCard: React.FC<ClassNameCardProps> = ({ className, onClassChange, isEditable = true }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (newClass: string) => {
    onClassChange(newClass);
    setIsModalOpen(false);
  };

  const displayName = classes.find(c => c.id === className)?.name || className;

    return (
    <>
      <div 
        className={`bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between h-full ${isEditable ? 'cursor-pointer' : ''}`}
        onClick={() => isEditable && setIsModalOpen(true)}
      >
        <div>
          <span className="text-sm text-gray-500">{t('class')}</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-gray-800">{displayName}</h3>
            {isEditable && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </div>
        </div>
      </div>
      <ClassSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={className}
      />
    </>
  );
};

export default ClassNameCard; 