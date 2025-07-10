import { StudentNote } from './notes-data';

export interface ParentData {
  parentId: string;
  children: StudentNote[];
}

// Source de vérité unique pour les enfants du parent connecté
export const mockParentData: ParentData = {
  parentId: 'parent-01',
  children: [
    { 
      studentId: 'eleve-01', 
      firstName: 'Adama', 
      lastName: 'Keita', 
      studentAvatar: '/path/to/avatar1.png',
      attendanceStatus: 'present',
      notes: {
        'cp1-fr-orale': 88,
        'cp1-fr-vocab': 78,
        'cp1-fr-gram': 85,
        'cp1-fr-conj': 92,
        'cp1-fr-ortho': 80,
        'cp1-fr-lect-comp': 87,
        'cp1-math-num': 95,
        'cp1-math-mesure': 90,
        'cp1-math-geo': 89,
        'cp1-math-prob': 87,
        'cp1-en-speak-gram': 82,
        'cp1-hist-comp': 79,
        'cp1-geo-comp': 85,
      },
      progression: {
        byCompetence: {
          'cp1-fr-orale': [ { date: 'Trim 1', progression: 88 }, { date: 'Trim 2', progression: 92 } ],
          'cp1-fr-vocab': [ { date: 'Trim 1', progression: 78 }, { date: 'Trim 2', progression: 84 } ],
          'cp1-fr-gram': [ { date: 'Trim 1', progression: 85 }, { date: 'Trim 2', progression: 88 } ],
          'cp1-math-num': [ { date: 'Trim 1', progression: 95 }, { date: 'Trim 2', progression: 97 } ],
          'cp1-math-mesure': [ { date: 'Trim 1', progression: 90 }, { date: 'Trim 2', progression: 92 } ],
        },
        byEvaluationType: {
          continue: [ { date: 'Lun', progression: 85 }, { date: 'Mar', progression: 88 }, { date: 'Mer', progression: 92 }, { date: 'Jeu', progression: 90 }, { date: 'Ven', progression: 95 } ],
          integration: [ { date: 'Sep', progression: 75 }, { date: 'Oct', progression: 80 }, { date: 'Nov', progression: 78 }, { date: 'Déc', progression: 82 }, { date: 'Jan', progression: 85 } ],
          trimestrielle: [ { date: 'Trim 1', progression: 80 }, { date: 'Trim 2', progression: 86 }, { date: 'Trim 3', progression: 90 } ],
        }
      }
    },
    { 
      studentId: 'eleve-02', 
      firstName: 'Moussa', 
      lastName: 'Keita', 
      studentAvatar: '/path/to/avatar2.png',
      attendanceStatus: 'late',
      notes: {
        'cp1-fr-orale': 70,
        'cp1-fr-vocab': 82,
        'cp1-fr-gram': 76,
        'cp1-fr-conj': 74,
        'cp1-fr-ortho': 68,
        'cp1-fr-lect-comp': 78,
        'cp1-math-num': 75,
        'cp1-math-mesure': 79,
        'cp1-math-geo': 77,
        'cp1-math-prob': 73,
        'cp1-en-speak-gram': 77,
        'cp1-hist-comp': 72,
        'cp1-geo-comp': 80,
      },
      progression: {
        byCompetence: {
            'cp1-fr-orale': [ { date: 'Trim 1', progression: 70 }, { date: 'Trim 2', progression: 75 } ],
            'cp1-fr-vocab': [ { date: 'Trim 1', progression: 82 }, { date: 'Trim 2', progression: 80 } ],
            'cp1-fr-gram': [ { date: 'Trim 1', progression: 76 }, { date: 'Trim 2', progression: 78 } ],
            'cp1-math-num': [ { date: 'Trim 1', progression: 75 }, { date: 'Trim 2', progression: 77 } ],
            'cp1-math-mesure': [ { date: 'Trim 1', progression: 79 }, { date: 'Trim 2', progression: 81 } ],
        },
        byEvaluationType: {
          continue: [ { date: 'Lun', progression: 78 }, { date: 'Mar', progression: 82 }, { date: 'Mer', progression: 80 }, { date: 'Jeu', progression: 79 }, { date: 'Ven', progression: 85 } ],
          integration: [ { date: 'Sep', progression: 68 }, { date: 'Oct', progression: 72 }, { date: 'Nov', progression: 75 }, { date: 'Déc', progression: 78 }, { date: 'Jan', progression: 77 } ],
          trimestrielle: [ { date: 'Trim 1', progression: 72 }, { date: 'Trim 2', progression: 78 }, { date: 'Trim 3', progression: 81 } ],
        }
      }
    },
  ],
}; 