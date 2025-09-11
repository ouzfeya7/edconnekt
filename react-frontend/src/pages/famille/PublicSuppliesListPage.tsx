import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { publicationApi } from '../../api/supplies-service/client';
import { Toaster, toast } from 'react-hot-toast';
import { 
  List, 
  Search, 
  Download, 
  FileText, 
  Package,
  Eye,
  AlertTriangle
} from 'lucide-react';

const PublicSuppliesListPage: React.FC = () => {
  const { t } = useTranslation();
  const [campaignId, setCampaignId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [items, setItems] = useState<{ id: string; label: string; quantity: number; unit?: string | null }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLoad = async () => {
    if (!campaignId || !classId) {
      toast.error(t('Veuillez saisir la campagne et la classe', 'Veuillez saisir la campagne et la classe'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await publicationApi.publicListApiCampaignsCampaignIdPublicListGet(campaignId, classId);
      setItems(res.data.items ?? []);
      toast.success(t('Liste chargée avec succès', 'Liste chargée avec succès'));
    } catch {
      const errorMsg = t('Erreur de chargement', 'Erreur de chargement');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = async () => {
    if (!campaignId || !classId) {
      toast.error(t('Veuillez saisir la campagne et la classe', 'Veuillez saisir la campagne et la classe'));
      return;
    }

    try {
      await publicationApi.publicListPdfApiCampaignsCampaignIdPublicListPdfGet(campaignId, classId);
      toast.success(t('PDF généré avec succès', 'PDF généré avec succès'));
    } catch {
      toast.error(t('Erreur lors de la génération du PDF', 'Erreur lors de la génération du PDF'));
    }
  };

  const canQuery = Boolean(campaignId && classId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Toaster position="top-right" />
      
      {/* En-tête moderne */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <List className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Liste publique des fournitures', 'Fournitures Publiques')}</h1>
              <p className="text-gray-600">{t('Consultez et téléchargez la liste des fournitures', 'Consultez et téléchargez la liste des fournitures')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Section de configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Configuration', 'Configuration')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('ID Campagne', 'ID Campagne')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de la campagne', 'Saisir l\'ID de la campagne')} 
                value={campaignId} 
                onChange={(e) => setCampaignId(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('ID Classe', 'ID Classe')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de la classe', 'Saisir l\'ID de la classe')} 
                value={classId} 
                onChange={(e) => setClassId(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={!canQuery || loading}
                onClick={handleLoad}
              >
                <Eye className="h-4 w-4" />
                {loading ? t('Chargement...', 'Chargement...') : t('Charger', 'Charger')}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={!canQuery}
                onClick={handlePdf}
              >
                <Download className="h-4 w-4" />
                {t('PDF', 'Télécharger PDF')}
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'état */}
        {loading && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              <span>{t('Chargement de la liste publique...', 'Chargement de la liste publique...')}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Liste des fournitures */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('Liste des fournitures', 'Liste des fournitures')}</h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {items.length} {t('articles', 'articles')}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-500 mb-2">{t('Aucune fourniture', 'Aucune fourniture')}</p>
                <p className="text-gray-400">{t('Aucune fourniture trouvée pour cette configuration', 'Aucune fourniture trouvée pour cette configuration')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it) => (
                  <div key={it.id} className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{it.label}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{it.quantity}</span>
                          {it.unit && <span className="text-gray-500">{it.unit}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {t('Total:', 'Total:')} <span className="font-medium">{items.length} {t('articles', 'articles')}</span>
                  </div>
                  <button
                    onClick={handlePdf}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    {t('Télécharger en PDF', 'Télécharger en PDF')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSuppliesListPage;


