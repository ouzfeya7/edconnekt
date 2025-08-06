import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { getStudentAssignments, StudentAssignment } from '../../lib/mock-student-data';
import dayjs from 'dayjs';
import { ActionCard } from '../../components/ui/ActionCard';
import DevoirCard from '../../components/evaluations/DevoirCard';
import { Combobox, ComboboxOption } from '../../components/ui/Combobox';
import Pagination from '../../components/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import { classes } from '../../lib/mock-data';

type DevoirStatus = 'À venir' | 'En cours' | 'Terminé' | 'Brouillon';

export interface Devoir {
  id: string;
  title: string;
  subject: string;
  className: string;
  status: DevoirStatus;
  startDate: string;
  endDate: string;
  submitted: number;
  notSubmitted: number;
  files?: { name: string; url: string }[];
}

const transformAssignmentToDevoir = (assignment: StudentAssignment): Devoir => {
  // On adapte les champs pour correspondre à l'interface Devoir
  // On suppose une seule classe pour la démo ("CP1"), à adapter si besoin
  // Les dates sont simplifiées, à adapter selon le besoin réel
  return {
    id: assignment.id.toString(),
    title: assignment.title,
    subject: assignment.subject,
    className: 'CP1',
    status:
      assignment.status === 'pending'
        ? 'En cours'
        : assignment.status === 'completed'
        ? 'Terminé'
        : assignment.status === 'overdue'
        ? 'À venir'
        : 'Brouillon',
    startDate: dayjs().format('DD MMMM YYYY'),
    endDate: assignment.dueDate,
    submitted: Math.floor(Math.random() * 20), // Valeur fictive, à remplacer par la vraie logique
    notSubmitted: 20 - Math.floor(Math.random() * 20), // Valeur fictive
    files: assignment.resources?.map(r => ({ name: r.name, url: r.url || '#' })) || [],
  };
};

const ITEMS_PER_PAGE = 12;

// Export des données mock pour les autres composants
export const mockDevoirs: Devoir[] = getStudentAssignments().map(transformAssignmentToDevoir);

const GestionDevoirsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const classOptions = useMemo(() => [
    { value: '', label: t('all_classes', 'Toutes les classes') },
    ...classes.map(c => ({ value: c.name, label: c.name }))
  ], [t]);

  const subjectOptions = useMemo(() => [
    { value: '', label: t('all_subjects') },
    ...[...new Set(mockDevoirs.map(d => d.subject))].map(s => ({ value: s, label: s }))
  ], [mockDevoirs, t]);

  const statusOptions: ComboboxOption[] = useMemo(() => [
    { value: '', label: t('all_statuses') },
    { value: 'À venir', label: t('status_upcoming') },
    { value: 'En cours', label: t('status_in_progress') },
    { value: 'Terminé', label: t('status_completed') },
    { value: 'Brouillon', label: t('status_draft') },
  ], [t]);

  const filteredDevoirs = useMemo(() => {
    return mockDevoirs
      .filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(d => selectedClass ? d.className === selectedClass : true)
      .filter(d => selectedSubject ? d.subject === selectedSubject : true)
      .filter(d => selectedStatus ? d.status === selectedStatus : true);
  }, [mockDevoirs, searchTerm, selectedClass, selectedSubject, selectedStatus]);

  const paginatedDevoirs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevoirs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevoirs, currentPage]);

  const totalPages = Math.ceil(filteredDevoirs.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête moderne décoratif */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{t('homework_management', 'Gestion des devoirs')}</h1>
          <ActionCard 
            icon={<Plus className="text-orange-500" />} 
            label={t('add_assignment', 'Ajouter un devoir')} 
            onClick={() => navigate('/devoirs/creer')} 
          />
        </div>
      </div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder={t('search_assignment', 'Rechercher un devoir...')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-white rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            <Combobox options={classOptions} value={selectedClass} onChange={setSelectedClass} placeholder={t('all_classes', 'Toutes les classes')} />
            <Combobox options={subjectOptions} value={selectedSubject} onChange={setSelectedSubject} placeholder={t('all_subjects')} />
            <Combobox options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} placeholder={t('all_statuses')} />
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 lg:mt-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      {/* Grille des devoirs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDevoirs.map(devoir => (
          <DevoirCard
            key={devoir.id}
            id={devoir.id}
            title={devoir.title}
            subject={devoir.subject}
            startDate={devoir.startDate}
            endDate={devoir.endDate}
            submitted={devoir.submitted}
            notSubmitted={devoir.notSubmitted}
          />
        ))}
      </div>
    </div>
  );
};

export default GestionDevoirsPage; 