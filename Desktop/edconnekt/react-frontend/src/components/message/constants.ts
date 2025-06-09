// constants/messages.ts

export const categories = [
  { label: "Boîte de réception", value: "all" },
  { label: "Élève", value: "Eleve" },
  { label: "Parent", value: "Parent" },
  { label: "Administration", value: "Administration" },
  { label: "Important", value: "important" },
  { label: "Brouillon", value: "draft" },
  { label: "Envoyés", value: "sent" },
];

export const messages = [
  {
    id: 1,
    sender: "Fatima Thiam",
    content: "Lorem ipsum dolor sit amet consectetur. Tincidunt mi ege",
    role: "Eleve",
    time: "8:38 AM",
  },
  {
    id: 2,
    sender: "Aicha Lo",
    content: "Lorem ipsum dolor sit amet consectetur.",
    role: "Parent",
    time: "8:13 AM",
  },
  {
    id: 3,
    sender: "Modou Beye",
    content: "Lorem ipsum dolor sit amet consectetur. Tincidunt mi",
    role: "Administration",
    time: "7:52 PM",
  },
  // Ajoute ici d'autres messages...
];