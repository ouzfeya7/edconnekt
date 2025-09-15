import { StudentNote, getSubjectsForClass } from './notes-data';

/**
 * Génère des notes aléatoires pour un élève spécifique
 * @param classId - L'identifiant de la classe
 * @param studentId - L'identifiant de l'élève
 * @param firstName - Le prénom de l'élève
 * @param lastName - Le nom de l'élève
 * @param studentAvatar - L'URL de l'avatar de l'élève
 * @returns Un objet StudentNote avec des notes aléatoires
 */
export const generateMockStudentNotes = (
  classId: string,
  studentId: string,
  firstName: string,
  lastName: string,
  studentAvatar: string
): StudentNote => {
  const domains = getSubjectsForClass(classId);
  const allCompetences = domains.flatMap(d => d.subjects.flatMap(s => s.competences));
  
  const notes: { [competenceId: string]: number | 'absent' | 'non-evalue' } = {};
  
  // Générer des notes aléatoires pour chaque compétence
  allCompetences.forEach(competence => {
    // 5% de chance d'être absent, 5% de chance de ne pas être évalué, 90% de chance d'avoir une note
    const rand = Math.random();
    if (rand < 0.05) {
      notes[competence.id] = 'absent';
    } else if (rand < 0.10) {
      notes[competence.id] = 'non-evalue';
    } else {
      // Générer une note entre 0 et 100
      notes[competence.id] = Math.floor(Math.random() * 101);
    }
  });
  
  return {
    studentId,
    firstName,
    lastName,
    studentAvatar,
    notes,
  };
};

/**
 * Crée des données fictives pour un élève spécifique
 */
export const createMockStudentData = (
  classId: string = 'cp1',
  studentName: string = 'Ouz Feya',
  avatarUrl: string = 'https://i.pravatar.cc/150?img=33'
): StudentNote[] => {
  const [firstName, lastName] = studentName.split(' ');
  const studentId = `${classId}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
  
  const studentNote = generateMockStudentNotes(
    classId,
    studentId,
    firstName,
    lastName,
    avatarUrl
  );
  
  return [studentNote];
};

/**
 * Données fictives pour l'élève connecté
 */
export const mockCurrentStudentNotes = createMockStudentData();

/**
 * Fonction pour obtenir les notes de l'élève connecté
 */
export const getCurrentStudentNotes = (classId: string = 'cp1'): StudentNote[] => {
  return createMockStudentData(classId);
}; 