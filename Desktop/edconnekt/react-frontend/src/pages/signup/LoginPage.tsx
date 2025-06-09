import { useKeycloak } from "@react-keycloak/web";

export const LoginPage = () => {
  const { keycloak } = useKeycloak();

  const login = () => {
    keycloak.login();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <button
        onClick={login}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Se connecter
      </button>
    </div>
  );
};
