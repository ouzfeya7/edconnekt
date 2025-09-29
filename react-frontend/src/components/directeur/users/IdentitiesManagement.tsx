import React from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useIdentities, useIdentityCreate, useIdentityUpdate, useIdentityDelete, useIdentityGet, useIdentityLinkToEstablishment, useIdentityUnlinkFromEstablishment } from '../../../hooks/useIdentity';
import type { IdentityCreate, IdentityUpdate, IdentityResponse, IdentityStatus, EstablishmentRole } from '../../../api/identity-service/api';

type NullableString = string | null | undefined;

export default function IdentitiesManagement(): JSX.Element {
  const [page, setPage] = React.useState<number>(1);
  const [size, setSize] = React.useState<number>(10);
  const [search, setSearch] = React.useState<string>('');
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  // Separate modals and states
  const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);
  const [detailsId, setDetailsId] = React.useState<string | null>(null);

  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<IdentityResponse | null>(null);

  const [linkOpen, setLinkOpen] = React.useState<boolean>(false);
  const [linkId, setLinkId] = React.useState<string | null>(null);
  const [linkEstablishmentId, setLinkEstablishmentId] = React.useState<string>('');
  const [linkRole, setLinkRole] = React.useState<EstablishmentRole | ''>('');

  const [unlinkOpen, setUnlinkOpen] = React.useState<boolean>(false);
  const [unlinkId, setUnlinkId] = React.useState<string | null>(null);
  const [unlinkEstablishmentId, setUnlinkEstablishmentId] = React.useState<string>('');

  const { data, isLoading, isError } = useIdentities({ page, size, search: search || undefined });
  const createMutation = useIdentityCreate();
  const updateMutation = useIdentityUpdate(editingId || undefined);
  const deleteMutation = useIdentityDelete();
  const { data: detailData, isLoading: detailLoading } = useIdentityGet(detailsId || undefined);
  const { data: editDetailData, isLoading: editDetailLoading } = useIdentityGet(editingId || undefined);
  const linkMutation = useIdentityLinkToEstablishment(linkId || undefined);
  const unlinkMutation = useIdentityUnlinkFromEstablishment(unlinkId || undefined);

  const items = (data?.items ?? []) as IdentityResponse[];
  const total = data?.total ?? 0;

  // No status side-effect; status selection is handled within the Edit form

  const handleSubmitCreate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: IdentityCreate = {
      firstname: String(fd.get('firstname') || '').trim(),
      lastname: String(fd.get('lastname') || '').trim(),
      email: normalizeOptional(fd.get('email')),
      phone: normalizeOptional(fd.get('phone')),
      status: undefined,
      external_id: normalizeOptional(fd.get('external_id')),
    };
    if (!payload.firstname || !payload.lastname) return;
    try {
      await toast.promise(
        createMutation.mutateAsync(payload),
        {
          loading: 'Création…',
          success: 'Identité créée',
          error: (e) => errorMessage(e, 'Échec de la création'),
        }
      );
      setCreateOpen(false);
      form.reset();
    } catch {}
  };

  const handleSubmitEdit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: IdentityUpdate = {
      firstname: normalizeOptional(fd.get('firstname')) as NullableString,
      lastname: normalizeOptional(fd.get('lastname')) as NullableString,
      email: normalizeOptional(fd.get('email')) as NullableString,
      phone: normalizeOptional(fd.get('phone')) as NullableString,
      status: normalizeOptional(fd.get('status')) as IdentityStatus | null | undefined,
    };
    try {
      await toast.promise(
        updateMutation.mutateAsync(payload),
        {
          loading: 'Enregistrement…',
          success: 'Identité mise à jour',
          error: (e) => errorMessage(e, "Échec de la mise à jour"),
        }
      );
      setEditOpen(false);
      setEditing(null);
      setEditingId(null);
    } catch {}
  };

  const handleSubmitLink: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!linkId || !linkEstablishmentId || !linkRole) return;
    try {
      await toast.promise(
        linkMutation.mutateAsync({ establishment_id: linkEstablishmentId, role: linkRole as EstablishmentRole }),
        {
          loading: 'Liaison…',
          success: "Identité liée à l'établissement",
          error: (e) => errorMessage(e, 'Échec de la liaison'),
        }
      );
      setLinkEstablishmentId('');
      setLinkRole('');
      setLinkOpen(false);
      setLinkId(null);
    } catch {}
  };

  const handleSubmitUnlink: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!unlinkId || !unlinkEstablishmentId) return;
    try {
      await toast.promise(
        unlinkMutation.mutateAsync({ establishmentId: unlinkEstablishmentId }),
        {
          loading: 'Déliaison…',
          success: "Identité déliée de l'établissement",
          error: (e) => errorMessage(e, 'Échec de la déliaison'),
        }
      );
      setUnlinkEstablishmentId('');
      setUnlinkOpen(false);
      setUnlinkId(null);
    } catch {}
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Identités</h3>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher..."
            className="px-3 py-1.5 border rounded text-sm"
          />
          <select
            className="px-2 py-1 border rounded text-sm"
            value={size}
            onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}
          >
            {[10, 20, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
          <button onClick={() => setCreateOpen(true)} className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm">Créer</button>
        </div>
      </div>

      {isLoading && <div className="text-gray-500">Chargement…</div>}
      {isError && <div className="text-red-600">Erreur de chargement</div>}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Prénom</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Nom</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Email</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Téléphone</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Statut</th>
                <th className="px-3 py-2 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm">{it.firstname}</td>
                  <td className="px-3 py-2 text-sm">{it.lastname}</td>
                  <td className="px-3 py-2 text-sm">{it.email ?? '—'}</td>
                  <td className="px-3 py-2 text-sm">{it.phone ?? '—'}</td>
                  <td className="px-3 py-2 text-sm">{it.status ?? '—'}</td>
                  <td className="px-3 py-2 text-sm flex gap-2 flex-wrap">
                    <button className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => { setDetailsId(it.id); setDetailsOpen(true); }}>Détails</button>
                    <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => { setEditingId(it.id); setEditing(it); setEditOpen(true); }}>Éditer</button>
                    <button className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={() => { setLinkId(it.id); setLinkOpen(true); }}>Lier étab.</button>
                    <button className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200" onClick={() => { setUnlinkId(it.id); setUnlinkOpen(true); }}>Délier étab.</button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={async () => {
                        if (!confirm('Supprimer cette identité ?')) return;
                        try {
                          await toast.promise(
                            deleteMutation.mutateAsync({ identityId: it.id }),
                            {
                              loading: 'Suppression…',
                              success: 'Identité supprimée',
                              error: (e) => errorMessage(e, 'Échec de la suppression'),
                            }
                          );
                        } catch {}
                      }}
                    >Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr className="border-t"><td className="px-3 py-6 text-center text-gray-500" colSpan={6}>Aucune identité</td></tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-3 text-sm">
            <div>Total: {total}</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Précédent</button>
              <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded bg-gray-100">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Créer une identité</h3>
            <form onSubmit={handleSubmitCreate} className="space-y-3">
              <div><label className="block text-sm mb-1">Prénom *</label><input name="firstname" className="w-full border rounded px-3 py-2" required /></div>
              <div><label className="block text-sm mb-1">Nom *</label><input name="lastname" className="w-full border rounded px-3 py-2" required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-sm mb-1">Email</label><input name="email" className="w-full border rounded px-3 py-2" /></div>
                <div><label className="block text-sm mb-1">Téléphone</label><input name="phone" className="w-full border rounded px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm mb-1">External ID</label><input name="external_id" className="w-full border rounded px-3 py-2" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setCreateOpen(false)}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={createMutation.isPending}>{createMutation.isPending ? 'Création…' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && detailsId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de l'identité</h3>
              <button aria-label="Fermer" className="p-2 rounded hover:bg-gray-100" onClick={() => { setDetailsOpen(false); setDetailsId(null); }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {detailLoading && <div className="text-gray-500">Chargement…</div>}
            {!detailLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Prénom</div>
                  <div className="text-sm font-medium">{detailData?.firstname ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nom</div>
                  <div className="text-sm font-medium">{detailData?.lastname ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-sm font-medium break-all">{detailData?.email ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Téléphone</div>
                  <div className="text-sm font-medium">{detailData?.phone ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <div className="text-sm font-medium">{detailData?.status ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="text-sm font-medium break-all">{detailData?.id ?? detailsId}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Éditer l'identité</h3>
              <button aria-label="Fermer" className="p-2 rounded hover:bg-gray-100" onClick={() => { setEditOpen(false); setEditing(null); setEditingId(null); }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {editDetailLoading && <div className="text-gray-500">Chargement…</div>}
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Prénom</label>
                  <input name="firstname" defaultValue={editDetailData?.firstname ?? editing?.firstname ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nom</label>
                  <input name="lastname" defaultValue={editDetailData?.lastname ?? editing?.lastname ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input name="email" defaultValue={editDetailData?.email ?? editing?.email ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Téléphone</label>
                  <input name="phone" defaultValue={editDetailData?.phone ?? editing?.phone ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Statut</label>
                <select name="status" defaultValue={(editDetailData?.status ?? editing?.status ?? '') as string} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">(inchangé)</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archivée</option>
                  <option value="TRANSFERRED">Transférée</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {linkOpen && linkId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lier à un établissement</h3>
              <button aria-label="Fermer" className="p-2 rounded hover:bg-gray-100" onClick={() => { setLinkOpen(false); setLinkId(null); }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitLink} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Établissement ID</label>
                <input value={linkEstablishmentId} onChange={(e) => setLinkEstablishmentId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Rôle</label>
                <select value={linkRole} onChange={(e) => setLinkRole(e.target.value as EstablishmentRole)} className="w-full border rounded px-3 py-2 text-sm" required>
                  <option value="" disabled>Choisir un rôle…</option>
                  <option value="STUDENT">Élève</option>
                  <option value="PARENT">Parent</option>
                  <option value="TEACHER">Enseignant</option>
                  <option value="ADMIN_STAFF">Personnel administratif</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm" disabled={linkMutation.isPending}>
                  {linkMutation.isPending ? 'Liaison…' : 'Lier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unlink Modal */}
      {unlinkOpen && unlinkId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Délier de l'établissement</h3>
              <button aria-label="Fermer" className="p-2 rounded hover:bg-gray-100" onClick={() => { setUnlinkOpen(false); setUnlinkId(null); }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitUnlink} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Établissement ID</label>
                <input value={unlinkEstablishmentId} onChange={(e) => setUnlinkEstablishmentId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded text-sm" disabled={unlinkMutation.isPending}>
                  {unlinkMutation.isPending ? 'Déliaison…' : 'Délier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeOptional(value: FormDataEntryValue | null): string | undefined {
  const str = value == null ? '' : String(value);
  const trimmed = str.trim();
  return trimmed === '' ? undefined : trimmed;
}


function errorMessage(e: unknown, fallback: string): string {
  // AxiosError-like shape support
  if (typeof e === 'string') return e || fallback;
  if (e && typeof e === 'object') {
    const anyErr = e as { response?: { data?: any }; message?: string };
    const apiMsg = anyErr?.response?.data?.message;
    if (typeof apiMsg === 'string' && apiMsg.trim()) return apiMsg;
    if (anyErr?.message) return anyErr.message;
  }
  return fallback;
}