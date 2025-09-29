import React from 'react';
import { X } from 'lucide-react';
import type { EstablishmentRole } from '../../utils/contextStorage';
import type { UserEstablishmentResponse } from '../../api/identity-service/api';

interface Props {
  open: boolean;
  onClose: () => void;
  blockClose?: boolean;
  establishments: UserEstablishmentResponse[];
  selectedEtabId: string | null;
  onSelectEtab: (id: string) => void;
  roles: EstablishmentRole[];
  rolesLoading?: boolean;
  onConfirm: (role: EstablishmentRole) => void;
  zeroEstabs?: boolean;
  loading?: boolean;
  error?: string;
}

const ContextSelectModal: React.FC<Props> = ({
  open,
  onClose,
  blockClose = false,
  establishments,
  selectedEtabId,
  onSelectEtab,
  roles,
  rolesLoading,
  onConfirm,
  zeroEstabs,
  loading,
  error,
}) => {
  const [selectedRole, setSelectedRole] = React.useState<EstablishmentRole | ''>('');

  React.useEffect(() => {
    setSelectedRole('');
  }, [selectedEtabId]);

  // Auto-select the role if only one is available for the selected establishment
  React.useEffect(() => {
    if (!rolesLoading && roles && roles.length === 1) {
      setSelectedRole(roles[0]);
    }
  }, [rolesLoading, roles]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sélection du contexte</h3>
          <button
            onClick={onClose}
            disabled={blockClose}
            aria-label="Fermer"
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {zeroEstabs ? (
          <div className="text-sm text-gray-600">Aucun établissement rattaché à votre compte. Contactez un administrateur.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg">
              <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">Établissements</div>
              <div className="max-h-72 overflow-auto">
                {loading ? (
                  <div className="p-3 text-sm text-gray-500">Chargement…</div>
                ) : establishments.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">Aucun établissement</div>
                ) : (
                  <ul>
                    {establishments.map((e) => (
                      <li key={e.establishment_id}>
                        <button
                          className={`w-full text-left px-3 py-2 text-sm border-b last:border-b-0 hover:bg-gray-50 ${selectedEtabId === e.establishment_id ? 'bg-indigo-50' : ''}`}
                          onClick={() => onSelectEtab(e.establishment_id)}
                        >
                          <div className="font-medium">{e.establishment_id}</div>
                          <div className="text-xs text-gray-500">Rôles: {(e.roles || []).join(', ') || '—'}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">Rôles</div>
              <div className="max-h-72 overflow-auto">
                {rolesLoading ? (
                  <div className="p-3 text-sm text-gray-500">Chargement des rôles…</div>
                ) : roles.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">Aucun rôle disponible</div>
                ) : (
                  <ul>
                    {roles.map((r) => (
                      <li key={r}>
                        <label className="flex items-center gap-2 px-3 py-2 text-sm border-b last:border-b-0 cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="role"
                            value={r}
                            checked={selectedRole === r}
                            onChange={() => setSelectedRole(r)}
                          />
                          <span>{labelForRole(r)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} disabled={blockClose} className="px-4 py-2 border rounded disabled:opacity-50">Annuler</button>
          <button
            disabled={!selectedEtabId || !selectedRole}
            onClick={() => selectedRole && onConfirm(selectedRole)}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

function labelForRole(r: EstablishmentRole): string {
  switch (r) {
    case 'student':
      return 'Élève';
    case 'parent':
      return 'Parent';
    case 'teacher':
      return 'Enseignant';
    case 'admin_staff':
      return 'Personnel administratif';
    default:
      return r;
  }
}

export default ContextSelectModal;
