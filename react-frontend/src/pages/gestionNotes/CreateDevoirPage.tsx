import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UploadCloud, File as FileIcon, X, Calendar, Book, Users, CircleDot } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { mockCourses, classStats, classes } from '../../lib/mock-data';
import dayjs from 'dayjs';
import { mockDevoirs, Devoir } from './GestionDevoirsPage';
import { useFilters } from '../../contexts/FilterContext';

const DRAFT_STORAGE_KEY = 'create-devoir-draft';

const CreateDevoirPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentClasse } = useFilters();

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(dayjs().add(1, 'week').format('YYYY-MM-DD'));
  const [points, setPoints] = useState('100');

  // Sauvegarde/chargement du brouillon
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setInstructions(draft.instructions || '');
      setSubject(draft.subject || '');
      setDueDate(draft.dueDate || dayjs().add(1, 'week').format('YYYY-MM-DD'));
      setPoints(draft.points || '100');
    }
  }, []);

  const saveDraft = useCallback(() => {
    const draft = { title, instructions, subject, dueDate, points };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [title, instructions, subject, dueDate, points]);

  useEffect(() => {
    saveDraft();
  }, [saveDraft]);

  const handlePublish = () => {
    if (!title || !subject) {
      alert(t('error_title_subject_required', 'Le titre et la matière sont requis.'));
      return;
    }
    const className = classes.find(c => c.id === currentClasse)?.name || currentClasse;

    const newDevoir: Devoir = {
      id: `devoir-${Date.now()}`,
      title,
      subject,
      className, // Dynamically set from context
      status: 'En cours',
      startDate: dayjs().format('DD MMMM YYYY'),
      endDate: dayjs(dueDate).format('DD MMMM YYYY'),
      submitted: 0,
      notSubmitted: classStats.total,
      files: files.map(file => ({ name: file.name, url: URL.createObjectURL(file) })),
    };

    mockDevoirs.unshift(newDevoir);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    navigate('/devoirs');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: setFiles });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f !== fileToRemove));
  };
  
  const subjects = [...new Set(mockCourses.filter(c => c.classId === currentClasse).map(course => course.subject))];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{t('create_assignment', 'Créer un devoir')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { saveDraft(); navigate('/devoirs'); }} className="px-6 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-200">{t('save_and_exit', 'Enregistrer et quitter')}</button>
            <button onClick={handlePublish} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600">{t('assign', 'Publier')}</button>
          </div>
        </div>

        {/* Form Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <input type="text" placeholder={t('title', 'Titre')} value={title} onChange={e => setTitle(e.target.value)} className="w-full text-2xl font-semibold border-b-2 pb-2 focus:border-orange-500 outline-none" />
              <textarea placeholder={t('instructions_optional', 'Instructions (facultatif)')} value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full mt-4 p-2 h-40 border-none focus:ring-0 outline-none resize-none" />
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">{t('attachments', 'Pièces jointes')}</h3>
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">{t('drag_drop', 'Glissez-déposez ou cliquez pour ajouter des fichiers')}</p>
              </div>
              <aside className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-800">{file.name}</span>
                    </div>
                    <button onClick={() => handleRemoveFile(file)} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
                  </div>
                ))}
              </aside>
            </div>
          </div>
          {/* Colonne latérale */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Book className="text-gray-500" />
                <span className="font-semibold">{t('subject', 'Matière')}</span>
              </div>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                <option value="" disabled>{t('select_subject', 'Sélectionner une matière')}</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <hr/>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" />
                <span className="font-semibold">{t('due_date', 'Date limite')}</span>
              </div>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded-md" />
              <hr/>
              <div className="flex items-center gap-3">
                <CircleDot className="text-gray-500" />
                <span className="font-semibold">{t('points', 'Points')}</span>
              </div>
              <input type="text" value={points} onChange={e => setPoints(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDevoirPage; 