import './index.css';
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import Keycloak commenté temporairement
// import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './pages/authentification/keycloak.ts';
import App from './App.tsx';
import "./i18n";
import './index.css';
import { AuthProvider } from './pages/authentification/AuthContext';

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
    <App />
  </AuthProvider>
  //  </ReactKeycloakProvider>
);
