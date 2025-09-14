import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EditClasseModal from './EditClasseModal';
import { useClasse } from '../../../hooks/useClasse';
import { useClasseEleves } from '../../../hooks/useClasseEleves';
import { useClasseEnseignants } from '../../../hooks/useClasseEnseignants';
import { useClasseAudits } from '../../../hooks/useClasseAudits';
import type { ClasseOut } from '../../../api/classe-service/api';
const ClasseDetailPage: React.FC = () => {
  const { classeId } = useParams<{ classeId: string }>();
  const { data: classe, isLoading, isError } = useClasse(classeId || '');
  const { data: eleves } = useClasseEleves(classeId || '');
  const { data: enseignants } = useClasseEnseignants(classeId || '');
  const { data: audits } = useClasseAudits(classeId);
  const [activeTab, setActiveTab] = useState<'details' | 'eleves' | 'enseignants' | 'audit'>('details');
  const [editOpen, setEditOpen] = useState(false);

  const statusBadge = useMemo(() => {
    const archived = Boolean((classe as unknown as { archived_at?: string })?.archived_at);
    if (!classe) return null;
    const color = archived ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800';
    const label = archived ? 'Archivée' : 'Active';
    return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{label}</span>;
  }, [classe]);

  if (isLoading) return <div className="p-8">Chargement…</div>;
  if (isError || !classe) return <div className="p-8 text-red-600">Classe introuvable.</div>;

  const etabId = (classe as unknown as { etablissement_id?: string })?.etablissement_id;

  return (
    <div className="p-8 bg-white min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{classe.nom}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            {statusBadge}
            <span>Code: {classe.code}</span>
            <span>Niveau: {classe.niveau}</span>
            <span>Année: {classe.annee_scolaire}</span>
            <span>Capacité: {typeof classe.capacity === 'number' ? classe.capacity : '—'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditOpen(true)} className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700">Modifier</button>
          <Link to={`/etablissements/${etabId ?? ''}?tab=classes`} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</Link>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4">
          <button onClick={() => setActiveTab('details')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Détails</button>
          <button onClick={() => setActiveTab('eleves')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'eleves' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Élèves</button>
          <button onClick={() => setActiveTab('enseignants')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'enseignants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Enseignants</button>
          <button onClick={() => setActiveTab('audit')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Audit</button>
        </nav>
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded p-4 text-sm text-gray-700 space-y-1">
            <div><span className="text-gray-500">ID:</span> {classe.id}</div>
            <div><span className="text-gray-500">Code:</span> {classe.code}</div>
            <div><span className="text-gray-500">Nom:</span> {classe.nom}</div>
            <div><span className="text-gray-500">Niveau:</span> {classe.niveau}</div>
            <div><span className="text-gray-500">Année scolaire:</span> {classe.annee_scolaire}</div>
            <div><span className="text-gray-500">Capacité:</span> {typeof classe.capacity === 'number' ? classe.capacity : '—'}</div>
            <div><span className="text-gray-500">Créée le:</span> {classe.created_at ? new Date(classe.created_at).toLocaleString() : '—'}</div>
            <div><span className="text-gray-500">MàJ le:</span> {classe.updated_at ? new Date(classe.updated_at).toLocaleString() : '—'}</div>
          </div>
        </div>
      )}

      {activeTab === 'eleves' && (
        <div className="border rounded p-4 overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Élève</th><th className="px-3 py-2 text-left text-sm text-gray-600">ID</th></tr></thead>
            <tbody>
              {(eleves ?? []).map((e) => (
                <tr key={e.id} className="border-t"><td className="px-3 py-2">{e.nom ?? '—'}</td><td className="px-3 py-2">{e.id}</td></tr>
              ))}
              {(!eleves || eleves.length === 0) && (<tr className="border-t"><td className="px-3 py-6 text-center text-gray-500" colSpan={2}>Aucun élève.</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'enseignants' && (
        <div className="border rounded p-4 overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-sm text-gray-600">Enseignant</th><th className="px-3 py-2 text-left text-sm text-gray-600">ID</th></tr></thead>
            <tbody>
              {(enseignants ?? []).map((p) => (
                <tr key={p.id} className="border-t"><td className="px-3 py-2">{p.nom ?? '—'}</td><td className="px-3 py-2">{p.id}</td></tr>
              ))}
              {(!enseignants || enseignants.length === 0) && (<tr className="border-t"><td className="px-3 py-6 text-center text-gray-500" colSpan={2}>Aucun enseignant.</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="border rounded p-4 text-sm text-gray-600 space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">#</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Date</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Opération</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Motif</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Auteur ID</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-600">Auteur Nom</th>
                </tr>
              </thead>
              <tbody>
                {(audits ?? []).map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">{a.id}</td>
                    <td className="px-3 py-2">{new Date(a.date_operation).toLocaleString()}</td>
                    <td className="px-3 py-2">{a.operation}</td>
                    <td className="px-3 py-2">{a.motif ?? '—'}</td>
                    <td className="px-3 py-2">{a.auteur_id ?? '—'}</td>
                    <td className="px-3 py-2">{a.auteur_nom ?? '—'}</td>
                  </tr>
                ))}
                {(!audits || audits.length === 0) && (
                  <tr className="border-t"><td className="px-3 py-6 text-center text-gray-500" colSpan={6}>Aucun audit.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditClasseModal isOpen={editOpen} onClose={() => setEditOpen(false)} classe={classe as unknown as ClasseOut} />
    </div>
  );
};

export default ClasseDetailPage;


