export interface Competence {
  id: string;
  label: string;
}

export interface Subject {
  id: string;
  name: string;
  competences: Competence[];
}

export interface Domain {
  id: string;
  name: string;
  subjects: Subject[];
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

export interface StudentNote {
  studentId: string;
  firstName: string;
  lastName: string;
  studentAvatar: string;
  notes: {
    [competenceId: string]: number | 'absent' | 'non-evalue';
  };
  attendanceStatus?: 'present' | 'late' | 'absent';
  progression?: {
      byCompetence?: {
          [competenceId: string]: { date: string, progression: number }[]
      };
      byEvaluationType?: {
          [evalType: string]: { date: string, progression: number }[]
      };
  };
  pdiSessions?: {
    [sessionKey: string]: PdiPlanSession;
  };
}

// Système de notation
export const getGradingStatus = (note: number | 'absent' | 'non-evalue') => {
  if (note === 'absent') return { text: 'Abs', color: 'text-gray-500' };
  if (note === 'non-evalue') return { text: '-', color: 'text-gray-500' };
  
  if (typeof note === 'number') {
    if (note >= 75) return { text: `${note}`, color: 'text-green-600' }; // Succès
    if (note >= 50) return { text: `${note}`, color: 'text-orange-500' }; // Avertissement
    return { text: `${note}`, color: 'text-red-600' }; // Échec
  }
  
  // Fallback pour tout autre cas imprévu
  return { text: '-', color: 'text-gray-400' };
};

// Structure des matières par classe
const subjectsByClass: { [classId: string]: Domain[] } = {
  presk1: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'presk-fr-langage', label: 'Langage' },
            { id: 'presk-fr-conte', label: 'Conte' },
            { id: 'presk-fr-vocab', label: 'Vocabulaire' },
            { id: 'presk-fr-lecture', label: 'Lecture' },
            { id: 'presk-fr-graphisme', label: 'Graphisme' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'presk-en-convo', label: 'Conversation' },
              { id: 'presk-en-vocab', label: 'Vocabulaire' },
              { id: 'presk-en-listen-speak', label: 'Listening/Speaking' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'vivre-ensemble', name: 'Vivre ensemble', competences: [{id: 'presk-ve-coop', label:'Coopérer'}]},
            { id: 'vivre-milieu', name: 'Vivre dans son milieu', competences: [{id: 'presk-vm-desc', label:'Décrire'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'presk-quran-memo', label:'Mémorisation'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'presk-math-num', label: 'Numérique' },
                  { id: 'presk-math-geo', label: 'Géométrie' },
                  { id: 'presk-math-mesure', label: 'Mesure' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'motricite', name: 'Motricité', competences: [{id: 'presk-as-marche', label: 'Marcher'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'presk-as-algo', label: 'Algorithmes'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'presk-as-role', label: 'Jeu de rôle'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'presk-as-rythme', label: 'Rythme'}]},
        ]
    }
  ],
  presk2: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'presk-fr-langage', label: 'Langage' },
            { id: 'presk-fr-conte', label: 'Conte' },
            { id: 'presk-fr-vocab', label: 'Vocabulaire' },
            { id: 'presk-fr-lecture', label: 'Lecture' },
            { id: 'presk-fr-graphisme', label: 'Graphisme' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'presk-en-convo', label: 'Conversation' },
              { id: 'presk-en-vocab', label: 'Vocabulaire' },
              { id: 'presk-en-listen-speak', label: 'Listening/Speaking' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'vivre-ensemble', name: 'Vivre ensemble', competences: [{id: 'presk-ve-coop', label:'Coopérer'}]},
            { id: 'vivre-milieu', name: 'Vivre dans son milieu', competences: [{id: 'presk-vm-desc', label:'Décrire'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'presk-quran-memo', label:'Mémorisation'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'presk-math-num', label: 'Numérique' },
                  { id: 'presk-math-geo', label: 'Géométrie' },
                  { id: 'presk-math-mesure', label: 'Mesure' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'motricite', name: 'Motricité', competences: [{id: 'presk-as-marche', label: 'Marcher'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'presk-as-algo', label: 'Algorithmes'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'presk-as-role', label: 'Jeu de rôle'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'presk-as-rythme', label: 'Rythme'}]},
        ]
    }
  ],
  cp1: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'cp1-fr-orale', label: 'Exp Orale' },
            { id: 'cp1-fr-vocab', label: 'Vocabulaire' },
            { id: 'cp1-fr-gram', label: 'Grammaire' },
            { id: 'cp1-fr-conj', label: 'Conjugaison' },
            { id: 'cp1-fr-ortho', label: 'Orthographe' },
            { id: 'cp1-fr-lect-comp', label: 'Compréhension' },
            { id: 'cp1-fr-lect-idm', label: 'IDM' },
            { id: 'cp1-fr-lect-fluid', label: 'Fluidité' },
            { id: 'cp1-fr-prod-ecrite', label: 'Prod. Ecrite' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'cp1-en-speak-gram', label: 'Speaking-Gram' },
              { id: 'cp1-en-listen', label: 'Listening' },
              { id: 'cp1-en-vocab', label: 'vocab' },
              { id: 'cp1-en-read-write', label: 'reading-writing' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'cp1-hist', name: 'Histoire', competences: [{id: 'cp1-hist-comp', label:'Histoire Comp'}]},
            { id: 'cp1-geo', name: 'Geographie', competences: [{id: 'cp1-geo-comp', label:'Geographie Comp'}]},
            { id: 'cp1-ei', name: 'Etude Islamique', competences: [{id: 'cp1-ei-comp', label:'Etude Islamique Comp'}]},
            { id: 'cp1-quran', name: 'Quran', competences: [{id: 'cp1-quran-comp', label:'Quran Comp'}]},
            { id: 'cp1-ve', name: 'Vivre Ensemble', competences: [{id: 'cp1-ve-comp', label:'Vivre Ensemble Comp'}]},
            { id: 'cp1-vdsm', name: 'VDSM', competences: [{id: 'cp1-vdsm-comp', label:'VDSM Comp'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'MATHS',
              competences: [
                  { id: 'cp1-math-num', label: 'Act Numérique' },
                  { id: 'cp1-math-mesure', label: 'Act de Mesure' },
                  { id: 'cp1-math-geo', label: 'Act géométrique' },
                  { id: 'cp1-math-prob', label: 'Rés de Problèm' },
              ]
          },
          {
            id: 'ist', name: 'IST',
            competences: [
                { id: 'cp1-ist-comp', label: 'IST Comp' },
            ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'CREATIVITE ARTISTIQUE / SPORTIVE',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'cp1-eps-comp', label: 'Activités Physiques'}]},
            {id: 'arts', name: 'Arts', competences: [
                { id: 'cp1-arts-plast', label: 'Arts Plastiques'},
                { id: 'cp1-arts-theatre', label: 'Theatre/Drama'},
                { id: 'cp1-arts-drum', label: 'Drumming/Mus'},
            ]},
        ]
    }
  ],
  cp2: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'cp-fr-orale', label: 'Comm. orale' },
            { id: 'cp-fr-ecrite', label: 'Prod. écrite' },
            { id: 'cp-fr-fluidite', label: 'Fluidité' },
            { id: 'cp-fr-idm', label: 'IDM' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'cp-en-convo', label: 'Conversation' },
              { id: 'cp-en-vocab', label: 'Vocabulaire' },
              { id: 'cp-en-story', label: 'Story Telling' },
              { id: 'cp-en-gram', label: 'Grammaire' },
              { id: 'cp-en-listen-speak', label: 'Listening/Speaking' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'geographie', name: 'Géographie', competences: [{id: 'cp-geo-repere', label:'Repères mobiles'}]},
            { id: 'lecture-arabe', name: 'Lecture arabe', competences: [{id: 'cp-ar-lecture', label:'Lecture'}]},
            { id: 'etudes-islamiques', name: 'Études islamiques', competences: [{id: 'cp-ei-dogme', label:'Dogme'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'cp-quran-memo', label:'Mémorisation'}]},
            { id: 'vivre-ensemble', name: 'Vivre ensemble', competences: [{id: 'cm2-sh-ve', label:'Civisme'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'cm2-math-num', label: 'Activités numériques' },
                  { id: 'cm2-math-mesure', label: 'Mesure' },
                  { id: 'cm2-math-geo', label: 'Géométrie' },
                  { id: 'cm2-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'cm2-as-sport', label: 'Sport collectif'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'cm2-as-crea', label: 'Création libre'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'cm2-as-piece', label: 'Jouer une pièce'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'cm2-as-compo', label: 'Composition'}]},
        ]
    }
  ],
  ce1: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'ce-fr-ortho', label: 'Orthographe' },
            { id: 'ce-fr-vocab', label: 'Vocabulaire' },
            { id: 'ce-fr-gram', label: 'Grammaire' },
            { id: 'ce-fr-conj', label: 'Conjugaison' },
            { id: 'ce-fr-lec-cgp', label: 'Lecture (CGP)' },
            { id: 'ce-fr-lec-idm', label: 'Lecture (IDM)' },
            { id: 'ce-fr-lec-comp', label: 'Lecture (Compr.)' },
            { id: 'ce-fr-lec-fluid', label: 'Lecture (Fluidité)' },
            { id: 'ce-fr-prod-ecrite', label: 'Prod. écrite' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'ce-en-gram', label: 'Grammaire' },
              { id: 'ce-en-speak-listen', label: 'Speaking/Listening' },
              { id: 'ce-en-vocab', label: 'Vocabulaire' },
              { id: 'ce-en-reading', label: 'Reading' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'wellness', name: 'Wellness', competences: [{id: 'ce-sh-palu', label:'Facteurs Paludisme'}]},
            { id: 'geographie', name: 'Géographie', competences: [{id: 'ce-sh-geo', label:'Se repérer'}]},
            { id: 'histoire', name: 'Histoire', competences: [{id: 'ce-sh-hist', label:'Chronologie'}]},
            { id: 'lecture-arabe', name: 'Lecture arabe', competences: [{id: 'ce-sh-arabe', label:'Lecture'}]},
            { id: 'etudes-islamiques', name: 'Études islamiques', competences: [{id: 'ce-sh-ei', label:'Règles'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'ce-sh-quran', label:'Mémorisation'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'ce-math-num', label: 'Numérique' },
                  { id: 'ce-math-mesure', label: 'Mesure' },
                  { id: 'ce-math-geo', label: 'Géométrie' },
                  { id: 'ce-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'ce-as-parcours', label: 'Parcours'}]},
            {id: 'motricite', name: 'Motricité', competences: [{id: 'ce-as-coord', label: 'Coordination'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'ce-as-couleurs', label: 'Couleurs'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'ce-as-emotion', label: 'Émotions'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'ce-as-instrum', label: 'Instruments'}]},
        ]
    }
  ],
  ce2: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'ce-fr-ortho', label: 'Orthographe' },
            { id: 'ce-fr-vocab', label: 'Vocabulaire' },
            { id: 'ce-fr-gram', label: 'Grammaire' },
            { id: 'ce-fr-conj', label: 'Conjugaison' },
            { id: 'ce-fr-lec-cgp', label: 'Lecture (CGP)' },
            { id: 'ce-fr-lec-idm', label: 'Lecture (IDM)' },
            { id: 'ce-fr-lec-comp', label: 'Lecture (Compr.)' },
            { id: 'ce-fr-lec-fluid', label: 'Lecture (Fluidité)' },
            { id: 'ce-fr-prod-ecrite', label: 'Prod. écrite' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'ce-en-gram', label: 'Grammaire' },
              { id: 'ce-en-speak-listen', label: 'Speaking/Listening' },
              { id: 'ce-en-vocab', label: 'Vocabulaire' },
              { id: 'ce-en-reading', label: 'Reading' },
          ],
        }
      ],
    },
    {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'wellness', name: 'Wellness', competences: [{id: 'ce-sh-palu', label:'Facteurs Paludisme'}]},
            { id: 'geographie', name: 'Géographie', competences: [{id: 'ce-sh-geo', label:'Se repérer'}]},
            { id: 'histoire', name: 'Histoire', competences: [{id: 'ce-sh-hist', label:'Chronologie'}]},
            { id: 'lecture-arabe', name: 'Lecture arabe', competences: [{id: 'ce-sh-arabe', label:'Lecture'}]},
            { id: 'etudes-islamiques', name: 'Études islamiques', competences: [{id: 'ce-sh-ei', label:'Règles'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'ce-sh-quran', label:'Mémorisation'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'ce-math-num', label: 'Numérique' },
                  { id: 'ce-math-mesure', label: 'Mesure' },
                  { id: 'ce-math-geo', label: 'Géométrie' },
                  { id: 'ce-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'ce-as-parcours', label: 'Parcours'}]},
            {id: 'motricite', name: 'Motricité', competences: [{id: 'ce-as-coord', label: 'Coordination'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'ce-as-couleurs', label: 'Couleurs'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'ce-as-emotion', label: 'Émotions'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'ce-as-instrum', label: 'Instruments'}]},
        ]
    }
  ],
  cm2: [
    {
      id: 'lang-comm', name: 'Langues et Communication',
      subjects: [
        { 
          id: 'francais', name: 'Français',
          competences: [
            { id: 'cm2-fr-expr-orale', label: 'Expr. orale' },
            { id: 'cm2-fr-vocab', label: 'Vocabulaire' },
            { id: 'cm2-fr-gram', label: 'Grammaire' },
            { id: 'cm2-fr-conj', label: 'Conjugaison' },
            { id: 'cm2-fr-ortho', label: 'Orthographe' },
            { id: 'cm2-fr-lec-comp', label: 'Lecture (Compr.)' },
            { id: 'cm2-fr-lec-idm', label: 'Lecture (IDM)' },
            { id: 'cm2-fr-lec-fluid', label: 'Lecture (Fluidité)' },
            { id: 'cm2-fr-prod-ecrite', label: 'Prod. écrite' },
          ],
        },
        {
          id: 'anglais', name: 'Anglais',
          competences: [
              { id: 'cm2-en-speak-gram', label: 'Speaking/Grammaire' },
              { id: 'cm2-en-listen-vocab', label: 'Listening/Vocabulaire' },
              { id: 'cm2-en-read-write', label: 'Reading/Writing' },
          ],
        }
      ],
    },
     {
        id: 'sci-hum', name: 'Sciences Humaines',
        subjects: [
            { id: 'histoire', name: 'Histoire', competences: [{id: 'cm2-sh-hist', label:'Paléolithique'}]},
            { id: 'geographie', name: 'Géographie', competences: [{id: 'cm2-sh-geo', label:'Élevage'}]},
            { id: 'etudes-islamiques', name: 'Études islamiques', competences: [{id: 'cm2-sh-ei', label:'Dogme'}]},
            { id: 'qran', name: 'Qran', competences: [{id: 'cm2-sh-quran', label:'Mémorisation'}]},
            { id: 'vivre-ensemble', name: 'Vivre ensemble', competences: [{id: 'cm2-sh-ve', label:'Civisme'}]},
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'cm2-math-num', label: 'Activités numériques' },
                  { id: 'cm2-math-mesure', label: 'Mesure' },
                  { id: 'cm2-math-geo', label: 'Géométrie' },
                  { id: 'cm2-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'cm2-as-sport', label: 'Sport collectif'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'cm2-as-crea', label: 'Création libre'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'cm2-as-piece', label: 'Jouer une pièce'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'cm2-as-compo', label: 'Composition'}]},
        ]
    }
  ],
};

/**
 * Génère des données de notes pour une classe et une liste d'élèves données.
 * Les notes sont initialisées comme 'non-evalue'.
 */
export const getNotesForClass = (classId: string, students: { id: string, firstName: string, lastName: string, avatar: string }[]): StudentNote[] => {
  const subjects = subjectsByClass[classId] || [];
  const allCompetences = subjects.flatMap(d => d.subjects.flatMap(s => s.competences));

  return students.map(student => {
    const notes: { [competenceId:string]: number | 'absent' | 'non-evalue' } = {};
    allCompetences.forEach(competence => {
      // Les notes sont initialisées à 'non-evalue' pour que l'enseignant les remplisse.
      notes[competence.id] = 'non-evalue';
    });
    
    return {
      studentId: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      studentAvatar: student.avatar,
      notes,
    };
  });
};

export const getSubjectsForClass = (classId: string): Domain[] => {
    return subjectsByClass[classId] || [];
}

// DONNÉES DES ÉLÈVES PAR CLASSE
// Source de vérité pour les élèves. 
// Pour ajouter un élève, il suffit de l'ajouter à la bonne classe ici.
const studentDataByClass = {
  presk1: [
    { studentId: 'presk1-eleve-1', firstName: 'Amina', lastName: 'Fall', studentAvatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { studentId: 'presk1-eleve-2', firstName: 'Babacar', lastName: 'Dieng', studentAvatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  ],
  presk2: [
    { studentId: 'presk2-eleve-1', firstName: 'Bineta', lastName: 'Sarr', studentAvatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  ],
  cp1: [
    // === NOUVELLE LISTE DE 20 ÉLÈVES POUR CP1 ===
    // --- 8 Filles ---
    { studentId: 'cp1-eleve-1', firstName: 'Awa', lastName: 'Gueye', studentAvatar: 'https://i.pravatar.cc/150?img=1' },
    { studentId: 'cp1-eleve-2', firstName: 'Fatou', lastName: 'Diop', studentAvatar: 'https://i.pravatar.cc/150?img=5' },
    { studentId: 'cp1-eleve-3', firstName: 'Mariama', lastName: 'Sow', studentAvatar: 'https://i.pravatar.cc/150?img=7' },
    { studentId: 'cp1-eleve-4', firstName: 'Ndeye', lastName: 'Fall', studentAvatar: 'https://i.pravatar.cc/150?img=8' },
    { studentId: 'cp1-eleve-5', firstName: 'Astou', lastName: 'Ndiaye', studentAvatar: 'https://i.pravatar.cc/150?img=10' },
    { studentId: 'cp1-eleve-6', firstName: 'Coumba', lastName: 'Diallo', studentAvatar: 'https://i.pravatar.cc/150?img=11' },
    { studentId: 'cp1-eleve-7', firstName: 'Khadija', lastName: 'Ba', studentAvatar: 'https://i.pravatar.cc/150?img=12' },
    { studentId: 'cp1-eleve-8', firstName: 'Aminata', lastName: 'Cissé', studentAvatar: 'https://i.pravatar.cc/150?img=14' },
    // --- 12 Garçons ---
    { studentId: 'cp1-eleve-9', firstName: 'Moussa', lastName: 'Sow', studentAvatar: 'https://i.pravatar.cc/150?img=3' },
    { studentId: 'cp1-eleve-10', firstName: 'Ousmane', lastName: 'Traoré', studentAvatar: 'https://i.pravatar.cc/150?img=15' },
    { studentId: 'cp1-eleve-11', firstName: 'Ibrahima', lastName: 'Diallo', studentAvatar: 'https://i.pravatar.cc/150?img=16' },
    { studentId: 'cp1-eleve-12', firstName: 'Cheikh', lastName: 'Dieng', studentAvatar: 'https://i.pravatar.cc/150?img=18' },
    { studentId: 'cp1-eleve-13', firstName: 'Alioune Badara', lastName: 'Thiam', studentAvatar: 'https://i.pravatar.cc/150?img=20' },
    { studentId: 'cp1-eleve-14', firstName: 'Pape', lastName: 'Diouf', studentAvatar: 'https://i.pravatar.cc/150?img=22' },
    { studentId: 'cp1-eleve-15', firstName: 'El Hadji', lastName: 'Sy', studentAvatar: 'https://i.pravatar.cc/150?img=25' },
    { studentId: 'cp1-eleve-16', firstName: 'Daouda', lastName: 'Faye', studentAvatar: 'https://i.pravatar.cc/150?img=28' },
    { studentId: 'cp1-eleve-17', firstName: 'Abdoulaye', lastName: 'Sarr', studentAvatar: 'https://i.pravatar.cc/150?img=31' },
    { studentId: 'cp1-eleve-18', firstName: 'Lamine', lastName: 'Camara', studentAvatar: 'https://i.pravatar.cc/150?img=33' },
    { studentId: 'cp1-eleve-19', firstName: 'Mamadou', lastName: 'Diallo', studentAvatar: 'https://i.pravatar.cc/150?img=35' },
    { studentId: 'cp1-eleve-20', firstName: 'Souleymane', lastName: 'Ba', studentAvatar: 'https://i.pravatar.cc/150?img=40' },
  ],
  cp2: [
    { studentId: 'cp2-eleve-1', firstName: 'Ousmane', lastName: 'Ba', studentAvatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  ],
  ce1: [
    { studentId: 'ce1-eleve-1', firstName: 'Ndeye', lastName: 'Coumba', studentAvatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
  ],
  ce2: [
    { studentId: 'ce2-eleve-1', firstName: 'Pape', lastName: 'Diouf', studentAvatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
  ],
  cm2: [
    { studentId: 'cm2-eleve-1', firstName: 'Rama', lastName: 'Cisse', studentAvatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { studentId: 'cm2-eleve-2', firstName: 'Alioune', lastName: 'Tine', studentAvatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  ]
};

/**
 * Combine les données des élèves et les notes pour l'export.
 * C'est la variable que le StudentContext va utiliser.
 */
export const studentNotesByClass: { [classId: string]: StudentNote[] } = {};

Object.keys(studentDataByClass).forEach(classId => {
  const studentsOfClass = studentDataByClass[classId as keyof typeof studentDataByClass].map(s => ({
    id: s.studentId,
    firstName: s.firstName,
    lastName: s.lastName,
    avatar: s.studentAvatar
  }));
  studentNotesByClass[classId] = getNotesForClass(classId, studentsOfClass);
});

// Nouvelle fonction pour calculer les moyennes trimestrielles
export const calculateTrimesterAverages = (allNotes: StudentNote[], trimestre: number): StudentNote[] => {
    // Dans une vraie application, on filtrerait les notes par date du trimestre.
    // Ici, on simule en générant 3 sets de notes et en choisissant un.
    // Cette simulation garantit des moyennes différentes pour chaque trimestre.
    
    return allNotes.map(studentNote => {
        const averagedNotes: { [key: string]: number | 'absent' | 'non-evalue' } = {};

        for (const competenceId in studentNote.notes) {
            // Simuler 3 notes pour chaque compétence sur l'année
            const note1 = Math.random() > 0.1 ? Math.floor(40 + Math.random() * 61) : 'absent';
            const note2 = Math.random() > 0.1 ? Math.floor(40 + Math.random() * 61) : 'absent';
            const note3 = Math.random() > 0.1 ? Math.floor(40 + Math.random() * 61) : 'absent';

            const trimesterNotes: (number | 'absent' | 'non-evalue')[] = [note1, note2, note3];
            const selectedNote = trimesterNotes[trimestre -1]; // Choisir la note simulée pour le trimestre
            
            // Pour la démo, on ne calcule pas de moyenne mais on prend une note "trimestrielle" simulée
            // Dans un cas réel, on aurait une liste de notes par date, on filtrerait par trimestre et on ferait la moyenne
            if(typeof selectedNote === 'number') {
                averagedNotes[competenceId] = selectedNote;
            } else {
                averagedNotes[competenceId] = 'non-evalue'; // ou 'absent'
            }
        }

        return {
            ...studentNote,
            notes: averagedNotes,
        };
    });
};
