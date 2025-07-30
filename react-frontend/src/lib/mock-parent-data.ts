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
          'cp1-fr-orale': [
            { date: 'Trim 1', progression: 68 },
            { date: 'Trim 2', progression: 82 },
            { date: 'Trim 3', progression: 55 },
            { date: 'Lun', progression: 60 },
            { date: 'Mar', progression: 75 },
            { date: 'Mer', progression: 80 },
            { date: 'Jeu', progression: 82 },
            { date: 'Ven', progression: 99 },
          ],
          'cp1-fr-vocab': [
            { date: 'Trim 1', progression: 78 },
            { date: 'Trim 2', progression: 84 },
            { date: 'Trim 3', progression: 89 },
            { date: 'Lun', progression: 70 },
            { date: 'Mar', progression: 75 },
            { date: 'Mer', progression: 80 },
            { date: 'Jeu', progression: 82 },
            { date: 'Ven', progression: 79 },
          ],
          'cp1-fr-gram': [
            { date: 'Trim 1', progression: 85 },
            { date: 'Trim 2', progression: 88 },
            { date: 'Trim 3', progression: 91 },
            { date: 'Lun', progression: 78 },
            { date: 'Mar', progression: 82 },
            { date: 'Mer', progression: 86 },
            { date: 'Jeu', progression: 88 },
            { date: 'Ven', progression: 90 },
          ],
          'cp1-math-num': [
            { date: 'Trim 1', progression: 95 },
            { date: 'Trim 2', progression: 97 },
            { date: 'Trim 3', progression: 99 },
            { date: 'Lun', progression: 90 },
            { date: 'Mar', progression: 92 },
            { date: 'Mer', progression: 94 },
            { date: 'Jeu', progression: 96 },
            { date: 'Ven', progression: 98 },
          ],
          'cp1-math-mesure': [
            { date: 'Trim 1', progression: 90 },
            { date: 'Trim 2', progression: 92 },
            { date: 'Trim 3', progression: 94 },
            { date: 'Lun', progression: 85 },
            { date: 'Mar', progression: 87 },
            { date: 'Mer', progression: 89 },
            { date: 'Jeu', progression: 91 },
            { date: 'Ven', progression: 93 },
          ],
        },
        byEvaluationType: {
          continue: [
            { date: 'Lun', progression: 85 },
            { date: 'Mar', progression: 88 },
            { date: 'Mer', progression: 92 },
            { date: 'Jeu', progression: 90 },
            { date: 'Ven', progression: 95 },
            { date: 'Lun', progression: 96 },
            { date: 'Mar', progression: 97 },
            { date: 'Mer', progression: 98 },
            { date: 'Jeu', progression: 99 },
            { date: 'Ven', progression: 100 },
          ],
          integration: [
            { date: 'Sep', progression: 75 },
            { date: 'Oct', progression: 80 },
            { date: 'Nov', progression: 78 },
            { date: 'Déc', progression: 82 },
            { date: 'Jan', progression: 85 },
            { date: 'Fév', progression: 87 },
            { date: 'Mar', progression: 89 },
            { date: 'Avr', progression: 91 },
            { date: 'Mai', progression: 93 },
            { date: 'Juin', progression: 95 },
          ],
          trimestrielle: [
            { date: 'Trim 1', progression: 80 },
            { date: 'Trim 2', progression: 86 },
            { date: 'Trim 3', progression: 90 },
          ]
        }
      }
    },
    { 
      studentId: '2', 
      firstName: 'Moussa', 
      lastName: 'Keita', 
      studentAvatar: 'https://i.pravatar.cc/150?img=2',
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