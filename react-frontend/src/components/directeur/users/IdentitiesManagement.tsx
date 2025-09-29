import React from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useIdentities, useIdentityCreate, useIdentityUpdate, useIdentityDelete, useIdentityGet, useIdentityGetFull, useIdentityLinkToEstablishment, useIdentityUnlinkFromEstablishment, useIdentityLastCode, useIdentityCatalogRolesEffectifs, useIdentityCatalogCycles, useIdentityCatalogRolesPrincipaux, useIdentityRoles, useIdentityRoleCreate, useIdentityRoleUpdate, useIdentityRoleDelete } from '../../../hooks/useIdentity';
import type { IdentityCreate, IdentityUpdate, IdentityStatus, IdentityWithRoles, EstablishmentLinkCreate, RoleAssignmentCreate, RoleAssignmentUpdate, RoleAssignmentResponse } from '../../../api/identity-service/api';
import type { EstablishmentRole } from '../../../utils/contextStorage';

type NullableString = string | null | undefined;

export default function IdentitiesManagement(): JSX.Element {
  const [page, setPage] = React.useState<number>(1);
  const [size, setSize] = React.useState<number>(10);
  const [search, setSearch] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [roleFilter, setRoleFilter] = React.useState<EstablishmentRole | ''>('');
  const [establishmentFilter, setEstablishmentFilter] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  // Separate modals and states
  const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);
  const [detailsId, setDetailsId] = React.useState<string | null>(null);

  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<IdentityWithRoles | null>(null);

  const [linkOpen, setLinkOpen] = React.useState<boolean>(false);
  const [linkId, setLinkId] = React.useState<string | null>(null);
  const [linkEstablishmentId, setLinkEstablishmentId] = React.useState<string>('');
  const [linkRole, setLinkRole] = React.useState<EstablishmentRole | ''>('');
  const [linkRoleEffectif, setLinkRoleEffectif] = React.useState<string>('');
  const [linkFunctionDisplay, setLinkFunctionDisplay] = React.useState<string>('');
  const [linkCycles, setLinkCycles] = React.useState<string[]>([]);

  const [unlinkOpen, setUnlinkOpen] = React.useState<boolean>(false);
  const [unlinkId, setUnlinkId] = React.useState<string | null>(null);
  const [unlinkEstablishmentId, setUnlinkEstablishmentId] = React.useState<string>('');

  // Roles management modal state
  const [rolesOpen, setRolesOpen] = React.useState<boolean>(false);
  const [rolesIdentityId, setRolesIdentityId] = React.useState<string | null>(null);
  const [editRoleId, setEditRoleId] = React.useState<string | null>(null);
  const [roleEstabId, setRoleEstabId] = React.useState<string>('');
  const [rolePrincipalCode, setRolePrincipalCode] = React.useState<string>('');
  const [roleEffectifCode, setRoleEffectifCode] = React.useState<string>('');
  const [roleFunctionDisplay, setRoleFunctionDisplay] = React.useState<string>('');
  const [roleCycleCodes, setRoleCycleCodes] = React.useState<string[]>([]);
  const [roleSubjectCodes, setRoleSubjectCodes] = React.useState<string[]>([]);

  const { data, isLoading, isError } = useIdentities({
    page,
    size,
    search: search || undefined,
    status: statusFilter || undefined,
    role: roleFilter || undefined,
    establishmentId: establishmentFilter || undefined,
    sortBy: sortBy || undefined,
    sortOrder,
  });
  const createMutation = useIdentityCreate();
  const updateMutation = useIdentityUpdate(editingId || undefined);
  const deleteMutation = useIdentityDelete();
  const { data: detailData, isLoading: detailLoading } = useIdentityGetFull(detailsId || undefined);
  const { data: editDetailData, isLoading: editDetailLoading } = useIdentityGet(editingId || undefined);
  const { data: lastCode } = useIdentityLastCode();
  const { data: rolesEffResp } = useIdentityCatalogRolesEffectifs({ page: 1, size: 100, isActive: true });
  const { data: cyclesResp } = useIdentityCatalogCycles({ page: 1, size: 100, isActive: true });
  const { data: rolesPrinResp } = useIdentityCatalogRolesPrincipaux({ page: 1, size: 100, isActive: true });
  const rolesEffList: any[] = Array.isArray(rolesEffResp?.data) ? (rolesEffResp?.data as any[]) : [];
  const cyclesList: any[] = Array.isArray(cyclesResp?.data) ? (cyclesResp?.data as any[]) : [];
  const rolesPrinList: any[] = Array.isArray(rolesPrinResp?.data) ? (rolesPrinResp?.data as any[]) : [];

  const { data: rolesList, isLoading: rolesLoading } = useIdentityRoles(rolesIdentityId || undefined);
  const roleCreate = useIdentityRoleCreate(rolesIdentityId || undefined);
  const roleUpdate = useIdentityRoleUpdate(rolesIdentityId || undefined, editRoleId || undefined);
  const roleDelete = useIdentityRoleDelete(rolesIdentityId || undefined);
  const detail = (detailData ?? undefined) as IdentityWithRoles | undefined;
  const editDetail = (editDetailData ?? undefined) as IdentityWithRoles | undefined;
  const linkMutation = useIdentityLinkToEstablishment(linkId || undefined);
  const unlinkMutation = useIdentityUnlinkFromEstablishment(unlinkId || undefined);

  const items = (Array.isArray(data?.data) ? (data?.data as IdentityWithRoles[]) : []);
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
      code_identite: String(fd.get('code_identite') || '').trim(),
    };
    if (!payload.firstname || !payload.lastname) return;
    if (!payload.code_identite) return;
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
      const payload: EstablishmentLinkCreate = { establishment_id: linkEstablishmentId, role_principal_code: linkRole as string };
      if (linkRoleEffectif) (payload as any).role_effectif_code = linkRoleEffectif;
      if (linkFunctionDisplay) (payload as any).function_display = linkFunctionDisplay;
      if (linkCycles && linkCycles.length > 0) (payload as any).cycle_codes = linkCycles;
      await toast.promise(
        linkMutation.mutateAsync(payload),
        {
          loading: 'Liaison…',
          success: "Identité liée à l'établissement",
          error: (e) => errorMessage(e, 'Échec de la liaison'),
        }
      );
      setLinkEstablishmentId('');
      setLinkRole('');
      setLinkRoleEffectif('');
      setLinkFunctionDisplay('');
      setLinkCycles([]);
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
        <div className="flex items-center gap-2 flex-wrap justify-end">
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
          <select
            className="px-2 py-1 border rounded text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Statut: Tous</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="TRANSFERRED">TRANSFERRED</option>
          </select>
          <select
            className="px-2 py-1 border rounded text-sm"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as EstablishmentRole | ''); setPage(1); }}
          >
            <option value="">Rôle: Tous</option>
            <option value="student">Élève</option>
            <option value="parent">Parent</option>
            <option value="teacher">Enseignant</option>
            <option value="admin_staff">Admin staff</option>
          </select>
          <input
            value={establishmentFilter}
            onChange={(e) => { setEstablishmentFilter(e.target.value); setPage(1); }}
            placeholder="Etablissement ID"
            className="px-3 py-1.5 border rounded text-sm"
            style={{ minWidth: 180 }}
          />
          <select
            className="px-2 py-1 border rounded text-sm"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          >
            <option value="">Tri: défaut</option>
            <option value="firstname">firstname</option>
            <option value="lastname">lastname</option>
            <option value="email">email</option>
            <option value="status">status</option>
          </select>
          <select
            className="px-2 py-1 border rounded text-sm"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc'); setPage(1); }}
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
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
                    <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200" onClick={() => { setRolesIdentityId(it.id); setRolesOpen(true); }}>Rôles</button>
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

      {/* Roles Management Modal */}
      {rolesOpen && rolesIdentityId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rôles de l'identité</h3>
              <button aria-label="Fermer" className="p-2 rounded hover:bg-gray-100" onClick={() => { setRolesOpen(false); setRolesIdentityId(null); setEditRoleId(null); }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Roles list */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Rôles existants</div>
              {rolesLoading && <div className="text-gray-500">Chargement…</div>}
              {!rolesLoading && (
                <div className="border rounded divide-y">
                  {(Array.isArray(rolesList) ? rolesList as RoleAssignmentResponse[] : []).map((r) => (
                    <div key={r.id} className="p-3 flex items-center justify-between gap-2">
                      <div className="text-sm">
                        <div className="font-medium">{(r as any)?.role_principal?.code ?? '—'} { (r as any)?.role_effectif?.code ? `· ${(r as any)?.role_effectif?.code}` : '' }</div>
                        <div className="text-gray-500">Etab: {(r as any)?.identity_establishment_id ?? '—'} · Fonction: {r.function_display ?? '—'}</div>
                        {Array.isArray((r as any)?.subjects) && (r as any).subjects.length > 0 && (
                          <div className="text-gray-500">Matières: {((r as any).subjects as any[]).map((s: any) => s?.code ?? s).filter(Boolean).join(', ')}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => {
                          setEditRoleId(r.id);
                          setRoleEstabId((r as any)?.identity_establishment_id ?? '');
                          setRolePrincipalCode((r as any)?.role_principal?.code ?? '');
                          setRoleEffectifCode((r as any)?.role_effectif?.code ?? '');
                          setRoleFunctionDisplay(r.function_display ?? '');
                          setRoleCycleCodes(((r as any)?.cycles ?? []).map((c: any) => c.code));
                          setRoleSubjectCodes(((r as any)?.subjects ?? []).map((s: any) => s.code));
                        }}>Éditer</button>
                        <button className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200" onClick={async () => {
                          if (!confirm('Supprimer ce rôle ?')) return;
                          try {
                            await toast.promise(
                              roleDelete.mutateAsync({ roleId: r.id }),
                              { loading: 'Suppression…', success: 'Rôle supprimé', error: (e) => errorMessage(e, 'Échec de la suppression') }
                            );
                          } catch { }
                        }}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                  {(Array.isArray(rolesList) ? (rolesList as RoleAssignmentResponse[]).length === 0 : true) && (
                    <div className="p-3 text-sm text-gray-500">Aucun rôle</div>
                  )}
                </div>
              )}
            </div>

            {/* Create/Update form */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{editRoleId ? 'Modifier le rôle' : 'Ajouter un rôle'}</div>
                {editRoleId && (
                  <button className="text-xs text-gray-600 hover:text-gray-800" onClick={() => {
                    setEditRoleId(null);
                    setRoleEstabId('');
                    setRolePrincipalCode('');
                    setRoleEffectifCode('');
                    setRoleFunctionDisplay('');
                    setRoleCycleCodes([]);
                  }}>Réinitialiser</button>
                )}
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!rolesIdentityId) return;
                if (!roleEstabId || !rolePrincipalCode) return;
                try {
                  if (editRoleId) {
                    const payload: RoleAssignmentUpdate = {
                      establishment_id: roleEstabId,
                      role_principal_code: rolePrincipalCode,
                      role_effectif_code: roleEffectifCode || undefined,
                      function_display: roleFunctionDisplay || undefined,
                      cycle_codes: roleCycleCodes.length ? roleCycleCodes : undefined,
                      subject_codes: roleSubjectCodes.length ? roleSubjectCodes : undefined,
                    } as any;
                    await toast.promise(
                      roleUpdate.mutateAsync(payload),
                      { loading: 'Enregistrement…', success: 'Rôle mis à jour', error: (e) => errorMessage(e, 'Échec de la mise à jour') }
                    );
                  } else {
                    const payload: RoleAssignmentCreate = {
                      establishment_id: roleEstabId,
                      role_principal_code: rolePrincipalCode,
                      role_effectif_code: roleEffectifCode || undefined,
                      function_display: roleFunctionDisplay || undefined,
                      cycle_codes: roleCycleCodes.length ? roleCycleCodes : undefined,
                      subject_codes: roleSubjectCodes.length ? roleSubjectCodes : undefined,
                    } as any;
                    await toast.promise(
                      roleCreate.mutateAsync(payload),
                      { loading: 'Création…', success: 'Rôle créé', error: (e) => errorMessage(e, 'Échec de la création') }
                    );
                  }
                  setEditRoleId(null);
                  setRoleEstabId('');
                  setRolePrincipalCode('');
                  setRoleEffectifCode('');
                  setRoleFunctionDisplay('');
                  setRoleCycleCodes([]);
                  setRoleSubjectCodes([]);
                } catch {}
              }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Établissement ID *</label>
                  <input value={roleEstabId} onChange={(e) => setRoleEstabId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Rôle principal *</label>
                  <select value={rolePrincipalCode} onChange={(e) => setRolePrincipalCode(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" required>
                    <option value="" disabled>Choisir…</option>
                    {rolesPrinList.map((r: any) => (
                      <option key={r.id ?? r.code} value={r.code}>{r.label_key ?? r.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Rôle effectif</label>
                  <select value={roleEffectifCode} onChange={(e) => setRoleEffectifCode(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="">(aucun)</option>
                    {rolesEffList.map((r: any) => (
                      <option key={r.id ?? r.code} value={r.code}>{r.label_key ?? r.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Fonction affichée</label>
                  <input value={roleFunctionDisplay} onChange={(e) => setRoleFunctionDisplay(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Cycles</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-auto border rounded p-2">
                    {cyclesList.map((c: any) => {
                      const checked = roleCycleCodes.includes(c.code);
                      return (
                        <label key={c.id ?? c.code} className="inline-flex items-center gap-1 text-sm">
                          <input type="checkbox" checked={checked} onChange={(e) => {
                            setRoleCycleCodes((prev) => e.target.checked ? [...prev, c.code] : prev.filter((x) => x !== c.code));
                          }} />
                          <span>{c.label_key ?? c.code}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Matières (codes, séparés par des virgules)</label>
                  <input
                    value={roleSubjectCodes.join(',')}
                    onChange={(e) => {
                      const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      // dédupliquer
                      setRoleSubjectCodes(Array.from(new Set(arr)));
                    }}
                    placeholder="ex: MATH, PHYS, HIST"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  {roleSubjectCodes.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">Sélection: {roleSubjectCodes.join(', ')}</div>
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm" disabled={roleCreate.isPending || roleUpdate.isPending}>
                    {editRoleId ? (roleUpdate.isPending ? 'Enregistrement…' : 'Enregistrer') : (roleCreate.isPending ? 'Création…' : 'Créer')}
                  </button>
                </div>
              </form>
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
              <div>
                <label className="block text-sm mb-1">Code identité *</label>
                <input name="code_identite" className="w-full border rounded px-3 py-2" required placeholder="Ex: IDT000151" />
                <div className="text-xs text-gray-500 mt-1">Dernier code utilisé: {lastCode ?? '—'}</div>
              </div>
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
                  <div className="text-sm font-medium">{detail?.firstname ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nom</div>
                  <div className="text-sm font-medium">{detail?.lastname ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-sm font-medium break-all">{detail?.email ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Téléphone</div>
                  <div className="text-sm font-medium">{detail?.phone ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <div className="text-sm font-medium">{detail?.status ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="text-sm font-medium break-all">{detail?.id ?? detailsId}</div>
                </div>
                {/* Rôles complexes */}
                <div className="md:col-span-2">
                  <div className="mt-2 text-sm text-gray-600 font-medium">Rôles complexes</div>
                  {Array.isArray((detail as any)?.role_assignments) && (detail as any).role_assignments.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {((detail as any).role_assignments as any[]).map((r: any) => (
                        <div key={r.id} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700">{r?.role_principal?.code ?? '—'}</span>
                            {r?.role_effectif?.code && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{r.role_effectif.code}</span>
                            )}
                            {r?.function_display && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700">{r.function_display}</span>
                            )}
                          </div>
                          {(Array.isArray(r?.cycles) && r.cycles.length > 0) && (
                            <div className="mt-1 text-xs text-gray-600">Cycles: {r.cycles.map((c: any) => c?.code ?? c).filter(Boolean).join(', ')}</div>
                          )}
                          {(Array.isArray(r?.subjects) && r.subjects.length > 0) && (
                            <div className="mt-1 text-xs text-gray-600">Matières: {r.subjects.map((s: any) => s?.code ?? s).filter(Boolean).join(', ')}</div>
                          )}
                          <div className="mt-1 text-[11px] text-gray-400">Etab: {r?.identity_establishment_id ?? '—'}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">Aucun rôle</div>
                  )}
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
                  <input name="firstname" defaultValue={editDetail?.firstname ?? editing?.firstname ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nom</label>
                  <input name="lastname" defaultValue={editDetail?.lastname ?? editing?.lastname ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input name="email" defaultValue={editDetail?.email ?? editing?.email ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Téléphone</label>
                  <input name="phone" defaultValue={editDetail?.phone ?? editing?.phone ?? ''} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Statut</label>
                <select name="status" defaultValue={(editDetail?.status ?? editing?.status ?? '') as string} className="w-full border rounded px-3 py-2 text-sm">
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
                  <option value="student">Élève</option>
                  <option value="parent">Parent</option>
                  <option value="teacher">Enseignant</option>
                  <option value="admin_staff">Personnel administratif</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Rôle effectif (optionnel)</label>
                <select value={linkRoleEffectif} onChange={(e) => setLinkRoleEffectif(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">(aucun)</option>
                  {rolesEffList.map((r: any) => (
                    <option key={r.id ?? r.code} value={r.code}>{r.label_key ?? r.code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Fonction affichée (optionnel)</label>
                <input value={linkFunctionDisplay} onChange={(e) => setLinkFunctionDisplay(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Cycles (optionnel)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-auto border rounded p-2">
                  {cyclesList.map((c: any) => {
                    const checked = linkCycles.includes(c.code);
                    return (
                      <label key={c.id ?? c.code} className="inline-flex items-center gap-1 text-sm">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          setLinkCycles((prev) => e.target.checked ? [...prev, c.code] : prev.filter((x) => x !== c.code));
                        }} />
                        <span>{c.label_key ?? c.code}</span>
                      </label>
                    );
                  })}
                </div>
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