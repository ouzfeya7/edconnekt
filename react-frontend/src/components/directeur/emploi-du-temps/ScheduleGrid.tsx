import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { useSchedule } from '../../../contexts/ScheduleContext';

const ScheduleGrid: React.FC = () => {
  const { t } = useTranslation();
  const { courses, conflicts, filters, getCoursesByDay, getCoursesByClasse } = useSchedule();

  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const getCourseForSlot = (day: string, timeSlot: string, classe: string) => {
    const dayCourses = getCoursesByDay(day);
    return dayCourses.find(course => 
      course.heureDebut === timeSlot.split('-')[0] && 
      course.classe === classe
    );
  };

  const getConflictForSlot = (day: string, timeSlot: string, classe: string) => {
    return conflicts.find(conflict => 
      conflict.jour === day && 
      conflict.heureDebut === timeSlot.split('-')[0] && 
      conflict.classe === classe
    );
  };

  const getCourseColor = (type: string) => {
    switch (type) {
      case 'cours':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'td':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'tp':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'evaluation':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const classes = filters.classe.length > 0 ? filters.classe : ['6ème', '5ème', '4ème', '3ème'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                {t('time')}
              </th>
              {days.map(day => (
                <th key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                  {t(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                  {timeSlot}
                </td>
                {days.map(day => (
                  <td key={day} className="px-4 py-2 border-r border-gray-200">
                    <div className="space-y-2">
                      {classes.map((classe: string) => {
                        const course = getCourseForSlot(day, timeSlot, classe);
                        const conflict = getConflictForSlot(day, timeSlot, classe);
                        
                        if (conflict) {
                          return (
                            <div key={classe} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                              <div className="flex items-center text-red-700 mb-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                <span className="font-medium">{t('conflict')}</span>
                              </div>
                              <div className="text-red-600">
                                <div>{conflict.type}</div>
                                <div className="text-xs opacity-75">{conflict.description}</div>
                              </div>
                            </div>
                          );
                        }

                        if (course) {
                          return (
                            <div key={classe} className={`p-2 border rounded text-xs ${getCourseColor(course.type)}`}>
                              <div className="font-medium mb-1">{course.matiere}</div>
                              <div className="flex items-center text-xs opacity-75 mb-1">
                                <Users className="w-3 h-3 mr-1" />
                                <span>{course.enseignant}</span>
                              </div>
                              <div className="flex items-center text-xs opacity-75">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{course.salle}</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={classe} className="p-2 text-xs text-gray-400">
                            {classe}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleGrid;
