import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { EstablishmentRole } from '../../utils/contextStorage';
import { usePublicEstablishments } from '../../hooks/usePublicEstablishments';
import type { EtablissementOut } from '../../api/establishment-service/api';
import { useModal } from '../../hooks/useModal';

interface Props {
  open: boolean;
  onClose: () => void;
  blockClose?: boolean;
  establishments: string[];
  selectedEtabId: string | null;
  onSelectEtab: (id: string) => void;
  roles: EstablishmentRole[];
  rolesLoading?: boolean;
  onConfirm: (role: EstablishmentRole) => void;
  zeroEstabs?: boolean;
  loading?: boolean;
  error?: string;
  activeEtabId?: string | null;
  activeRole?: EstablishmentRole | null;
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
  activeEtabId,
  activeRole,
}) => {
  const [selectedRole, setSelectedRole] = React.useState<EstablishmentRole | ''>('');
  
  // Utiliser le hook personnalisé pour gérer le modal (sauf si blockClose est activé)
  useModal(open, blockClose ? () => {} : onClose);

  // Charger les établissements publics pour afficher le nom au lieu de l'UUID
  const { data: publicEstabs } = usePublicEstablishments({ limit: 100 });
  const etabIdToName = React.useMemo(() => {
    const map = new Map<string, string>();
    (publicEstabs ?? []).forEach((e: EtablissementOut) => {
      if (e?.id) map.set(e.id, e.nom || e.id);
    });
    return map;
  }, [publicEstabs]);

  React.useEffect(() => {
    // Si la modale s'ouvre et qu'un contexte existe, pré-sélectionner le rôle courant
    if (open && selectedEtabId === activeEtabId && activeRole) {
      setSelectedRole(activeRole);
    } else {
      setSelectedRole('');
    }
  }, [selectedEtabId, open, activeEtabId, activeRole]);

  // Auto-select the role if only one is available for the selected establishment
  React.useEffect(() => {
    if (!rolesLoading && roles && roles.length === 1) {
      setSelectedRole(roles[0]);
    }
  }, [rolesLoading, roles]);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay séparé */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={blockClose ? undefined : onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-xl w-full max-w-3xl p-0 shadow-2xl overflow-hidden border border-gray-200 z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sélection du contexte</h3>
            <p className="text-xs text-gray-600 mt-0.5">Choisissez votre établissement et votre rôle pour continuer</p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            <div className="border rounded-lg overflow-hidden">
              <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">Établissements</div>
              <div className="max-h-72 overflow-auto">
                {loading ? (
                  <ul className="p-3 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </ul>
                ) : establishments.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">Aucun établissement</div>
                ) : (
                  <ul>
                    {establishments.map((etabId) => (
                      <li key={etabId}>
                        <button
                          className={`w-full text-left px-3 py-2 text-sm border-b last:border-b-0 hover:bg-gray-50 ${selectedEtabId === etabId ? 'bg-indigo-50' : ''}`}
                          onClick={() => onSelectEtab(etabId)}
                        >
                          <div className="font-medium">{etabIdToName.get(etabId) ?? etabId}</div>
                          {selectedEtabId === etabId && (
                            <div className="text-xs text-indigo-600">Sélectionné</div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">Rôles</div>
              <div className="max-h-72 overflow-auto">
                {rolesLoading ? (
                  <ul className="p-3 space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <li key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </ul>
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
                          <span className={`${selectedRole === r ? 'text-indigo-700 font-medium' : ''}`}>{labelForRole(r)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            {selectedEtabId ? (
              <span>
                Établissement: <span className="font-medium text-gray-700">{etabIdToName.get(selectedEtabId) ?? selectedEtabId}</span>
                {selectedRole ? (
                  <>
                    {' '}
                    • Rôle: <span className="font-medium text-gray-700">{labelForRole(selectedRole)}</span>
                  </>
                ) : null}
              </span>
            ) : (
              <span>Sélectionnez un établissement et un rôle</span>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} disabled={blockClose} className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50">Annuler</button>
            <button
              disabled={!selectedEtabId || !selectedRole || loading || rolesLoading}
              onClick={() => selectedRole && onConfirm(selectedRole)}
              className={`px-4 py-2 rounded text-white ${(!selectedEtabId || !selectedRole || loading || rolesLoading) ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {(loading || rolesLoading) ? 'Veuillez patienter…' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
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
