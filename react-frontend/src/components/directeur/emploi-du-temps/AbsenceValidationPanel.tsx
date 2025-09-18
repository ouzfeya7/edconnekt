import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, User, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAbsencesList, useValidateAbsence } from '../../../hooks/useAbsences';

const AbsenceValidationPanel: React.FC = () => {
  const { t } = useTranslation();
  const { data: absences, isLoading } = useAbsencesList({ skip: 0, limit: 100 });
  const validateAbsence = useValidateAbsence();

  const absencesEnAttente = (absences ?? []).filter((a) => a.status === 'REPORTED');

  const handleValidateAbsence = async (absenceId: string) => {
    try {
      await validateAbsence.mutateAsync(absenceId);
      toast.success(t('absence_validated', 'Absence validée'));
    } catch (e) {
      toast.error(t('error_validating_absence', 'Erreur lors de la validation'));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">{t('absence_validation', 'Validation des Absences')}</h3>
        </div>
        <div className="text-sm text-gray-500">{t('loading', 'Chargement...')}</div>
      </div>
    );
  }

  if (absencesEnAttente.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('absence_validation', 'Validation des Absences')}
          </h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500">{t('no_pending_absences', 'Aucune absence en attente de validation')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('absence_validation', 'Validation des Absences')}
            </h3>
          </div>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {absencesEnAttente.length} {t('pending', 'en attente')}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('teacher', 'Enseignant')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('date', 'Date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('timeslot', 'Créneau')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('reason', 'Raison')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('reported_on', 'Déclaré le')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {absencesEnAttente.map((absence) => (
              <tr key={absence.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {absence.teacher_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(absence.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {absence.timeslot_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-sm text-gray-900 max-w-xs truncate" title={absence.reason}>
                      {absence.reason}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(absence.created_at).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleValidateAbsence(absence.id)}
                    disabled={validateAbsence.isPending}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {validateAbsence.isPending ? t('saving', 'Enregistrement...') : t('validate', 'Valider')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbsenceValidationPanel;