import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { mockCourses } from '../../lib/mock-data'; // Pour la liste des matières
import dayjs from 'dayjs';
import { useFilters } from '../../contexts/FilterContext';

export interface NewDevoirData {
  title: string;
  subject: string;
  submissionDate: string;
  files: File[];
}

interface AddDevoirModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: NewDevoirData) => void;
}

const DRAFT_STORAGE_KEY = 'devoir-draft';

const AddDevoirModal: React.FC<AddDevoirModalProps> = ({ isOpen, onClose, onApply }) => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [submissionDate, setSubmissionDate] = useState(dayjs().add(1, 'week').format('YYYY-MM-DD'));
  const [files, setFiles] = useState<File[]>([]);

  // Charger le brouillon au montage du composant si la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || '');
          setSubject(draft.subject || '');
          setSubmissionDate(draft.submissionDate || dayjs().add(1, 'week').format('YYYY-MM-DD'));
          // Les fichiers ne peuvent pas être restaurés pour des raisons de sécurité,
          // l'utilisateur devra les re-sélectionner.
        } catch (error) {
          console.error("Failed to parse draft from localStorage", error);
        }
      }
    }
  }, [isOpen]);

  // Sauvegarder le brouillon à chaque changement
  useEffect(() => {
    if (isOpen) {
      const draft = { title, subject, submissionDate };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [title, subject, submissionDate, isOpen]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleApply = () => {
    if (!title || !subject || !submissionDate) return;
    onApply({ title, subject, submissionDate, files });
    // Vider le brouillon après la création
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    onClose();
    // Reset state
    setTitle('');
    setSubject('');
    setSubmissionDate(dayjs().add(1, 'week').format('YYYY-MM-DD'));
    setFiles([]);
  };

  const handleClose = () => {
    // Ne pas vider le brouillon si l'utilisateur annule
    onClose();
  };

  // Liste unique de matières en fonction de la classe sélectionnée
  const subjects = [...new Set(mockCourses.filter(c => c.classId === currentClasse).map(course => course.subject))];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{t('add_assignment', 'Ajouter un devoir')}</DialogTitle>
          <DialogDescription>{t('add_assignment_desc', 'Remplissez les informations ci-dessous pour créer un nouveau devoir.')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right font-medium text-gray-700">{t('title', 'Titre')}</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3 p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="subject" className="text-right font-medium text-gray-700">{t('subject', 'Matière')}</label>
            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3 p-2 border rounded-md bg-white">
              <option value="" disabled>{t('select_subject', 'Sélectionner une matière')}</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="submissionDate" className="text-right font-medium text-gray-700">{t('submission_date', 'Date de soumission')}</label>
            <input id="submissionDate" type="date" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} className="col-span-3 p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
             <label className="text-right font-medium text-gray-700 mt-2">{t('attachments', 'Pièces jointes')}</label>
            <div className="col-span-3">
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">{t('drag_drop', 'Glissez et déposez des fichiers ici, ou cliquez pour sélectionner')}</p>
              </div>
              <aside className="mt-4">
                {files.length > 0 && <h4 className="font-semibold text-gray-700 mb-2">{t('files', 'Fichiers')}</h4>}
                <ul>
                  {files.map((file, i) => (
                    <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-1">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-800">{file.name}</span>
                      </div>
                      <button onClick={() => handleRemoveFile(file)} className="text-gray-500 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 mt-4 border-t">
          <button onClick={handleClose} className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">{t('cancel', 'Annuler')}</button>
          <button onClick={handleApply} className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600">{t('create_assignment', 'Créer le devoir')}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDevoirModal; 