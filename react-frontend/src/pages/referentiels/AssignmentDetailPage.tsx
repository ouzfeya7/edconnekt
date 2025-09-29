import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssignment } from '../../hooks/competence/useAssignments';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const AssignmentDetailPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useAssignment(assignmentId);
  const { t } = useTranslation();

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (error && status !== 404) {
      toast.error(t('competency.detail.assignment.load_error_toast', "Une erreur est survenue lors du chargement de l'affectation."));
    }
  }, [error, t]);

  if (!assignmentId) return <div>{t('param_missing', 'Paramètre manquant')}: assignmentId</div>;
  if (isLoading) return <div>{t('loading_assignment', "Chargement de l'affectation...")}</div>;
  if (error) {
    const status = (error as any)?.response?.status;
    if (status === 404) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="rounded border border-amber-300 bg-amber-50 p-4">
            <div className="font-semibold text-amber-800 mb-1">{t('competency.detail.assignment.not_found', 'Affectation introuvable (404)')}</div>
            <div className="text-sm text-amber-700">{t('resource_missing_or_deleted', "La ressource demandée n'existe pas ou a été supprimée.")}</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(-1)}>{t('competency.common.back', 'Retour')}</button>
              <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate('/referentiels')}>{t('competency.common.open_referentials', 'Ouvrir les référentiels')}</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <div className="font-semibold text-red-800 mb-1">{t('competency.common.error_title', 'Erreur')}</div>
          <div className="text-sm text-red-700 break-all">{error.message}</div>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 text-sm border rounded" onClick={() => refetch()} disabled={isFetching}>{isFetching ? t('retrying', 'Nouvel essai…') : t('competency.common.retry', 'Réessayer')}</button>
            <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(-1)}>{t('competency.common.back', 'Retour')}</button>
          </div>
        </div>
      </div>
    );
  }
  if (!data) return <div>Aucune donnée disponible.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('competency.detail.assignment.title', 'Affectation')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/referentiels?refId=${data.referential_id}&version=${data.version_number}&tab=domains`)}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {t('competency.detail.assignment.open_ref', 'Ouvrir le référentiel')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {t('competency.common.back', 'Retour')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.assignment.info', 'Informations')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">ID:</span> {data.id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.assignment.referential', 'Référentiel')}:</span> {data.referential_id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.assignment.version', 'Version')}:</span> {data.version_number}</div>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.assignment.scope', 'Portée')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">{t('competency.detail.assignment.type', 'Type')}:</span> {data.scope_type}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.assignment.value', 'Valeur')}:</span> {data.scope_value}</div>
            <div><span className="font-medium text-gray-700">{t('competency.common.created_at', 'Créé le')}:</span> {data.created_at ? dayjs(data.created_at).format('DD/MM/YYYY HH:mm') : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
