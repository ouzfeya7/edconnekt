import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, XCircle } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingSummary from './OnboardingSummary';
import ValidationErrors from './ValidationErrors';

const CSVUploader: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedFile,
    setSelectedFile,
    readCsvFile,
    validationErrors,
    isUploading,
    uploadStatus,
    handleUpload
  } = useOnboarding();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      readCsvFile(file);
    } else {
      alert(t('invalid_file_type', 'Veuillez sélectionner un fichier CSV valide'));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t('import_csv', 'Import CSV')}
      </h2>
      
      {/* Zone de drop */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          {t('drag_drop_csv', 'Glissez-déposez votre fichier CSV ici')}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {t('or_click_to_select', 'ou cliquez pour sélectionner')}
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
        >
          {t('select_file', 'Sélectionner un fichier')}
        </label>
      </div>

      {/* Fichier sélectionné */}
      {selectedFile && (
        <div className="mb-6">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Résumé et erreurs */}
      <OnboardingSummary />
      <ValidationErrors />

      {/* Bouton d'import */}
      {selectedFile && (isUploading || validationErrors.length === 0) && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-3 px-4 rounded-lg transition-colors ${
            isUploading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('importing', 'Import en cours...')}
            </div>
          ) : (
            t('import_users', 'Importer les utilisateurs')
          )}
        </button>
      )}

      {/* Message de succès/erreur */}
      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-800">
              {t('import_success', 'Import réussi ! Les invitations ont été envoyées.')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
