import React, { useEffect, useState } from 'react';
import { useLookupCompetencyByCode } from '../../hooks/competence/useCompetencies';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CompetencyLookupPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [referentialId, setReferentialId] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  const navigate = useNavigate();
  const { t } = useTranslation();
  const enabled = code.trim().length > 0;
  const { data, isLoading, error, refetch, isFetching } = useLookupCompetencyByCode({
    code: enabled ? code.trim() : undefined,
    referentialId: referentialId.trim() || undefined,
    version: version ? Number(version) : undefined,
  });

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (error && status !== 404) {
      toast.error(t('competency.lookup.load_error_toast', 'Une erreur est survenue lors de la recherche.'));
    }
  }, [error, t]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled) return;
    refetch();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t('competency.lookup.title', 'Recherche de compétence par code')}</h1>

      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded border">
        <div>
          <label className="block text-sm font-medium mb-1">{t('competency.lookup.code_label', 'Code de la compétence')}</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: MATH.CALC.1"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t('competency.lookup.referential_label', 'Référentiel (optionnel)')}</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="referentialId"
              value={referentialId}
              onChange={(e) => setReferentialId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('competency.lookup.version_label', 'Version (optionnel)')}</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="ex: 1"
              inputMode="numeric"
              pattern="\\d*"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!enabled || isFetching}
          >
            {isLoading || isFetching ? t('competency.lookup.searching', 'Recherche...') : t('competency.lookup.submit', 'Rechercher')}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {error && (() => {
          const status = (error as any)?.response?.status;
          if (status === 404) {
            return (
              <div className="rounded border border-amber-300 bg-amber-50 p-4">
                <div className="font-semibold text-amber-800 mb-1">{t('competency.lookup.not_found_title', 'Aucune compétence trouvée (404)')}</div>
                <div className="text-sm text-amber-700">{t('competency.lookup.not_found_hint', 'Vérifiez le code saisi et réessayez.')}</div>
                <div className="mt-3">
                  <button className="px-3 py-2 text-sm border rounded" onClick={() => refetch()} disabled={isFetching}>{isFetching ? t('retrying', 'Nouvel essai…') : t('competency.common.retry', 'Réessayer')}</button>
                </div>
              </div>
            );
          }
          return (
            <div className="rounded border border-red-300 bg-red-50 p-4">
              <div className="font-semibold text-red-800 mb-1">{t('competency.common.error_title', 'Erreur')}</div>
              <div className="text-sm text-red-700 break-all">{error.message}</div>
              <div className="mt-3">
                <button className="px-3 py-2 text-sm border rounded" onClick={() => refetch()} disabled={isFetching}>{isFetching ? t('retrying', 'Nouvel essai…') : t('competency.common.retry', 'Réessayer')}</button>
              </div>
            </div>
          );
        })()}

        {data && (
          <div className="bg-white border rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{t('result', 'Résultat')}</h2>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(`/referentiels/competencies/${data.id}`)}>{t('competency.lookup.open_detail', 'Ouvrir la fiche')}</button>
                <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(`/referentiels?refId=${data.referential_id}&version=${data.version_number}&tab=competencies${data.subject_id ? `&subjectId=${data.subject_id}` : ''}`)}>{t('competency.lookup.open_ref', 'Ouvrir le référentiel')}</button>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium text-gray-700">{t('competency.detail.competency.label', 'Libellé')}:</span> {data.label}</div>
              <div><span className="font-medium text-gray-700">{t('competency.detail.competency.code', 'Code')}:</span> {data.code}</div>
              <div><span className="font-medium text-gray-700">{t('competency.detail.competency.subject_id', 'Matière ID')}:</span> {data.subject_id ?? '—'}</div>
              <div><span className="font-medium text-gray-700">{t('competency.detail.competency.referential', 'Référentiel')}:</span> {data.referential_id} • v{data.version_number}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetencyLookupPage;
