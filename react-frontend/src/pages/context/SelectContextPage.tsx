import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, CheckCircle, LogOut, RefreshCw, ArrowRight } from 'lucide-react';
import { useIdentityContext } from '../../contexts/IdentityContextProvider';
import { useIdentityMyEstablishments, useIdentityMyRoles } from '../../hooks/useIdentityContext';
import type { EstablishmentRole } from '../../utils/contextStorage';
import { useAuth } from '../../pages/authentification/useAuth';
import { usePublicEstablishments } from '../../hooks/usePublicEstablishments';
import type { EtablissementOut } from '../../api/establishment-service/api';

const SelectContextPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { activeEtabId, activeRole, selectContext } = useIdentityContext();

  // If context already selected, redirect to home
  React.useEffect(() => {
    if (activeEtabId && activeRole) {
      // éviter les boucles de navigation en série
      const id = window.setTimeout(() => navigate('/', { replace: true }), 0);
      return () => window.clearTimeout(id);
    }
  }, [activeEtabId, activeRole, navigate]);

  // Load user establishments
  const { data: estabsResp, isLoading: estabsLoading, isError: estabsError } = useIdentityMyEstablishments({ enabled: true });
  const establishments = React.useMemo(() => (Array.isArray(estabsResp) ? (estabsResp as string[]) : []), [estabsResp]);

  // Charger la liste d'établissements (nommage) pour afficher les libellés au lieu des UUIDs
  const [publicOffset, setPublicOffset] = React.useState(0);
  const [publicLimit, setPublicLimit] = React.useState(20);
  const { data: establishmentsList } = usePublicEstablishments({ limit: publicLimit, offset: publicOffset });
  const etabIdToName = React.useMemo(() => {
    const map = new Map<string, string>();
    (establishmentsList ?? []).forEach((e: EtablissementOut) => {
      const id = e?.id ?? '';
      const nom = e?.nom ?? '';
      if (id) map.set(id, nom || id);
    });
    return map;
  }, [establishmentsList]);

  const [selectedEtabId, setSelectedEtabId] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<EstablishmentRole | ''>('');

  // When establishments are loaded, apply auto-rules
  React.useEffect(() => {
    if (!estabsLoading && !estabsError && Array.isArray(establishments)) {
      if (establishments.length === 0) {
        // No establishment: blocking case handled in UI (no redirect)
        return;
      }
      if (establishments.length === 1) {
        const onlyEtabId = establishments[0];
        setSelectedEtabId(onlyEtabId);
      }
    }
  }, [estabsLoading, estabsError, establishments, selectContext, navigate]);

  // Load roles for selected establishment
  const { data: rolesResp, isLoading: rolesLoading } = useIdentityMyRoles(selectedEtabId ?? undefined, { enabled: !!selectedEtabId });
  const rolesForSelected = React.useMemo(() => (Array.isArray(rolesResp) ? (rolesResp as EstablishmentRole[]) : []), [rolesResp]);

  // Auto-select role if only one is available for chosen establishment
  React.useEffect(() => {
    if (!rolesLoading && rolesForSelected && rolesForSelected.length === 1) {
      setSelectedRole(rolesForSelected[0]);
    }
  }, [rolesLoading, rolesForSelected]);

  // Auto-validate context when there's exactly one establishment and one role
  const autoSubmittedRef = React.useRef(false);
  React.useEffect(() => {
    if (autoSubmittedRef.current) return;
    const singleEtab = Array.isArray(establishments) && establishments.length === 1 ? establishments[0] : null;
    const singleRole = (!rolesLoading && rolesForSelected && rolesForSelected.length === 1) ? rolesForSelected[0] : null;
    if (singleEtab && singleRole && !activeEtabId && !activeRole) {
      autoSubmittedRef.current = true;
      (async () => {
        try {
          await selectContext(singleEtab, singleRole);
          navigate('/', { replace: true });
        } catch {
          autoSubmittedRef.current = false;
        }
      })();
    }
  }, [establishments, rolesForSelected, rolesLoading, activeEtabId, activeRole, selectContext, navigate]);

  const canValidate = !!selectedEtabId && !!selectedRole;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sélection du contexte</h1>
              <p className="text-sm text-gray-600">Choisissez votre établissement et votre rôle pour continuer</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>

        {/* Loading & error states for establishments */}
        {estabsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Chargement de vos établissements…</span>
            </div>
          </div>
        )}
        {estabsError && (
          <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl">
            <div className="text-red-700 font-medium mb-2">Erreur de chargement</div>
            <div className="text-sm text-red-600">Impossible de récupérer vos établissements</div>
          </div>
        )}

        {/* No establishment: blocking message */}
        {!estabsLoading && !estabsError && establishments.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-amber-800 font-medium mb-2">Aucun établissement disponible</div>
              <div className="text-sm text-amber-700 mb-4">
                Aucun établissement n'est rattaché à votre compte. Contactez un administrateur pour obtenir l'accès.
              </div>
              <div className="text-xs text-amber-600">
                Vous ne pouvez pas accéder à l'application sans établissement.
              </div>
            </div>
          </div>
        )}

        {/* One or multiple establishments */}
        {!estabsLoading && !estabsError && establishments.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Establishments Panel */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/60 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/80 border-b border-gray-200/60">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Établissements</h3>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {establishments.length}
                  </span>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-2 space-y-1">
                    {establishments.map((etabId) => (
                      <button
                        key={etabId}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                          selectedEtabId === etabId 
                            ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm' 
                            : 'bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                        onClick={() => {
                          setSelectedEtabId(etabId);
                          setSelectedRole('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className={`font-medium ${selectedEtabId === etabId ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {etabIdToName.get(etabId) ?? etabId}
                            </div>
                          </div>
                          {selectedEtabId === etabId && (
                            <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              {/* Roles Panel */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/60 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/80 border-b border-gray-200/60">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Rôles</h3>
                  {rolesForSelected.length > 0 && (
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {rolesForSelected.length}
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-2">
                    {selectedEtabId ? (
                      rolesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-2 text-gray-500">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Chargement des rôles…</span>
                          </div>
                        </div>
                      ) : rolesForSelected.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-sm text-gray-500">Aucun rôle disponible</div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {rolesForSelected.map((r) => (
                            <label 
                              key={r}
                              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                                selectedRole === r 
                                  ? 'bg-purple-50 border-2 border-purple-200 shadow-sm' 
                                  : 'bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                              }`}
                            >
                              <input
                                type="radio"
                                name="role"
                                value={r}
                                checked={selectedRole === r}
                                onChange={() => setSelectedRole(r)}
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <span className={`font-medium ${selectedRole === r ? 'text-purple-900' : 'text-gray-900'}`}>
                                  {labelForRole(r)}
                                </span>
                              </div>
                              {selectedRole === r && (
                                <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-sm text-gray-500">Choisissez d'abord un établissement</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        {!estabsLoading && !estabsError && establishments.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {canValidate ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sélection complète - Prêt à continuer</span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                  <span>Sélectionnez un établissement et un rôle</span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                onClick={() => {
                  setSelectedEtabId(null);
                  setSelectedRole('');
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  canValidate
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!canValidate}
                onClick={() => {
                  if (selectedEtabId && selectedRole) {
                    selectContext(selectedEtabId, selectedRole);
                    navigate('/', { replace: true });
                  }
                }}
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
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

export default SelectContextPage;
