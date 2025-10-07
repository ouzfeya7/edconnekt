import React, { useEffect, useState } from 'react';
import { useReferentials } from '../../hooks/competence/useReferentials';
import { useSubjects, usePublicSubjectsByScope } from '../../hooks/competence/useSubjects';
import { useCompetencies, useLookupCompetencyByCode, usePublicCompetenciesForSubject } from '../../hooks/competence/useCompetencies';
import { useDomains } from '../../hooks/competence/useDomains';
import { usePublicReferentialTree } from '../../hooks/competence/usePublicReferentials';
import { useCreateReferential, usePublishReferential, useDeleteReferential, useCreateDomain, useUpdateDomain, useDeleteDomain, useCreateSubject, useCreateCompetency, useUpdateSubject, useDeleteSubject, useUpdateCompetency, useDeleteCompetency } from '../../hooks/competence/useMutations';
import { useAssignments, useCreateAssignment, useDeleteAssignment } from '../../hooks/competence/useAssignments';
import toast from 'react-hot-toast';
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';
import { CycleEnum, VisibilityEnum } from '../../api/competence-service/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/competencies/FilterBar';
import CompetencyCard from '../../components/competencies/CompetencyCard';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FilterBarGeneric from '../../components/ui/FilterBarGeneric';
import ReferentialCard from '../../components/referentiels/ReferentialCard';
import DomainCard from '../../components/referentiels/DomainCard';
import SubjectCard from '../../components/referentiels/SubjectCard';
import '../../styles/competencies.css';
import type { AssignmentCreate } from '../../api/competence-service/api';

const ReferentielsManager: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const size = 20;
  const [q, setQ] = useState<string>('');
  const [cycle, setCycle] = useState<string | null>(null);
  const [state, setRefState] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string | null>(null);
  const [selectedReferentialId, setSelectedReferentialId] = useState<string | null>(null);
  const [versionNumber, setVersionNumber] = useState<number | null>(null);
  const [subjectPage, setSubjectPage] = useState(1);
  const subjectSize = 20;
  const [subjectQ, setSubjectQ] = useState<string>('');
  const [competencyPage, setCompetencyPage] = useState(1);
  const competencySize = 20;
  const [competencyQ, setCompetencyQ] = useState<string>('');
  // Recherche par code (intégrée)
  const [lookupCode, setLookupCode] = useState<string>('');
  const [lookupReferentialId, setLookupReferentialId] = useState<string>('');
  const [lookupVersion, setLookupVersion] = useState<string>('');
  // Arborescence publique
  const [showPublicTree, setShowPublicTree] = useState(false);
  
  // Filtres unifiés pour les compétences
  const [competencyFilters, setCompetencyFilters] = useState({
    search: '',
    subject: '',
    referential: '',
    version: '',
    showAdvanced: false
  });
  
  // Dialog de confirmation pour suppression
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; type: string }>({ 
    isOpen: false, 
    id: '', 
    type: '' 
  });
  
  // Sélection multiple pour actions en lot
  const [selectedCompetencies, setSelectedCompetencies] = useState<Set<string>>(new Set());
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  
  // Filtres unifiés pour chaque onglet
  const [referentialFilters, setReferentialFilters] = useState({
    search: '',
    cycle: '',
    state: '',
    visibility: '',
    showAdvanced: false
  });
  
  const [domainFilters, setDomainFilters] = useState({
    search: '',
    showAdvanced: false
  });
  
  const [subjectFilters, setSubjectFilters] = useState({
    search: '',
    domain: '',
    showAdvanced: false
  });
  
  // Filtres pour chaque onglet
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [competencyFilter, setCompetencyFilter] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'referentials' | 'domains' | 'subjects' | 'competencies' | 'assignments'>('referentials');

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

  // Pré-remplir les champs du lookup avec le référentiel sélectionné
  useEffect(() => {
    setLookupReferentialId(effectiveReferentialId ?? '');
    setLookupVersion(effectiveVersion !== null ? String(effectiveVersion) : '');
  }, [effectiveReferentialId, effectiveVersion]);

  const lookupEnabled = lookupCode.trim().length > 0;
  const { data: lookupData, isLoading: lookupLoading, error: lookupError, refetch: lookupRefetch, isFetching: lookupFetching } = useLookupCompetencyByCode({
    code: lookupEnabled ? lookupCode.trim() : undefined,
    referentialId: lookupReferentialId.trim() || undefined,
    version: lookupVersion ? Number(lookupVersion) : undefined,
  });

  useEffect(() => {
    const status = (lookupError as { response?: { status?: number } } | undefined)?.response?.status;
    if (lookupError && status !== 404) {
      toast.error('Une erreur est survenue lors de la recherche.');
    }
  }, [lookupError]);

  const onLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEnabled) return;
    lookupRefetch();
  };

  // Handlers pour les nouvelles fonctionnalités
  const handleCompetencyEdit = (competencyId: string) => {
    const competency = (competenciesPage?.items ?? []).find((c: CompetencyRow) => c.id === competencyId);
    if (competency) {
      openEditCompetency(competency);
    }
  };

  const handleCompetencyView = (competencyId: string) => {
    navigate(`/referentiels/competencies/${competencyId}`);
  };

  const handleCompetencyDelete = (competencyId: string) => {
    setConfirmDelete({ isOpen: true, id: competencyId, type: 'competency' });
  };

  const handleCompetencySelect = (competencyId: string) => {
    setSelectedCompetencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(competencyId)) {
        newSet.delete(competencyId);
      } else {
        newSet.add(competencyId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = (competenciesPage?.items ?? []).map((c: CompetencyRow) => c.id);
    setSelectedCompetencies(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedCompetencies(new Set());
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete.type === 'competency') {
      try {
        await deleteCompetency.mutateAsync({ competencyId: confirmDelete.id });
        toast.success('Compétence supprimée avec succès');
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
    setConfirmDelete({ isOpen: false, id: '', type: '' });
  };

  const handleExportCompetencies = () => {
    const filteredCompetencies = (competenciesPage?.items ?? [])
      .filter((c: CompetencyRow) => !competencyFilters.subject || c.subject_id === competencyFilters.subject);
    exportCsv('competences.csv', filteredCompetencies.map((c: CompetencyRow) => ({ 
      id: c.id, 
      code: c.code, 
      label: c.label,
      subject_id: c.subject_id 
    })));
  };

  const totalRefs = refsPage?.total ?? 0;
  const { data: domains } = useDomains({ referentialId: effectiveReferentialId ?? undefined, versionNumber: effectiveVersion ?? undefined });
  const totalDomains = (domains ?? []).length;
  const totalSubjects = subjectsPage?.total ?? 0;
  const totalCompetencies = competenciesPage?.total ?? 0;
  // Hook arborescence publique
  const { data: publicTree, isLoading: treeLoading, error: treeError, refetch: treeRefetch } = usePublicReferentialTree(
    effectiveReferentialId ?? '',
    effectiveVersion ?? 0
  );

  // Hydrate state from URL query params
  useEffect(() => {
    const initialRefId = searchParams.get('refId');
    const initialVersion = searchParams.get('version');
    const tab = searchParams.get('tab') as 'referentials' | 'domains' | 'subjects' | 'competencies' | 'assignments' | null;
    const initialSubjectFilter = searchParams.get('subjectId');

    if (initialRefId) setSelectedReferentialId(initialRefId);
    if (initialVersion && !Number.isNaN(Number(initialVersion))) setVersionNumber(Number(initialVersion));
    if (tab) setActiveTab(tab);
    if (initialSubjectFilter) setCompetencyFilter(initialSubjectFilter);
  }, [searchParams]);

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
  // (toggles supprimés car non utilisés)

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
  // (toggles supprimés car non utilisés)

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
      const codeRegex = /^[A-Z0-9_-]+$/;
      const normalizedCode = subjectForm.code.trim().toUpperCase();
      if (!codeRegex.test(normalizedCode)) {
        toast.error('Le code doit respecter le format A-Z, 0-9, _ ou -');
        return;
      }
      if (!subjectDomainId) {
        toast.error('Veuillez sélectionner un domaine');
        return;
      }
      const payload: { code: string; name: string; domain_id: string; coefficient?: number; credit?: number; color?: string; order_index?: number } = { code: normalizedCode, name: subjectForm.name.trim(), domain_id: subjectDomainId };
      if (typeof coefficient === 'number') {
        if (!(coefficient > 0)) {
          toast.error('Coefficient doit être strictement > 0');
          return;
        }
        payload.coefficient = coefficient;
      }
      if (typeof credit === 'number') {
        if (!(credit >= 0)) {
          toast.error('Crédit doit être >= 0');
          return;
        }
        payload.credit = credit;
      }
      if (subjectForm.color?.trim()) payload.color = subjectForm.color.trim();
      if (subjectForm.order_index !== undefined) payload.order_index = subjectForm.order_index;
      await toast.promise(
        createSubject.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion, payload }),
        { loading: 'Création…', success: 'Matière créée', error: 'Échec de la création' }
      );
    } else if (subjectForm.id) {
      const codeRegex = /^[A-Z0-9_-]+$/;
      const updatePayload: { name?: string; code?: string; coefficient?: number; credit?: number; color?: string; order_index?: number } = { name: subjectForm.name.trim() };
      if (subjectForm.code?.trim()) {
        const normalizedCode = subjectForm.code.trim().toUpperCase();
        if (!codeRegex.test(normalizedCode)) {
          toast.error('Le code doit respecter le format A-Z, 0-9, _ ou -');
          return;
        }
        updatePayload.code = normalizedCode;
      }
      if (typeof coefficient === 'number') updatePayload.coefficient = coefficient;
      if (typeof credit === 'number') updatePayload.credit = credit;
      if (subjectForm.color?.trim()) updatePayload.color = subjectForm.color.trim();
      if (subjectForm.order_index !== undefined) updatePayload.order_index = subjectForm.order_index;
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
      const codeRegex = /^[A-Z0-9_-]+$/;
      const normalizedCode = competencyForm.code.trim().toUpperCase();
      if (!codeRegex.test(normalizedCode)) {
        toast.error('Le code doit respecter le format A-Z, 0-9, _ ou -');
        return;
      }
      const payload: { subject_id: string; code: string; label: string; description?: string; levels?: string[]; order_index?: number } = { subject_id: competencySubjectId, code: normalizedCode, label: competencyForm.label.trim() };
      if (competencyForm.description) payload.description = competencyForm.description;
      if (competencyForm.levels && competencyForm.levels.length > 0) payload.levels = competencyForm.levels;
      if (competencyForm.order_index !== undefined) payload.order_index = competencyForm.order_index;
      await toast.promise(
        createCompetency.mutateAsync({ referentialId: effectiveReferentialId, versionNumber: effectiveVersion, payload }),
        { loading: 'Création…', success: 'Compétence créée', error: 'Échec de la création' }
      );
    } else if (competencyForm.id) {
      const updatePayload: { label?: string; description?: string; levels?: string[]; order_index?: number } = { label: competencyForm.label.trim() };
      if (competencyForm.description) updatePayload.description = competencyForm.description;
      if (competencyForm.levels && competencyForm.levels.length > 0) updatePayload.levels = competencyForm.levels;
      if (competencyForm.order_index !== undefined) updatePayload.order_index = competencyForm.order_index;
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
        <p className="text-gray-600">Administrez les référentiels, matières et compétences.</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'referentials' as const, title: 'Référentiels', icon: GraduationCap },
            { id: 'domains' as const, title: 'Domaines', icon: GraduationCap },
            { id: 'subjects' as const, title: 'Matières', icon: BookOpen },
            { id: 'competencies' as const, title: 'Compétences', icon: Award },
            { id: 'assignments' as const, title: 'Affectations', icon: Users },
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
            {/* Nouvelle barre de filtres unifiée pour référentiels */}
            <FilterBarGeneric
              title="Référentiels"
              searchPlaceholder="Rechercher un référentiel..."
              filters={{
                search: referentialFilters.search,
                cycle: referentialFilters.cycle,
                state: referentialFilters.state,
                visibility: referentialFilters.visibility,
                showAdvanced: referentialFilters.showAdvanced
              }}
              onFiltersChange={(newFilters) => {
                setReferentialFilters(newFilters);
                setQ(newFilters.search);
                setCycle(newFilters.cycle || null);
                setRefState(newFilters.state || null);
                setVisibility(newFilters.visibility || null);
                setPage(1);
              }}
              onExport={() => exportCsv('referentiels.csv', (refsPage?.items ?? []).map((r: ReferentialListItem) => ({ 
                id: r.id, 
                name: r.name || '', 
                cycle: r.cycle || '', 
                version_number: r.version_number, 
                state: r.state, 
                visibility: r.visibility ?? '' 
              })))}
              onCreate={openCreateReferential}
              isLoading={refsLoading || createRef.isPending}
              totalCount={totalRefs}
              advancedFilters={[
                {
                  key: 'cycle',
                  label: 'Tous les cycles',
                  type: 'select',
                  options: [
                    { value: 'PRESCOLAIRE', label: 'Préscolaire' },
                    { value: 'PRIMAIRE', label: 'Primaire' },
                    { value: 'COLLEGE', label: 'Collège' },
                    { value: 'LYCEE', label: 'Lycée' },
                    { value: 'SECONDAIRE', label: 'Secondaire' },
                    { value: 'UNIVERSITE', label: 'Université' }
                  ]
                },
                {
                  key: 'state',
                  label: 'Tous les états',
                  type: 'select',
                  options: [
                    { value: 'DRAFT', label: 'Brouillon' },
                    { value: 'PUBLISHED', label: 'Publié' }
                  ]
                },
                {
                  key: 'visibility',
                  label: 'Toutes les visibilités',
                  type: 'select',
                  options: [
                    { value: 'TENANT', label: 'Établissement' },
                    { value: 'GLOBAL', label: 'Global' }
                  ]
                }
              ]}
              actions={[
                {
                  label: 'Publier',
                  onClick: handlePublishRef,
                  variant: 'secondary',
                  disabled: !effectiveReferentialId || effectiveVersion === null || publishRef.isPending
                },
                {
                  label: showPublicTree ? 'Masquer arborescence' : 'Voir arborescence',
                  onClick: () => setShowPublicTree(!showPublicTree),
                  variant: 'secondary',
                  disabled: !effectiveReferentialId || effectiveVersion === null
                }
              ]}
            />
            {showPublicTree && (
              <div className="px-4 pb-4">
                {!effectiveReferentialId || effectiveVersion === null ? (
                  <div className="text-sm text-gray-500">Sélectionnez un référentiel et une version pour afficher l'arborescence.</div>
                ) : treeLoading ? (
                  <div className="text-sm text-gray-500">Chargement de l'arborescence…</div>
                ) : treeError ? (
                  <div className="rounded border border-red-300 bg-red-50 p-3 text-sm">
                    Erreur lors du chargement de l'arborescence.
                    <button className="ml-2 px-2 py-1 border rounded" onClick={() => treeRefetch()}>Réessayer</button>
                  </div>
                ) : publicTree ? (
                  <div className="bg-gray-50 border rounded p-3 max-h-[360px] overflow-auto text-sm">
                    <div className="font-medium mb-2">{publicTree.name} • v{publicTree.version_number}</div>
                    <ul className="space-y-2">
                      {(publicTree.domains ?? []).map((d: { id: string; name: string; subjects?: Array<{ id: string; name?: string; code?: string; competencies?: unknown[] }> }) => (
                        <li key={d.id} className="">
                          <div className="font-semibold">Domaine: {d.name}</div>
                          <ul className="ml-4 list-disc">
                            {(d.subjects ?? []).map((s) => (
                              <li key={s.id}>
                                <div>Matière: {s.name ?? s.code}</div>
                                {Array.isArray(s.competencies) && s.competencies.length > 0 && (
                                  <div className="ml-4 text-gray-600">Compétences: {s.competencies.length}</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
            {/* Nouvelle liste en format cartes pour référentiels */}
            {refsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-2 text-gray-600">Chargement des référentiels...</span>
              </div>
            ) : (
              <div className="p-6">
                <div className={viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                  {(refsPage?.items ?? [])
                    .filter((r: ReferentialListItem) => {
                      // Filtrage par recherche textuelle
                      if (referentialFilters.search) {
                        const searchLower = referentialFilters.search.toLowerCase();
                        return r.name?.toLowerCase().includes(searchLower);
                      }
                      return true;
                    })
                    .map((r: ReferentialListItem) => (
                      <ReferentialCard
                        key={r.id}
                        referential={{
                          id: r.id,
                          name: r.name || '',
                          cycle: r.cycle || '',
                          version_number: r.version_number,
                          state: (r.state === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'),
                          visibility: (r.visibility === 'GLOBAL' ? 'GLOBAL' : r.visibility === 'TENANT' ? 'TENANT' : undefined),
                        }}
                        isSelected={effectiveReferentialId === r.id}
                        onSelect={(id, version) => {
                          setSelectedReferentialId(id);
                          setVersionNumber(version);
                          setActiveTab('domains');
                        }}
                        onDelete={handleDeleteRef}
                      />
                    ))}
                </div>
                
                {/* Message si aucun résultat */}
                {(!refsPage || (refsPage.items ?? []).length === 0) && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">Aucun référentiel trouvé</div>
                    <div className="text-sm text-gray-400">Essayez de modifier vos filtres ou créez un nouveau référentiel</div>
                  </div>
                )}
              </div>
            )}
            {/* Pagination améliorée */}
            {(refsPage?.items?.length ?? 0) > 0 && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Page {page} • {(refsPage?.items?.length ?? 0)} éléments affichés
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={page <= 1} 
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
                  </button>
                  <button 
                    className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={(refsPage?.items?.length ?? 0) < size} 
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="border rounded-lg">
             {!effectiveReferentialId || effectiveVersion === null ? (
               <div className="p-8 text-center">
                 <div className="text-lg font-medium mb-2">Aucun référentiel sélectionné</div>
                 <div className="text-sm text-gray-500 mb-4">Sélectionnez un référentiel pour gérer les domaines.</div>
                 <button 
                   onClick={() => setActiveTab('referentials')}
                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                 >
                   <GraduationCap className="w-4 h-4 text-white" />
                   Sélectionner un référentiel
                 </button>
               </div>
             ) : (
               <>
            {/* Nouvelle barre de filtres unifiée pour domaines */}
            <FilterBarGeneric
              title="Domaines"
              searchPlaceholder="Rechercher un domaine..."
              filters={{
                search: domainFilters.search,
                showAdvanced: domainFilters.showAdvanced
              }}
              onFiltersChange={(newFilters) => {
                setDomainFilters(newFilters);
                setDomainFilter(newFilters.search);
              }}
              onCreate={openCreateDomain}
              isLoading={false}
              totalCount={totalDomains}
              actions={[
                {
                  label: 'Retour aux référentiels',
                  onClick: () => setActiveTab('referentials'),
                  variant: 'secondary'
                }
              ]}
            />
            {/* Indicateur du référentiel sélectionné */}
            <div className="px-4 pt-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">
                  Référentiel sélectionné: {effectiveReferentialId?.substring(0, 8)}... (v{effectiveVersion})
                </span>
              </div>
            </div>
            {/* Nouvelle liste en format cartes pour domaines */}
            <div className="p-6">
              <div className={viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                {(domains ?? [])
                  .filter((d: { id: string; name: string; referential_id?: string }) => {
                    // Filtre par nom de domaine
                    const nameMatch = !domainFilters.search || d.name.toLowerCase().includes(domainFilters.search.toLowerCase());
                    // Filtre par référentiel (si un référentiel est sélectionné)
                    const referentialMatch = !effectiveReferentialId || d.referential_id === effectiveReferentialId;
                    return nameMatch && referentialMatch;
                  })
                  .map((d: { id: string; name: string }) => {
                    // Calculer les statistiques du domaine
                    const domainSubjects = (subjectsPage?.items ?? []).filter((s: SubjectRow) => s.domain_id === d.id);
                    const domainCompetencies = domainSubjects.reduce((total: number, subject: SubjectRow) => {
                      return total + ((competenciesPage?.items ?? []).filter((c: CompetencyRow) => c.subject_id === subject.id).length);
                    }, 0);
                    
                    return (
                      <DomainCard
                        key={d.id}
                        domain={{ id: d.id, name: d.name, referential_id: effectiveReferentialId || '' }}
                        isSelected={selectedDomains.has(d.id)}
                        onEdit={openEditDomain}
                        onDelete={handleDeleteDomain}
                        onSelect={(id) => {
                          setSelectedDomains(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(id)) {
                              newSet.delete(id);
                            } else {
                              newSet.add(id);
                            }
                            return newSet;
                          });
                        }}
                        stats={{
                          subjects: domainSubjects.length,
                          competencies: domainCompetencies
                        }}
                      />
                    );
                  })}
              </div>
              
              {/* Message si aucun résultat */}
              {(!domains || domains.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">Aucun domaine trouvé</div>
                  <div className="text-sm text-gray-400">Créez un nouveau domaine pour commencer</div>
                </div>
              )}
            </div>
               </>
             )}
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="border rounded-lg">
            {!effectiveReferentialId || effectiveVersion === null ? (
              <div className="p-8 text-center">
                <div className="text-lg font-medium mb-2">Aucun référentiel sélectionné</div>
                <div className="text-sm text-gray-500 mb-4">Sélectionnez un référentiel pour gérer les matières.</div>
                <button 
                  onClick={() => setActiveTab('referentials')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  Sélectionner un référentiel
                </button>
              </div>
            ) : (
            <>
            {/* Nouvelle barre de filtres unifiée pour matières */}
            <FilterBarGeneric
              title="Matières"
              searchPlaceholder="Rechercher une matière..."
              filters={{
                search: subjectFilters.search,
                domain: subjectFilters.domain,
                showAdvanced: subjectFilters.showAdvanced
              }}
              onFiltersChange={(newFilters) => {
                setSubjectFilters((prev) => ({ ...prev, domain: newFilters.domain }));
                setSubjectQ(newFilters.search);
                setSubjectPage(1);
              }}
              onExport={() => exportCsv('matieres.csv', (subjectsPage?.items ?? []).map((s: SubjectRow) => ({ 
                id: s.id, 
                code: s.code, 
                name: s.name, 
                coefficient: s.coefficient, 
                credit: s.credit 
              })))}
              onCreate={openCreateSubject}
              isLoading={subjectsLoading}
              totalCount={totalSubjects}
              advancedFilters={[
                {
                  key: 'domain',
                  label: 'Tous les domaines',
                  type: 'select',
                  options: (domains ?? []).map((d: { id: string; name: string }) => ({
                    value: d.id,
                    label: d.name
                  }))
                }
              ]}
              actions={[
                {
                  label: 'Retour aux référentiels',
                  onClick: () => setActiveTab('referentials'),
                  variant: 'secondary'
                }
              ]}
            />
            {/* Indicateur du référentiel sélectionné */}
            <div className="px-4 pt-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-900">
                  Référentiel sélectionné: {effectiveReferentialId?.substring(0, 8)}... (v{effectiveVersion})
                </span>
              </div>
            </div>
            {/* Nouvelle liste en format cartes pour matières */}
            {subjectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-2 text-gray-600">Chargement des matières...</span>
              </div>
            ) : (
              <div className="p-6">
                <div className={viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                  {(subjectsPage?.items ?? [])
                    .filter((s: SubjectRow) => {
                      // Filtrage par domaine
                      if (subjectFilters.domain && s.domain_id !== subjectFilters.domain) return false;
                      // Filtrage par recherche textuelle
                      if (subjectFilters.search) {
                        const searchLower = subjectFilters.search.toLowerCase();
                        return (
                          s.name?.toLowerCase().includes(searchLower) ||
                          s.code?.toLowerCase().includes(searchLower)
                        );
                      }
                      return true;
                    })
                    .map((s: SubjectRow) => {
                      // Trouver le nom du domaine
                      const domainName = (domains ?? []).find((d: { id: string; name: string }) => d.id === s.domain_id)?.name;
                      // Calculer le nombre de compétences
                      const subjectCompetencies = (competenciesPage?.items ?? []).filter((c: CompetencyRow) => c.subject_id === s.id).length;
                      
                      return (
                        <SubjectCard
                          key={s.id}
                          subject={{ id: s.id, name: s.name, code: s.code, domain_id: s.domain_id || '' }}
                          domainName={domainName}
                          isSelected={selectedSubjects.has(s.id)}
                          onEdit={openEditSubject}
                          onDelete={(id) => {
                            if (confirm('Supprimer cette matière ?')) {
                              toast.promise(
                                deleteSubject.mutateAsync({ subjectId: id }),
                                { 
                                  loading: 'Suppression…', 
                                  success: 'Matière supprimée', 
                                  error: 'Échec suppression' 
                                }
                              );
                            }
                          }}
                          onSelect={(id) => {
                            setSelectedSubjects(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(id)) {
                                newSet.delete(id);
                              } else {
                                newSet.add(id);
                              }
                              return newSet;
                            });
                          }}
                          stats={{
                            competencies: subjectCompetencies
                          }}
                        />
                      );
                    })}
                </div>
                
                {/* Message si aucun résultat */}
                {(!subjectsPage || (subjectsPage.items ?? []).length === 0) && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">Aucune matière trouvée</div>
                    <div className="text-sm text-gray-400">Créez une nouvelle matière pour commencer</div>
                  </div>
                )}
              </div>
            )}
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <div>Page {subjectPage}</div>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded" disabled={subjectPage <= 1} onClick={() => setSubjectPage((p) => Math.max(1, p - 1))}>Préc.</button>
                <button className="px-2 py-1 border rounded" disabled={(subjectsPage?.items?.length ?? 0) < subjectSize} onClick={() => setSubjectPage((p) => p + 1)}>Suiv.</button>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {activeTab === 'competencies' && (
          <div className="border rounded-lg">
            {!effectiveReferentialId || effectiveVersion === null ? (
              <div className="p-8 text-center">
                <div className="text-lg font-medium mb-2">Aucun référentiel sélectionné</div>
                <div className="text-sm text-gray-500 mb-4">Sélectionnez un référentiel pour gérer les compétences.</div>
                <button 
                  onClick={() => setActiveTab('referentials')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  Sélectionner un référentiel
                </button>
              </div>
            ) : (
            <>
            {/* Nouvelle barre de filtres unifiée */}
            <FilterBar
              filters={{
                search: competencyFilters.search,
                subject: competencyFilters.subject || competencyFilter,
                referential: competencyFilters.referential,
                version: competencyFilters.version,
                showAdvanced: competencyFilters.showAdvanced
              }}
              onFiltersChange={(newFilters) => {
                setCompetencyFilters(newFilters);
                setCompetencyFilter(newFilters.subject);
                setCompetencyQ(newFilters.search);
                setCompetencyPage(1);
              }}
              onExport={handleExportCompetencies}
              onCreate={openCreateCompetency}
              isLoading={compLoading}
              subjects={subjectsPage?.items ?? []}
              totalCount={totalCompetencies}
            />
            {/* Bloc de recherche par code intégré - conservé mais simplifié */}
            {competencyFilters.showAdvanced && (
              <div className="p-4 border-b bg-gray-50">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 mb-2">Recherche par code spécifique</h3>
                  <form onSubmit={onLookupSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          className="w-full border rounded px-3 py-2"
                          placeholder="Code exact (ex: MATH.CALC.1)"
                          value={lookupCode}
                          onChange={(e) => setLookupCode(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          className="w-full border rounded px-3 py-2"
                          placeholder="Référentiel (optionnel)"
                          value={lookupReferentialId}
                          onChange={(e) => setLookupReferentialId(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          className="w-full border rounded px-3 py-2"
                          placeholder="Version (optionnel)"
                          value={lookupVersion}
                          onChange={(e) => setLookupVersion(e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700" 
                      disabled={!lookupCode.trim() || lookupFetching}
                    >
                      {lookupLoading || lookupFetching ? 'Recherche…' : 'Recherche exacte'}
                    </button>
                  </form>

                  {/* Résultats de la recherche par code */}
                  {lookupError && (() => {
                    const status = (lookupError as { response?: { status?: number } } | undefined)?.response?.status;
                    if (status === 404) {
                      return (
                        <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3">
                          <div className="font-medium text-amber-800">Code non trouvé</div>
                          <div className="text-sm text-amber-700">Aucune compétence avec ce code exact.</div>
                        </div>
                      );
                    }
                    return (
                      <div className="mt-3 rounded border border-red-300 bg-red-50 p-3">
                        <div className="font-medium text-red-800">Erreur de recherche</div>
                        <div className="text-sm text-red-700">{(lookupError as Error).message}</div>
                      </div>
                    );
                  })()}

                  {lookupData && (
                    <div className="mt-3 bg-white border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">✓ Compétence trouvée</span>
                        <div className="flex gap-2">
                          <button 
                            className="px-2 py-1 text-xs border rounded hover:bg-gray-50" 
                            onClick={() => navigate(`/referentiels/competencies/${lookupData.id}`)}
                          >
                            Voir détail
                          </button>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div><strong>{lookupData.label}</strong> ({lookupData.code})</div>
                        <div className="text-gray-600">Réf: {lookupData.referential_id} • v{lookupData.version_number}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="px-4 pt-3 text-xs text-gray-600">Référentiel: {effectiveReferentialId ?? '—'} • Version: {effectiveVersion ?? '—'}</div>
            {/* Nouvelle liste en format cartes */}
            {compLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Chargement des compétences...</span>
              </div>
            ) : (
              <div className="p-6">
                {/* Barre d'actions pour sélection multiple */}
                {selectedCompetencies.size > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-800">
                        {selectedCompetencies.size} compétence{selectedCompetencies.size > 1 ? 's' : ''} sélectionnée{selectedCompetencies.size > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={handleDeselectAll}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Désélectionner tout
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50">
                        Exporter sélection
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                        Supprimer sélection
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Toggle vue cartes/compacte */}
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Sélectionner tout
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Affichage:</span>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-2 py-1 text-xs rounded ${
                        viewMode === 'cards' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Cartes
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`px-2 py-1 text-xs rounded ${
                        viewMode === 'compact' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>
                
                <div className={viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                  {(competenciesPage?.items ?? [])
                    .filter((c: CompetencyRow) => {
                      // Filtrage par matière
                      if (competencyFilters.subject && c.subject_id !== competencyFilters.subject) return false;
                      // Filtrage par recherche textuelle
                      if (competencyFilters.search) {
                        const searchLower = competencyFilters.search.toLowerCase();
                        return (
                          c.label?.toLowerCase().includes(searchLower) ||
                          c.code?.toLowerCase().includes(searchLower) ||
                          c.description?.toLowerCase().includes(searchLower)
                        );
                      }
                      return true;
                    })
                    .map((c: CompetencyRow) => {
                      const subjectName = (subjectsPage?.items ?? []).find((s: SubjectRow) => s.id === c.subject_id)?.name;
                      const domainName = (domains ?? []).find((d: { id: string; name: string }) => {
                        const subject = (subjectsPage?.items ?? []).find((s: SubjectRow) => s.id === c.subject_id);
                        return d.id === subject?.domain_id;
                      })?.name;
                      
                      const refIdForCard: string | undefined = effectiveReferentialId === null ? undefined : effectiveReferentialId;
                      const verForCard: number | undefined = effectiveVersion === null ? undefined : effectiveVersion;
                      
                      return (
                        <CompetencyCard
                          key={c.id}
                          competency={{ id: c.id, code: c.code || '', label: c.label || '', description: c.description ?? undefined, subject_id: (c.subject_id ? c.subject_id : undefined), referential_id: refIdForCard, version_number: verForCard }}                          subjectName={subjectName}
                          domainName={domainName}
                          isSelected={selectedCompetencies.has(c.id)}
                          onEdit={handleCompetencyEdit}
                          onDelete={handleCompetencyDelete}
                          onView={handleCompetencyView}
                          onSelect={handleCompetencySelect}
                        />
                      );
                    })}
                </div>
                
                {/* Message si aucun résultat */}
                {(!competenciesPage || (competenciesPage.items ?? []).length === 0) && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">Aucune compétence trouvée</div>
                    <div className="text-sm text-gray-400">Essayez de modifier vos filtres ou créez une nouvelle compétence</div>
                  </div>
                )}
              </div>
            )}
            {/* Pagination améliorée */}
            {(competenciesPage?.items?.length ?? 0) > 0 && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Page {competencyPage} • {(competenciesPage?.items?.length ?? 0)} éléments affichés
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={competencyPage <= 1} 
                    onClick={() => setCompetencyPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
                  </button>
                  <button 
                    className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={(competenciesPage?.items?.length ?? 0) < competencySize} 
                    onClick={() => setCompetencyPage((p) => p + 1)}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="border rounded-lg">
            {!effectiveReferentialId || effectiveVersion === null ? (
              <div className="p-8 text-center">
                <div className="text-lg font-medium mb-2">Aucun référentiel sélectionné</div>
                <div className="text-sm text-gray-500 mb-4">Sélectionnez un référentiel pour gérer les affectations.</div>
                <button 
                  onClick={() => setActiveTab('referentials')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  Sélectionner un référentiel
                </button>
              </div>
            ) : (
              <AssignmentsSection referentialId={effectiveReferentialId} versionNumber={effectiveVersion} />
            )}
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
                  <option value={CycleEnum.Secondaire}>Secondaire</option>
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

      {/* Dialog de confirmation pour suppression */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Supprimer la compétence"
        description="Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', type: '' })}
      />
    </div>
  );
};

export default ReferentielsManager;

type AssignmentsSectionProps = { referentialId: string; versionNumber: number };
const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({ referentialId, versionNumber }) => {
  const { data: assignments, isLoading } = useAssignments({ referentialId, versionNumber });
  const createAssignment = useCreateAssignment({ referentialId, versionNumber });
  const deleteAssignment = useDeleteAssignment();

  const [scopeType, setScopeType] = useState<string>('CLASS');
  const [scopeValue, setScopeValue] = useState<string>('');

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Référentiel: {referentialId.substring(0,8)}... • Version: {versionNumber}</div>
        <button
          className="px-3 py-2 text-sm rounded bg-blue-600 text-white"
          onClick={async () => {
            if (!scopeType || !scopeValue.trim()) {
              toast.error('Type et valeur requis');
              return;
            }
            await toast.promise(createAssignment.mutateAsync({ scope_type: scopeType, scope_value: scopeValue.trim() } as AssignmentCreate), {
              loading: 'Création…', success: 'Affectation créée', error: 'Échec de la création'
            });
            setScopeValue('');
          }}
        >Créer une affectation</button>
      </div>

      <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Type</label>
          <select className="w-full border rounded px-3 py-2" value={scopeType} onChange={(e) => setScopeType(e.target.value)}>
            <option value="CLASS">Classe</option>
            <option value="SCHOOL">Établissement</option>
            <option value="LEVEL">Niveau</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Valeur</label>
          <input className="w-full border rounded px-3 py-2" placeholder="ex: 6A ou ETAB-123" value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-600">Chargement…</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Valeur</th>
                <th className="px-4 py-2 text-left">Créé le</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(assignments ?? []).map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.id}</td>
                  <td className="px-4 py-2">{a.scope_type}</td>
                  <td className="px-4 py-2">{a.scope_value}</td>
                  <td className="px-4 py-2">{a.created_at ? new Date(a.created_at).toLocaleString('fr-FR') : '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                      onClick={async () => {
                        await toast.promise(deleteAssignment.mutateAsync({ assignmentId: a.id }), { loading: 'Suppression…', success: 'Supprimée', error: 'Échec suppression' });
                      }}
                    >Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Panneau endpoints publics (compact) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <PublicEndpointsPanel />
      </div>
    </div>
  );
};

type PublicEndpointsPanelProps = Record<string, never>;
const PublicEndpointsPanel: React.FC<PublicEndpointsPanelProps> = () => {
  const [cycle, setCycle] = useState<string>('PRIMAIRE');
  const [level, setLevel] = useState<string>('CM2');
  const { data: subjectsByScope } = usePublicSubjectsByScope({ cycle, level });
  const [subjectForPublic, setSubjectForPublic] = useState<string>('');
  const { data: publicCompetencies } = usePublicCompetenciesForSubject(subjectForPublic || undefined);

  return (
    <div className="bg-white border rounded p-4">
      <div className="font-medium mb-2">Endpoints publics (aperçu)</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Cycle</label>
          <select className="w-full border rounded px-2 py-1 text-sm" value={cycle} onChange={(e) => setCycle(e.target.value)}>
            <option value="PRESCOLAIRE">Préscolaire</option>
            <option value="PRIMAIRE">Primaire</option>
            <option value="COLLEGE">Collège</option>
            <option value="LYCEE">Lycée</option>
            <option value="SECONDAIRE">Secondaire</option>
            <option value="UNIVERSITE">Université</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Niveau</label>
          <input className="w-full border rounded px-2 py-1 text-sm" placeholder="ex: CM2" value={level} onChange={(e) => setLevel(e.target.value)} />
        </div>
        <div className="flex items-end">
          <span className="text-xs text-gray-500">{(subjectsByScope ?? []).length} matières</span>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-600 mb-1">Matière (public)</label>
        <select className="w-full border rounded px-2 py-1 text-sm" value={subjectForPublic} onChange={(e) => setSubjectForPublic(e.target.value)}>
          <option value="">Sélectionner…</option>
          {(subjectsByScope ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name ?? s.code}</option>
          ))}
        </select>
      </div>
      {subjectForPublic && (
        <div className="text-xs text-gray-600">Compétences: {(publicCompetencies ?? []).length}</div>
      )}
    </div>
  );
};


