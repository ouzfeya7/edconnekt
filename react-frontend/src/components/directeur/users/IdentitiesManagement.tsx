import React from 'react';
import { useIdentities, useIdentityCreate, useIdentityUpdate, useIdentityDelete } from '../../../hooks/useIdentity';
import type { IdentityCreate, IdentityUpdate, IdentityResponse } from '../../../api/identity-service/api';

type NullableString = string | null | undefined;

export default function IdentitiesManagement(): JSX.Element {
  const [page, setPage] = React.useState<number>(1);
  const [size, setSize] = React.useState<number>(10);
  const [search, setSearch] = React.useState<string>('');
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<IdentityResponse | null>(null);

  const { data, isLoading, isError } = useIdentities({ page, size, search: search || undefined });
  const createMutation = useIdentityCreate();
  const updateMutation = useIdentityUpdate(editing?.id);
  const deleteMutation = useIdentityDelete();

  const items = (data?.items ?? []) as IdentityResponse[];
  const total = data?.total ?? 0;

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
    await createMutation.mutateAsync(payload);
    setCreateOpen(false);
    form.reset();
  };

  const handleSubmitEdit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: IdentityUpdate = {
      firstname: normalizeOptional(fd.get('firstname')) as NullableString,
      lastname: normalizeOptional(fd.get('lastname')) as NullableString,
      email: normalizeOptional(fd.get('email')) as NullableString,
      phone: normalizeOptional(fd.get('phone')) as NullableString,
      status: normalizeOptional(fd.get('status')) as NullableString,
    };
    await updateMutation.mutateAsync(payload);
    setEditOpen(false);
    setEditing(null);
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
                  <td className="px-3 py-2 text-sm flex gap-2">
                    <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => { setEditing(it); setEditOpen(true); }}>Éditer</button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={async () => { if (confirm('Supprimer cette identité ?')) await deleteMutation.mutateAsync({ identityId: it.id }); }}
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

      {editOpen && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Modifier l'identité</h3>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              <div><label className="block text-sm mb-1">Prénom</label><input name="firstname" defaultValue={editing.firstname} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm mb-1">Nom</label><input name="lastname" defaultValue={editing.lastname} className="w-full border rounded px-3 py-2" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-sm mb-1">Email</label><input name="email" defaultValue={editing.email ?? ''} className="w-full border rounded px-3 py-2" /></div>
                <div><label className="block text-sm mb-1">Téléphone</label><input name="phone" defaultValue={editing.phone ?? ''} className="w-full border rounded px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm mb-1">Statut</label><input name="status" defaultValue={String(editing.status ?? '')} className="w-full border rounded px-3 py-2" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => { setEditOpen(false); setEditing(null); }}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}</button>
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


