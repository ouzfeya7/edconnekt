import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://auth.uat1-engy-partners.com:8443/", // URL de base de l'instance Keycloak
  realm: "edconnekt",                    // Nom du realm
  clientId: "school-app",                // ID du client
});

export default keycloak;