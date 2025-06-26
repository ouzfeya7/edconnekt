# Instructions pour le déploiement du thème Keycloak "EdConnect"

Ce paquet contient le thème personnalisé pour la page de connexion de l'application EdConnect.

**Contenu de l'archive :**
*   `edconnekt-theme.zip` : L'archive contenant tous les fichiers du thème.

---

### Procédure de déploiement

1.  **Décompresser l'archive** :
    Décompressez le fichier `edconnekt-theme.zip` qui accompagne ce document. Vous obtiendrez un dossier nommé `edconnekt-theme`.

2.  **Copier le thème sur le serveur Keycloak** :
    Placez le dossier `edconnekt-theme` dans le répertoire des thèmes de l'instance Keycloak. Le chemin d'accès final sur le serveur doit être :
    `.../keycloak/themes/edconnekt-theme/`

    *Note : L'emplacement exact du répertoire `themes` peut varier en fonction de l'installation de Keycloak (Docker, machine virtuelle, etc.).*

3.  **Redémarrer le service Keycloak** :
    Un redémarrage du service Keycloak peut être nécessaire pour qu'il détecte le nouveau thème.

---

### Procédure d'activation

1.  **Se connecter à la console d'administration** de Keycloak.
2.  Sélectionner le **Realm** correspondant à l'application EdConnect.
3.  Dans le menu de gauche, aller dans **"Realm Settings"**.
4.  Ouvrir l'onglet **"Themes"**.
5.  Dans la liste déroulante **"Login Theme"**, choisir **"edconnekt-theme"**.
6.  Cliquer sur **"Save"** en bas de la page.

Le thème sera alors actif pour tous les utilisateurs. 