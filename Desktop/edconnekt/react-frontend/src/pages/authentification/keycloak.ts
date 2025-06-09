import Keycloak from "keycloak-js";

// const keycloak = new Keycloak({
//   url: "http://localhost:8080",
//   realm: "myrealm",     // ⚡ Mets ton vrai realm
//   clientId: "myclient", // ⚡ Mets ton vrai client-id
// });

const keycloak = new Keycloak({
  url: "http://keycloak.localhost",
  realm: "EdConnect",
  clientId: "myclient", 
});

export default keycloak;
  