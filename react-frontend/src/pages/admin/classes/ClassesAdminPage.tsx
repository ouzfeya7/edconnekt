import React, { useEffect, useMemo, useState } from 'react';
import { useEstablishments } from '../../../hooks/useEstablishments';
import { useClasses } from '../../../hooks/useClasses';
import type { StatusEnum } from '../../../api/establishment-service/api';
import type { ClasseOut } from '../../../api/classe-service/api';
import { Button } from '../../../components/ui/button';
import { FaPlus, FaSearch, FaFileImport, FaUserPlus, FaUserEdit, FaTrash, FaUserGraduate, FaChalkboardTeacher, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreateClasseModal from './CreateClasseModal';
import ImportClassesModal from './ImportClassesModal';
import EditClasseModal from './EditClasseModal';
import AssignTeacherModal from './AssignTeacherModal';
import AssignStudentModal from './AssignStudentModal';
import { useArchiveClasse } from '../../../hooks/useArchiveClasse';
import { useAuth } from '../../authentification/useAuth';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const ClassesAdminPage: React.FC = () => {
  const [selectedEtablissementId, setSelectedEtablissementId] = useState<string>('');
  const [nomFilter, setNomFilter] = useState<string>('');
  const [niveauFilter, setNiveauFilter] = useState<string>('');
  const [isArchived, setIsArchived] = useState<string>('false');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<ClasseOut | null>(null);
  const [assignTeacherTarget, setAssignTeacherTarget] = useState<string>('');
  const [assignStudentTarget, setAssignStudentTarget] = useState<string>('');
  const [skip] = useState<number>(0);
  const [limit] = useState<number>(100);

  const { roles } = useAuth();
  const isDirector = roles.includes('directeur');

  // Etablissements actifs pour sélectionner le contexte
  const { data: establishments, isLoading: isLoadingEtab } = useEstablishments({ status: 'ACTIVE' as StatusEnum, limit: 100, offset: 0 });

  // Pré-remplir et verrouiller pour le directeur (ID stocké côté session en attendant Keycloak)
  useEffect(() => {
    if (isDirector && !selectedEtablissementId) {
      const stored = sessionStorage.getItem('etablissement_id') || '';
      if (stored) setSelectedEtablissementId(stored);
    }
  }, [isDirector, selectedEtablissementId]);

  const { data: classesResponse, isLoading: isLoadingClasses } = useClasses({
    etablissementId: selectedEtablissementId,
    skip,
    limit,
    nom: nomFilter || undefined,
    niveau: niveauFilter || undefined,
    isArchived: isArchived === 'true' ? true : isArchived === 'false' ? false : undefined,
  });

  const classes: ClasseOut[] = useMemo(() => classesResponse?.data ?? [], [classesResponse]);
  const archiveMutation = useArchiveClasse();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingArchive, setPendingArchive] = useState<{ id: string; nom: string } | null>(null);

  const askArchive = (id: string, nom: string) => {
    setPendingArchive({ id, nom });
    setConfirmOpen(true);
  };

  const confirmArchive = () => {
    if (!pendingArchive) return;
    archiveMutation.mutate(pendingArchive.id, {
      onSuccess: () => {
        toast.success('Classe archivée avec succès');
        setConfirmOpen(false);
        setPendingArchive(null);
      },
      onError: () => {
        toast.error("Échec de l'archivage de la classe");
      },
    });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Classes</h1>
          <p className="text-gray-600 mt-1">Lister et créer des classes par établissement.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateOpen(true)} disabled={!selectedEtablissementId}>
            <FaPlus className="mr-2" />
            Nouvelle classe
          </Button>
          <Button onClick={() => setIsImportOpen(true)} disabled={!selectedEtablissementId} variant="secondary">
            <FaFileImport className="mr-2" />
            Importer des classes
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={selectedEtablissementId}
              onChange={(e) => setSelectedEtablissementId(e.target.value)}
              disabled={isLoadingEtab || isDirector}
            >
              <option value="">Sélectionner…</option>
              {(establishments ?? []).map((etab) => (
                <option key={etab.id} value={etab.id}>
                  {etab.nom}
                </option>
              ))}
            </select>
            {isDirector && !selectedEtablissementId && (
              <p className="text-xs text-gray-500 mt-1">Sélection automatique en attente de l'ID établissement côté Keycloak.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom…"
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                value={nomFilter}
                onChange={(e) => setNomFilter(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <input
              type="text"
              placeholder="Ex: 6ème, 3ème, Terminale"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivées</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={isArchived}
              onChange={(e) => setIsArchived(e.target.value)}
            >
              <option value="false">Non</option>
              <option value="true">Oui</option>
              <option value="all">Toutes</option>
            </select>
          </div>
        </div>

        {/* Liste */}
        {!selectedEtablissementId ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Aucun établissement sélectionné</h3>
            <p className="mt-1 text-sm text-gray-500">
              Veuillez utiliser le menu déroulant ci-dessus pour choisir un établissement et afficher ses classes.
            </p>
          </div>
        ) : isLoadingClasses ? (
          <div className="text-gray-600">Chargement des classes…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Niveau</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Année scolaire</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Capacité</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Créée le</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{c.code}</td>
                    <td className="p-4">{c.nom}</td>
                    <td className="p-4">{c.niveau}</td>
                    <td className="p-4">{c.annee_scolaire}</td>
                    <td className="p-4">{typeof c.capacity === 'number' ? c.capacity : '-'}</td>
                    <td className="p-4">{c.created_at ? new Date(c.created_at).toLocaleDateString('fr-SN') : '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditTarget(c)}
                          title="Modifier"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <FaUserEdit className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAssignTeacherTarget(c.id)}
                          title="Assigner enseignant"
                          className="text-gray-600 hover:text-green-600"
                        >
                          <FaChalkboardTeacher className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAssignStudentTarget(c.id)}
                          title="Assigner élève"
                          className="text-gray-600 hover:text-green-600"
                        >
                          <FaUserGraduate className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => askArchive(c.id, c.nom)}
                          title="Archiver"
                          className="text-gray-600 hover:text-red-600"
                        >
                          <FaTrash className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateClasseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        etablissementId={selectedEtablissementId}
      />
      <ImportClassesModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        etablissementId={selectedEtablissementId}
      />
      <EditClasseModal isOpen={!!editTarget} onClose={() => setEditTarget(null)} classe={editTarget} />
      <AssignTeacherModal isOpen={!!assignTeacherTarget} onClose={() => setAssignTeacherTarget('')} classeId={assignTeacherTarget} />
      <AssignStudentModal isOpen={!!assignStudentTarget} onClose={() => setAssignStudentTarget('')} classeId={assignStudentTarget} />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Archiver cette classe ?"
        description={pendingArchive ? `Classe: ${pendingArchive.nom}` : undefined}
        confirmText="Archiver"
        cancelText="Annuler"
        onCancel={() => { setConfirmOpen(false); setPendingArchive(null); }}
        onConfirm={confirmArchive}
      />
    </div>
  );
};

export default ClassesAdminPage;


