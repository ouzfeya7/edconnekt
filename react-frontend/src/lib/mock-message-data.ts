// Données mock pour la messagerie EdConnekt

export interface Message {
  id: string;
  sender: string;
  senderEmail?: string;
  content: string;
  category: string;
  time: string;
  isStarred: boolean;
  isSelected: boolean;
  subject?: string;
  fullContent?: string;
  recipient?: string;
  recipientEmail?: string;
  avatarUrl?: string;
  isRead?: boolean;
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

export type UserRole = 'eleve' | 'parent' | 'enseignant' | 'admin' | 'directeur';

// Messages pour les élèves
export const getStudentMessages = (): Message[] => [
  {
    id: '1',
    sender: 'M. Diallo - Mathématiques',
    senderEmail: 'm.diallo@edconnekt.com',
    subject: 'Devoir de mathématiques - Équations du second degré',
    content: 'Devoir de mathématiques pour lundi prochain sur les équations du second degré',
    fullContent: `Bonjour,

J'espère que vous allez bien. Je vous rappelle que le devoir de mathématiques sur les équations du second degré est à rendre pour lundi prochain.

Voici les exercices à faire :
- Exercices 1 à 5 page 87
- Exercices 10 à 12 page 89
- Problème de synthèse page 92

N'hésitez pas à me contacter si vous avez des questions.

Cordialement,
M. Diallo`,
    category: 'Professeur',
    time: 'Aujourd\'hui 8:38',
    isStarred: true,
    isSelected: false,
    isRead: false,
    priority: 'high',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    attachments: ['Formulaire_equations.pdf']
  },
  {
    id: '2',
    sender: 'Mme Sow - Français',
    senderEmail: 'mme.sow@edconnekt.com',
    subject: 'Résultats du contrôle de français',
    content: 'Notes du contrôle de français disponibles dans votre espace élève',
    fullContent: `Chère classe,

Les notes du contrôle de français du 10 mars sont maintenant disponibles dans votre espace élève.

Dans l'ensemble, les résultats sont satisfaisants. Quelques points à retenir :
- Attention à l'orthographe et à la conjugaison
- Développez davantage vos analyses littéraires
- Soignez la présentation de vos copies

Pour ceux qui souhaitent améliorer leurs résultats, je propose des séances de soutien les mardis après-midi.

Bonne continuation,
Mme Sow`,
    category: 'Professeur',
    time: 'Aujourd\'hui 8:13',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=47'
  },
  {
    id: '3',
    sender: 'Administration - Scolarité',
    senderEmail: 'scolarite@edconnekt.com',
    subject: 'Réunion parents-professeurs - 15 mars',
    content: 'Rappel : Réunion parents-professeurs le 15 mars à 18h00',
    fullContent: `Chers élèves,

Nous vous rappelons que la réunion parents-professeurs aura lieu le vendredi 15 mars à partir de 18h00.

Merci de transmettre cette information à vos parents et de leur remettre le planning des rendez-vous qui vous sera distribué demain.

Documents à apporter :
- Carnet de correspondance
- Bulletins du trimestre
- Cahiers principaux

L'équipe administrative`,
    category: 'Administration',
    time: 'Hier 19:52',
    isStarred: true,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '4',
    sender: 'M. Ba - Sciences Physiques',
    subject: 'Préparation TP - Optique géométrique',
    content: 'Préparation pour l\'examen pratique de sciences physiques',
    fullContent: `Bonjour à tous,

Le prochain TP d'optique géométrique aura lieu jeudi prochain. Voici ce que vous devez préparer :

Matériel à apporter :
- Blouse obligatoire
- Calculatrice scientifique
- Règle graduée

Rappels de sécurité :
- Manipulation soigneuse du matériel optique
- Respect des consignes de sécurité
- Travail en binômes

Le compte-rendu sera à rendre la semaine suivante.

M. Ba`,
    category: 'Professeur',
    time: 'Hier 19:30',
    isStarred: false,
    isSelected: false,
    isRead: false,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=71'
  },
  {
    id: '5',
    sender: 'Administration - Vie Scolaire',
    subject: 'Modification emploi du temps - Semaine 12',
    content: 'Emploi du temps modifié pour la semaine du 18 au 22 mars',
    fullContent: `Chers élèves,

En raison de l'absence de Mme Martin (Anglais), l'emploi du temps de la semaine prochaine est modifié :

Modifications :
- Lundi 18/03 : Cours d'anglais de 14h remplacé par étude surveillée
- Mercredi 20/03 : Cours d'anglais de 10h annulé
- Vendredi 22/03 : Cours de rattrapage anglais de 15h à 16h

Merci de bien noter ces changements.

Service Vie Scolaire`,
    category: 'Administration',
    time: 'Hier 16:20',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'high',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '6',
    sender: 'Brouillon',
    subject: 'Demande d\'absence - Rendez-vous médical',
    content: 'Demande d\'absence pour rendez-vous médical du 25 mars...',
    fullContent: `Madame, Monsieur,

Je vous prie de bien vouloir m'excuser pour mon absence du mardi 25 mars de 14h à 16h.

Motif : Rendez-vous médical chez le dentiste (urgence)

Je rattraperai les cours manqués auprès de mes camarades et me tiendrai à votre disposition pour tout complément d'information.

Cordialement,
[Votre nom]`,
    category: 'Brouillon',
    time: 'Hier 14:15',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=33'
  },
  {
    id: '7',
    sender: 'Mme Ndiaye - Histoire-Géographie',
    subject: 'Sortie pédagogique - Musée des Civilisations',
    content: 'Sortie au Musée des Civilisations prévue le 5 avril',
    fullContent: `Chers élèves,

J'ai le plaisir de vous annoncer l'organisation d'une sortie pédagogique au Musée des Civilisations Noires de Dakar le vendredi 5 avril.

Programme :
- Départ : 8h00 depuis l'établissement
- Visite guidée : 9h30 - 11h30
- Atelier pédagogique : 14h00 - 15h30
- Retour prévu : 17h00

Coût : 2000 FCFA par élève
Autorisation parentale obligatoire (document à récupérer en vie scolaire)

Cette sortie s'inscrit dans notre programme sur les civilisations africaines.

Mme Ndiaye`,
    category: 'Professeur',
    time: '2 jours',
    isStarred: true,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=44'
  },
  {
    id: '8',
    sender: 'Bibliothèque - Mme Fall',
    subject: 'Rappel - Retour de livres',
    content: 'Rappel pour le retour des livres empruntés',
    fullContent: `Bonjour,

Nous vous rappelons que vous avez des livres en retard à la bibliothèque :

Livres à retourner :
- "Le Petit Prince" - Emprunté le 15/02
- "Les Misérables" (Tome 1) - Emprunté le 20/02

Merci de les retourner rapidement pour éviter une suspension de vos droits d'emprunt.

Horaires de la bibliothèque :
- Lundi à vendredi : 8h00 - 17h00
- Samedi : 9h00 - 12h00

Cordialement,
Mme Fall - Bibliothécaire`,
    category: 'Administration',
    time: '3 jours',
    isStarred: false,
    isSelected: false,
    isRead: false,
    priority: 'low',
    avatarUrl: 'https://i.pravatar.cc/150?img=26'
  }
];

// Messages pour les enseignants
export const getTeacherMessages = (): Message[] => [
  {
    id: '1',
    sender: 'Fatima Thiam - 2nde A',
    subject: 'Question sur l\'exercice 3 de mathématiques',
    content: 'Question sur l\'exercice 3 du devoir de mathématiques',
    fullContent: `Bonjour Monsieur Diallo,

J'espère que vous allez bien. J'ai une petite question concernant l'exercice 3 du devoir de mathématiques que vous nous avez donné.

Dans la résolution de l'équation x² - 5x + 6 = 0, pourriez-vous me préciser si nous devons obligatoirement utiliser la méthode de factorisation ou si nous pouvons aussi utiliser la formule du discriminant ?

J'ai essayé les deux méthodes et j'obtiens le même résultat (x = 2 ou x = 3), mais je voulais m'assurer de la méthode attendue.

Merci d'avance pour votre réponse.

Cordialement,
Fatima Thiam
Classe de 2nde A`,
    category: 'Eleve',
    time: 'Aujourd\'hui 8:38',
    isStarred: false,
    isSelected: false,
    isRead: false,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=25'
  },
  {
    id: '2',
    sender: 'M. Diop (Parent de Moussa)',
    subject: 'Rendez-vous - Résultats du trimestre',
    content: 'Demande de rendez-vous concernant les résultats du trimestre',
    fullContent: `Bonjour Madame Sow,

J'espère que vous allez bien. Je suis le père de Moussa Diop, élève en 1ère L dans votre classe de français.

Je souhaiterais prendre rendez-vous avec vous afin de discuter des résultats trimestriels de mon fils. Bien que ses notes soient correctes, j'aimerais comprendre comment l'aider à progresser davantage, notamment en expression écrite.

Seriez-vous disponible la semaine prochaine pour un entretien ? Je peux me libérer :
- Mardi après 16h00
- Mercredi après 15h00  
- Jeudi après 17h00

En vous remerciant par avance.

Cordialement,
M. Diop
Tél : 77 123 45 67`,
    category: 'Parent',
    time: 'Aujourd\'hui 8:13',
    isStarred: true,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=52'
  },
  {
    id: '3',
    sender: 'Amadou Diop - Facilitateur Sciences',
    subject: 'Support pour le TP d\'optique',
    content: 'Support pour la préparation du TP de sciences',
    fullContent: `Bonjour M. Ba,

J'espère que vous allez bien. Suite à notre échange de ce matin, je vous confirme ma disponibilité pour vous aider à préparer le matériel pour le prochain TP d'optique géométrique.

J'ai vérifié l'état du matériel dans le laboratoire :
- 15 bancs d'optique opérationnels
- 20 lentilles convergentes (différentes focales)
- 15 lentilles divergentes
- Sources lumineuses : toutes fonctionnelles
- Écrans : en bon état

Le matériel sera prêt pour jeudi. J'ai aussi préparé quelques lentilles de rechange au cas où.

N'hésitez pas à me solliciter si vous avez besoin d'autre chose.

Cordialement,
Amadou Diop
Facilitateur Sciences`,
    category: 'Facilitateur',
    time: 'Hier 19:52',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=61'
  },
  {
    id: '4',
    sender: 'Administration - Direction Pédagogique',
    subject: 'Réunion pédagogique - Conseil d\'enseignement',
    content: 'Réunion pédagogique - Ordre du jour et documents',
    fullContent: `Chers collègues,

La réunion du conseil d'enseignement se tiendra demain mercredi 13 mars à 14h00 en salle des professeurs.

Ordre du jour :
1. Bilan du 2ème trimestre
2. Préparation des conseils de classe
3. Projets pédagogiques du 3ème trimestre
4. Organisation des examens blancs
5. Sorties et voyages scolaires
6. Questions diverses

Documents à apporter :
- Relevés de notes par classe
- Propositions d'orientation (Terminales)
- Fiches de projets pédagogiques

La réunion est prévue pour durer 2h00 maximum.

Cordialement,
M. Sarr - Directeur Pédagogique`,
    category: 'Administration',
    time: 'Hier 19:30',
    isStarred: true,
    isSelected: false,
    isRead: false,
    priority: 'high',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '5',
    sender: 'Mariam Ba - Terminale S',
    subject: 'Absence justifiée - Cours de demain',
    content: 'Absence justifiée pour le cours de demain',
    fullContent: `Bonjour Madame Ndiaye,

J'espère que vous allez bien. Je vous écris pour vous informer de mon absence au cours d'histoire-géographie de demain jeudi 14 mars de 10h00 à 12h00.

Motif : Rendez-vous médical urgent chez l'ophtalmologue (problème de vue qui s'aggrave).

Je vous joins le justificatif médical en pièce jointe. Je rattraperai le cours auprès de mes camarades et je viendrai vous voir dès mon retour pour récupérer les documents distribués.

En vous remerciant pour votre compréhension.

Cordialement,
Mariam Ba
Terminale S2`,
    category: 'Eleve',
    time: 'Hier 18:45',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=27',
    attachments: ['Justificatif_medical.pdf']
  }
];

// Messages envoyés (communs aux deux rôles)
export const getSentMessages = (): Message[] => [
  {
    id: 'sent-1',
    sender: 'Moi',
    recipient: 'Fatima Thiam',
    subject: 'Re: Question sur l\'exercice 3 de mathématiques',
    content: 'Réponse à votre question sur le devoir',
    fullContent: `Bonjour Fatima,

Merci pour votre question très pertinente.

Vous avez tout à fait raison, les deux méthodes sont valides et mènent au même résultat. Pour cet exercice, vous pouvez utiliser la méthode de votre choix :

1. Factorisation : x² - 5x + 6 = (x-2)(x-3) = 0
2. Discriminant : Δ = 25 - 24 = 1, donc x = (5±1)/2

L'important est de bien justifier votre démarche et de vérifier vos solutions en les reportant dans l'équation originale.

Continuez ainsi, vous êtes sur la bonne voie !

Cordialement,
M. Diallo`,
    category: 'Eleve',
    time: 'Aujourd\'hui 9:15',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=68'
  },
  {
    id: 'sent-2',
    sender: 'Moi',
    recipient: 'Administration',
    subject: 'Demande de matériel - Laboratoire de sciences',
    content: 'Demande de renouvellement du matériel de laboratoire',
    fullContent: `Madame la Directrice,

J'espère que vous allez bien. Je vous écris pour faire une demande de renouvellement de matériel pour le laboratoire de sciences physiques.

Matériel nécessaire :
- 5 multimètres numériques (les anciens sont défaillants)
- 20 résistances de différentes valeurs
- 3 générateurs de tension continue
- Fils de connexion (lot de 50)

Budget estimé : 150 000 FCFA

Ce matériel est indispensable pour les TP du 3ème trimestre, notamment pour les classes de Terminale S qui préparent le baccalauréat.

Je reste à votre disposition pour tout complément d'information.

Cordialement,
M. Ba - Professeur de Sciences Physiques`,
    category: 'Administration',
    time: 'Hier 14:30',
    isStarred: false,
    isSelected: false,
    isRead: true,
    priority: 'normal',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  }
];

// Fonction pour obtenir les messages selon le rôle
export const getMessagesForRole = (role: UserRole): Message[] => {
  switch (role) {
    case 'enseignant':
      return getTeacherMessages();
    case 'eleve':
    default:
      return getStudentMessages();
  }
};

// Catégories par rôle
export const getCategoriesForRole = (role: UserRole) => {
  const baseCategories = [
    { 
      id: 'inbox', 
      name: 'Boîte de réception',
      icon: 'Inbox'
    },
    { 
      id: 'sent', 
      name: 'Messages envoyés',
      icon: 'Send'
    },
  ];

  const roleCategories = {
    eleve: [
      { 
        id: 'teachers', 
        name: 'Professeurs',
        icon: 'Users'
      },
      { 
        id: 'admin', 
        name: 'Administration',
        icon: 'Building2'
      },
    ],
    parent: [
      { 
        id: 'teachers', 
        name: 'Professeurs',
        icon: 'Users'
      },
      { 
        id: 'admin', 
        name: 'Administration',
        icon: 'Building2'
      },
    ],
    enseignant: [
      { 
        id: 'students', 
        name: 'Élèves',
        icon: 'GraduationCap'
      },
      { 
        id: 'parents', 
        name: 'Parents',
        icon: 'Users'
      },
      { 
        id: 'facilitators', 
        name: 'Facilitateurs',
        icon: 'UserCog'
      },
      { 
        id: 'admin', 
        name: 'Administration',
        icon: 'Building2'
      },
    ],
    admin: [
      { 
        id: 'teachers', 
        name: 'Professeurs',
        icon: 'Users'
      },
      { 
        id: 'students', 
        name: 'Élèves',
        icon: 'GraduationCap'
      },
    ],
    directeur: [
      { 
        id: 'directeurs', 
        name: 'Directeurs',
        icon: 'UserCog'
      },
    ],
  };

  const finalCategories = [
    { 
      id: 'important', 
      name: 'Messages importants',
      icon: 'Star'
    },
    { 
      id: 'archives', 
      name: 'Archives',
      icon: 'Archive'
    },
    { 
      id: 'draft', 
      name: 'Brouillons',
      icon: 'FileEdit'
    },
  ];

  return [...baseCategories, ...roleCategories[role], ...finalCategories];
}; 