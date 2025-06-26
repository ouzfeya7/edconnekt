import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { classStats } from '../../lib/mock-data';
import dayjs from 'dayjs';
import { ActionCard } from '../../components/ui/ActionCard';
import DevoirCard from '../../components/evaluations/DevoirCard';
import { Combobox, ComboboxOption } from '../../components/ui/Combobox';
import Pagination from '../../components/ui/Pagination';
import { useNavigate } from 'react-router-dom';

type DevoirStatus = 'À venir' | 'En cours' | 'Terminé' | 'Brouillon';

interface Devoir {
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

// Données factices étendues
export const mockDevoirs: Devoir[] = [
  { id: '1', title: 'Résoudre une équation', subject: 'Mathématique', className: '4e B', status: 'En cours', startDate: dayjs().format('DD MMMM YYYY'), endDate: dayjs().add(1, 'week').format('DD MMMM YYYY'), submitted: 12, notSubmitted: classStats.total - 12 },
  { id: '2', title: 'Expression du futur en anglais', subject: 'Anglais', className: '4e B', status: 'À venir', startDate: dayjs().format('DD MMMM YYYY'), endDate: dayjs().add(2, 'week').format('DD MMMM YYYY'), submitted: 18, notSubmitted: classStats.total - 18, files: [{ name: 'instructions.pdf', url: '#' }, { name: 'example.docx', url: '#' }] },
  { id: '3', title: 'Accord du participe passé', subject: 'Français', className: '4e A', status: 'Terminé', startDate: dayjs().subtract(1, 'week').format('DD MMMM YYYY'), endDate: dayjs().format('DD MMMM YYYY'), submitted: 20, notSubmitted: classStats.total - 20 },
  { id: '4', title: 'Dissertation sur la mondialisation', subject: 'Histoire', className: '3e A', status: 'Terminé', startDate: dayjs().subtract(2, 'weeks').format('DD MMMM YYYY'), endDate: dayjs().subtract(1, 'week').format('DD MMMM YYYY'), submitted: 15, notSubmitted: classStats.total - 15 },
  { id: '5', title: 'Schéma de la cellule', subject: 'SVT', className: '4e A', status: 'Brouillon', startDate: dayjs().format('DD MMMM YYYY'), endDate: dayjs().add(3, 'week').format('DD MMMM YYYY'), submitted: 0, notSubmitted: classStats.total },
];

const ITEMS_PER_PAGE = 8;

const GestionDevoirsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [devoirs] = useState<Devoir[]>(mockDevoirs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const classOptions = useMemo(() => [
    { value: '', label: t('all_classes') },
    ...[...new Set(devoirs.map(d => d.className))].map(c => ({ value: c, label: c }))
  ], [devoirs, t]);

  const subjectOptions = useMemo(() => [
    { value: '', label: t('all_subjects') },
    ...[...new Set(devoirs.map(d => d.subject))].map(s => ({ value: s, label: s }))
  ], [devoirs, t]);

  const statusOptions: ComboboxOption[] = useMemo(() => [
    { value: '', label: t('all_statuses') },
    { value: 'À venir', label: t('status_upcoming') },
    { value: 'En cours', label: t('status_in_progress') },
    { value: 'Terminé', label: t('status_completed') },
    { value: 'Brouillon', label: t('status_draft') },
  ], [t]);

  const filteredDevoirs = useMemo(() => {
    return devoirs
      .filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(d => selectedClass ? d.className === selectedClass : true)
      .filter(d => selectedSubject ? d.subject === selectedSubject : true)
      .filter(d => selectedStatus ? d.status === selectedStatus : true);
  }, [devoirs, searchTerm, selectedClass, selectedSubject, selectedStatus]);

  const paginatedDevoirs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevoirs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevoirs, currentPage]);

  const totalPages = Math.ceil(filteredDevoirs.length / ITEMS_PER_PAGE);

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('homework_management', 'Gestion des devoirs')}</h1>
          <ActionCard 
            icon={<Plus className="text-orange-500" />}
            label={t('add_assignment', 'Ajouter un devoir')}
            onClick={() => navigate('/devoirs/creer')}
          />
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center">
           <div className="relative w-full lg:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder={t('search_assignment', 'Rechercher un devoir...')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-white rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-1/2">
              <Combobox options={classOptions} value={selectedClass} onChange={setSelectedClass} placeholder={t('all_classes')} />
              <Combobox options={subjectOptions} value={selectedSubject} onChange={setSelectedSubject} placeholder={t('all_subjects')} />
              <Combobox options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} placeholder={t('all_statuses')} />
            </div>
        </div>

        {/* Grille des devoirs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default GestionDevoirsPage; 