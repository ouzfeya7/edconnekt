import { useAuth } from '../authentification/useAuth';
import { useEffect } from 'react';

export const LoginPage = () => {
  const { login } = useAuth();

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Redirection vers la page de connexion...</h1>
      {/* Vous pouvez ajouter un spinner ou un indicateur de chargement ici */}
    </div>
  );
};
