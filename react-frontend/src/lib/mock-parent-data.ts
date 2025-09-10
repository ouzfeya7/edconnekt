import { StudentNote } from './notes-data';

export interface ParentData {
  parentId: string;
  children: StudentNote[];
}

// Types pour les données PDI
export interface PdiCompetence {
  id: string;
  name: string;
  currentScore: number;
  weeklyEvolution: number;
  teacherComment: string;
  status: 'acquis' | 'en_cours' | 'a_renforcer';
}

export interface PdiPlanSession {
  sessionCode: string;
  sessionDate: string;
  trimester: number;
  week: number;
  competences: PdiCompetence[];
  actionPlan: {
    inClass: { action: string; description: string }[];
    atHome: { action: string; description: string }[];
    followUp: string;
  };
  attendance: {
    total: number;
    present: number;
    late: number;
    absent: number;
    observations: string;
  };
  parentMessage: string;
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
      },
      // Données PDI pour Adama
      pdiSessions: {
        'trim1-week4': {
          sessionCode: 'PDI 01-04',
          sessionDate: '31 juillet 2025',
          trimester: 1,
          week: 4,
          competences: [
            {
              id: 'presk-fr-langage',
              name: 'Langage oral',
              currentScore: 88,
              weeklyEvolution: 4,
              teacherComment: 'Excellente expression orale ; continuer les jeux de rôle.',
              status: 'acquis'
            },
            {
              id: 'presk-fr-conte',
              name: 'Conte & Compréhension',
              currentScore: 92,
              weeklyEvolution: 9,
              teacherComment: 'Très bonne compréhension et participation active.',
              status: 'acquis'
            },
            {
              id: 'presk-fr-vocab',
              name: 'Vocabulaire',
              currentScore: 85,
              weeklyEvolution: 2,
              teacherComment: 'Vocabulaire riche et varié ; excellente maîtrise.',
              status: 'acquis'
            },
            {
              id: 'presk-fr-lecture',
              name: 'Lecture',
              currentScore: 87,
              weeklyEvolution: 3,
              teacherComment: 'Lecture fluide et expressive ; très bon niveau.',
              status: 'acquis'
            },
            {
              id: 'presk-fr-graphisme',
              name: 'Graphisme',
              currentScore: 90,
              weeklyEvolution: 5,
              teacherComment: 'Tracés nets et précis ; excellente maîtrise du geste.',
              status: 'acquis'
            }
          ],
          actionPlan: {
            inClass: [
              {
                action: 'Enrichissement vocabulaire',
                description: 'Atelier d\'enrichissement lexical 2×15 min cette semaine.'
              },
              {
                action: 'Lecture expressive',
                description: 'Exercices de lecture à voix haute avec intonation.'
              }
            ],
            atHome: [
              {
                action: 'Lecture enrichie',
                description: 'Lire des histoires plus complexes chaque soir 10 min.'
              },
              {
                action: 'Expression créative',
                description: 'Inventer des histoires et les raconter en famille.'
              }
            ],
            followUp: 'Maintenir l\'excellence lors de la prochaine séance PDI (07/08).'
          },
          attendance: {
            total: 20,
            present: 18,
            late: 1,
            absent: 1,
            observations: 'Adama était présent et très impliqué, montrant un excellent niveau.'
          },
          parentMessage: 'Chers parents,\n\nAdama démontre un excellent niveau dans toutes les compétences. Son vocabulaire est riche, sa lecture fluide et son expression orale remarquable. Pour maintenir cette excellence, je vous invite à continuer les activités de lecture enrichie et d\'expression créative à la maison.\n\nJe reste disponible pour toute question via le carnet numérique ou lors de la permanence du mardi (16 h-17 h).'
        }
      }
    },
    { 
      studentId: '2', 
      firstName: 'Moussa', 
      lastName: 'Keita', 
      studentAvatar: '/path/to/avatar2.png',
      attendanceStatus: 'late',
      notes: {
        'cp1-fr-orale': 65,
        'cp1-fr-vocab': 58,
        'cp1-fr-gram': 62,
        'cp1-fr-conj': 55,
        'cp1-fr-ortho': 60,
        'cp1-fr-lect-comp': 52,
        'cp1-math-num': 68,
        'cp1-math-mesure': 64,
        'cp1-math-geo': 70,
        'cp1-math-prob': 66,
        'cp1-en-speak-gram': 58,
        'cp1-hist-comp': 62,
        'cp1-geo-comp': 65,
      },
      progression: {
        byCompetence: {
            'cp1-fr-orale': [ { date: 'Trim 1', progression: 55 }, { date: 'Trim 2', progression: 60 }, { date: 'Trim 3', progression: 65 } ],
            'cp1-fr-vocab': [ { date: 'Trim 1', progression: 50 }, { date: 'Trim 2', progression: 55 }, { date: 'Trim 3', progression: 58 } ],
            'cp1-fr-gram': [ { date: 'Trim 1', progression: 58 }, { date: 'Trim 2', progression: 60 }, { date: 'Trim 3', progression: 62 } ],
            'cp1-math-num': [ { date: 'Trim 1', progression: 62 }, { date: 'Trim 2', progression: 65 }, { date: 'Trim 3', progression: 68 } ],
            'cp1-math-mesure': [ { date: 'Trim 1', progression: 60 }, { date: 'Trim 2', progression: 62 }, { date: 'Trim 3', progression: 64 } ],
        },
        byEvaluationType: {
          continue: [ { date: 'Lun', progression: 58 }, { date: 'Mar', progression: 60 }, { date: 'Mer', progression: 62 }, { date: 'Jeu', progression: 64 }, { date: 'Ven', progression: 66 } ],
          integration: [ { date: 'Sep', progression: 55 }, { date: 'Oct', progression: 58 }, { date: 'Nov', progression: 60 }, { date: 'Déc', progression: 62 }, { date: 'Jan', progression: 64 } ],
          trimestrielle: [ { date: 'Trim 1', progression: 58 }, { date: 'Trim 2', progression: 62 }, { date: 'Trim 3', progression: 66 } ],
        }
      },
      // Données PDI pour Moussa
      pdiSessions: {
        'trim1-week4': {
          sessionCode: 'PDI 01-04',
          sessionDate: '31 juillet 2025',
          trimester: 1,
          week: 4,
          competences: [
            {
              id: 'presk-fr-langage',
              name: 'Langage oral',
              currentScore: 65,
              weeklyEvolution: 2,
              teacherComment: 'Expression correcte ; quelques hésitations à améliorer.',
              status: 'en_cours'
            },
            {
              id: 'presk-fr-conte',
              name: 'Conte & Compréhension',
              currentScore: 62,
              weeklyEvolution: 3,
              teacherComment: 'Compréhension satisfaisante ; participation active.',
              status: 'en_cours'
            },
            {
              id: 'presk-fr-vocab',
              name: 'Vocabulaire',
              currentScore: 58,
              weeklyEvolution: 1,
              teacherComment: 'Vocabulaire correct ; quelques mots à enrichir.',
              status: 'en_cours'
            },
            {
              id: 'presk-fr-lecture',
              name: 'Lecture',
              currentScore: 52,
              weeklyEvolution: -1,
              teacherComment: 'Lecture hésitante ; besoin d\'entraînement supplémentaire.',
              status: 'a_renforcer'
            },
            {
              id: 'presk-fr-graphisme',
              name: 'Graphisme',
              currentScore: 68,
              weeklyEvolution: 4,
              teacherComment: 'Tracés réguliers ; bonne maîtrise du geste.',
              status: 'en_cours'
            }
          ],
          actionPlan: {
            inClass: [
              {
                action: 'Remédiation lecture',
                description: 'Séances de lecture 2×15 min cette semaine.'
              },
              {
                action: 'Enrichissement vocabulaire',
                description: 'Jeux de mots et devinettes en petits groupes.'
              }
            ],
            atHome: [
              {
                action: 'Lecture quotidienne',
                description: 'Lire ensemble 10 min chaque soir avec support visuel.'
              },
              {
                action: 'Conversation enrichie',
                description: 'Décrire les activités de la journée en détail.'
              }
            ],
            followUp: 'Évaluation des progrès lors de la prochaine séance PDI (07/08).'
          },
          attendance: {
            total: 20,
            present: 18,
            late: 1,
            absent: 1,
            observations: 'Moussa était présent et participatif.'
          },
          parentMessage: 'Chers parents,\n\nMoussa progresse bien dans la plupart des domaines. Il a encore quelques difficultés en lecture qui nécessitent un peu plus d\'entraînement. Je vous recommande de continuer les activités de lecture à la maison pour consolider ses acquis.\n\nJe reste disponible pour toute question via le carnet numérique ou lors de la permanence du mardi (16 h-17 h).'
        }
      }
    },
  ],
}; 