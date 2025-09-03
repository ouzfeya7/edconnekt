import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash, Search, PlusCircle, Link as LinkIcon, ArrowLeftRight, Clock, MinusCircle } from 'lucide-react';
import { useStudents } from '../../../hooks/students/useStudents';
import { useCreateStudent } from '../../../hooks/students/useCreateStudent';
import { useUpdateStudent } from '../../../hooks/students/useUpdateStudent';
import { useDeleteStudent } from '../../../hooks/students/useDeleteStudent';
import { useLinkParent } from '../../../hooks/students/useLinkParent';
import { useUnlinkParent } from '../../../hooks/students/useUnlinkParent';
import { useTransferStudentClass } from '../../../hooks/students/useTransferStudentClass';
import { useStudentAudit } from '../../../hooks/students/useStudentAudit';
import { useClasses } from '../../../hooks/useClasses';
import { useEstablishments } from '../../../hooks/useEstablishments';
import { setStudentServiceEstablishmentId } from '../../../api/student-service/http';

const StudentsManagement = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<'ACTIVE' | 'TRANSFERRED' | 'ARCHIVED' | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  const [selectedEtabId, setSelectedEtabId] = useState<string>('');
  const { data: establishments } = useEstablishments({ limit: 100 });
  const currentEtabId = selectedEtabId;

  const { data, isLoading, isError } = useStudents({ page, size, classId, status, search: search || null, etabId: currentEtabId || undefined });
  const { data: classesData } = useClasses({ etablissementId: currentEtabId, limit: 200, skip: 0 });

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const linkParent = useLinkParent();
  const unlinkParent = useUnlinkParent();
  const transferClass = useTransferStudentClass();

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [unlinkInfo, setUnlinkInfo] = useState<{ studentId: string; parentId: string } | null>(null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      firstname: { value: string };
      lastname: { value: string };
      parent_id: { value: string };
      relation: { value: 'mother' | 'father' | 'tutor' };
      class_id: { value: string };
      school_year: { value: string };
    };
    await createStudent.mutateAsync({
      payload: {
        firstname: form.firstname.value,
        lastname: form.lastname.value,
        parent_id: form.parent_id.value,
        parent_relation: form.relation.value,
        class_id: form.class_id.value,
        school_year: form.school_year.value,
      },
      etabId: currentEtabId || undefined,
    });
    setShowCreate(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editId) return;
    const form = e.currentTarget as HTMLFormElement & {
      status: { value: 'ACTIVE' | 'TRANSFERRED' | 'ARCHIVED' };
      photo_url: { value: string };
    };
    await updateStudent.mutateAsync({ studentId: editId, update: { status: form.status.value, photo_url: form.photo_url.value || null }, etabId: currentEtabId || undefined });
    setEditId(null);
  };

  const handleLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!linkId) return;
    const form = e.currentTarget as HTMLFormElement & {
      parent_id: { value: string };
      relation: { value: 'mother' | 'father' | 'tutor' };
    };
    await linkParent.mutateAsync({ payload: { student_id: linkId, parent_id: form.parent_id.value, relation: form.relation.value }, etabId: currentEtabId || undefined });
    setLinkId(null);
  };

  const handleUnlink = async () => {
    if (!unlinkInfo) return;
    await unlinkParent.mutateAsync({ ...unlinkInfo, etabId: currentEtabId || undefined } as { studentId: string; parentId: string; etabId?: string });
    setUnlinkInfo(null);
  };

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transferId) return;
    const form = e.currentTarget as HTMLFormElement & {
      class_id: { value: string };
      school_year: { value: string };
      joined_on: { value: string };
    };
    await transferClass.mutateAsync({
      studentId: transferId,
      update: {
        class_id: form.class_id.value,
        school_year: form.school_year.value,
        joined_on: form.joined_on.value,
      },
      etabId: currentEtabId || undefined,
    });
    setTransferId(null);
  };

  const students = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('students_list', 'Liste des Élèves')}</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
          <PlusCircle className="w-4 h-4 mr-2" /> {t('add_student', 'Ajouter un élève')}
        </button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <select className="border rounded-md px-2 py-2" value={selectedEtabId} onChange={(e) => { const id = e.target.value; setSelectedEtabId(id); setStudentServiceEstablishmentId(id || undefined); setPage(1); setClassId(null); }}>
          <option value="">{t('select_establishment','Sélectionner un établissement')}</option>
          {(establishments || []).map((etab) => (
            <option key={etab.id} value={etab.id}>{etab.nom}</option>
          ))}
        </select>
        <div className="md:col-span-2 flex items-center border rounded-md px-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="w-full px-2 py-2 outline-none" placeholder={t('search_name', 'Rechercher nom/prénom') || ''} value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        </div>
        <select className="border rounded-md px-2 py-2" value={status ?? ''} onChange={(e) => { setPage(1); const v = e.target.value as '' | 'ACTIVE' | 'TRANSFERRED' | 'ARCHIVED'; setStatus(v ? v : null); }}>
          <option value="">{t('all_status', 'Tous statuts')}</option>
          <option value="ACTIVE">{t('ACTIVE', 'Actif')}</option>
          <option value="TRANSFERRED">{t('TRANSFERRED', 'Transféré')}</option>
          <option value="ARCHIVED">{t('ARCHIVED', 'Archivé')}</option>
        </select>
        <select className="border rounded-md px-2 py-2" value={classId ?? ''} onChange={(e) => { setPage(1); setClassId(e.target.value || null); }} disabled={!currentEtabId}>
          <option value="">{t('all_classes', 'Toutes classes')}</option>
          {classesData?.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <select className="border rounded-md px-2 py-2" value={size} onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}>
          {[10,20,50,100].map((n) => (<option key={n} value={n}>{n} / page</option>))}
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name', 'Nom')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status', 'Statut')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('created_at', 'Créé le')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">{t('loading', 'Chargement...')}</td></tr>
            )}
            {isError && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-red-600">{t('error_loading', 'Erreur de chargement')}</td></tr>
            )}
            {!isLoading && !isError && students.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">{t('no_data', 'Aucune donnée')}</td></tr>
            )}
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap">{s.firstname} {s.lastname}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {s.status === 'ACTIVE' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{t('ACTIVE','Actif')}</span>}
                  {s.status === 'TRANSFERRED' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{t('TRANSFERRED','Transféré')}</span>}
                  {s.status === 'ARCHIVED' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{t('ARCHIVED','Archivé')}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" onClick={() => setEditId(s.id)} title={t('edit','Modifier') || ''}><Edit className="w-4 h-4" /></button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => deleteStudent.mutate({ studentId: s.id, etabId: currentEtabId || undefined })} title={t('delete','Supprimer') || ''}><Trash className="w-4 h-4" /></button>
                  <button className="text-teal-600 hover:text-teal-800" onClick={() => setLinkId(s.id)} title={t('link_parent','Lier parent') || ''}><LinkIcon className="w-4 h-4" /></button>
                  <button className="text-orange-600 hover:text-orange-800" onClick={() => setUnlinkInfo({ studentId: s.id, parentId: '' })} title={t('unlink_parent','Délier parent') || ''}><MinusCircle className="w-4 h-4" /></button>
                  <button className="text-purple-600 hover:text-purple-800" onClick={() => setTransferId(s.id)} title={t('transfer_class','Transférer classe') || ''}><ArrowLeftRight className="w-4 h-4" /></button>
                  <button className="text-gray-700 hover:text-gray-900" onClick={() => setAuditId(s.id)} title={t('audit','Audit') || ''}><Clock className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">{t('total','Total')}: {total}</span>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{t('prev','Préc')}</button>
          <span className="text-sm">{page}/{pages}</span>
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>{t('next','Suiv')}</button>
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{t('create_student','Créer un élève')}</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">{t('firstname','Prénom')}</label>
                  <input name="firstname" className="w-full border rounded px-2 py-2" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('lastname','Nom')}</label>
                  <input name="lastname" className="w-full border rounded px-2 py-2" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">{t('parent_id','Parent ID')}</label>
                  <input name="parent_id" className="w-full border rounded px-2 py-2" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('relation','Relation')}</label>
                  <select name="relation" className="w-full border rounded px-2 py-2" required>
                    <option value="mother">{t('mother','Mère')}</option>
                    <option value="father">{t('father','Père')}</option>
                    <option value="tutor">{t('tutor','Tuteur')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('class','Classe')}</label>
                  <select name="class_id" className="w-full border rounded px-2 py-2" required>
                    <option value="">{t('select','Sélectionner')}</option>
                    {classesData?.data?.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">{t('school_year','Année scolaire')}</label>
                  <input name="school_year" placeholder="2024-2025" className="w-full border rounded px-2 py-2" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setShowCreate(false)}>{t('cancel','Annuler')}</button>
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{t('create','Créer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">{t('update_student','Mettre à jour')}</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">{t('status','Statut')}</label>
                <select name="status" className="w-full border rounded px-2 py-2">
                  <option value="ACTIVE">{t('ACTIVE','Actif')}</option>
                  <option value="TRANSFERRED">{t('TRANSFERRED','Transféré')}</option>
                  <option value="ARCHIVED">{t('ARCHIVED','Archivé')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t('photo_url','URL Photo')}</label>
                <input name="photo_url" className="w-full border rounded px-2 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setEditId(null)}>{t('cancel','Annuler')}</button>
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{t('save','Enregistrer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {linkId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">{t('link_parent','Lier un parent')}</h3>
            <form onSubmit={handleLink} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">{t('parent_id','Parent ID')}</label>
                <input name="parent_id" className="w-full border rounded px-2 py-2" required />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('relation','Relation')}</label>
                <select name="relation" className="w-full border rounded px-2 py-2" required>
                  <option value="mother">{t('mother','Mère')}</option>
                  <option value="father">{t('father','Père')}</option>
                  <option value="tutor">{t('tutor','Tuteur')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setLinkId(null)}>{t('cancel','Annuler')}</button>
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{t('link','Lier')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {unlinkInfo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">{t('unlink_parent','Délier un parent')}</h3>
            <div className="space-y-3">
              <label className="block text-sm mb-1">{t('parent_id','Parent ID')}</label>
              <input className="w-full border rounded px-2 py-2" placeholder="UUID" value={unlinkInfo.parentId} onChange={(e) => setUnlinkInfo({ ...unlinkInfo, parentId: e.target.value })} />
              <div className="flex justify-end space-x-2 pt-2">
                <button className="px-3 py-2 border rounded" onClick={() => setUnlinkInfo(null)}>{t('cancel','Annuler')}</button>
                <button className="px-3 py-2 bg-orange-600 text-white rounded" onClick={handleUnlink}>{t('unlink','Délier')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {transferId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">{t('transfer_class','Transférer de classe')}</h3>
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">{t('class','Classe')}</label>
                <select name="class_id" className="w-full border rounded px-2 py-2" required>
                  <option value="">{t('select','Sélectionner')}</option>
                  {classesData?.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t('school_year','Année scolaire')}</label>
                <input name="school_year" placeholder="2024-2025" className="w-full border rounded px-2 py-2" required />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('joined_on','Date d\'entrée')}</label>
                <input name="joined_on" type="date" className="w-full border rounded px-2 py-2" required />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setTransferId(null)}>{t('cancel','Annuler')}</button>
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded">{t('transfer','Transférer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {auditId && (
        <StudentAuditModal studentId={auditId} onClose={() => setAuditId(null)} />
      )}
    </div>
  );
};

function StudentAuditModal({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useStudentAudit(studentId);
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{t('student_audit','Audit de l\'élève')}</h3>
          <button className="px-3 py-1 border rounded" onClick={onClose}>{t('close','Fermer')}</button>
        </div>
        {isLoading && <div className="text-gray-500">{t('loading','Chargement...')}</div>}
        {isError && <div className="text-red-600">{t('error_loading','Erreur de chargement')}</div>}
        {!isLoading && !isError && (
          <div className="space-y-2">
            {(data || []).map((a) => (
              <div key={a.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{new Date(a.created_at).toLocaleString()}</div>
                  <div className="text-xs font-semibold">{a.action}</div>
                </div>
                <div className="mt-1 text-xs text-gray-600">actor: {a.actor_id} ({a.actor_role})</div>
                {a.diff && (
                  <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(a.diff, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsManagement;