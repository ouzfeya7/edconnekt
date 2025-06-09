import { render, screen, fireEvent } from "@testing-library/react";
import SubscriptionTable from "./SubscriptionTable";

describe("SubscriptionTable Component", () => {
  const mockSubscriptions = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      class: "5ème A",
      type: "mensuel",
      startDate: "2024-03-20",
      status: "active",
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      class: "6ème B",
      type: "annuel",
      startDate: "2024-03-21",
      status: "inactive",
    },
  ];

  const mockOnToggleStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche tous les abonnements", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Vérifier que tous les abonnements sont affichés
    expect(screen.getByText("Jean")).toBeInTheDocument();
    expect(screen.getByText("Dupont")).toBeInTheDocument();
    expect(screen.getByText("5ème A")).toBeInTheDocument();
    expect(screen.getByText("Marie")).toBeInTheDocument();
    expect(screen.getByText("Martin")).toBeInTheDocument();
    expect(screen.getByText("6ème B")).toBeInTheDocument();
  });

  test("affiche correctement les statuts", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText("✅ Actif")).toBeInTheDocument();
    expect(screen.getByText("❌ Inactif")).toBeInTheDocument();
  });

  test("appelle onToggleStatus lors du clic sur le bouton de statut", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Cliquer sur le bouton de statut du premier abonnement
    fireEvent.click(screen.getByText("Résilier"));
    expect(mockOnToggleStatus).toHaveBeenCalledWith(1);

    // Cliquer sur le bouton de statut du deuxième abonnement
    fireEvent.click(screen.getByText("Réactiver"));
    expect(mockOnToggleStatus).toHaveBeenCalledWith(2);
  });

  test("affiche correctement les types d'abonnement", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText("mensuel")).toBeInTheDocument();
    expect(screen.getByText("annuel")).toBeInTheDocument();
  });

  test("gère le cas où il n'y a pas d'abonnements", () => {
    render(
      <SubscriptionTable
        subscriptions={[]}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Vérifier que le tableau est vide mais toujours présent
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("affiche les dates dans le bon format", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText("2024-03-20")).toBeInTheDocument();
    expect(screen.getByText("2024-03-21")).toBeInTheDocument();
  });

  test("affiche les boutons d'action avec les bonnes couleurs", () => {
    render(
      <SubscriptionTable
        subscriptions={mockSubscriptions}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const activeButton = screen.getByText("Résilier");
    const inactiveButton = screen.getByText("Réactiver");

    expect(activeButton).toHaveClass("bg-red-500");
    expect(inactiveButton).toHaveClass("bg-green-500");
  });
});
