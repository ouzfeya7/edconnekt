import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://keycloak.localhost:8081", // URL de base de l'instance Keycloak
  realm: "edconnekt",                    // Nom du realm
  clientId: "school-app",                // ID du client
});

export default keycloak;