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

export interface StudentNote {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  notes: {
    [competenceId: string]: number | 'absent' | 'non-evalue';
  };
}

// Système de notation
export const getGradingStatus = (note: number | 'absent' | 'non-evalue') => {
  if (note === 'absent') return { text: 'Abs', color: 'text-gray-500' };
  if (note === 'non-evalue') return { text: 'NE', color: 'text-gray-500' };
  
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
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'cp-math-mesure', label: 'Mesure' },
                  { id: 'cp-math-geo', label: 'Géométrie' },
                  { id: 'cp-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'cp-as-course', label: 'Course'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'cp-as-dessin', label: 'Dessin'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'cp-as-impro', label: 'Improvisation'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'cp-as-chant', label: 'Chant'}]},
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
        ]
    },
    {
      id: 'stem', name: 'STEM',
      subjects: [
          {
              id: 'maths', name: 'Mathématiques',
              competences: [
                  { id: 'cp-math-mesure', label: 'Mesure' },
                  { id: 'cp-math-geo', label: 'Géométrie' },
                  { id: 'cp-math-problemes', label: 'Résolution de problèmes' },
              ]
          }
      ]
    },
    {
        id: 'art-sport', name: 'Créativité & Sport',
        subjects: [
            {id: 'eps', name: 'EPS', competences: [{id: 'cp-as-course', label: 'Course'}]},
            {id: 'arts-plastiques', name: 'Arts plastiques', competences: [{id: 'cp-as-dessin', label: 'Dessin'}]},
            {id: 'theatre', name: 'Théâtre/Drama', competences: [{id: 'cp-as-impro', label: 'Improvisation'}]},
            {id: 'musique', name: 'Musique', competences: [{id: 'cp-as-chant', label: 'Chant'}]},
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

// Données de notes des élèves
const studentNotesByClass: { [classId: string]: StudentNote[] } = {
    presk1: [
        {
            studentId: 'presk1-eleve-1', studentName: 'Amina Fall', studentAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            notes: { 'presk-fr-langage': 92, 'presk-fr-conte': 88, 'presk-math-num': 95, 'presk-as-marche': 75 }
        },
        {
            studentId: 'presk1-eleve-2', studentName: 'Babacar Dieng', studentAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            notes: { 'presk-fr-langage': 75, 'presk-fr-conte': 'absent', 'presk-math-num': 82, 'presk-as-marche': 90 }
        },
    ],
    presk2: [
        {
            studentId: 'presk2-eleve-1', studentName: 'Bineta Sarr', studentAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
            notes: { 'presk-fr-vocab': 85, 'presk-en-convo': 91, 'presk-math-geo': 78, 'presk-as-algo': 88 }
        },
    ],
    cp1: [
        {
            studentId: 'cp1-eleve-1', studentName: 'Fatou Diop', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            notes: {
                'cp-fr-orale': 95, 'cp-fr-ecrite': 82, 'cp-fr-fluidite': 91, 'cp-fr-idm': 85,
                'cp-en-convo': 88, 'cp-en-vocab': 76, 'cp-en-story': 92,
                'cp-math-mesure': 75, 'cp-math-geo': 68, 'cp-math-problemes': 81,
            }
        },
        {
            studentId: 'cp1-eleve-2', studentName: 'Moussa Sow', studentAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            notes: {
                'cp-fr-orale': 45, 'cp-fr-ecrite': 65, 'cp-fr-fluidite': 55, 'cp-fr-idm': 72,
                'cp-en-convo': 'absent', 'cp-en-vocab': 80, 'cp-en-story': 68,
                'cp-math-mesure': 92, 'cp-math-geo': 85, 'cp-math-problemes': 95,
            }
        },
        {
            studentId: 'cp1-eleve-3', studentName: 'Awa Gueye', studentAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            notes: {
                'cp-fr-orale': 88, 'cp-fr-ecrite': 91, 'cp-fr-fluidite': 94, 'cp-fr-idm': 89,
                'cp-en-convo': 92, 'cp-en-vocab': 'non-evalue', 'cp-en-story': 85,
                'cp-math-mesure': 34, 'cp-math-geo': 45, 'cp-math-problemes': 25,
            }
        }
    ],
    cp2: [
        {
            studentId: 'cp2-eleve-1', studentName: 'Ousmane Ba', studentAvatar: 'https://randomuser.me/api/portraits/men/7.jpg',
            notes: { 'cp-fr-idm': 88, 'cp-en-gram': 76, 'cp-math-geo': 91, 'cp-as-dessin': 85 }
        },
    ],
    ce1: [
        {
            studentId: 'ce1-eleve-1', studentName: 'Ndeye Coumba', studentAvatar: 'https://randomuser.me/api/portraits/women/8.jpg',
            notes: { 'ce-fr-ortho': 78, 'ce-en-reading': 85, 'ce-math-num': 90, 'ce-as-parcours': 95 }
        },
    ],
    ce2: [
        {
            studentId: 'ce2-eleve-1', studentName: 'Pape Diouf', studentAvatar: 'https://randomuser.me/api/portraits/men/9.jpg',
            notes: { 'ce-fr-gram': 68, 'ce-en-vocab': 79, 'ce-math-problemes': 82, 'ce-as-coord': 77 }
        },
    ],
    cm2: [
        {
            studentId: 'cm2-eleve-1', studentName: 'Rama Cisse', studentAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
            notes: { 'cm2-fr-expr-orale': 91, 'cm2-en-speak-gram': 88, 'cm2-math-num': 95, 'cm2-as-sport': 89 }
        },
        {
            studentId: 'cm2-eleve-2', studentName: 'Alioune Tine', studentAvatar: 'https://randomuser.me/api/portraits/men/11.jpg',
            notes: { 'cm2-fr-expr-orale': 72, 'cm2-en-speak-gram': 65, 'cm2-math-num': 'absent', 'cm2-as-sport': 92 }
        },
    ]
};

export const getSubjectsForClass = (classId: string): Domain[] => {
    return subjectsByClass[classId] || [];
}

export const getNotesForClass = (classId: string): StudentNote[] => {
    return studentNotesByClass[classId] || [];
} 