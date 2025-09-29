import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompetency } from '../../hooks/competence/useCompetencies';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const CompetencyDetailPage: React.FC = () => {
  const { competencyId } = useParams<{ competencyId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useCompetency(competencyId);
  const { t } = useTranslation();

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (error && status !== 404) {
      toast.error(t('competency.detail.competency.load_error_toast', 'Une erreur est survenue lors du chargement de la compétence.'));
    }
  }, [error, t]);

  if (!competencyId) return <div>{t('param_missing', 'Paramètre manquant')}: competencyId</div>;
  if (isLoading) return <div>{t('loading_competency', 'Chargement de la compétence...')}</div>;
  if (error) {
    const status = (error as any)?.response?.status;
    if (status === 404) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="rounded border border-amber-300 bg-amber-50 p-4">
            <div className="font-semibold text-amber-800 mb-1">{t('competency.detail.competency.not_found', 'Compétence introuvable (404)')}</div>
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
        <h1 className="text-2xl font-semibold">{t('competency.detail.competency.title', 'Compétence')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/referentiels?refId=${data.referential_id}&version=${data.version_number}&tab=competencies${data.subject_id ? `&subjectId=${data.subject_id}` : ''}`)}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {t('competency.detail.competency.open_ref', 'Ouvrir le référentiel')}
          </button>
          {data.subject_id && (
            <button
              onClick={() => navigate(`/referentiels/subjects/${data.subject_id}`)}
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
            >
              {t('competency.detail.competency.view_subject', 'Voir la matière')}
            </button>
          )}
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
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.competency.info', 'Informations')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.label', 'Libellé')}:</span> {data.label}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.code', 'Code')}:</span> {data.code}</div>
            <div>
              <span className="font-medium text-gray-700">{t('competency.detail.competency.description', 'Description')}:</span>
              <div className="mt-1 text-gray-700">{data.description ?? '—'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">{t('competency.detail.competency.levels', 'Niveaux')}:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(data.levels ?? []).length > 0 ? (
                  (data.levels ?? []).map((lvl) => (
                    <span key={lvl} className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200">{lvl}</span>
                  ))
                ) : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.competency.metadata', 'Métadonnées')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">ID:</span> {data.id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.subject_id', 'Matière ID')}:</span> {data.subject_id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.referential', 'Référentiel')}:</span> {data.referential_id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.version', 'Version')}:</span> {data.version_number}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.competency.order', 'Ordre')}:</span> {data.order_index ?? 0}</div>
            <div><span className="font-medium text-gray-700">{t('competency.common.created_at', 'Créé le')}:</span> {data.created_at ? dayjs(data.created_at).format('DD/MM/YYYY HH:mm') : '—'}</div>
            <div><span className="font-medium text-gray-700">{t('competency.common.updated_at', 'Mis à jour le')}:</span> {data.updated_at ? dayjs(data.updated_at).format('DD/MM/YYYY HH:mm') : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyDetailPage;
