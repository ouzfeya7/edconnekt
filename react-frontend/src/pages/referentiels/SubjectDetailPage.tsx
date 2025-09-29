import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubject } from '../../hooks/competence/useSubjects';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const SubjectDetailPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useSubject(subjectId);
  const { t } = useTranslation();

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (error && status !== 404) {
      toast.error(t('competency.detail.subject.load_error_toast', 'Une erreur est survenue lors du chargement de la matière.'));
    }
  }, [error, t]);

  if (!subjectId) return <div>{t('param_missing', 'Paramètre manquant')}: subjectId</div>;
  if (isLoading) return <div>{t('loading_subject', 'Chargement de la matière...')}</div>;
  if (error) {
    const status = (error as any)?.response?.status;
    if (status === 404) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="rounded border border-amber-300 bg-amber-50 p-4">
            <div className="font-semibold text-amber-800 mb-1">{t('competency.detail.subject.not_found', 'Matière introuvable (404)')}</div>
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
        <h1 className="text-2xl font-semibold">{t('competency.detail.subject.title', 'Matière')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/referentiels?tab=competencies&refId=${data.referential_id}&version=${data.version_number}&subjectId=${data.id}`)}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {t('competency.detail.subject.view_competencies', 'Voir compétences')}
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
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.subject.info', 'Informations essentielles')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.name', 'Nom')}:</span> {data.name}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.code', 'Code')}:</span> {data.code}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.coefficient', 'Coefficient')}:</span> {data.coefficient ?? '—'}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.credit', 'Crédit')}:</span> {data.credit ?? '—'}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{t('competency.detail.subject.color', 'Couleur')}:</span>
              {data.color ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded border" style={{ backgroundColor: data.color }} />
                  {data.color}
                </span>
              ) : '—'}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500 mb-2">{t('competency.detail.subject.metadata', 'Métadonnées')}</div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-700">ID:</span> {data.id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.referential', 'Référentiel')}:</span> {data.referential_id}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.version', 'Version')}:</span> {data.version_number}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.domain_id', 'Domaine ID')}:</span> {data.domain_id ?? '—'}</div>
            <div><span className="font-medium text-gray-700">{t('competency.detail.subject.order', 'Ordre')}:</span> {data.order_index ?? 0}</div>
            <div><span className="font-medium text-gray-700">{t('competency.common.created_at', 'Créé le')}:</span> {data.created_at ? dayjs(data.created_at).format('DD/MM/YYYY HH:mm') : '—'}</div>
            <div><span className="font-medium text-gray-700">{t('competency.common.updated_at', 'Mis à jour le')}:</span> {data.updated_at ? dayjs(data.updated_at).format('DD/MM/YYYY HH:mm') : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
