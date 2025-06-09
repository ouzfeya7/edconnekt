import { useState } from "react";

const SubscriptionForm = ({ addSubscription, onClose }) => {
  // État initial du formulaire
  const initialState = {
    firstName: "",
    lastName: "",
    class: "",
    type: "mensuel",
    startDate: "",
  };

  const [formData, setFormData] = useState(initialState);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission du formulaire avec validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des champs vides
    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => value.trim() === "")
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Ajout de l'abonnement
    addSubscription({
      ...formData,
      id: Date.now(),
      status: "active",
    });

    // Réinitialisation du formulaire
    setFormData(initialState);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-2 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Nouvel Abonnement
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          {/* Type d'abonnement */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'abonnement
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="mensuel"
                  checked={formData.type === "mensuel"}
                  onChange={handleChange}
                  className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-base">Mensuel</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="annuel"
                  checked={formData.type === "annuel"}
                  onChange={handleChange}
                  className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-base">Annuel</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
