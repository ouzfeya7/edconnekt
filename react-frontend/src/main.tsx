import './index.css';
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import Keycloak commenté temporairement
// import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './pages/authentification/keycloak.ts';
import App from './App.tsx';
import "./i18n";
import i18n from './i18n';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import './index.css';
import { AuthProvider } from './pages/authentification/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { StudentProvider } from './contexts/StudentContext';
import { FilterProvider } from './contexts/FilterContext';
import PaiementPage from './pages/PaiementPage';
import RessourceDetailPage from './pages/RessourceDetailPage';

// Synchronize dayjs locale with i18next
const updateDayjsLocale = (lng: string | undefined) => {
  const dayjsLocale = lng?.split('-')[0] || 'fr'; // 'fr-FR' -> 'fr', default to 'fr'
  dayjs.locale(dayjsLocale);
};

i18n.on('languageChanged', (lng) => {
  updateDayjsLocale(lng);
});

// Initial set
updateDayjsLocale(i18n.language);

createRoot(document.getElementById('root')!).render(
  // Keycloak Provider commenté temporairement
  // <ReactKeycloakProvider
  //   authClient={keycloak}
  //   initOptions={{ onLoad: 'login-required' }}
  //   autoRefreshToken={true}
  //   onTokens={(tokens) => {
  //     console.log('Tokens updated', tokens);
  //   }}
  //   onEvent={(event, error) => {
  //     console.log('Keycloak event', event, error);
  //   }}>
  <AuthProvider>
    <FilterProvider>
      <EventProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </EventProvider>
    </FilterProvider>
  </AuthProvider>
  //  </ReactKeycloakProvider>
);
