import React, { useState } from 'react';

import { Upload, XCircle, FileDown, User, Users, UserCog, Shield, CheckCircle, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { downloadIdentityTemplate } from '../../../utils/downloadTemplate';
import EstablishmentSelector from './EstablishmentSelector';

type Domain = 'student' | 'parent' | 'teacher' | 'admin_staff';

// Champs requis et autorisés par domaine
const requiredHeadersMap: Record<Domain, string[]> = {
  student: ['establishment_id', 'firstname', 'lastname', 'birth_date', 'gender', 'level', 'account_required', 'email', 'phone'],
  parent: ['establishment_id', 'firstname', 'lastname', 'email', 'phone'],
  teacher: ['establishment_id', 'firstname', 'lastname', 'email', 'phone', 'subject', 'hire_date'],
  admin_staff: ['establishment_id', 'firstname', 'lastname', 'email', 'phone', 'position', 'hire_date'],
};
const allowedExtraHeaders: string[] = [];
const allowedHeadersMap: Record<Domain, string[]> = {
  student: [...requiredHeadersMap.student, ...allowedExtraHeaders],
  parent: [...requiredHeadersMap.parent, ...allowedExtraHeaders],
  teacher: [...requiredHeadersMap.teacher, ...allowedExtraHeaders],
  admin_staff: [...requiredHeadersMap.admin_staff, ...allowedExtraHeaders],
};

// removed unused helper readCsvFirstHeaderLine

// removed unused helper validateHeaders

// removed unused helper parseCsv

// removed unused helper validateRows

const Section: React.FC<{ title: string; domain: Domain; }> = ({ title, domain }) => {
  const { handleUpload, isUploading, uploadProgress, currentUploadDomain, canUpload, isAdmin } = useOnboarding();
  const [file, setFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleDownloadServerTemplate = async (format: 'csv' | 'xlsx') => {
    try {
      await downloadIdentityTemplate(domain, format);
    } catch {
      toast.error('Impossible de télécharger le template');
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    noClick: true,
    onDrop: async (acceptedFiles) => {
      const f = acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles[0] : null;
      if (!f) {
        setFile(null);
        setShowSuccess(false);
        return;
      }
      setFile(f);
      setShowSuccess(false);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (isAdmin && !canUpload) {
      toast.error("Sélectionnez d'abord un établissement");
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
          
          {/* Description supprimée pour s'aligner sur l'API */}
          
          {/* Indicateur de statut */}
          {file && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Fichier prêt pour l'import
            </div>
          )}

      {/* Suppression des informations JSON du template pour une UI plus propre */}
        </div>
        
        <div className="shrink-0 flex items-center gap-2">
          <button 
            onClick={() => handleDownloadServerTemplate('csv')} 
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
            title="Télécharger le template depuis l'API (CSV)"
          >
            <FileDown className="w-4 h-4" /> 
            API CSV
          </button>
          <button 
            onClick={() => handleDownloadServerTemplate('xlsx')} 
            className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
            title="Télécharger le template depuis l'API (XLSX)"
          >
            <FileDown className="w-4 h-4" /> 
            API XLSX
          </button>
        </div>
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
              {isDragActive ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier CSV ou Excel'}
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

      {/* Vérification CSV côté front supprimée (UI épurée, on se base sur l'API) */}

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
            disabled={isUploading || !canUpload} 
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isUploading || !canUpload
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Import en cours...
              </div>
            ) : (!canUpload && isAdmin) ? (
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Sélection d'établissement requise
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

        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Sélecteur d'établissement à droite du titre (élargi) */}
          <div className="min-w-[20rem] lg:min-w-[28rem] w-full">
            <EstablishmentSelector />
          </div>
          <div className="flex gap-4 text-sm">
            {stats.totalUploads > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.successfulUploads}</div>
                <div className="text-gray-500">Imports réussis</div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Grille des sections améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Élèves" domain="student" />
        <Section title="Parents" domain="parent" />
        <Section title="Enseignants" domain="teacher" />
        <Section title="Personnel administratif" domain="admin_staff" />
      </div>
    </div>
  );
};

export default CSVUploader;
