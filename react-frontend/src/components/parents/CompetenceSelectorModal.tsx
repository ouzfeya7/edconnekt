import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { cn } from '../../lib/utils';
import { getSubjectsForClass, Domain, Subject, Competence } from '../../lib/notes-data';

interface CompetenceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (competence: { id: string; label: string }) => void;
  classId: string;
}

const CompetenceSelectorModal: React.FC<CompetenceSelectorModalProps> = ({
  isOpen,
  onClose,
  onApply,
  classId,
}) => {
  const { t } = useTranslation();
  const domains = useMemo(() => getSubjectsForClass(classId), [classId]);

  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);

  const handleApply = () => {
    if (selectedCompetence) {
      onApply(selectedCompetence);
      onClose();
    }
  };

  const resetSelection = (level: 'domain' | 'subject') => {
    if (level === 'domain') {
        setSelectedSubject(null);
    }
    setSelectedCompetence(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{t('select_competence', 'Sélectionner une compétence')}</DialogTitle>
        </DialogHeader>

        <div className="flex space-x-4 py-4">
          {/* Domaines */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-gray-600">{t('domains', 'Domaines')}</h4>
            {domains.map(domain => (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain);
                  resetSelection('domain');
                }}
                className={cn('w-full text-left px-3 py-2 rounded-md text-sm',
                  selectedDomain?.id === domain.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                )}
              >
                {domain.name}
              </button>
            ))}
          </div>

          {/* Matières */}
          <div className="flex-1 space-y-2">
             <h4 className="font-semibold text-gray-600">{t('subjects', 'Matières')}</h4>
            {selectedDomain?.subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => {
                    setSelectedSubject(subject);
                    resetSelection('subject');
                }}
                className={cn('w-full text-left px-3 py-2 rounded-md text-sm',
                  selectedSubject?.id === subject.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                )}
              >
                {subject.name}
              </button>
            ))}
          </div>

          {/* Compétences */}
          <div className="flex-1 space-y-2">
             <h4 className="font-semibold text-gray-600">{t('competences', 'Compétences')}</h4>
            {selectedSubject?.competences.map(competence => (
              <button
                key={competence.id}
                onClick={() => setSelectedCompetence(competence)}
                className={cn('w-full text-left px-3 py-2 rounded-md text-sm',
                    selectedCompetence?.id === competence.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                )}
              >
                {competence.label}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            {t('cancel')}
          </button>
          <button onClick={handleApply} disabled={!selectedCompetence} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:bg-gray-300">
            {t('apply')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompetenceSelectorModal; 