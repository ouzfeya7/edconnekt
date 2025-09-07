import React, { useState } from 'react';
import { useReferentials } from '../../hooks/competence/useReferentials';
import { useSubjects } from '../../hooks/competence/useSubjects';
import { useCompetencies } from '../../hooks/competence/useCompetencies';
import { useDomains } from '../../hooks/competence/useDomains';
import { useCreateReferential, usePublishReferential, useDeleteReferential, useCreateDomain, useUpdateDomain, useDeleteDomain, useCreateSubject, useCreateCompetency, useUpdateSubject, useDeleteSubject, useUpdateCompetency, useDeleteCompetency } from '../../hooks/competence/useMutations';
import toast from 'react-hot-toast';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { CycleEnum, VisibilityEnum } from '../../api/competence-service/api';

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
  
  // Filtres pour chaque onglet
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [competencyFilter, setCompetencyFilter] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'referentials' | 'domains' | 'subjects' | 'competencies'>('referentials');

  const { data: refs, isLoading: refsLoading } = useReferentials({ page, size, cycle, state: state, visibility, q: q || null });

  type Paginated<TItem> = { items: TItem[]; total: number };
  type ReferentialListItem = { id: string; name: string; cycle?: string; version_number: number; state?: string; visibility?: string };
  type SubjectRow = { id: string; code?: string; name?: string; coefficient?: number | string | null; credit?: number | string | null; domain_id?: string; color?: string | null };
  type CompetencyRow = { id: string; code?: string; label?: string; description?: string | null; subject_id?: string };

  // Narrow unknown query results to expected shapes locally
  const refsPage = refs as unknown as Paginated<ReferentialListItem> | undefined;
  // L'utilisateur doit sélectionner un référentiel pour accéder aux autres onglets
  const effectiveReferentialId = selectedReferentialId ?? null;
  const effectiveVersion = versionNumber ?? null;

  const { data: subjects, isLoading: subjectsLoading } = useSubjects(
    effectiveReferentialId && effectiveVersion !== null
      ? { referentialId: effectiveReferentialId, versionNumber: effectiveVersion, page: subjectPage, size: subjectSize, q: subjectQ || null }
      : // dummy args to satisfy types but will not run due to enabled in hook
        { referentialId: '', versionNumber: 0 }
  );
  const subjectsPage = subjects as unknown as Paginated<SubjectRow> | undefined;

  const { data: competencies, isLoading: compLoading } = useCompetencies(
    effectiveReferentialId && effectiveVersion !== null
       ? { referentialId: effectiveReferentialId, versionNumber: effectiveVersion, page: competencyPage, size: competencySize, subjectId: null, q: competencyQ || null }
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
  const deleteRef = useDeleteReferential();
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();
  const createSubject = useCreateSubject();
  const createCompetency = useCreateCompetency();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const updateCompetency = useUpdateCompetency();
  const deleteCompetency = useDeleteCompetency();

  // Local modal state
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [refForm, setRefForm] = useState<{ 
    name: string; 
    cycle: CycleEnum; 
    description?: string | null; 
    visibility?: VisibilityEnum;
  }>({ 
    name: '', 
    cycle: CycleEnum.Primaire,
    description: '',
    visibility: undefined
  });
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState<'create' | 'edit'>('create');
  const [subjectForm, setSubjectForm] = useState<{ 
    id?: string; 
    code: string; 
    name: string; 
    coefficient?: string; 
    credit?: string; 
    color?: string; 
    order_index?: number;
  }>({ 
    code: '', 
    name: '', 
    coefficient: '', 
    credit: '', 
    color: '', 
    order_index: 0 
  });
  const [subjectDomainId, setSubjectDomainId] = useState<string>('');
  const [subjectFormSubmitted, setSubjectFormSubmitted] = useState(false);
  const [competencyModalOpen, setCompetencyModalOpen] = useState(false);
  const [competencyModalMode, setCompetencyModalMode] = useState<'create' | 'edit'>('create');
  const [competencyForm, setCompetencyForm] = useState<{ 
    id?: string; 
    code: string; 
    label: string; 
    description?: string; 
    levels?: string[]; 
    order_index?: number;
  }>({ 
    code: '', 
    label: '', 
    description: '', 
    levels: [], 
    order_index: 0 
  });
  const [competencySubjectId, setCompetencySubjectId] = useState<string | null>(null);

  // Modal state pour les domaines
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [domainModalMode, setDomainModalMode] = useState<'create' | 'edit'>('create');
  const [domainForm, setDomainForm] = useState<{ 
    id?: string; 
    name: string; 
    order_index?: number;
  }>({ 
    name: '', 
    order_index: 0 
  });
  const [domainFormSubmitted, setDomainFormSubmitted] = useState(false);
  
  // États pour le déploiement des lignes
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedCompetencies, setExpandedCompetencies] = useState<Set<string>>(new Set());

  const openCreateReferential = () => {
    setRefForm({ 
      name: '', 
      cycle: CycleEnum.Primaire, 
      description: '', 
      visibility: undefined 
    });
    setRefModalOpen(true);
    // Réinitialiser l'état de la mutation
    createRef.reset();
  };
  const submitReferentialForm = async () => {
    if (!refForm.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    const payload: { 
      name: string; 
      cycle: CycleEnum; 
      description?: string | null; 
      visibility?: VisibilityEnum;
    } = { 
      name: refForm.name.trim(), 
      cycle: refForm.cycle 
    };
    if (refForm.description?.trim()) payload.description = refForm.description.trim();
    if (refForm.visibility) payload.visibility = refForm.visibility;
    
    await toast.promise(createRef.mutateAsync(payload), { loading: 'Création…', success: 'Référentiel créé', error: 'Échec de la création' });
    setRefModalOpen(false);
  };
  const handlePublishRef = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    await toast.promise(
      publishRef.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion }),
      {
        loading: 'Publication…',
        success: 'Référentiel publié',
        error: (err: unknown) => {
          const anyErr = err as { response?: { status?: number; data?: { error?: string; code?: string; detail?: string } } };
          const status = anyErr?.response?.status;
          const data = anyErr?.response?.data;
          const code = data?.error || data?.code || '';
          const detail = data?.detail || '';
          const isValidationBeforePublish = status === 400 && (code.includes('VALIDATION') || detail.toLowerCase().includes('validation'));
          if (isValidationBeforePublish) {
            return "Publication impossible: le référentiel est vide. Ajoutez au moins un domaine, une matière et une compétence, puis réessayez.";
          }
          return 'Échec de la publication';
        },
      }
    );
  };

  const handleDeleteRef = async (referentialId: string, versionNumber: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce référentiel ? Cette action est irréversible.')) return;
    await toast.promise(deleteRef.mutateAsync({ referentialId, versionNumber }), { loading: 'Suppression…', success: 'Référentiel supprimé', error: 'Échec de la suppression' });
  };
  const openCreateDomain = () => {
    setDomainModalMode('create');
    setDomainForm({ name: '', order_index: 0 });
    setDomainFormSubmitted(false);
    setDomainModalOpen(true);
    // Réinitialiser les états des mutations
    createDomain.reset();
    updateDomain.reset();
  };

  const openEditDomain = (d: { id: string; name: string }) => {
    setDomainModalMode('edit');
    setDomainForm({ id: d.id, name: d.name });
    setDomainFormSubmitted(false);
    setDomainModalOpen(true);
  };

  const submitDomainForm = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    
    // Marquer le formulaire comme soumis pour afficher les erreurs de validation
    setDomainFormSubmitted(true);
    
    if (!domainForm.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    if (domainModalMode === 'create') {
      const payload: { name: string; order_index?: number } = { name: domainForm.name.trim() };
      if (domainForm.order_index !== undefined) payload.order_index = domainForm.order_index;
      
      await toast.promise(
        createDomain.mutateAsync({ 
          referentialId: effectiveReferentialId, 
          versionNumber: effectiveVersion, 
          payload 
        }), 
        { loading: 'Création…', success: 'Domaine créé', error: 'Échec de la création' }
      );
    } else if (domainForm.id) {
      const updatePayload: { name?: string; order_index?: number } = { name: domainForm.name.trim() };
      if (domainForm.order_index !== undefined) updatePayload.order_index = domainForm.order_index;
      
      await toast.promise(
        updateDomain.mutateAsync({ 
          domainId: domainForm.id, 
          update: updatePayload 
        }), 
        { loading: 'Mise à jour…', success: 'Domaine mis à jour', error: 'Échec de la mise à jour' }
      );
    }
    setDomainModalOpen(false);
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('Supprimer ce domaine ?')) return;
    await toast.promise(
      deleteDomain.mutateAsync({ domainId }), 
      { loading: 'Suppression…', success: 'Domaine supprimé', error: 'Échec de la suppression' }
    );
  };

  // Fonctions pour gérer le déploiement des lignes
  const toggleSubjectExpansion = (subjectId: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const toggleCompetencyExpansion = (competencyId: string) => {
    setExpandedCompetencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(competencyId)) {
        newSet.delete(competencyId);
      } else {
        newSet.add(competencyId);
      }
      return newSet;
    });
  };
  const openCreateSubject = () => {
    setSubjectModalMode('create');
    setSubjectForm({ 
      code: '', 
      name: '', 
      coefficient: '', 
      credit: '', 
      color: '', 
      order_index: 0 
    });
    setSubjectDomainId(domainFilter || '');
    setSubjectFormSubmitted(false);
    setSubjectModalOpen(true);
    // Réinitialiser les états des mutations
    createSubject.reset();
    updateSubject.reset();
  };
  const openEditSubject = (s: SubjectRow) => {
    setSubjectModalMode('edit');
    setSubjectForm({ id: s.id, code: s.code ?? '', name: s.name ?? '', coefficient: s.coefficient?.toString?.() ?? '', credit: s.credit?.toString?.() ?? '' });
    setSubjectFormSubmitted(false);
    setSubjectModalOpen(true);
  };
  const submitSubjectForm = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    
    // Marquer le formulaire comme soumis pour afficher les erreurs de validation
    setSubjectFormSubmitted(true);
    
    const coefficient = subjectForm.coefficient ? Number(subjectForm.coefficient) : undefined;
    const credit = subjectForm.credit ? Number(subjectForm.credit) : undefined;
    if (subjectModalMode === 'create') {
      if (!subjectForm.code || !subjectForm.name) {
        toast.error('Code et Nom sont requis');
        return;
      }
      if (!subjectDomainId) {
        toast.error('Veuillez sélectionner un domaine');
        return;
      }
             const payload: { code: string; name: string; domain_id: string; coefficient?: number; credit?: number; color?: string; order_index?: number } = { code: subjectForm.code, name: subjectForm.name, domain_id: subjectDomainId };
      if (typeof coefficient === 'number') payload.coefficient = coefficient;
      if (typeof credit === 'number') payload.credit = credit;
       if (subjectForm.color?.trim()) payload.color = subjectForm.color.trim();
       if (subjectForm.order_index !== undefined) payload.order_index = subjectForm.order_index;
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
    setCompetencyForm({ 
      code: '', 
      label: '', 
      description: '', 
      order_index: 0 
    });
    setCompetencySubjectId(competencyFilter || null);
    setCompetencyModalOpen(true);
    // Réinitialiser les états des mutations
    createCompetency.reset();
    updateCompetency.reset();
  };
  const openEditCompetency = (c: CompetencyRow) => {
    setCompetencyModalMode('edit');
    setCompetencyForm({ id: c.id, code: c.code ?? '', label: c.label ?? '', description: c.description ?? '' });
    setCompetencyModalOpen(true);
  };
  const submitCompetencyForm = async () => {
    if (!effectiveReferentialId || effectiveVersion === null) return;
    if (competencyModalMode === 'create') {
      if (!competencyForm.code || !competencyForm.label) {
        toast.error('Code et Libellé sont requis');
        return;
      }
      if (!competencySubjectId) {
        toast.error('Veuillez sélectionner une matière');
        return;
      }
             const payload: { subject_id: string; code: string; label: string; description?: string; levels?: string[]; order_index?: number } = { subject_id: competencySubjectId, code: competencyForm.code, label: competencyForm.label };
      if (competencyForm.description) payload.description = competencyForm.description;
       if (competencyForm.levels && competencyForm.levels.length > 0) payload.levels = competencyForm.levels;
       if (competencyForm.order_index !== undefined) payload.order_index = competencyForm.order_index;
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
                   onClick={() => { 
                     setSelectedReferentialId(r.id); 
                     setVersionNumber(r.version_number); 
                     setActiveTab('domains');
                   }}
                   className={`w-full text-left border rounded p-3 hover:bg-gray-50 transition-colors ${
                     effectiveReferentialId === r.id 
                       ? 'border-blue-400 bg-blue-25' 
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                         <div className={`w-2 h-2 rounded-full ${
                           r.state === 'PUBLISHED' ? 'bg-green-400' : 'bg-amber-400'
                         }`} />
                  <div className="font-medium text-gray-900">{r.name}</div>
                       </div>
                       <div className="flex items-center gap-4 text-sm text-gray-500">
                         <span className="flex items-center gap-1">
                           <GraduationCap className="w-3 h-3" />
                           {r.cycle}
                         </span>
                         <span className="flex items-center gap-1">
                           <BookOpen className="w-3 h-3" />
                           v{r.version_number}
                         </span>
                         <span className={`px-2 py-0.5 rounded text-xs ${
                           r.state === 'PUBLISHED' 
                             ? 'bg-green-50 text-green-700' 
                             : 'bg-amber-50 text-amber-700'
                         }`}>
                           {r.state === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                         </span>
                         {r.visibility && (
                           <span className="text-xs text-gray-400">
                             {r.visibility === 'GLOBAL' ? 'Global' : 'Établissement'}
                           </span>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       {effectiveReferentialId === r.id && (
                         <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         </div>
                       )}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteRef(r.id, r.version_number);
                         }}
                         className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
                         disabled={deleteRef.isPending}
                       >
                         {deleteRef.isPending ? '...' : 'Supprimer'}
                       </button>
                     </div>
                   </div>
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
             {!effectiveReferentialId || effectiveVersion === null ? (
               <div className="p-8 text-center text-gray-500">
                 <div className="text-lg font-medium mb-2">Aucun référentiel sélectionné</div>
                 <div className="text-sm">Veuillez d'abord sélectionner un référentiel dans l'onglet Référentiels</div>
               </div>
             ) : (
               <>
            <div className="p-4 border-b flex items-center justify-between">
                    <div>
              <div className="font-semibold">Domaines</div>
                      <div className="text-xs text-gray-500 mt-1">Cliquez sur un référentiel pour le sélectionner et accéder à ses domaines</div>
                    </div>
              <div className="flex items-center gap-3">
                      <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={openCreateDomain}>Créer</button>
                <div className="text-sm text-gray-600">{totalDomains} élément(s)</div>
              </div>
            </div>
                                   <div className="px-4 pt-3">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Référentiel sélectionné: {effectiveReferentialId} (v{effectiveVersion})
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-wrap items-center gap-3 text-sm">
                    <input value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} placeholder="Rechercher domaine…" className="border rounded px-3 py-2 w-56" />
                    <button 
                      onClick={() => setActiveTab('referentials')}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Retour aux référentiels
                    </button>
                  </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
                   {(domains ?? [])
                     .filter(d => {
                       // Filtre par nom de domaine
                       const nameMatch = !domainFilter || d.name.toLowerCase().includes(domainFilter.toLowerCase());
                       // Filtre par référentiel (si un référentiel est sélectionné)
                       const referentialMatch = !effectiveReferentialId || d.referential_id === effectiveReferentialId;
                       return nameMatch && referentialMatch;
                     })
                     .map((d) => (
                                               <div key={d.id} className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                  <div className="font-medium text-gray-900">{d.name}</div>
                                {d.order_index !== undefined && (
                                  <div className="text-xs text-gray-500">Ordre: {d.order_index}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors" 
                                onClick={() => openEditDomain(d)}
                              >
                                Éditer
                              </button>
                              <button 
                                className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 hover:text-red-600 transition-colors" 
                                onClick={() => handleDeleteDomain(d.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                </div>
              ))}
              {(!domains || domains.length === 0) && (
                <div className="text-sm text-gray-500">Aucun domaine</div>
              )}
            </div>
               </>
             )}
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
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="border rounded px-2 py-2">
                <option value="">Tous les domaines</option>
                {(domains ?? []).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select value={subjectSize} onChange={(e) => { setSubjectSize(Number(e.target.value)); setSubjectPage(1); }} className="border rounded px-2 py-2">
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
              <button className="px-3 py-1.5 text-sm rounded border" onClick={() => exportCsv('matieres.csv', (subjectsPage?.items ?? []).map((s: SubjectRow) => ({ id: s.id, code: s.code, name: s.name, coefficient: s.coefficient, credit: s.credit })))}>Exporter CSV</button>
            </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(subjectsPage?.items ?? [])
                .filter(s => !subjectFilter || s.domain_id === subjectFilter)
                .map((s: SubjectRow) => (
                  <div key={s.id} className="border rounded">
                    {/* Ligne principale cliquable */}
                    <div 
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleSubjectExpansion(s.id)}
                    >
                      <div className="text-left flex items-center gap-2">
                        <div className={`w-3 h-3 transition-transform ${expandedSubjects.has(s.id) ? 'rotate-90' : ''}`}>
                          ▶
                        </div>
                        <div>
                      <div className="font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-500">Code: {s.code} • Coef: {s.coefficient ?? '—'} • Crédit: {s.credit ?? '—'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors" 
                          onClick={(e) => { e.stopPropagation(); openEditSubject(s); }}
                        >
                          Éditer
                    </button>
                        <button 
                          className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 hover:text-red-600 transition-colors" 
                          onClick={async (e) => {
                            e.stopPropagation();
                        if (!confirm('Supprimer cette matière ?')) return;
                        await toast.promise(deleteSubject.mutateAsync({ subjectId: s.id }), { loading: 'Suppression…', success: 'Supprimé', error: 'Échec suppression' });
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    {/* Section déployée avec détails */}
                    {expandedSubjects.has(s.id) && (
                      <div className="px-3 pb-3 border-t bg-gray-50">
                        <div className="pt-3 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">ID:</span> {s.id}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Code:</span> {s.code}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Nom:</span> {s.name}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Coefficient:</span> {s.coefficient ?? 'Non défini'}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Crédit:</span> {s.credit ?? 'Non défini'}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Domaine ID:</span> {s.domain_id}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Domaine:</span> {(domains ?? []).find(d => d.id === s.domain_id)?.name ?? 'Non défini'}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Couleur:</span> {s.color ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: s.color }}></div>
                                  {s.color}
                                </span>
                              ) : 'Non définie'}
                            </div>
                    </div>
                  </div>
                      </div>
                    )}
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
                <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white" onClick={openCreateCompetency} disabled={!effectiveReferentialId || effectiveVersion === null}>Créer</button>
                <div className="text-sm text-gray-600">{compLoading ? 'Chargement…' : `${totalCompetencies} élément(s)`}</div>
              </div>
            </div>
            <div className="px-4 pt-3 text-xs text-gray-600">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            <div className="p-4 flex flex-wrap items-center gap-3 text-sm">
              <input value={competencyQ} onChange={(e) => { setCompetencyQ(e.target.value); setCompetencyPage(1); }} placeholder="Rechercher compétence…" className="border rounded px-3 py-2 w-56" />
              <select value={competencyFilter} onChange={(e) => setCompetencyFilter(e.target.value)} className="border rounded px-2 py-2">
                <option value="">Toutes les matières</option>
                {(subjectsPage?.items ?? []).map((s: SubjectRow) => (
                  <option key={s.id} value={s.id}>{s.name ?? s.code}</option>
                ))}
              </select>
              <select value={competencySize} onChange={(e) => { setCompetencySize(Number(e.target.value)); setCompetencyPage(1); }} className="border rounded px-2 py-2">
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
              <button className="px-3 py-1.5 text-sm rounded border" onClick={() => exportCsv('competences.csv', (competenciesPage?.items ?? []).map((c: CompetencyRow) => ({ id: c.id, code: c.code, label: c.label })))}>Exporter CSV</button>
            </div>
            <div className="p-4 space-y-2 max-h-[520px] overflow-auto">
              {(competenciesPage?.items ?? [])
                .filter(c => !competencyFilter || c.subject_id === competencyFilter)
                .map((c: CompetencyRow) => (
                                  <div key={c.id} className="border rounded">
                    {/* Ligne principale cliquable */}
                    <div 
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleCompetencyExpansion(c.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 transition-transform ${expandedCompetencies.has(c.id) ? 'rotate-90' : ''}`}>
                          ▶
                        </div>
                    <div>
                      <div className="font-medium text-gray-900">{c.label}</div>
                          <div className="text-xs text-gray-500">Code: {c.code}</div>
                          {c.description && <div className="text-xs text-gray-500 mt-1">{c.description}</div>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors" 
                          onClick={(e) => { e.stopPropagation(); openEditCompetency(c); }}
                        >
                          Éditer
                        </button>
                        <button 
                          className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 hover:text-red-600 transition-colors" 
                          onClick={async (e) => {
                            e.stopPropagation();
                        if (!confirm('Supprimer cette compétence ?')) return;
                        await toast.promise(deleteCompetency.mutateAsync({ competencyId: c.id }), { loading: 'Suppression…', success: 'Supprimé', error: 'Échec suppression' });
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  
                  {/* Section déployée avec détails */}
                  {expandedCompetencies.has(c.id) && (
                    <div className="px-3 pb-3 border-t bg-gray-50">
                      <div className="pt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">ID:</span> {c.id}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Code:</span> {c.code}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Libellé:</span> {c.label}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Description:</span> {c.description ?? 'Non définie'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Matière ID:</span> {c.subject_id}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Matière:</span> {(subjectsPage?.items ?? []).find(s => s.id === c.subject_id)?.name ?? 'Non définie'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Domaine:</span> {(domains ?? []).find(d => d.id === (subjectsPage?.items ?? []).find(s => s.id === c.subject_id)?.domain_id)?.name ?? 'Non défini'}
                          </div>
                    </div>
                  </div>
                    </div>
                  )}
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
               <div>
                 <label className="block text-sm text-gray-700 mb-1">Description (optionnel)</label>
                 <textarea className="w-full border rounded px-3 py-2" rows={3} value={refForm.description ?? ''} onChange={(e) => setRefForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description du référentiel..." />
               </div>
               <div>
                 <label className="block text-sm text-gray-700 mb-1">Visibilité (optionnel)</label>
                 <select className="w-full border rounded px-3 py-2" value={refForm.visibility ?? ''} onChange={(e) => setRefForm((f) => ({ ...f, visibility: e.target.value ? e.target.value as VisibilityEnum : undefined }))}>
                   <option value="">Sélectionner une visibilité...</option>
                   <option value={VisibilityEnum.Tenant}>Établissement</option>
                   <option value={VisibilityEnum.Global}>Global</option>
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
              {subjectModalMode === 'create' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Domaine <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full border rounded px-3 py-2 ${subjectFormSubmitted && !subjectDomainId ? 'border-red-300 bg-red-50' : ''}`}
                    value={subjectDomainId}
                    onChange={(e) => setSubjectDomainId(e.target.value)}
                  >
                    <option value="">Sélectionner un domaine…</option>
                    {(domains ?? []).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {subjectFormSubmitted && !subjectDomainId && (
                    <p className="text-xs text-red-500 mt-1">Un domaine doit être sélectionné pour créer une matière</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full border rounded px-3 py-2 ${subjectFormSubmitted && !subjectForm.code ? 'border-red-300 bg-red-50' : ''}`}
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm((f) => ({ ...f, code: e.target.value }))}
                  placeholder="Ex: MAT"
                  disabled={subjectModalMode === 'edit'}
                />
                {subjectFormSubmitted && !subjectForm.code && (
                  <p className="text-xs text-red-500 mt-1">Le code est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full border rounded px-3 py-2 ${subjectFormSubmitted && !subjectForm.name ? 'border-red-300 bg-red-50' : ''}`}
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Mathématiques"
                />
                {subjectFormSubmitted && !subjectForm.name && (
                  <p className="text-xs text-red-500 mt-1">Le nom est requis</p>
                )}
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
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-sm text-gray-700 mb-1">Couleur (optionnel)</label>
                   <input type="color" className="w-full border rounded px-3 py-2" value={subjectForm.color ?? '#000000'} onChange={(e) => setSubjectForm((f) => ({ ...f, color: e.target.value }))} />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-700 mb-1">Ordre d'affichage (optionnel)</label>
                   <input type="number" className="w-full border rounded px-3 py-2" value={subjectForm.order_index ?? 0} onChange={(e) => setSubjectForm((f) => ({ ...f, order_index: Number(e.target.value) }))} placeholder="0" />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => setSubjectModalOpen(false)}>Annuler</button>
              <button 
                className={`px-3 py-2 text-sm rounded ${
                  createSubject.isPending || updateSubject.isPending || (subjectModalMode === 'create' && (!subjectDomainId || !subjectForm.code || !subjectForm.name))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                onClick={submitSubjectForm} 
                disabled={createSubject.isPending || updateSubject.isPending || (subjectModalMode === 'create' && (!subjectDomainId || !subjectForm.code || !subjectForm.name))}
              >
                {createSubject.isPending || updateSubject.isPending 
                  ? 'Enregistrement...' 
                  : subjectModalMode === 'create' 
                    ? 'Créer' 
                    : 'Enregistrer'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Competency Modal */}
      {competencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCompetencyModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4">
            <div className="px-5 py-4 border-b">
              <div className="text-lg font-semibold">{competencyModalMode === 'create' ? 'Créer une compétence' : 'Éditer la compétence'}</div>
                             <div className="text-xs text-gray-500 mt-1">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            </div>
                        <div className="px-5 py-3">
              <div className="grid grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-3">
                  {competencyModalMode === 'create' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Matière</label>
                      <select className="w-full border rounded px-3 py-2" value={competencySubjectId ?? ''} onChange={(e) => setCompetencySubjectId(e.target.value || null)}>
                        <option value="">Sélectionner une matière…</option>
                        {(subjectsPage?.items ?? []).map((s: SubjectRow) => (
                          <option key={s.id} value={s.id}>{s.name ?? s.code}</option>
                        ))}
                      </select>
            </div>
                  )}
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
                    <label className="block text-sm text-gray-700 mb-1">Ordre d'affichage (optionnel)</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={competencyForm.order_index ?? 0} onChange={(e) => setCompetencyForm((f) => ({ ...f, order_index: Number(e.target.value) }))} placeholder="0" />
                  </div>
                </div>
                
                {/* Colonne droite */}
                <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description (optionnel)</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={1} value={competencyForm.description ?? ''} onChange={(e) => setCompetencyForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description détaillée de la compétence..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Niveaux (optionnel)</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={1} value={competencyForm.levels?.join(', ') ?? ''} onChange={(e) => setCompetencyForm((f) => ({ ...f, levels: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} placeholder="Niveau 1, Niveau 2, Niveau 3..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button className="px-3 py-2 text-sm border rounded" onClick={() => setCompetencyModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white" onClick={submitCompetencyForm} disabled={createCompetency.isPending || updateCompetency.isPending}>{competencyModalMode === 'create' ? 'Créer' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}

       {/* Domain Modal */}
       {domainModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-black/40" onClick={() => setDomainModalOpen(false)} />
           <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
             <div className="px-5 py-4 border-b">
               <div className="text-lg font-semibold">{domainModalMode === 'create' ? 'Créer un domaine' : 'Éditer le domaine'}</div>
               <div className="text-xs text-gray-500 mt-1">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
             </div>
             <div className="px-5 py-4 space-y-4">
               <div>
                 <label className="block text-sm text-gray-700 mb-1">
                   Nom <span className="text-red-500">*</span>
                 </label>
                 <input 
                   className={`w-full border rounded px-3 py-2 ${domainFormSubmitted && !domainForm.name ? 'border-red-300 bg-red-50' : ''}`}
                   value={domainForm.name} 
                   onChange={(e) => setDomainForm((f) => ({ ...f, name: e.target.value }))} 
                   placeholder="Ex: Sciences" 
                 />
                 {domainFormSubmitted && !domainForm.name && (
                   <p className="text-xs text-red-500 mt-1">Le nom est requis</p>
                 )}
               </div>
               <div>
                 <label className="block text-sm text-gray-700 mb-1">Ordre d'affichage (optionnel)</label>
                 <input type="number" className="w-full border rounded px-3 py-2" value={domainForm.order_index ?? 0} onChange={(e) => setDomainForm((f) => ({ ...f, order_index: Number(e.target.value) }))} placeholder="0" />
               </div>
             </div>
             <div className="px-5 py-4 border-t flex justify-end gap-2">
               <button className="px-3 py-2 text-sm border rounded" onClick={() => setDomainModalOpen(false)}>Annuler</button>
               <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white" onClick={submitDomainForm} disabled={createDomain.isPending || updateDomain.isPending}>{domainModalMode === 'create' ? 'Créer' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferentielsManager;


