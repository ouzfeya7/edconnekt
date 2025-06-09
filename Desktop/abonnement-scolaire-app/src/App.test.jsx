import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Fonction utilitaire pour créer un abonnement de test
const createTestSubscription = (overrides = {}) => ({
  id: Date.now(),
  firstName: "John",
  lastName: "Doe",
  class: "6ème A",
  type: "mensuel",
  startDate: "2024-03-20",
  status: "active",
  ...overrides,
});

describe("App Component", () => {
  // Test de l'ajout d'abonnements
  describe("Ajout d'abonnements", () => {
    test("ajoute un nouvel abonnement avec succès", async () => {
      render(<App />);

      // Ouvrir le formulaire
      const addButton = screen.getByText("Ajouter un abonnement");
      fireEvent.click(addButton);

      // Remplir le formulaire
      await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
      await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
      await userEvent.type(screen.getByLabelText("Classe"), "5ème B");
      await userEvent.type(
        screen.getByLabelText("Date de début"),
        "2024-03-20"
      );
      fireEvent.click(screen.getByLabelText("Mensuel"));

      // Soumettre le formulaire
      fireEvent.click(screen.getByText("Enregistrer"));

      // Vérifier que l'abonnement est ajouté
      expect(screen.getByText("Jean")).toBeInTheDocument();
      expect(screen.getByText("Dupont")).toBeInTheDocument();
      expect(screen.getByText("5ème B")).toBeInTheDocument();
    });

    test("gère les champs longs correctement", async () => {
      render(<App />);

      fireEvent.click(screen.getByText("Ajouter un abonnement"));

      const longName = "Jean".repeat(20); // 80 caractères
      await userEvent.type(screen.getByLabelText("Prénom"), longName);
      await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
      await userEvent.type(screen.getByLabelText("Classe"), "5ème B");
      await userEvent.type(
        screen.getByLabelText("Date de début"),
        "2024-03-20"
      );
      fireEvent.click(screen.getByLabelText("Mensuel"));

      fireEvent.click(screen.getByText("Enregistrer"));

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    test("valide les champs obligatoires", async () => {
      render(<App />);

      fireEvent.click(screen.getByText("Ajouter un abonnement"));
      fireEvent.click(screen.getByText("Enregistrer"));

      // Vérifier que l'alerte est affichée
      expect(window.alert).toHaveBeenCalledWith(
        "Veuillez remplir tous les champs obligatoires"
      );
    });
  });

  // Test de la recherche
  describe("Fonctionnalité de recherche", () => {
    test("filtre les abonnements par nom", async () => {
      render(<App />);

      // Ajouter quelques abonnements
      const addButton = screen.getByText("Ajouter un abonnement");

      // Premier abonnement
      fireEvent.click(addButton);
      await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
      await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
      await userEvent.type(screen.getByLabelText("Classe"), "5ème A");
      await userEvent.type(
        screen.getByLabelText("Date de début"),
        "2024-03-20"
      );
      fireEvent.click(screen.getByLabelText("Mensuel"));
      fireEvent.click(screen.getByText("Enregistrer"));

      // Deuxième abonnement
      fireEvent.click(addButton);
      await userEvent.type(screen.getByLabelText("Prénom"), "Marie");
      await userEvent.type(screen.getByLabelText("Nom"), "Martin");
      await userEvent.type(screen.getByLabelText("Classe"), "6ème B");
      await userEvent.type(
        screen.getByLabelText("Date de début"),
        "2024-03-21"
      );
      fireEvent.click(screen.getByLabelText("Annuel"));
      fireEvent.click(screen.getByText("Enregistrer"));

      // Rechercher
      const searchInput = screen.getByPlaceholderText(
        "Rechercher par nom ou classe..."
      );
      await userEvent.type(searchInput, "Jean");

      // Vérifier les résultats
      expect(screen.getByText("Jean")).toBeInTheDocument();
      expect(screen.queryByText("Marie")).not.toBeInTheDocument();
    });
  });

  // Test de la bascule de statut
  describe("Bascule de statut", () => {
    test("change le statut d'un abonnement", async () => {
      render(<App />);

      // Ajouter un abonnement
      fireEvent.click(screen.getByText("Ajouter un abonnement"));
      await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
      await userEvent.type(screen.getByLabelText("Nom"), "Dupont");
      await userEvent.type(screen.getByLabelText("Classe"), "5ème A");
      await userEvent.type(
        screen.getByLabelText("Date de début"),
        "2024-03-20"
      );
      fireEvent.click(screen.getByLabelText("Mensuel"));
      fireEvent.click(screen.getByText("Enregistrer"));

      // Vérifier le statut initial
      expect(screen.getByText("✅ Actif")).toBeInTheDocument();

      // Changer le statut
      fireEvent.click(screen.getByText("Résilier"));

      // Vérifier le nouveau statut
      expect(screen.getByText("❌ Inactif")).toBeInTheDocument();
    });
  });

  // Test des performances
  describe("Performances", () => {
    test("gère un grand nombre d'abonnements", async () => {
      render(<App />);

      // Ajouter 100 abonnements
      for (let i = 0; i < 100; i++) {
        fireEvent.click(screen.getByText("Ajouter un abonnement"));
        await userEvent.type(screen.getByLabelText("Prénom"), `Jean${i}`);
        await userEvent.type(screen.getByLabelText("Nom"), `Dupont${i}`);
        await userEvent.type(screen.getByLabelText("Classe"), "5ème A");
        await userEvent.type(
          screen.getByLabelText("Date de début"),
          "2024-03-20"
        );
        fireEvent.click(screen.getByLabelText("Mensuel"));
        fireEvent.click(screen.getByText("Enregistrer"));
      }

      // Vérifier que tous les abonnements sont affichés
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(100);
    });
  });
});
