import React, { useState } from 'react';
import { importsData, ImportHistory } from './mock-imports';
import { etablissementsData } from '../etablissements/mock-etablissements';
import { 
  FaUpload, 
  FaFileCsv, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaDownload,
  FaHistory 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';

const ImportsPage: React.FC = () => {
  const [etablissements] = useState(etablissementsData);
  const [historique] = useState<ImportHistory[]>(importsData);
  const [filteredImports, setFilteredImports] = useState<ImportHistory[]>(importsData);
  const [activeTab, setActiveTab] = useState('import'); // 'import' or 'history'
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const getStatusIcon = (status: 'succès' | 'échec' | 'en_cours') => {
    switch(status) {
      case 'succès': return <FaCheckCircle className="text-green-500" />;
      case 'échec': return <FaTimesCircle className="text-red-500" />;
      case 'en_cours': return <FaSpinner className="animate-spin text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Supervision des Imports</h1>
        <p className="text-lg text-gray-600 mt-2">
          Gérez et supervisez les imports de données pour vos établissements.
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaUpload className="w-4 h-4" />
            <span>Nouvel Import</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaHistory className="w-4 h-4" />
            <span>Historique</span>
          </button>
        </nav>
      </div>

      {activeTab === 'import' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Lancer un nouvel import</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="etablissement" className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
              <select id="etablissement" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                {etablissements.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Fichier CSV</label>
              <div className="mt-1 flex items-center p-2 border border-gray-300 rounded-md bg-gray-50">
                <Button onClick={() => document.getElementById('file-upload')?.click()} variant="outline" className="flex items-center bg-white">
                  <FaFileCsv className="mr-2"/> Choisir un fichier
                </Button>
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".csv"/>
                {selectedFile && <span className="ml-4 text-gray-600 font-mono text-sm">{selectedFile.name}</span>}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button size="lg">
                <FaUpload className="mr-2"/> Importer
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <select 
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const status = e.target.value;
                if (status === 'all') {
                  setFilteredImports(historique);
                } else {
                  setFilteredImports(historique.filter(imp => imp.statut === status));
                }
              }}
              defaultValue="all"
            >
              <option value="all">Tous les statuts</option>
              <option value="succès">Succès</option>
              <option value="en_cours">En cours</option>
              <option value="échec">Échec</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Historique des Imports</h3>
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Établissement</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Fichier</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-center">Résultat</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredImports.map((imp) => (
                  <tr key={imp.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{new Date(imp.date).toLocaleString('fr-SN')}</td>
                    <td className="p-4 font-medium text-gray-800">{imp.etablissementNom}</td>
                    <td className="p-4 text-gray-700 capitalize">{imp.type.replace('_', ' ')}</td>
                    <td className="p-4 text-gray-700 font-mono">{imp.fichierSource}</td>
                    <td className="p-4 text-center">
                       <Badge 
                        text={imp.statut}
                        icon={getStatusIcon(imp.statut) || undefined}
                        bgColor={imp.statut === 'succès' ? 'bg-green-100' : imp.statut === 'échec' ? 'bg-red-100' : 'bg-blue-100'}
                        color={imp.statut === 'succès' ? 'text-green-800' : imp.statut === 'échec' ? 'text-red-800' : 'text-blue-800'}
                      />
                    </td>
                    <td className="p-4 text-sm text-center">
                       <div>{imp.enregistrementsImportes} importés</div>
                       {imp.erreurs > 0 && <div className="text-red-600">{imp.erreurs} erreurs</div>}
                    </td>
                    <td className="p-4 text-center">
                       {imp.rapportUrl && (
                         <Button variant="ghost" size="sm" title="Télécharger le rapport d'erreurs">
                            <FaDownload />
                        </Button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportsPage;
