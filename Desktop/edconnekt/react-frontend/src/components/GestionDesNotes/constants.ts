// ./constants.ts

export const monthNames: string[] = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  
  export const mockStudents = [
    { firstName: "Emma", lastName: "Dupont", subject: "Math", weeklySkill: "Logique", skill: "Résolution", grade: 88, progress: 80 },
    { firstName: "Léo", lastName: "Martin", subject: "Français", weeklySkill: "Écriture", skill: "Orthographe", grade: 76, progress: 60 },
    { firstName: "Clara", lastName: "Bernard", subject: "SVT", weeklySkill: "Observation", skill: "Rapports", grade: 92, progress: 95 },
    { firstName: "Lucas", lastName: "Petit", subject: "Histoire", weeklySkill: "Analyse", skill: "Chronologie", grade: 85, progress: 70 },
    { firstName: "Jade", lastName: "Moreau", subject: "Anglais", weeklySkill: "Vocabulaire", skill: "Compréhension", grade: 67, progress: 50 },
  ];
  
  export const viewOptions = ["Annuel", "Trimestre", "Mois", "PDI"];
  
  export const months = (currentMonthIndex: number) => [
    monthNames[(currentMonthIndex + 11) % 12], // Mois -2
    monthNames[(currentMonthIndex + 12 - 1) % 12], // Mois -1
    monthNames[currentMonthIndex], // Mois actuel
  ];
  
  export const rapportTypes = {
    annuel: ["Rapport Trimestre 1", "Rapport Trimestre 2", "Rapport Trimestre 3", "Rapport Trimestre 4"],
    trimestre: (months: string[]) => months.map(month => `Rapport ${month}`),
    mois: ["Rapport du mois", "Bilan mensuel", "Avancement"],
  };
  
  export const handleDownload = (name: string) => {
    alert(`Téléchargement de ${name}`);
  };
  