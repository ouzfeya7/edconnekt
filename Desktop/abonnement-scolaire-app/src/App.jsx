import { useState } from "react";
import SubscriptionTable from "./SubscriptionTable";
import SubscriptionForm from "./SubscriptionForm";
import AuthForm from './components/AuthForm';

function App() {
  // État initial avec quelques abonnements de test
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedStatus, setSelectedStatus] = useState("tous");

  // État pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false);

  // Fonction pour basculer le statut d'un abonnement
  const toggleStatus = (id) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === "active" ? "inactive" : "active" }
          : sub
      )
    );
  };

  // Fonction pour ajouter un nouvel abonnement
  const addSubscription = (newSubscription) => {
    setSubscriptions((prev) => [...prev, newSubscription]);
  };

  // Fonction pour filtrer les abonnements
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      subscription.firstName.toLowerCase().includes(searchLower) ||
      subscription.lastName.toLowerCase().includes(searchLower) ||
      subscription.class.toLowerCase().includes(searchLower);

    const matchesType =
      selectedType === "tous" || subscription.type === selectedType;
    const matchesStatus =
      selectedStatus === "tous" || subscription.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <AuthForm />
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
            Gestion des Abonnements Scolaires
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base"
          >
            Ajouter un abonnement
          </button>
        </div>

        {/* Filtres de recherche */}
        <div className="mb-4 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
          {/* Barre de recherche */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom ou classe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtre par type */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tous">Tous les types</option>
              <option value="mensuel">Mensuel</option>
              <option value="annuel">Annuel</option>
            </select>
          </div>

          {/* Filtre par statut */}
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tous">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        {/* Indicateur du nombre de résultats */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredSubscriptions.length} abonnement
          {filteredSubscriptions.length !== 1 ? "s" : ""} trouvé
          {filteredSubscriptions.length !== 1 ? "s" : ""}
        </div>

        {showForm && (
          <SubscriptionForm
            addSubscription={addSubscription}
            onClose={() => setShowForm(false)}
          />
        )}

        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onToggleStatus={toggleStatus}
        />
      </div>
    </div>
  );
}

export default App;
