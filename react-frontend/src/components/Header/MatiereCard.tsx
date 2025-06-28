import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MatiereModal from './MatiereModal';
import { ChevronDown } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import { getSubjectsForClass } from '../../lib/notes-data';

interface MatiereCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const MatiereCard: React.FC<MatiereCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentClasse } = useFilters();

  const domains = getSubjectsForClass(currentClasse);
  const subjectNames = [...new Set(domains.flatMap(domain => domain.subjects.map(s => s.name)))];

  const options = [
    { value: "Tout", label: t('all') },
    ...subjectNames.map(name => ({ value: name, label: name }))
  ];

  const displayValue = options.find(opt => opt.value === value)?.label || value;

  const handleApply = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <div 
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-start cursor-pointer w-full h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="block text-sm text-gray-500 font-medium">{t('subject')}</span>
        <div className="flex items-center justify-between w-full mt-2">
          <span className="text-lg text-gray-900 font-medium">{displayValue}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <MatiereModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={value}
        options={options}
    />
    </>
  );
};

export default MatiereCard; 