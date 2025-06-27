import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Calendar, Book, CheckCircle, Eye } from 'lucide-react';
import { mockDevoirs } from './GestionDevoirsPage'; 
import { useStudents, Student } from '../../contexts/StudentContext';
import dayjs from 'dayjs';

const DevoirDetailPage: React.FC = () => {
  const { devoirId } = useParams<{ devoirId: string }>();
  const { t } = useTranslation();
  const { students } = useStudents();
  
  const devoir = mockDevoirs.find(d => d.id === devoirId);
  const studentSubmissions = students.map((student, index) => {
    const hasSubmitted = index < (devoir?.submitted || 0);
    return {
      ...student,
      hasSubmitted,
      submissionDate: hasSubmitted ? dayjs().subtract(index, 'day').format('DD/MM/YYYY [à] HH:mm') : null,
    };
  });

  if (!devoir) {
    return (
      <div className="p-6 text-center">
        <h1>{t('assignment_not_found', 'Devoir non trouvé')}</h1>
        <Link to="/devoirs" className="text-blue-600 hover:underline mt-4 inline-block">
          {t('back_to_assignments', 'Retour à la liste des devoirs')}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/devoirs" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 font-medium">
          <ChevronLeft size={20} />
          <span>{t('back_to_assignments', 'Retour aux devoirs')}</span>
        </Link>

        {/* Header card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{devoir.title}</h1>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-600">
              <div className="flex items-center gap-2">
                <Book size={16} className="text-gray-400" />
                <span>{devoir.subject}</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span>{devoir.className}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>{t('start_date', 'Début')}: {dayjs(devoir.startDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
              <span className="text-gray-400">-</span>
              <span className="font-semibold text-red-500">{t('end_date', 'Fin')}: {dayjs(devoir.endDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
            </div>
          </div>
          <div className="px-4 py-2 text-sm font-semibold rounded-full self-start whitespace-nowrap
            ${devoir.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
          ">
            {t(devoir.status.toLowerCase().replace(' ', '_'), devoir.status)}
          </div>
        </div>

        {/* Submissions list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{t('submissions', 'Soumissions')}</h2>
            <p className="text-gray-500 mt-1">
              {devoir.submitted} {t('on', 'sur')} {students.length} {t('students_have_submitted', 'élèves ont soumis')}.
            </p>
          </div>
          
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">{t('student', 'Élève')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('submission_date', 'Date de soumission')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('status', 'Statut')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {studentSubmissions.map((student) => (
                <tr key={student.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img className="h-9 w-9 rounded-full object-cover" src={student.avatar} alt={student.name} />
                      <span>{student.name}</span>
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
                      <span className="text-gray-400 italic">{t('not_submitted_short', 'Non soumis')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {student.hasSubmitted && (
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium">
                        <Eye size={16} />
                        {t('view_submission', 'Voir la copie')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DevoirDetailPage;
