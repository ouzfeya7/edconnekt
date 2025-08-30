import React, { useState } from 'react';
import { useReferentials } from '../../hooks/competence/useReferentials';
import { useSubjects } from '../../hooks/competence/useSubjects';
import { useCompetencies } from '../../hooks/competence/useCompetencies';
import { useDomains } from '../../hooks/competence/useDomains';
import { useCreateReferential, usePublishReferential, useCreateDomain, useCreateSubject, useCreateCompetency, useUpdateSubject, useDeleteSubject, useUpdateCompetency, useDeleteCompetency } from '../../hooks/competence/useMutations';
import toast from 'react-hot-toast';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { CycleEnum } from '../../api/competence-service/api';

const ReferentielsManager: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [q, setQ] = useState<string>('');
  const [cycle, setCycle] = useState<string | null>(null);
  const [state, setRefState] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string | null>(null);
  const [selectedReferentialId, setSelectedReferentialId] = useState<string | null>(null);
  const [versionNumber, setVersionNumber] = useState<number | null>(null);
  const [subjectPage, setSubjectPage] = useState(1);
  const [subjectSize, setSubjectSize] = useState(20);
  const [subjectQ, setSubjectQ] = useState<string>('');
  const [competencyPage, setCompetencyPage] = useState(1);
  const [competencySize, setCompetencySize] = useState(20);
  const [competencyQ, setCompetencyQ] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'referentials' | 'domains' | 'subjects' | 'competencies'>('referentials');

  const { data: refs, isLoading: refsLoading } = useReferentials({ page, size, cycle, state: state, visibility, q: q || null });

  type Paginated<TItem> = { items: TItem[]; total: number };
  type ReferentialListItem = { id: string; name: string; cycle?: string; version_number: number; state?: string; visibility?: string };
  type SubjectRow = { id: string; code?: string; name?: string; coefficient?: number | string | null; credit?: number | string | null };
  type CompetencyRow = { id: string; code?: string; label?: string; description?: string | null };

  // Narrow unknown query results to expected shapes locally
  const refsPage = refs as unknown as Paginated<ReferentialListItem> | undefined;
  // Derive a default referential/version if not chosen yet
  const firstRef = refsPage?.items?.[0];
  const effectiveReferentialId = selectedReferentialId ?? firstRef?.id ?? null;
  const effectiveVersion = versionNumber ?? firstRef?.version_number ?? null;

  const { data: subjects, isLoading: subjectsLoading } = useSubjects(
    effectiveReferentialId && effectiveVersion !== null
      ? { referentialId: effectiveReferentialId, versionNumber: effectiveVersion, page: subjectPage, size: subjectSize, q: subjectQ || null }
      : // dummy args to satisfy types but will not run due to enabled in hook
        { referentialId: '', versionNumber: 0 }
  );
  const subjectsPage = subjects as unknown as Paginated<SubjectRow> | undefined;

  const { data: competencies, isLoading: compLoading } = useCompetencies(
    effectiveReferentialId && effectiveVersion !== null
      ? { referentialId: effectiveReferentialId, versionNumber: effectiveVersion, page: competencyPage, size: competencySize, subjectId: selectedSubjectId ?? null, q: competencyQ || null }
      : { referentialId: '', versionNumber: 0 }
  );
  const competenciesPage = competencies as unknown as Paginated<CompetencyRow> | undefined;

  const totalRefs = refsPage?.total ?? 0;
  const { data: domains } = useDomains({ referentialId: effectiveReferentialId ?? undefined, versionNumber: effectiveVersion ?? undefined });
  const totalDomains = (domains ?? []).length;
  const totalSubjects = subjectsPage?.total ?? 0;
  const totalCompetencies = competenciesPage?.total ?? 0;

  const createRef = useCreateReferential();
  const publishRef = usePublishReferential();
  const createDomain = useCreateDomain();
  const createSubject = useCreateSubject();
  const createCompetency = useCreateCompetency();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const updateCompetency = useUpdateCompetency();
  const deleteCompetency = useDeleteCompetency();

  // Local modal state
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [refForm, setRefForm] = useState<{ name: string; cycle: CycleEnum }>({ name: '', cycle: CycleEnum.Primaire });
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState<'create' | 'edit'>('create');
  const [subjectForm, setSubjectForm] = useState<{ id?: string; code: string; name: string; coefficient?: string; credit?: string }>({ code: '', name: '', coefficient: '', credit: '' });
  const [competencyModalOpen, setCompetencyModalOpen] = useState(false);
  const [competencyModalMode, setCompetencyModalMode] = useState<'create' | 'edit'>('create');
  const [competencyForm, setCompetencyForm] = useState<{ id?: string; code: string; label: string; description?: string }>({ code: '', label: '', description: '' });

  const openCreateReferential = () => {
    setRefForm({ name: '', cycle: CycleEnum.Primaire });
    setRefModalOpen(true);
  };
  const submitReferentialForm = async () => {
    if (!refForm.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    await toast.promise(createRef.mutateAsync({ name: refForm.name.trim(), cycle: refForm.cycle }), { loading: 'Création…', success: 'Référentiel créé', error: 'Échec de la création' });
    setRefModalOpen(false);
  };
  const handlePublishRef = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    await toast.promise(publishRef.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion }), { loading: 'Publication…', success: 'Référentiel publié', error: 'Échec de la publication' });
  };
  const handleQuickCreateDomain = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    const name = prompt('Nom du domaine ?');
    if (!name) return;
    await toast.promise(createDomain.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion, payload: { name } as { name: string } }), { loading: 'Création…', success: 'Domaine créé', error: 'Échec de la création' });
  };
  const openCreateSubject = () => {
    setSubjectModalMode('create');
    setSubjectForm({ code: '', name: '', coefficient: '', credit: '' });
    setSubjectModalOpen(true);
  };
  const openEditSubject = (s: SubjectRow) => {
    setSubjectModalMode('edit');
    setSubjectForm({ id: s.id, code: s.code ?? '', name: s.name ?? '', coefficient: s.coefficient?.toString?.() ?? '', credit: s.credit?.toString?.() ?? '' });
    setSubjectModalOpen(true);
  };
  const submitSubjectForm = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    const coefficient = subjectForm.coefficient ? Number(subjectForm.coefficient) : undefined;
    const credit = subjectForm.credit ? Number(subjectForm.credit) : undefined;
    if (subjectModalMode === 'create') {
      if (!subjectForm.code || !subjectForm.name) {
        toast.error('Code et Nom sont requis');
        return;
      }
      const payload: { code: string; name: string; coefficient?: number; credit?: number } = { code: subjectForm.code, name: subjectForm.name };
      if (typeof coefficient === 'number') payload.coefficient = coefficient;
      if (typeof credit === 'number') payload.credit = credit;
      await toast.promise(
        createSubject.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion, payload }),
        { loading: 'Création…', success: 'Matière créée', error: 'Échec de la création' }
      );
    } else if (subjectForm.id) {
      const updatePayload: { name?: string; code?: string; coefficient?: number; credit?: number } = { name: subjectForm.name, code: subjectForm.code };
      if (typeof coefficient === 'number') updatePayload.coefficient = coefficient;
      if (typeof credit === 'number') updatePayload.credit = credit;
      await toast.promise(
        updateSubject.mutateAsync({ subjectId: subjectForm.id, update: updatePayload }),
        { loading: 'Mise à jour…', success: 'Matière mise à jour', error: 'Échec de la mise à jour' }
      );
    }
    setSubjectModalOpen(false);
  };

  const openCreateCompetency = () => {
    setCompetencyModalMode('create');
    setCompetencyForm({ code: '', label: '', description: '' });
    setCompetencyModalOpen(true);
  };
  const openEditCompetency = (c: CompetencyRow) => {
    setCompetencyModalMode('edit');
    setCompetencyForm({ id: c.id, code: c.code ?? '', label: c.label ?? '', description: c.description ?? '' });
    setCompetencyModalOpen(true);
  };
  const submitCompetencyForm = async () => {
    if (!effectiveReferentialId || effectiveVersion === null || !selectedSubjectId) return;
    if (competencyModalMode === 'create') {
      if (!competencyForm.code || !competencyForm.label) {
        toast.error('Code et Libellé sont requis');
        return;
      }
      const payload: { subject_id: string; code: string; label: string; description?: string } = { subject_id: selectedSubjectId, code: competencyForm.code, label: competencyForm.label };
      if (competencyForm.description) payload.description = competencyForm.description;
      await toast.promise(
        createCompetency.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion, payload }),
        { loading: 'Création…', success: 'Compétence créée', error: 'Échec de la création' }
      );
    } else if (competencyForm.id) {
      const updatePayload: { label?: string; description?: string } = { label: competencyForm.label };
      if (competencyForm.description) updatePayload.description = competencyForm.description;
      await toast.promise(
        updateCompetency.mutateAsync({ competencyId: competencyForm.id, update: updatePayload }),
        { loading: 'Mise à jour…', success: 'Compétence mise à jour', error: 'Échec de la mise à jour' }
      );
    }
    setCompetencyModalOpen(false);
  };

  const exportCsv = (filename: string, rows: Array<Record<string, unknown>>) => {
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const csv = [headers.join(','), ...rows.map((r: Record<string, unknown>) => headers.map(h => JSON.stringify((r as Record<string, unknown>)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Référentiels</h1>
        <p className="text-gray-600">Administrez les référentiels, matières et compétences exposés par l'API.</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'referentials' as const, title: 'Référentiels', icon: GraduationCap },
            { id: 'domains' as const, title: 'Domaines', icon: GraduationCap },
            { id: 'subjects' as const, title: 'Matières', icon: BookOpen },
            { id: 'competencies' as const, title: 'Compétences', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {activeTab === 'referentials' && (
          <div className="border rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Référentiels</div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={openCreateReferential} disabled={createRef.isPending}>Créer</button>
                <button className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white" onClick={handlePublishRef} disabled={!effectiveReferentialId || effectiveVersion === null || publishRef.isPending}>Publier</button>
                <div className="text-sm text-gray-600">{refsLoading ? 'Chargement…' : `${totalRefs} élément(s)`}</div>
              </div>
            </div>
            <div className="p-4 flex flex-wrap items-center gap-3 text-sm">
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher…" className="border rounded px-3 py-2 w-48" />
              <select value={cycle ?? ''} onChange={(e) => { setCycle(e.target.value || null); setPage(1); }} className="border rounded px-2 py-2">
                <option value="">Cycle</option>
                <option value="PRESCOLAIRE">Préscolaire</option>
                <option value="PRIMAIRE">Primaire</option>
                <option value="COLLEGE">Collège</option>
                <option value="LYCEE">Lycée</option>
                <option value="UNIVERSITE">Université</option>
              </select>
              <select value={state ?? ''} onChange={(e) => { setRefState(e.target.value || null); setPage(1); }} className="border rounded px-2 py-2">
                <option value="">État</option>
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
              <select value={visibility ?? ''} onChange={(e) => { setVisibility(e.target.value || null); setPage(1); }} className="border rounded px-2 py-2">
                <option value="">Visibilité</option>
                <option value="TENANT">Établissement</option>
                <option value="GLOBAL">Global</option>
              </select>
              <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-2">
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
              <button className="px-3 py-1.5 text-sm rounded border" onClick={() => exportCsv('referentiels.csv', (refsPage?.items ?? []).map((r: ReferentialListItem) => ({ id: r.id, name: r.name, cycle: r.cycle, version_number: r.version_number, state: r.state, visibility: (r as Record<string, unknown>).visibility ?? '' })))}>Exporter CSV</button>
            </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(refsPage?.items ?? []).map((r: ReferentialListItem) => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedReferentialId(r.id); setVersionNumber(r.version_number); setSubjectPage(1); setCompetencyPage(1); setSelectedSubjectId(null); setActiveTab('subjects'); }}
                  className={`w-full text-left border rounded p-3 ${effectiveReferentialId === r.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="font-medium text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-600">Cycle: {r.cycle} • Version: {r.version_number} • État: {r.state}</div>
                </button>
              ))}
              {(!refsPage || (refsPage.items ?? []).length === 0) && (
                <div className="text-sm text-gray-500">Aucun référentiel</div>
              )}
            </div>
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <div>Page {page}</div>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Préc.</button>
                <button className="px-2 py-1 border rounded" disabled={(refsPage?.items?.length ?? 0) < size} onClick={() => setPage((p) => p + 1)}>Suiv.</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="border rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Domaines</div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={handleQuickCreateDomain} disabled={!effectiveReferentialId || effectiveVersion === null}>Créer</button>
                <div className="text-sm text-gray-600">{totalDomains} élément(s)</div>
              </div>
            </div>
            <div className="px-4 pt-3 text-xs text-gray-600">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(domains ?? []).map((d) => (
                <div key={d.id} className="border rounded p-3 hover:bg-gray-50">
                  <div className="font-medium text-gray-900">{d.name}</div>
                </div>
              ))}
              {(!domains || domains.length === 0) && (
                <div className="text-sm text-gray-500">Aucun domaine</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="border rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Matières</div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={openCreateSubject} disabled={!effectiveReferentialId || effectiveVersion === null}>Créer</button>
                <div className="text-sm text-gray-600">{subjectsLoading ? 'Chargement…' : `${totalSubjects} élément(s)`}</div>
              </div>
            </div>
            <div className="px-4 pt-3 text-xs text-gray-600">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            <div className="p-4 flex flex-wrap items-center gap-3 text-sm">
              <input value={subjectQ} onChange={(e) => { setSubjectQ(e.target.value); setSubjectPage(1); }} placeholder="Rechercher matière…" className="border rounded px-3 py-2 w-56" />
              <select value={subjectSize} onChange={(e) => { setSubjectSize(Number(e.target.value)); setSubjectPage(1); }} className="border rounded px-2 py-2">
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
              <button className="px-3 py-1.5 text-sm rounded border" onClick={() => exportCsv('matieres.csv', (subjectsPage?.items ?? []).map((s: SubjectRow) => ({ id: s.id, code: s.code, name: s.name, coefficient: s.coefficient, credit: s.credit })))}>Exporter CSV</button>
            </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(subjectsPage?.items ?? []).map((s: SubjectRow) => (
                <div key={s.id} className={`border rounded p-3 ${selectedSubjectId === s.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <button onClick={() => { setSelectedSubjectId(s.id); setCompetencyPage(1); setActiveTab('competencies'); }} className="text-left">
                      <div className="font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-600">Code: {s.code} • Coef: {s.coefficient ?? '—'} • Crédit: {s.credit ?? '—'}</div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 text-xs border rounded" onClick={() => openEditSubject(s)}>Éditer</button>
                      <button className="px-2 py-1 text-xs border rounded text-red-600" onClick={async () => {
                        if (!confirm('Supprimer cette matière ?')) return;
                        await toast.promise(deleteSubject.mutateAsync({ subjectId: s.id }), { loading: 'Suppression…', success: 'Supprimé', error: 'Échec suppression' });
                      }}>Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
              {(!subjectsPage || (subjectsPage.items ?? []).length === 0) && (
                <div className="text-sm text-gray-500">Aucune matière</div>
              )}
            </div>
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <div>Page {subjectPage}</div>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded" disabled={subjectPage <= 1} onClick={() => setSubjectPage((p) => Math.max(1, p - 1))}>Préc.</button>
                <button className="px-2 py-1 border rounded" disabled={(subjectsPage?.items?.length ?? 0) < subjectSize} onClick={() => setSubjectPage((p) => p + 1)}>Suiv.</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competencies' && (
          <div className="border rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Compétences</div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={openCreateCompetency} disabled={!effectiveReferentialId || effectiveVersion === null || !selectedSubjectId}>Créer</button>
                <div className="text-sm text-gray-600">{compLoading ? 'Chargement…' : `${totalCompetencies} élément(s)`}</div>
              </div>
            </div>
            <div className="px-4 pt-3 text-xs text-gray-600">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'} • Matière: {selectedSubjectId ?? '—'}</div>
            <div className="p-4 flex flex-wrap items-center gap-3 text-sm">
              <input value={competencyQ} onChange={(e) => { setCompetencyQ(e.target.value); setCompetencyPage(1); }} placeholder="Rechercher compétence…" className="border rounded px-3 py-2 w-56" />
              <select value={competencySize} onChange={(e) => { setCompetencySize(Number(e.target.value)); setCompetencyPage(1); }} className="border rounded px-2 py-2">
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
              <button className="px-3 py-1.5 text-sm rounded border" onClick={() => exportCsv('competences.csv', (competenciesPage?.items ?? []).map((c: CompetencyRow) => ({ id: c.id, code: c.code, label: c.label })))}>Exporter CSV</button>
            </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(competenciesPage?.items ?? []).map((c: CompetencyRow) => (
                <div key={c.id} className="border rounded p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{c.label}</div>
                      <div className="text-xs text-gray-600">Code: {c.code}</div>
                      {c.description && <div className="text-xs text-gray-600 mt-1">{c.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 text-xs border rounded" onClick={() => openEditCompetency(c)}>Éditer</button>
                      <button className="px-2 py-1 text-xs border rounded text-red-600" onClick={async () => {
                        if (!confirm('Supprimer cette compétence ?')) return;
                        await toast.promise(deleteCompetency.mutateAsync({ competencyId: c.id }), { loading: 'Suppression…', success: 'Supprimé', error: 'Échec suppression' });
                      }}>Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
              {(!competenciesPage || (competenciesPage.items ?? []).length === 0) && (
                <div className="text-sm text-gray-500">Aucune compétence</div>
              )}
            </div>
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <div>Page {competencyPage}</div>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded" disabled={competencyPage <= 1} onClick={() => setCompetencyPage((p) => Math.max(1, p - 1))}>Préc.</button>
                <button className="px-2 py-1 border rounded" disabled={(competenciesPage?.items?.length ?? 0) < competencySize} onClick={() => setCompetencyPage((p) => p + 1)}>Suiv.</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Referentiel Modal */}
      {refModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRefModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="px-5 py-4 border-b">
              <div className="text-lg font-semibold">Créer un référentiel</div>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                <input className="w-full border rounded px-3 py-2" value={refForm.name} onChange={(e) => setRefForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex: Programme national" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cycle</label>
                <select className="w-full border rounded px-3 py-2" value={refForm.cycle} onChange={(e) => setRefForm((f) => ({ ...f, cycle: e.target.value as unknown as CycleEnum }))}>
                  <option value={CycleEnum.Prescolaire}>Préscolaire</option>
                  <option value={CycleEnum.Primaire}>Primaire</option>
                  <option value={CycleEnum.College}>Collège</option>
                  <option value={CycleEnum.Lycee}>Lycée</option>
                  <option value={CycleEnum.Universite}>Université</option>
                </select>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => setRefModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white" onClick={submitReferentialForm} disabled={createRef.isPending}>Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSubjectModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="px-5 py-4 border-b">
              <div className="text-lg font-semibold">{subjectModalMode === 'create' ? 'Créer une matière' : 'Éditer la matière'}</div>
              <div className="text-xs text-gray-500 mt-1">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Code</label>
                <input className="w-full border rounded px-3 py-2" value={subjectForm.code} onChange={(e) => setSubjectForm((f) => ({ ...f, code: e.target.value }))} placeholder="Ex: MAT"
                  disabled={subjectModalMode === 'edit'} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                <input className="w-full border rounded px-3 py-2" value={subjectForm.name} onChange={(e) => setSubjectForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex: Mathématiques" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Coefficient (optionnel)</label>
                  <input type="number" className="w-full border rounded px-3 py-2" value={subjectForm.coefficient ?? ''} onChange={(e) => setSubjectForm((f) => ({ ...f, coefficient: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Crédit (optionnel)</label>
                  <input type="number" className="w-full border rounded px-3 py-2" value={subjectForm.credit ?? ''} onChange={(e) => setSubjectForm((f) => ({ ...f, credit: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => setSubjectModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white" onClick={submitSubjectForm} disabled={createSubject.isPending || updateSubject.isPending}>{subjectModalMode === 'create' ? 'Créer' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Competency Modal */}
      {competencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCompetencyModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="px-5 py-4 border-b">
              <div className="text-lg font-semibold">{competencyModalMode === 'create' ? 'Créer une compétence' : 'Éditer la compétence'}</div>
              <div className="text-xs text-gray-500 mt-1">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'} • Matière: {selectedSubjectId ?? '—'}</div>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Code</label>
                <input className="w-full border rounded px-3 py-2" value={competencyForm.code} onChange={(e) => setCompetencyForm((f) => ({ ...f, code: e.target.value }))} placeholder="Ex: C-MAT-01"
                  disabled={competencyModalMode === 'edit'} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Libellé</label>
                <input className="w-full border rounded px-3 py-2" value={competencyForm.label} onChange={(e) => setCompetencyForm((f) => ({ ...f, label: e.target.value }))} placeholder="Ex: Résoudre un problème" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description (optionnel)</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} value={competencyForm.description ?? ''} onChange={(e) => setCompetencyForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => setCompetencyModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white" onClick={submitCompetencyForm} disabled={createCompetency.isPending || updateCompetency.isPending}>{competencyModalMode === 'create' ? 'Créer' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferentielsManager;


