import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubscriptionForm from "./SubscriptionForm";

describe("SubscriptionForm Component", () => {
  const mockAddSubscription = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche tous les champs du formulaire", () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Classe")).toBeInTheDocument();
    expect(screen.getByLabelText("Date de début")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensuel")).toBeInTheDocument();
    expect(screen.getByLabelText("Annuel")).toBeInTheDocument();
  });

  test("valide les champs vides", async () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    // Tenter de soumettre le formulaire vide
    fireEvent.click(screen.getByText("Enregistrer"));

    // Vérifier que l'alerte est affichée
    expect(window.alert).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs obligatoires"
    );
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  test("valide les espaces dans les champs", async () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    // Remplir les champs avec des espaces
    await userEvent.type(screen.getByLabelText("Prénom"), "   ");
    await userEvent.type(screen.getByLabelText("Nom"), "   ");
    await userEvent.type(screen.getByLabelText("Classe"), "   ");
    await userEvent.type(screen.getByLabelText("Date de début"), "2024-03-20");
    fireEvent.click(screen.getByLabelText("Mensuel"));

    // Tenter de soumettre
    fireEvent.click(screen.getByText("Enregistrer"));

    // Vérifier que l'alerte est affichée
    expect(window.alert).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs obligatoires"
    );
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  test("soumet le formulaire avec des données valides", async () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
    await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
    await userEvent.type(screen.getByLabelText("Classe"), "5ème A");
    await userEvent.type(screen.getByLabelText("Date de début"), "2024-03-20");
    fireEvent.click(screen.getByLabelText("Mensuel"));

    // Soumettre le formulaire
    fireEvent.click(screen.getByText("Enregistrer"));

    // Vérifier que addSubscription est appelé avec les bonnes données
    expect(mockAddSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Jean",
        lastName: "Dupont",
        class: "5ème A",
        type: "mensuel",
        startDate: "2024-03-20",
        status: "active",
      })
    );

    // Vérifier que onClose est appelé
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("ferme le formulaire avec le bouton Annuler", () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Annuler"));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  test("ferme le formulaire avec le bouton de fermeture", () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("✕"));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAddSubscription).not.toHaveBeenCalled();
  });

  test("gère correctement le changement de type d'abonnement", async () => {
    render(
      <SubscriptionForm
        addSubscription={mockAddSubscription}
        onClose={mockOnClose}
      />
    );

    // Vérifier que mensuel est sélectionné par défaut
    expect(screen.getByLabelText("Mensuel")).toBeChecked();
    expect(screen.getByLabelText("Annuel")).not.toBeChecked();

    // Changer pour annuel
    fireEvent.click(screen.getByLabelText("Annuel"));

    // Vérifier que annuel est maintenant sélectionné
    expect(screen.getByLabelText("Mensuel")).not.toBeChecked();
    expect(screen.getByLabelText("Annuel")).toBeChecked();
  });
});
