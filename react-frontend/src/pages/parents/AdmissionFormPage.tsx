import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../authentification/AuthContext';
import { useCreateAdmission } from '../../hooks/useAdmissionMutations';
import type { AdmissionCreateRequest } from '../../api/admission-service/api';
import toast from 'react-hot-toast';

const RECAPTCHA_SITE_KEY = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function AdmissionFormPage() {
  const { isAuthenticated, user } = useAuthContext();
  const [loadingCaptcha, setLoadingCaptcha] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

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

  const { mutateAsync: createAdmission, isPending } = useCreateAdmission();

  // Préremplissage des informations parent à partir du profil Keycloak (si connecté)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const first = typeof user.firstName === 'string' ? user.firstName : '';
    const last = typeof user.lastName === 'string' ? user.lastName : '';
    const fullName = `${first} ${last}`.trim();
    const email = typeof user.email === 'string' ? user.email : '';

    // Tentative prudente d'extraction d'un numéro depuis les attributs Keycloak
    let phoneFromAttributes = '';
    const rawAttrs = (user as unknown as { attributes?: unknown }).attributes;
    if (rawAttrs && typeof rawAttrs === 'object') {
      const attrs = rawAttrs as Record<string, unknown>;
      const maybePhone = attrs['phone'] ?? attrs['phone_number'] ?? attrs['telephone'];
      if (Array.isArray(maybePhone) && typeof maybePhone[0] === 'string') {
        phoneFromAttributes = maybePhone[0];
      } else if (typeof maybePhone === 'string') {
        phoneFromAttributes = maybePhone;
      }
    }

    setParentName((prev) => prev || fullName);
    setParentEmail((prev) => prev || email);
    setParentContact((prev) => prev || email || phoneFromAttributes);
    setParentPhone((prev) => prev || phoneFromAttributes);
  }, [isAuthenticated, user]);

  useEffect(() => {
    const existing = document.querySelector('script[data-recaptcha="v3"]') as HTMLScriptElement | null;
    if (existing) {
      setLoadingCaptcha(false);
      return;
    }
    if (!RECAPTCHA_SITE_KEY) {
      setLoadingCaptcha(false);
      if (import.meta.env.DEV) console.warn('[recaptcha] VITE_RECAPTCHA_SITE_KEY manquant');
      toast.error('Configuration reCAPTCHA manquante');
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-recaptcha', 'v3');
    script.onload = () => setLoadingCaptcha(false);
    script.onerror = () => setLoadingCaptcha(false);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (loadingCaptcha) return;
    if (!window.grecaptcha) return;
    if (!RECAPTCHA_SITE_KEY) return;
    window.grecaptcha.ready(() => {
      window.grecaptcha!
        .execute(RECAPTCHA_SITE_KEY, { action: 'admission_submit' })
        .then((t) => setToken(t))
        .catch(() => setToken(null));
    });
  }, [loadingCaptcha]);

  const isValid = useMemo(() => {
    return (
      studentName.trim().length > 1 &&
      studentBirthdate.trim().length > 0 &&
      classRequested.trim().length > 0 &&
      parentName.trim().length > 1 &&
      parentContact.trim().length > 3
    );
  }, [studentName, studentBirthdate, classRequested, parentName, parentContact]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    // Régénérer un token reCAPTCHA v3 "frais" juste avant l'envoi
    let freshToken: string | null = token;
    if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
      try {
        freshToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'admission_submit' });
        setToken(freshToken);
      } catch {
        // ignore, on utilisera le token actuel si présent
      }
    }
    if (!freshToken) {
      toast.error('Captcha indisponible. Veuillez réessayer.');
      return;
    }
    const payload: AdmissionCreateRequest = {
      student_name: studentName,
      student_birthdate: studentBirthdate,
      class_requested: classRequested,
      parent_name: parentName,
      parent_contact: parentContact,
      student_email: studentEmail || null,
      student_phone: studentPhone || null,
      parent_email: parentEmail || null,
      parent_phone: parentPhone || null,
      notes: notes || null,
      attachments: null,
      captcha_token: freshToken,
    };
    try {
      const res = await createAdmission(payload);
      toast.success('Demande soumise avec succès.');
      if (res && typeof res.id === 'number') {
        toast.success(`Identifiant de suivi: ${res.id}`);
      }
      setStudentName('');
      setStudentBirthdate('');
      setClassRequested('');
      setParentName('');
      setParentContact('');
      setStudentEmail('');
      setStudentPhone('');
      setParentEmail('');
      setParentPhone('');
      setNotes('');
      setToken(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la soumission';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle demande d'admission</h1>
          <p className="text-gray-600 max-w-md mx-auto">Remplissez ce formulaire pour soumettre une demande d'admission pour votre enfant.</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Section Élève */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                Informations de l'élève
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet de l'élève <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Prénom et nom de famille"
                    value={studentName} 
                    onChange={(e) => setStudentName(e.target.value)} 
                    maxLength={255}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={studentBirthdate} 
                    onChange={(e) => setStudentBirthdate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe demandée <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ex: 6ème A, CP, etc."
                    value={classRequested} 
                    onChange={(e) => setClassRequested(e.target.value)} 
                    maxLength={100}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email élève</label>
                  <input 
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="email@exemple.com"
                    value={studentEmail} 
                    onChange={(e) => setStudentEmail(e.target.value)} 
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone élève</label>
                  <input 
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+221 XX XXX XX XX"
                    value={studentPhone} 
                    onChange={(e) => setStudentPhone(e.target.value)} 
                    maxLength={50}
                  />
                </div>
              </div>
            </div>

            {/* Section Parent */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                Informations du parent/tuteur
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du parent/tuteur <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Prénom et nom du parent"
                    value={parentName} 
                    onChange={(e) => setParentName(e.target.value)} 
                    maxLength={255}
                    required 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact principal <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Email ou numéro de téléphone principal"
                    value={parentContact} 
                    onChange={(e) => setParentContact(e.target.value)} 
                    maxLength={255}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email parent</label>
                  <input 
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="parent@exemple.com"
                    value={parentEmail} 
                    onChange={(e) => setParentEmail(e.target.value)} 
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone parent</label>
                  <input 
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+221 XX XXX XX XX"
                    value={parentPhone} 
                    onChange={(e) => setParentPhone(e.target.value)} 
                    maxLength={50}
                  />
                </div>
              </div>
            </div>

            {/* Section Notes */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                Informations complémentaires
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes additionnelles</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={4}
                  placeholder="Informations complémentaires, besoins spéciaux, motivations..."
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </div>
            </div>

            {/* Status et sécurité */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {loadingCaptcha ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Protection contre les robots</p>
                  <p>Ce formulaire est protégé par reCAPTCHA pour garantir la sécurité.</p>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
                disabled={!isValid || isPending || loadingCaptcha || !token || !RECAPTCHA_SITE_KEY}
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Soumettre la demande d'admission
                  </div>
                )}
              </button>
            </div>

            {/* Note obligatoire */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


