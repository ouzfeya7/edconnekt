import React, { useMemo, useState } from 'react';
import AssignmentCard from '../referentiels/AssignmentCard';
import FilterBarGeneric from '../ui/FilterBarGeneric';
import DeleteConfirmModal from '../referentiels/DeleteConfirmModal';
import { useAssignments, useCreateAssignment, useDeleteAssignment } from '../../hooks/competence/useAssignments';
import type { AssignmentCreate } from '../../api/competence-service/api';
import toast from 'react-hot-toast';

interface AssignmentsSectionProps {
  referentialId: string;
  versionNumber: number;
  viewMode?: 'cards' | 'compact';
}

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: AssignmentCreate) => void;
  isLoading?: boolean;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [scopeType, setScopeType] = useState<string>('CLASS');
  const [scopeValue, setScopeValue] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const hasError = submitted && (!scopeType || !scopeValue.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!scopeType || !scopeValue.trim()) return;
    onConfirm({ scope_type: scopeType, scope_value: scopeValue.trim() } as AssignmentCreate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="px-5 py-4 border-b">
          <div className="text-lg font-semibold">Créer une affectation</div>
        </div>
        <form className="px-5 py-4 space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type d'affectation <span className="text-red-500">*</span></label>
            <select
              className={`w-full border rounded px-3 py-2 ${submitted && !scopeType ? 'border-red-300 bg-red-50' : ''}`}
              value={scopeType}
              onChange={(e) => setScopeType(e.target.value)}
              disabled={isLoading}
            >
              <option value="CLASS">Classe</option>
              <option value="SCHOOL">Établissement</option>
              <option value="LEVEL">Niveau</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Valeur <span className="text-red-500">*</span></label>
            <input
              className={`w-full border rounded px-3 py-2 ${submitted && !scopeValue.trim() ? 'border-red-300 bg-red-50' : ''}`}
              value={scopeValue}
              onChange={(e) => setScopeValue(e.target.value)}
              placeholder="Ex: 6A, CM2, Lycée A, ..."
              disabled={isLoading}
            />
            {hasError && (
              <p className="text-xs text-red-500 mt-1">Le type et la valeur sont requis</p>
            )}
          </div>
          <div className="px-0 py-2 border-t flex justify-end gap-2">
            <button type="button" className="px-3 py-2 text-sm border rounded" onClick={onClose} disabled={isLoading}>Annuler</button>
            <button type="submit" className="px-3 py-2 text-sm rounded bg-blue-600 text-white disabled:bg-blue-300" disabled={isLoading}>
              {isLoading ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const exportCsv = (filename: string, rows: Array<Record<string, unknown>>) => {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify((r[h as keyof typeof r] ?? '')).toString()).join(','))].join('\n');
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

const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({ referentialId, versionNumber, viewMode = 'cards' }) => {
  const { data: assignments, isLoading } = useAssignments({ referentialId, versionNumber });
  const createAssignment = useCreateAssignment({ referentialId, versionNumber });
  const deleteAssignment = useDeleteAssignment();

  const [filters, setFilters] = useState({ search: '', scopeType: '', showAdvanced: false });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  const filtered = useMemo(() => {
    return (assignments ?? []).filter((a: { scope_value?: string; scope_type?: string; id: string; created_at?: string }) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!String(a.scope_value || '').toLowerCase().includes(s)) return false;
      }
      if (filters.scopeType) {
        if (a.scope_type !== filters.scopeType) return false;
      }
      return true;
    });
  }, [assignments, filters]);

  return (
    <section className="w-full">
      <FilterBarGeneric
        title="Affectations"
        searchPlaceholder="Rechercher une affectation…"
        filters={filters}
        onFiltersChange={(f) => {
          const next = f as Record<string, unknown>;
          setFilters({
            search: String(next.search ?? ''),
            scopeType: String(next.scopeType ?? ''),
            showAdvanced: Boolean(next.showAdvanced ?? false),
          });
        }}
        onExport={() => exportCsv('affectations.csv', filtered.map((a) => ({
          id: a.id,
          scope_type: a.scope_type,
          scope_value: a.scope_value,
          created_at: a.created_at || ''
        })))}
        isLoading={isLoading}
        totalCount={filtered.length}
        advancedFilters={[
          {
            key: 'scopeType',
            label: 'Tous les types',
            type: 'select',
            options: [
              { value: 'CLASS', label: 'Classe' },
              { value: 'SCHOOL', label: 'Établissement' },
              { value: 'LEVEL', label: 'Niveau' },
            ],
          },
        ]}
        actions={[
          {
            label: 'Nouvelle affectation',
            onClick: () => setCreateOpen(true),
          },
        ]}
      />

      {/* Liste des affectations */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">Chargement des affectations...</span>
          </div>
        ) : (
          <div className={viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
            {filtered.map((a: { id: string; scope_type: string; scope_value: string; created_at?: string }) => (
              <AssignmentCard
                key={a.id}
                assignment={{
                  id: a.id,
                  scope_type: a.scope_type,
                  scope_value: a.scope_value,
                  created_at: a.created_at,
                  referential_id: referentialId,
                  version_number: versionNumber,
                }}
                isSelected={selected.has(a.id)}
                onSelect={(id) => {
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }}
                onDelete={(id) => {
                  const label = `${a.scope_type} • ${a.scope_value}`;
                  setDeleteTarget({ id, label });
                  setDeleteOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Vide */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">Aucune affectation trouvée</div>
            <div className="text-sm text-gray-400">Créez une nouvelle affectation pour commencer</div>
          </div>
        )}
      </div>

      {/* Modale de création */}
      <CreateAssignmentModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        isLoading={createAssignment.isPending}
        onConfirm={async (payload) => {
          try {
            await toast.promise(
              createAssignment.mutateAsync(payload),
              { loading: 'Création…', success: 'Affectation créée', error: 'Échec de la création' }
            );
            setCreateOpen(false);
          } catch {
            // handled by toast
          }
        }}
      />

      {/* Modale de suppression */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await toast.promise(
              deleteAssignment.mutateAsync({ assignmentId: deleteTarget.id }),
              { loading: 'Suppression…', success: 'Affectation supprimée', error: 'Échec suppression' }
            );
            setDeleteOpen(false);
            setDeleteTarget(null);
          } catch {
            // handled by toast
          }
        }}
        title="Supprimer l'affectation"
        itemName={deleteTarget?.label || ''}
        itemType="affectation"
        isLoading={deleteAssignment.isPending}
      />
    </section>
  );
};

export default AssignmentsSection;
