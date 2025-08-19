import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Upload, Building } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

const SchoolSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  const { schoolSettings, updateSchoolSettings, uploadLogo, isLoading, isSaving } = useSettings();
  
  const [formData, setFormData] = useState({
    nom: schoolSettings.nom,
    adresse: schoolSettings.adresse,
    telephone: schoolSettings.telephone,
    email: schoolSettings.email,
    siteWeb: schoolSettings.siteWeb || '',
    directeur: schoolSettings.directeur,
    anneeScolaire: schoolSettings.anneeScolaire,
    fuseauHoraire: schoolSettings.fuseauHoraire || 'Europe/Paris',
    langue: schoolSettings.langue || 'fr'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(schoolSettings.logo);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update school settings
    await updateSchoolSettings(formData);
    
    // Upload logo if selected
    if (logoFile) {
      await uploadLogo(logoFile);
    }
  };

  const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];

  const timezones = [
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Building className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">
          {t('school_settings')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('school_logo')}
          </h3>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo" 
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('upload_logo')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('logo_requirements')}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('school_name')} *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('director')}
            </label>
            <input
              type="text"
              value={formData.directeur}
              onChange={(e) => handleInputChange('directeur', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('address')} *
            </label>
            <textarea
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone')}
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('website')}
            </label>
            <input
              type="url"
              value={formData.siteWeb}
              onChange={(e) => handleInputChange('siteWeb', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('academic_year')} *
            </label>
            <input
              type="text"
              value={formData.anneeScolaire}
              onChange={(e) => handleInputChange('anneeScolaire', e.target.value)}
              placeholder="2023-2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('timezone')}
            </label>
            <select
              value={formData.fuseauHoraire}
              onChange={(e) => handleInputChange('fuseauHoraire', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('language')}
            </label>
            <select
              value={formData.langue}
              onChange={(e) => handleInputChange('langue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? t('saving') : t('save_settings')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolSettingsForm;
