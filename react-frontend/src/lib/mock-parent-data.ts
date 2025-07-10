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
      attendanceStatus: 'absent',
      notes: {
        'cp1-fr-orale': 35,
        'cp1-fr-vocab': 28,
        'cp1-fr-gram': 42,
        'cp1-fr-conj': 31,
        'cp1-fr-ortho': 25,
        'cp1-fr-lect-comp': 38,
        'cp1-math-num': 22,
        'cp1-math-mesure': 44,
        'cp1-math-geo': 36,
        'cp1-math-prob': 29,
        'cp1-en-speak-gram': 33,
        'cp1-hist-comp': 27,
        'cp1-geo-comp': 41,
      },
      progression: {
        byCompetence: {
            'cp1-fr-orale': [ { date: 'Trim 1', progression: 30 }, { date: 'Trim 2', progression: 35 } ],
            'cp1-fr-vocab': [ { date: 'Trim 1', progression: 25 }, { date: 'Trim 2', progression: 28 } ],
            'cp1-fr-gram': [ { date: 'Trim 1', progression: 38 }, { date: 'Trim 2', progression: 42 } ],
            'cp1-math-num': [ { date: 'Trim 1', progression: 18 }, { date: 'Trim 2', progression: 22 } ],
            'cp1-math-mesure': [ { date: 'Trim 1', progression: 40 }, { date: 'Trim 2', progression: 44 } ],
        },
        byEvaluationType: {
          continue: [ { date: 'Lun', progression: 25 }, { date: 'Mar', progression: 31 }, { date: 'Mer', progression: 28 }, { date: 'Jeu', progression: 35 }, { date: 'Ven', progression: 38 } ],
          integration: [ { date: 'Sep', progression: 20 }, { date: 'Oct', progression: 26 }, { date: 'Nov', progression: 30 }, { date: 'Déc', progression: 34 }, { date: 'Jan', progression: 37 } ],
          trimestrielle: [ { date: 'Trim 1', progression: 28 }, { date: 'Trim 2', progression: 34 }, { date: 'Trim 3', progression: 40 } ],
        }
      }
    },
  ],
}; 