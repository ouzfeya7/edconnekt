import React, { useState } from 'react';

import { Upload, XCircle, FileDown, User, Users, UserCog, Shield, CheckCircle, AlertTriangle, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';


type Domain = 'student' | 'parent' | 'teacher' | 'admin_staff';

// Champs requis et autorisés par domaine
const requiredHeadersMap: Record<Domain, string[]> = {
  student: ['establishment_id', 'firstname', 'lastname', 'birth_date', 'gender', 'level', 'account_required'],
  parent: ['establishment_id', 'firstname', 'lastname'],
  teacher: ['establishment_id', 'firstname', 'lastname', 'subject', 'hire_date'],
  admin_staff: ['establishment_id', 'firstname', 'lastname', 'position', 'hire_date'],
};
const allowedExtraHeaders = ['email', 'phone'];
const allowedHeadersMap: Record<Domain, string[]> = {
  student: [...requiredHeadersMap.student, ...allowedExtraHeaders],
  parent: [...requiredHeadersMap.parent, ...allowedExtraHeaders],
  teacher: [...requiredHeadersMap.teacher, ...allowedExtraHeaders],
  admin_staff: [...requiredHeadersMap.admin_staff, ...allowedExtraHeaders],
};

async function readCsvFirstHeaderLine(file: File): Promise<string[] | null> {
  try {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return null;
    const headerLine = lines[0];
    // Detect delimiter by count; prefer ';' if tie (API examples use ';')
    const semi = (headerLine.match(/;/g) || []).length;
    const comma = (headerLine.match(/,/g) || []).length;
    const delimiter = semi >= comma ? ';' : ',';
    return headerLine
      .split(delimiter)
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
  } catch {
    return null;
  }
}

function validateHeaders(actual: string[] | null, required: string[], allowed: string[]): { ok: boolean; missing: string[]; unknown: string[] } {
  if (!actual) return { ok: false, missing: required, unknown: [] };
  const norm = (arr: string[]) => arr.map((s) => s.trim().toLowerCase());
  const act = norm(actual);
  const req = norm(required);
  const all = norm(allowed);
  const missing = req.filter((e) => !act.includes(e));
  const unknown = act.filter((a) => !all.includes(a));
  return { ok: missing.length === 0 && unknown.length === 0, missing, unknown };
}

function parseCsv(fileText: string): { headers: string[]; rows: string[][]; delimiter: string } | null {
  const lines = fileText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return null;
  const headerLine = lines[0];
  const semi = (headerLine.match(/;/g) || []).length;
  const comma = (headerLine.match(/,/g) || []).length;
  const delimiter = semi >= comma ? ';' : ',';
  const headers = headerLine.split(delimiter).map((h) => h.trim());
  const rows = lines.slice(1).map((l) => l.split(delimiter));
  return { headers, rows, delimiter };
}

function validateRows(fileText: string, domain: Domain): string[] {
  const parsed = parseCsv(fileText);
  if (!parsed) return ['Fichier vide ou illisible.'];
  const headerLower = parsed.headers.map((h) => h.trim().toLowerCase());
  const indexOf = (name: string) => headerLower.indexOf(name);

  const required = requiredHeadersMap[domain];
  const errors: string[] = [];
  const push = (line: number, message: string) => errors.push(`Ligne ${line}: ${message}`);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const boolValues = new Set(['true', 'false', '1', '0', 'yes', 'no']);

  parsed.rows.forEach((cells, idx) => {
    const lineNum = idx + 2; // +1 header, +1-based
    // Requis non vides
    required.forEach((col) => {
      const i = indexOf(col);
      const v = i >= 0 ? (cells[i]?.trim?.() ?? '') : '';
      if (!v) push(lineNum, `Champ requis manquant: ${col}`);
    });

    // Contrôles spécifiques
    if (domain === 'student') {
      const bd = cells[indexOf('birth_date')]?.trim?.() ?? '';
      const g = cells[indexOf('gender')]?.trim?.().toLowerCase() ?? '';
      const ar = cells[indexOf('account_required')]?.trim?.().toLowerCase() ?? '';
      if (bd && !dateRe.test(bd)) push(lineNum, 'birth_date doit être au format YYYY-MM-DD');
      if (g && !['m', 'f', 'male', 'female'].includes(g)) push(lineNum, "gender doit être 'M'/'F' ou 'male'/'female'");
      if (ar && !boolValues.has(ar)) push(lineNum, "account_required doit être l'un de: true/false/1/0/yes/no");
      // Si un compte doit être créé, l'email est requis pour l'invitation Keycloak
      const emailVal = cells[indexOf('email')]?.trim?.() ?? '';
      const requiresAccount = ['true', '1', 'yes'].includes(ar);
      if (requiresAccount && !emailVal) push(lineNum, "email requis lorsque account_required est à 'true'");
      if (requiresAccount && emailVal && !emailRe.test(emailVal)) push(lineNum, 'email invalide');
    }
    if (domain === 'teacher' || domain === 'admin_staff') {
      const hd = cells[indexOf('hire_date')]?.trim?.() ?? '';
      if (hd && !dateRe.test(hd)) push(lineNum, 'hire_date doit être au format YYYY-MM-DD');
      // Email requis pour l'envoi d'invitations Keycloak
      const emailVal = cells[indexOf('email')]?.trim?.() ?? '';
      if (!emailVal) push(lineNum, 'email requis');
      if (emailVal && !emailRe.test(emailVal)) push(lineNum, 'email invalide');
    }
    if (domain === 'parent') {
      // Email requis pour l'envoi d'invitations Keycloak
      const emailVal = cells[indexOf('email')]?.trim?.() ?? '';
      if (!emailVal) push(lineNum, 'email requis');
      if (emailVal && !emailRe.test(emailVal)) push(lineNum, 'email invalide');
    }

    // Contrôles génériques optionnels
    const email = cells[indexOf('email')]?.trim?.() ?? '';
    const phone = cells[indexOf('phone')]?.trim?.() ?? '';
    if (email && !emailRe.test(email)) push(lineNum, 'email invalide');
    if (phone && !/^[+]?[^A-Za-z]{7,}$/.test(phone)) push(lineNum, 'phone invalide');
  });

  return errors;
}

const Section: React.FC<{ title: string; domain: Domain; description: string; }> = ({ title, domain, description }) => {
  const { handleUpload, isUploading, uploadProgress, currentUploadDomain } = useOnboarding();
  const [file, setFile] = useState<File | null>(null);
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv'] },
    multiple: false,
    noClick: true,
    onDrop: async (acceptedFiles) => {
      const f = acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles[0] : null;
      if (!f) {
        setFile(null);
        setHeaderError(null);
        setValidationErrors([]);
        setShowSuccess(false);
        return;
      }
      const actualHeaders = await readCsvFirstHeaderLine(f);
      const { ok, missing, unknown } = validateHeaders(actualHeaders, requiredHeadersMap[domain], allowedHeadersMap[domain]);
      if (!ok) {
        setFile(null);
        setHeaderError(`En-têtes invalides. Manquants: ${missing.join(', ')}${unknown.length ? ` | Colonnes inconnues: ${unknown.join(', ')}` : ''}`);
        toast.error('Format CSV invalide. Vérifiez les en-têtes.');
        return;
      }
      // Validation des lignes
      const text = await f.text();
      const errs = validateRows(text, domain);
      if (errs.length > 0) {
        setFile(null);
        setHeaderError(null);
        setValidationErrors(errs);
        toast.error('Erreurs détectées dans le fichier. Corrigez puis réessayez.');
        return;
      }
      setHeaderError(null);
      setValidationErrors([]);
      setFile(f);
      setShowSuccess(false);
    },
  });

  const handleDownloadTemplate = async () => {
    try {
      const delimiter = ';';
      const headers = allowedHeadersMap[domain];
      const headerLine = headers.join(delimiter);
      // Exemple de ligne selon le domaine
      const sampleByDomain: Record<Domain, string[]> = {
        student: ['ETAB_ID', 'Jean', 'Dupont', '2012-05-10', 'M', 'college', 'true', 'jean.dupont@example.com', '+221700000000'],
        parent: ['ETAB_ID', 'Awa', 'Diop', 'awa.diop@example.com', '+221700000001'],
        teacher: ['ETAB_ID', 'Mamadou', 'Fall', 'm.fall@example.com', '+221700000002', 'Math', '2024-09-01'],
        admin_staff: ['ETAB_ID', 'Fatou', 'Ndiaye', 'f.ndiaye@example.com', '+221700000003', 'Secrétaire', '2024-09-01'],
      };
      // Réordonner l'exemple pour qu'il corresponde aux headers réels
      const sampleMap: Record<string, string> = {};
      const sample = sampleByDomain[domain];
      // Construire un mapping simple basé sur un ordre connu
      if (domain === 'student') {
        const keys = ['establishment_id','firstname','lastname','birth_date','gender','level','account_required','email','phone'];
        keys.forEach((k, i) => { sampleMap[k] = sample[i] ?? ''; });
      } else if (domain === 'parent') {
        const keys = ['establishment_id','firstname','lastname','email','phone'];
        keys.forEach((k, i) => { sampleMap[k] = sample[i] ?? ''; });
      } else if (domain === 'teacher') {
        const keys = ['establishment_id','firstname','lastname','email','phone','subject','hire_date'];
        keys.forEach((k, i) => { sampleMap[k] = sample[i] ?? ''; });
      } else {
        const keys = ['establishment_id','firstname','lastname','email','phone','position','hire_date'];
        keys.forEach((k, i) => { sampleMap[k] = sample[i] ?? ''; });
      }
      const sampleLine = headers.map(h => (sampleMap[h] ?? '')).join(delimiter);
      const csv = `${headerLine}\n${sampleLine}\n`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${domain}_template.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Impossible de générer le template');
    }
  };

  const onUploadClick = async () => {
    if (!file) return;
    // Re-validate at submit time as a safeguard
    const actualHeaders = await readCsvFirstHeaderLine(file);
    const { ok: headersOk, missing, unknown } = validateHeaders(actualHeaders, requiredHeadersMap[domain], allowedHeadersMap[domain]);
    if (!headersOk) {
      toast.error(`Format CSV invalide. Manquants: ${missing.join(', ')}${unknown.length ? ` | Colonnes inconnues: ${unknown.join(', ')}` : ''}`);
      return;
    }
    const text = await file.text();
    const errs = validateRows(text, domain);
    if (errs.length > 0) {
      setValidationErrors(errs);
      toast.error('Erreurs détectées dans le fichier. Corrigez puis réessayez.');
      return;
    }
    const success = await handleUpload(file, domain);
    if (success) {
      setFile(null);
      setShowSuccess(true);
    }
  };

  // Icône selon le domaine
  const getDomainIcon = () => {
    switch (domain) {
      case 'student': return <User className="w-5 h-5 text-blue-600" />;
      case 'parent': return <Users className="w-5 h-5 text-green-600" />;
      case 'teacher': return <UserCog className="w-5 h-5 text-purple-600" />;
      case 'admin_staff': return <Shield className="w-5 h-5 text-orange-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  // Nom du domaine en français
  const getDomainName = () => {
    switch (domain) {
      case 'student': return 'élèves';
      case 'parent': return 'parents';
      case 'teacher': return 'enseignants';
      case 'admin_staff': return 'utilisateurs';
      default: return 'utilisateurs';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header de section amélioré */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getDomainIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {/* Indicateur de statut */}
          {file && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Fichier prêt pour l'import
            </div>
          )}
        </div>
        
        <button 
          onClick={handleDownloadTemplate} 
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          <FileDown className="w-4 h-4" /> 
          Template
        </button>
      </div>

      {/* Zone de drop améliorée */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : file 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        {!file ? (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier CSV'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour sélectionner un fichier
            </p>
            <button 
              type="button" 
              onClick={open} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sélectionner un fichier
            </button>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-700 mb-2">Fichier sélectionné !</p>
            <p className="text-sm text-green-600">{file.name}</p>
          </div>
        )}
        <input {...getInputProps()} />
      </div>

      {/* Gestion des erreurs améliorée */}
      {headerError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <div className="font-medium mb-1">Erreur de format CSV</div>
              <div className="whitespace-pre-wrap break-words">{headerError}</div>
            </div>
          </div>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <div className="font-medium">Erreurs de validation détectées</div>
              <div className="text-red-600">({validationErrors.length} erreur(s))</div>
            </div>
          </div>
          
          <div className="max-h-48 overflow-auto space-y-2">
            {validationErrors.map((error, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 font-mono text-xs">L{Math.floor(index / 10) + 2}</span>
                <span className="text-red-700">{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions améliorées */}
      {file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB • 
                  {domain === 'student' ? ' Données élèves' : 
                   domain === 'parent' ? ' Données parents' :
                   domain === 'teacher' ? ' Données enseignants' : ' Données personnel'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="text-red-500 hover:text-red-700 p-1 rounded"
              title="Supprimer le fichier"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de progression si upload en cours */}
          {isUploading && currentUploadDomain === domain && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button 
            onClick={onUploadClick} 
            disabled={isUploading} 
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Import en cours...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Importer les {getDomainName()}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Message de succès amélioré */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div className="text-sm text-green-800">
              <div className="font-medium">Import réussi !</div>
              <div>Les invitations ont été envoyées aux utilisateurs.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CSVUploader: React.FC = () => {
  const { getUploadStats } = useOnboarding();
  
  const stats = getUploadStats();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header amélioré avec statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upload & Validation
          </h2>
          <p className="text-gray-600 mt-1">
            Importez des lots d'identités pour automatiser l'onboarding des utilisateurs
          </p>
        </div>
        
        {/* Statistiques rapides */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-gray-500">Types d'utilisateurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-gray-500">Validation automatique</div>
          </div>
          {stats.totalUploads > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.successfulUploads}</div>
              <div className="text-gray-500">Imports réussis</div>
            </div>
          )}
        </div>
      </div>



      {/* Grille des sections améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Élèves" domain="student" description="Fichier students.csv: establishment_id;firstname;lastname;birth_date;gender;level;account_required;email;phone" />
        <Section title="Parents" domain="parent" description="Fichier parents.csv: establishment_id;firstname;lastname;email;phone" />
        <Section title="Enseignants" domain="teacher" description="Fichier teachers.csv: establishment_id;firstname;lastname;email;phone;subject;hire_date" />
        <Section title="Personnel administratif" domain="admin_staff" description="Fichier admin_staff.csv: establishment_id;firstname;lastname;email;phone;position;hire_date" />
      </div>
    </div>
  );
};

export default CSVUploader;
