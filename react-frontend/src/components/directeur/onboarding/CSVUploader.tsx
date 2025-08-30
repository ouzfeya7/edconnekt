import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, XCircle, FileDown } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../../pages/authentification/useAuth';
import { useEstablishments } from '../../../hooks/useEstablishments';

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
    }
    if (domain === 'teacher' || domain === 'admin_staff') {
      const hd = cells[indexOf('hire_date')]?.trim?.() ?? '';
      if (hd && !dateRe.test(hd)) push(lineNum, 'hire_date doit être au format YYYY-MM-DD');
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
  const { t } = useTranslation();
  const { handleUpload, isUploading } = useOnboarding();
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
    const success = await handleUpload(file);
    if (success) {
      setFile(null);
      setShowSuccess(true);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-md font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 whitespace-normal break-all leading-5">
            {description}
          </p>
        </div>
        <button onClick={handleDownloadTemplate} className="shrink-0 flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 text-sm">
          <FileDown className="w-4 h-4" /> {t('download_template', 'Télécharger le template')}
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 mb-2">
          {t('drag_drop_csv', 'Glissez-déposez votre fichier CSV ici')}
        </p>
        <input {...getInputProps()} />
        <button type="button" onClick={open} className="bg-blue-500 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm">
          {t('select_file', 'Sélectionner un fichier')}
        </button>
      </div>

      {headerError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 whitespace-pre-wrap break-all">
          {headerError}
              </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 max-h-40 overflow-auto space-y-1">
          <div className="font-semibold">Erreurs détectées ({validationErrors.length})</div>
          <ul className="list-disc pl-5">
            {validationErrors.map((e, i) => (
              <li key={i} className="break-all">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {file && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="text-sm">
            <div className="font-medium text-gray-900 break-all">{file.name}</div>
            <div className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
          <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
              <XCircle className="w-5 h-5" />
            </button>
        </div>
      )}

      {file && (
        <button onClick={onUploadClick} disabled={isUploading} className={`w-full py-2 rounded text-white ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {isUploading ? t('importing', 'Import en cours...') : t('import_users', 'Importer les utilisateurs')}
        </button>
      )}

      {showSuccess && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              {t('import_success', 'Import réussi ! Les invitations ont été envoyées.')}
        </div>
      )}
    </div>
  );
};

const CSVUploader: React.FC = () => {
  const { roles } = useAuth();
  const isAdmin = roles.includes('administrateur');
  const { data: establishments } = useEstablishments({ limit: 100, offset: 0 });
  const [adminEtabId, setAdminEtabId] = useState<string>('');
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{t('upload_validation', 'Upload & Validation')}</h2>
      {isAdmin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('target_establishment', 'Établissement cible')}</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            value={adminEtabId}
            onChange={(e) => {
              const selected = e.target.value;
              setAdminEtabId(selected);
              if (selected) localStorage.setItem('current-etab-id', selected);
            }}
          >
            <option value="">{t('select', 'Sélectionner…')}</option>
            {(establishments ?? []).map((etab) => (
              <option key={etab.id} value={etab.id}>{etab.nom}</option>
            ))}
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Élèves" domain="student" description="Fichier students.csv: establishment_id;firstname;lastname;birth_date;gender;level;account_required;email;phone" />
        <Section title="Parents" domain="parent" description="Fichier parents.csv: establishment_id;firstname;lastname;email;phone" />
        <Section title="Enseignants" domain="teacher" description="Fichier teachers.csv: establishment_id;firstname;lastname;email;phone;subject;hire_date" />
        <Section title="Personnel administratif" domain="admin_staff" description="Fichier admin_staff.csv: establishment_id;firstname;lastname;email;phone;position;hire_date" />
      </div>
    </div>
  );
};

export default CSVUploader;
