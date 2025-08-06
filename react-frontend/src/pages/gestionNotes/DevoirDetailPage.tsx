import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Calendar, Book, CheckCircle, Eye, Search, Filter } from 'lucide-react';
import { mockDevoirs } from './GestionDevoirsPage'; 
import { useStudents } from '../../contexts/StudentContext';
import dayjs from 'dayjs';

const DevoirDetailPage: React.FC = () => {
  const { devoirId } = useParams<{ devoirId: string }>();
  const { t } = useTranslation();
  const { students } = useStudents();
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'not_submitted'>('all');
  
  const devoir = mockDevoirs.find(d => d.id === devoirId);
  const studentSubmissions = students.map((student, index) => {
    const hasSubmitted = index < (devoir?.submitted || 0);
    return {
      ...student,
      hasSubmitted,
      submissionDate: hasSubmitted ? dayjs().subtract(index, 'day').format('DD/MM/YYYY [à] HH:mm') : null,
    };
  });

  // Filtrer les soumissions selon la recherche et les filtres
  const filteredSubmissions = useMemo(() => {
    return studentSubmissions.filter(student => {
      const matchesSearch = searchQuery === '' || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'submitted' && student.hasSubmitted) ||
        (statusFilter === 'not_submitted' && !student.hasSubmitted);
      
      return matchesSearch && matchesStatus;
    });
  }, [studentSubmissions, searchQuery, statusFilter]);

  if (!devoir) {
    return (
      <div className="bg-white min-h-screen p-4 md:p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('assignment_not_found', 'Devoir non trouvé')}</h1>
          <Link to="/devoirs" className="text-orange-600 hover:text-orange-700 font-medium">
            {t('back_to_assignments', 'Retour à la liste des devoirs')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="w-full">
        <Link to="/devoirs" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-6 font-medium">
          <ChevronLeft size={20} />
          <span>{t('back_to_assignments', 'Retour aux devoirs')}</span>
        </Link>

        {/* En-tête décoratif moderne */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
          {/* Motifs décoratifs */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full -translate-y-14 translate-x-14"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/15 rounded-full translate-y-10 -translate-x-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
          
          <div className="relative flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{devoir.title}</h1>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <Book size={16} className="text-slate-500" />
                  <span className="font-medium">{devoir.subject}</span>
                </div>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{devoir.className}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                <Calendar size={16} className="text-slate-500" />
                <span>{t('start_date', 'Début')}: {dayjs(devoir.startDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
                <span className="text-slate-400">-</span>
                <span className="font-semibold text-red-500">{t('end_date', 'Fin')}: {dayjs(devoir.endDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
              </div>
            </div>
            <div className="px-4 py-2 text-sm font-semibold rounded-full self-start whitespace-nowrap
              ${devoir.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
            ">
              {t(devoir.status.toLowerCase().replace(' ', '_'), devoir.status)}
            </div>
          </div>
        </div>

        {/* Submissions list */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{t('submissions', 'Soumissions')}</h2>
                <p className="text-slate-500 mt-1">
                  {filteredSubmissions.filter(s => s.hasSubmitted).length} {t('on', 'sur')} {filteredSubmissions.length} {t('students_have_submitted', 'élèves ont soumis')}.
                </p>
              </div>
              
              {/* Barre de recherche et filtres */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un élève..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                
                {/* Filtre par statut */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'submitted' | 'not_submitted')}
                    className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="submitted">Soumis</option>
                    <option value="not_submitted">Non soumis</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">{t('student', 'Élève')}</th>
                  <th scope="col" className="px-6 py-3 font-medium">{t('submission_date', 'Date de soumission')}</th>
                  <th scope="col" className="px-6 py-3 font-medium">{t('status', 'Statut')}</th>
                  <th scope="col" className="px-6 py-3 font-medium">{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((student) => (
                    <tr key={student.id} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img className="h-9 w-9 rounded-full object-cover" src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
                          <span>{`${student.firstName} ${student.lastName}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{student.submissionDate || '-'}</td>
                      <td className="px-6 py-4">
                        {student.hasSubmitted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircle size={14} />
                            {t('submitted', 'Soumis')}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">{t('not_submitted_short', 'Non soumis')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.hasSubmitted && (
                          <button className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium">
                            <Eye size={16} />
                            {t('view_submission', 'Voir la copie')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-300" />
                        <p>Aucun élève trouvé</p>
                        <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevoirDetailPage;
