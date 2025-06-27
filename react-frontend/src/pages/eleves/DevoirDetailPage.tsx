import { useParams, Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';

// Données statiques pour simuler la récupération d'un devoir
const devoirsData = [
  {
    id: 1,
    title: 'Exercice Livre Math : résoudre une équation du second degrès',
    subject: 'Mathématique',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/math1/800/600',
    context: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
  },
  {
    id: 2,
    title: 'Exercice Livre Français : rédiger un poème sur le printemps.',
    subject: 'Français',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/french1/800/600',
    context: "Ce devoir vise à développer vos compétences en écriture poétique et votre capacité à exprimer des émotions et des images liées à la saison du printemps. Vous serez évalué sur l'originalité, le respect des formes poétiques et la richesse du vocabulaire."
  },
  // ... autres devoirs
];

const DevoirDetailPage = () => {
  const { devoirId } = useParams<{ devoirId: string }>();
  
  // Dans une vraie application, vous feriez un appel API pour récupérer les données du devoir.
  // Ici, nous utilisons les données statiques.
  const devoir = devoirsData.find(d => d.id.toString() === devoirId) || devoirsData[1]; // Fallback sur le devoir de français

  const getSubjectInitial = (subject: string) => {
    if (subject === 'Mathématique') return 'M';
    if (subject === 'Français') return 'F';
    return '?';
  };
  
  const getSubjectColor = (subject: string) => {
    if (subject === 'Mathématique') return 'bg-green-500';
    if (subject === 'Français') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  if (!devoir) {
    return <div>Devoir non trouvé.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Fil d'Ariane */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/devoirs" className="hover:text-gray-800">Devoirs</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="font-semibold text-gray-800 truncate">{devoir.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{devoir.title}</h1>
            <div className="flex items-center text-gray-600 space-x-4 mb-4">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                <span>Numéro de page : {devoir.page}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full ${getSubjectColor(devoir.subject)} text-white flex items-center justify-center font-bold mr-2 text-sm`}>
                  {getSubjectInitial(devoir.subject)}
                </div>
                <span>{devoir.subject}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Contexte</h2>
            <p className="text-gray-600 leading-relaxed">
              {devoir.context}
            </p>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <img src={devoir.imageUrl} alt={`Image pour ${devoir.title}`} className="w-full h-auto object-cover" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-48">
              {/* Carte vide comme sur la maquette */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DevoirDetailPage; 