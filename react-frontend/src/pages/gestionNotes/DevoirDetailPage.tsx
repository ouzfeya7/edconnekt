import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Calendar, Book, CheckCircle, XCircle, Eye, Send, Download } from 'lucide-react';
import { mockDevoirs } from './GestionDevoirsPage'; 
import { initialStudents, Student } from '../../contexts/StudentContext';
import dayjs from 'dayjs';
import { ActionCard } from '../../components/ui/ActionCard';

const DevoirDetailPage: React.FC = () => {
  const { devoirId } = useParams<{ devoirId: string }>();
  const { t } = useTranslation();
  
  const devoir = mockDevoirs.find(d => d.id === devoirId);

  // Simulation: on ne sait pas *qui* a soumis, juste combien.
  // On assigne un statut aléatoire et une date de soumission factice.
  const submittedCount = devoir?.submitted || 0;
  const studentSubmissions = initialStudents.map((student: Student, index: number) => {
    const hasSubmitted = index < submittedCount;
    let submissionDate = null;
    if (hasSubmitted) {
      // Génère une heure et minute aléatoire pour un rendu plus réaliste
      const randomHour = Math.floor(Math.random() * 10) + 8; // entre 8h et 17h
      const randomMinute = Math.floor(Math.random() * 60);
      
      submissionDate = dayjs(devoir?.endDate, 'DD MMMM YYYY', 'fr')
        .subtract(Math.floor(Math.random() * 3) + 1, 'day') // Soumis 1 à 3 jours avant
        .hour(randomHour)
        .minute(randomMinute)
        .format('DD/MM/YYYY [à] HH:mm');
    }
    return {
      ...student,
      hasSubmitted,
      submissionDate,
    };
  }).sort(() => Math.random() - 0.5);

  if (!devoir) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">{t('assignment_not_found', 'Devoir non trouvé')}</h1>
        <Link to="/devoirs" className="text-blue-600 hover:underline mt-4 inline-block">
          {t('back_to_assignments', 'Retour à la liste des devoirs')}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link to="/devoirs" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft size={20} />
          <span className="font-medium">{t('back_to_assignments', 'Retour aux devoirs')}</span>
        </Link>

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{devoir.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-gray-500">
            <div className="flex items-center gap-2">
              <Book size={16} />
              <span>{devoir.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">|</span>
              <span>{devoir.className}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>{t('start_date', 'Début')}: {dayjs(devoir.startDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
              <span className="text-gray-400">-</span>
              <span className="font-semibold text-red-500">{t('end_date', 'Fin')}: {dayjs(devoir.endDate, 'DD MMMM YYYY').format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              {devoir.files && devoir.files.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {devoir.files.map((file, index) => (
                    <ActionCard
                      key={index}
                      href={file.url}
                      download={file.name}
                      icon={<Download size={16} />}
                      label={file.name}
                      className="px-3 py-1.5 text-xs bg-gray-100"
                    />
                  ))}
                </div>
              )}
              <div className={`px-3 py-1 text-sm font-semibold rounded-full self-end ${
                devoir.status === 'Terminé' ? 'bg-green-100 text-green-700' :
                devoir.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {t(devoir.status.toLowerCase().replace(' ', '_'), devoir.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Student list */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{t('submissions', 'Soumissions')}</h2>
            <p className="text-gray-500 mt-1">{devoir.submitted} {t('on', 'sur')} {devoir.submitted + devoir.notSubmitted} {t('students_have_submitted', 'élèves ont soumis')}.</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-10 gap-4 text-xs font-medium text-gray-500 uppercase px-4 pb-2 border-b">
              <span className="col-span-4">{t('student', 'Élève')}</span>
              <span className="col-span-2 text-left">{t('submission_date', 'Date de soumission')}</span>
              <span className="col-span-2 text-center">{t('status', 'Statut')}</span>
              <span className="col-span-2 text-right">{t('actions', 'Actions')}</span>
            </div>
            <ul>
              {studentSubmissions.map((student: Student & { hasSubmitted: boolean, submissionDate: string | null }) => (
                <li key={student.id} className="grid grid-cols-10 gap-4 items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 col-span-4">
                    <img className="h-10 w-10 rounded-full object-cover" src={student.imageUrl} alt={student.name} />
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 col-span-2">
                    {student.submissionDate || '-'}
                  </div>
                  <div className="text-center col-span-2">
                    {student.hasSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        <CheckCircle size={14} />
                        {t('submitted', 'Soumis')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        <XCircle size={14} />
                        {t('not_submitted', 'Non soumis')}
                      </span>
                    )}
                  </div>
                  <div className="text-right col-span-2">
                    {student.hasSubmitted ? (
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline" onClick={() => alert(`Voir la copie de ${student.name}`)}>
                        <Eye size={16} />
                        {t('view_submission', 'Voir la copie')}
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 text-sm text-orange-600 hover:underline" onClick={() => alert(`Rappel envoyé à ${student.name}`)}>
                        <Send size={16} />
                        {t('send_reminder', 'Envoyer un rappel')}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevoirDetailPage;
