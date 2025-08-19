import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Save, X } from 'lucide-react';
import { useSchedule } from '../../../contexts/ScheduleContext';

interface ScheduleFormProps {
  onClose: () => void;
  editCourse?: any;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onClose, editCourse }) => {
  const { t } = useTranslation();
  const { addCourse, updateCourse, detectConflicts } = useSchedule();
  
  const [formData, setFormData] = useState({
    matiere: editCourse?.matiere || '',
    enseignant: editCourse?.enseignant || '',
    classe: editCourse?.classe || '',
    jour: editCourse?.jour || 'lundi',
    heureDebut: editCourse?.heureDebut || '08:00',
    duree: editCourse?.duree || 1,
    salle: editCourse?.salle || '',
    type: editCourse?.type || 'cours'
  });

  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkConflicts = async () => {
    setIsChecking(true);
    const courseData = {
      ...formData,
      heure: formData.heureDebut,
      cycle: '6eme' // Valeur par défaut, à adapter selon le contexte
    };
    const detectedConflicts = detectConflicts(courseData);
    setConflicts(detectedConflicts);
    setIsChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      heure: formData.heureDebut,
      cycle: '6eme' // Valeur par défaut, à adapter selon le contexte
    };
    
    if (editCourse) {
      updateCourse(editCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    
    onClose();
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const courseTypes = [
    { value: 'cours', label: t('course') },
    { value: 'td', label: t('tutorial') },
    { value: 'tp', label: t('practical_work') },
    { value: 'evaluation', label: t('evaluation') }
  ];

  const days = [
    { value: 'lundi', label: t('monday') },
    { value: 'mardi', label: t('tuesday') },
    { value: 'mercredi', label: t('wednesday') },
    { value: 'jeudi', label: t('thursday') },
    { value: 'vendredi', label: t('friday') },
    { value: 'samedi', label: t('saturday') }
  ];

  const classes = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editCourse ? t('edit_course') : t('add_course')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('subject')} *
              </label>
              <input
                type="text"
                value={formData.matiere}
                onChange={(e) => handleInputChange('matiere', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher')} *
              </label>
              <input
                type="text"
                value={formData.enseignant}
                onChange={(e) => handleInputChange('enseignant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('class')} *
              </label>
              <select
                value={formData.classe}
                onChange={(e) => handleInputChange('classe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t('select_class')}</option>
                {classes.map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('day')} *
              </label>
              <select
                value={formData.jour}
                onChange={(e) => handleInputChange('jour', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {days.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('start_time')} *
              </label>
              <select
                value={formData.heureDebut}
                onChange={(e) => handleInputChange('heureDebut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('duration')} (heures) *
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={formData.duree}
                onChange={(e) => handleInputChange('duree', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('room')} *
              </label>
              <input
                type="text"
                value={formData.salle}
                onChange={(e) => handleInputChange('salle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('course_type')} *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {courseTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={checkConflicts}
              disabled={isChecking}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              {isChecking ? t('checking') : t('check_conflicts')}
            </button>
          </div>

          {conflicts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                {t('conflicts_detected')} ({conflicts.length})
              </h4>
              <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <strong>{conflict.type}:</strong> {conflict.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              {editCourse ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {editCourse ? t('save') : t('add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
