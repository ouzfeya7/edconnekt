const SubscriptionTable = ({ subscriptions, onToggleStatus }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Prénom
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Classe
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date de début
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr
                key={subscription.id}
                className="hover:bg-gray-50 transition-colors block md:table-row"
              >
                <td className="px-4 py-3 text-sm text-gray-900 block md:table-cell">
                  <span className="md:hidden font-semibold">Prénom: </span>
                  {subscription.firstName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 block md:table-cell">
                  <span className="md:hidden font-semibold">Nom: </span>
                  {subscription.lastName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 block md:table-cell">
                  <span className="md:hidden font-semibold">Classe: </span>
                  {subscription.class}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 capitalize block md:table-cell">
                  <span className="md:hidden font-semibold">Type: </span>
                  {subscription.type}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 block md:table-cell">
                  <span className="md:hidden font-semibold">
                    Date de début:{" "}
                  </span>
                  {subscription.startDate}
                </td>
                <td className="px-4 py-3 text-sm block md:table-cell">
                  <span className="md:hidden font-semibold">Statut: </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.status === "active"
                      ? "✅ Actif"
                      : "❌ Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm block md:table-cell">
                  <span className="md:hidden font-semibold">Actions: </span>
                  <button
                    onClick={() => onToggleStatus(subscription.id)}
                    className={`w-full md:w-auto px-3 py-1 rounded-md text-white text-sm font-medium transition-colors
                      ${
                        subscription.status === "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    {subscription.status === "active"
                      ? "Résilier"
                      : "Réactiver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;
