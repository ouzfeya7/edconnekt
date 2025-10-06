import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AdmissionResponse, AdmissionUpdate } from '../../../api/admission-service/api';
import { useAdmission } from '../../../hooks/useAdmissions';
import { useUpdateAdmission } from '../../../hooks/useAdmissionMutations';
import toast from 'react-hot-toast';

export default function AdmissionDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const admissionIdRaw = params.admissionId ?? params.id ?? '';
  const admissionId = useMemo(() => {
    const parsed = Number(admissionIdRaw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [admissionIdRaw]);

  const { data, isLoading, isError, error } = useAdmission(admissionId);
  const { mutateAsync: updateAdmission, isPending } = useUpdateAdmission(admissionId);

  const [studentName, setStudentName] = useState<string>('');
  const [studentBirthdate, setStudentBirthdate] = useState<string>('');
  const [classRequested, setClassRequested] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [parentContact, setParentContact] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [studentPhone, setStudentPhone] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!data) return;
    const row = data as unknown as AdmissionResponse;
    setStudentName(row.student_name ?? '');
    setStudentBirthdate(row.student_birthdate ?? '');
    setClassRequested(row.class_requested ?? '');
    setParentName(row.parent_name ?? '');
    setParentContact(row.parent_contact ?? '');
    setStudentEmail((row.student_email as string | null) ?? '');
    setStudentPhone((row.student_phone as string | null) ?? '');
    setParentEmail((row.parent_email as string | null) ?? '');
    setParentPhone((row.parent_phone as string | null) ?? '');
    setNotes((row.notes as string | null) ?? '');
  }, [data]);

  useEffect(() => {
    if (isError) {
      const msg = (error instanceof Error && error.message) ? error.message : 'Erreur de chargement';
      toast.error(msg);
    }
  }, [isError, error]);

  const isValid = useMemo(() => {
    return (
      studentName.trim().length > 1 &&
      studentBirthdate.trim().length > 0 &&
      classRequested.trim().length > 0 &&
      parentName.trim().length > 1 &&
      parentContact.trim().length > 3
    );
  }, [studentName, studentBirthdate, classRequested, parentName, parentContact]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof admissionId !== 'number') {
      toast.error('Identifiant invalide');
      return;
    }
    if (!isValid) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const payload: AdmissionUpdate = {
      student_name: studentName || null,
      student_birthdate: studentBirthdate || null,
      class_requested: classRequested || null,
      parent_name: parentName || null,
      parent_contact: parentContact || null,
      student_email: studentEmail || null,
      student_phone: studentPhone || null,
      parent_email: parentEmail || null,
      parent_phone: parentPhone || null,
      notes: notes || null,
    };
    try {
      await updateAdmission(payload);
      toast.success('Admission mise à jour');
      navigate('/admissions');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Échec de la mise à jour';
      toast.error(message);
    }
  };

  if (typeof admissionId !== 'number') {
    return (
      <div className="p-6">
        <div className="text-red-600">Identifiant d'admission invalide.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admission #{admissionId}</h1>
              <p className="text-gray-600">Détail et édition</p>
            </div>
          </div>
          <button
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm"
            onClick={() => navigate('/admissions')}
          >
            Retour
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-gray-600">Chargement...</div>
        ) : (
          <form onSubmit={onSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet de l'élève *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  maxLength={255}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={studentBirthdate}
                  onChange={(e) => setStudentBirthdate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe demandée *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={classRequested}
                  onChange={(e) => setClassRequested(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du parent/tuteur *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  maxLength={255}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact principal *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  maxLength={255}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email élève</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone élève</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email parent</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone parent</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValid || isPending}
              >
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm"
                onClick={() => navigate('/admissions')}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


