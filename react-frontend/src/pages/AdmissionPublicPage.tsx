import { useEffect, useMemo, useState } from 'react';
import { useCreateAdmission } from '../hooks/useAdmissionMutations';
import type { AdmissionCreateRequest } from '../api/admission-service/api';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.svg';

// reCAPTCHA v3 site key via env (publique côté frontend)
const RECAPTCHA_SITE_KEY = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function AdmissionPublicPage() {
  const [loadingCaptcha, setLoadingCaptcha] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // Champs du formulaire
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

  // Charger le script reCAPTCHA v3
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

  // Obtenir un token sur readiness
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
        // Ignore, on utilisera le token existant s'il est présent
      }
    }
    if (!freshToken) {
      toast.error("Captcha indisponible. Veuillez réessayer.");
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
      // Optionnel: afficher un identifiant si le backend le renvoie
      if (res && typeof res.id === 'number') {
        toast.success(`Identifiant de suivi: ${res.id}`);
      }
      // Reset formulaire basique
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="EdConnekt" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">EdConnekt</h1>
                <p className="text-xs text-gray-500">Plateforme éducative</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Formulaire public
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Demande d'admission</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inscrivez votre enfant dans notre établissement en remplissant ce formulaire sécurisé. 
              Toutes les informations sont confidentielles.
            </p>
          </div>

          {/* Étapes */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">1</div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900 hidden sm:inline">Informations élève</span>
                <span className="ml-1 text-xs font-medium text-gray-900 sm:hidden">Élève</span>
              </div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-16 bg-gray-200 rounded"></div>
              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">2</div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900 hidden sm:inline">Contact parent</span>
                <span className="ml-1 text-xs font-medium text-gray-900 sm:hidden">Parent</span>
              </div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-16 bg-gray-200 rounded"></div>
              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">3</div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900 hidden sm:inline">Validation</span>
                <span className="ml-1 text-xs font-medium text-gray-900 sm:hidden">Envoi</span>
              </div>
            </div>
          </div>

          {/* Formulaire principal */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 xl:p-12">
            <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
              {/* Section Élève */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">1</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informations de l'élève</h2>
                    <p className="text-gray-600">Renseignez les informations de l'enfant à inscrire</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Nom complet de l'élève <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Prénom et nom de famille"
                      value={studentName} 
                      onChange={(e) => setStudentName(e.target.value)} 
                      maxLength={255}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={studentBirthdate} 
                      onChange={(e) => setStudentBirthdate(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Classe demandée <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Ex: 6ème A, CP, Terminale S..."
                      value={classRequested} 
                      onChange={(e) => setClassRequested(e.target.value)} 
                      maxLength={100}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Email élève</label>
                    <input 
                      type="email"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="email@exemple.com"
                      value={studentEmail} 
                      onChange={(e) => setStudentEmail(e.target.value)} 
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Téléphone élève</label>
                    <input 
                      type="tel"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="+221 XX XXX XX XX"
                      value={studentPhone} 
                      onChange={(e) => setStudentPhone(e.target.value)} 
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Section Parent */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold">2</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact du parent/tuteur</h2>
                    <p className="text-gray-600">Coordonnées de la personne responsable</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Nom du parent/tuteur <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="Prénom et nom du parent ou tuteur légal"
                      value={parentName} 
                      onChange={(e) => setParentName(e.target.value)} 
                      maxLength={255}
                      required 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Contact principal <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="Email ou numéro de téléphone principal"
                      value={parentContact} 
                      onChange={(e) => setParentContact(e.target.value)} 
                      maxLength={255}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Email parent</label>
                    <input 
                      type="email"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="parent@exemple.com"
                      value={parentEmail} 
                      onChange={(e) => setParentEmail(e.target.value)} 
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Téléphone parent</label>
                    <input 
                      type="tel"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="+221 XX XXX XX XX"
                      value={parentPhone} 
                      onChange={(e) => setParentPhone(e.target.value)} 
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Section Notes */}
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">3</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informations complémentaires</h2>
                    <p className="text-gray-600">Détails supplémentaires (optionnel)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Notes additionnelles</label>
                  <textarea 
                    className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    rows={4}
                    placeholder="Informations complémentaires, besoins spéciaux, motivations, questions..."
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                  />
                </div>
              </div>

              {/* Sécurité */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {loadingCaptcha ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    ) : (
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Formulaire sécurisé</h3>
                    <p className="text-sm text-gray-600">
                      Ce formulaire est protégé par reCAPTCHA v3 et nos données sont chiffrées pour garantir la confidentialité de vos informations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-6 sm:pt-8">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  disabled={!isValid || isPending || loadingCaptcha || !token || !RECAPTCHA_SITE_KEY}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                      <span className="text-base sm:text-lg">Envoi en cours...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-base sm:text-lg">
                        <span className="hidden sm:inline">Soumettre la demande d'admission</span>
                        <span className="sm:hidden">Soumettre la demande</span>
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* Mentions */}
              <div className="text-center space-y-3 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Les champs marqués d'un <span className="text-red-500 font-medium">*</span> sont obligatoires
                </p>
                <p className="text-xs text-gray-400">
                  En soumettant ce formulaire, vous acceptez que vos données soient traitées dans le cadre de votre demande d'admission.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


