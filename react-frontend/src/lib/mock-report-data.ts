export interface SubjectReport {
  subject: string;
  average: number;
  teacherComment: string;
  competencies: {
    name: string;
    status: 'acquis' | 'en_cours' | 'a_renforcer';
  }[];
}

export interface TrimesterReport {
  trimester: number;
  overallAverage: number;
  generalComment: string;
  attendance: {
    present: number;
    late: number;
    absent: number;
  };
  subjects: SubjectReport[];
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  reports: TrimesterReport[];
}

export const mockStudentReport: StudentReport = {
  studentId: "eleve-01",
  studentName: "Adama Keita",
  reports: [
    {
      trimester: 1,
      overallAverage: 82,
      generalComment: "Adama est une élève sérieuse et motivée. Le travail est constant et les résultats sont très satisfaisants. Continuez ainsi !",
      attendance: {
        present: 250,
        late: 2,
        absent: 1,
      },
      subjects: [
        {
          subject: "Français",
          average: 85,
          teacherComment: "Excellente participation orale et très bon niveau de compréhension. L'écriture peut encore être améliorée.",
          competencies: [
            { name: "Lire un texte à voix haute", status: 'acquis' },
            { name: "Comprendre un article", status: 'acquis' },
            { name: "Écrire sans fautes", status: 'en_cours' },
          ]
        },
        {
          subject: "Mathématiques",
          average: 91,
          teacherComment: "Adama maîtrise parfaitement les concepts de résolution d'équations. La logique est excellente.",
          competencies: [
            { name: "Résoudre une équation", status: 'acquis' },
            { name: "Géométrie dans l'espace", status: 'acquis' },
          ]
        },
        {
          subject: "Arts et Créativité",
          average: 75,
          teacherComment: "Beaucoup d'imagination et de créativité. Le dessin technique est à travailler.",
          competencies: [
            { name: "Dessiner un paysage", status: 'en_cours' },
            { name: "Utiliser les couleurs", status: 'acquis' },
          ]
        },
        {
          subject: "Histoire",
          average: 78,
          teacherComment: "Bonne mémorisation des dates et des faits. Il faut maintenant travailler sur l'analyse de documents.",
          competencies: [
            { name: "Se repérer sur une frise", status: 'acquis' },
            { name: "Analyser un document source", status: 'a_renforcer' },
          ]
        }
      ]
    },
    // On pourrait ajouter ici les données pour le Trimestre 2, etc.
  ]
}; 