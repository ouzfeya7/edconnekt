import { Facilitator, mockPdiStudents } from './mock-data';
import { buildSessionStudent } from './pdi-rules';
import { PdiSession } from '../types/pdi';

export function createPdiSessionsForFacilitator(facilitator: Facilitator): PdiSession[] {
  const sessionStudents = mockPdiStudents.map(buildSessionStudent);

  // Dates variées pour les démonstrations (différents jours de la semaine)
  const sampleDates = [
    '30/07/2025', // Mercredi
    '24/07/2025', // Jeudi  
    '18/07/2025', // Vendredi
    '14/07/2025', // Lundi
    '08/07/2025'  // Mardi
  ];

  const studentsPerClass = 5;

  return facilitator.classes.map((className, index) => {
    const sessionDate = sampleDates[index] || sampleDates[0];
    const startIndex = index * studentsPerClass;
    const endIndex = startIndex + studentsPerClass;
    const classStudents = sessionStudents.slice(startIndex, endIndex);

    // Créer différents statuts pour les démonstrations
    const statuses = ['scheduled', 'in_progress', 'completed', 'published'] as const;
    const status = statuses[index % statuses.length];

    return {
      id: `${index + 1}`,
      date: sessionDate,
      classId: `class-${index + 1}`,
      className,
      status: status,
      students: classStudents,
      observations: `Séance productive avec la classe ${className}. Une bonne participation générale. Quelques élèves nécessitent un suivi renforcé.`,
      reportGenerated: status === 'completed' || status === 'published',
      published: status === 'published',
    };
  });
}


