import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // ← ajoute useNavigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: login logic
    console.log({ email, password });

    // Simuler la connexion réussie
    // Tu peux ajouter ici une vraie vérification plus tard

    // Rediriger vers le dashboard enseignant
    navigate("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Connexion</h2>

      <div>
        <label className="block mb-1 text-gray-600">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Mot de passe</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
      >
        Se connecter
      </button>
    </form>
  );
};
