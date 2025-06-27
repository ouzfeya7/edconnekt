import { useState } from 'react';
import { Link } from 'react-router-dom';
import SelectCard from '../../components/Header/SelectCard';

const devoirsData = [
  {
    id: 1,
    title: 'Exercice Livre Math : résoudre une équation du second degrès',
    subject: 'Mathématique',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/math1/400/300'
  },
  {
    id: 2,
    title: 'Exercice Livre Français : rédiger un poème sur le printemps.',
    subject: 'Français',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/french1/400/300'
  },
  {
    id: 3,
    title: 'Exercice Anglais : traduire un texte sur les animaux.',
    subject: 'Anglais',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/english1/400/300'
  },
  {
    id: 4,
    title: "Exercice Math : calculer l'aire d'un triangle.",
    subject: 'Mathématique',
    page: '12-13-14',
    imageUrl: 'https://picsum.photos/seed/math2/400/300'
  }
];

const DevoirCard = ({ devoir }: { devoir: typeof devoirsData[0] }) => {
  const getSubjectInitial = (subject: string) => {
    if (subject === 'Mathématique') return 'M';
    if (subject === 'Français') return 'F';
    if (subject === 'Anglais') return 'A';
    return '?';
  };
  
  const getSubjectColor = (subject: string) => {
    if (subject === 'Mathématique') return 'bg-green-500';
    if (subject === 'Français') return 'bg-purple-500';
    if (subject === 'Anglais') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <Link to={`/devoirs/${devoir.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <img src={devoir.imageUrl} alt={devoir.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 mb-2 flex-grow">{devoir.title}</h3>
        <p className="text-sm text-gray-500 mb-3">Numéro de page : {devoir.page}</p>
        <div className="flex items-center text-sm text-gray-700 mb-4">
          <div className={`w-6 h-6 rounded-full ${getSubjectColor(devoir.subject)} text-white flex items-center justify-center font-bold mr-2`}>
            {getSubjectInitial(devoir.subject)}
          </div>
          <span>{devoir.subject}</span>
        </div>
        <div className="mt-auto w-full bg-orange-50 text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-100 transition-colors text-center">
          Voir détails
        </div>
      </div>
    </Link>
  );
};


const DevoirsPage = () => {
  const [selectedDate, setSelectedDate] = useState("24 Mars 2025");
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 1");
  const [selectedSubject, setSelectedSubject] = useState("Tout");

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Devoirs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SelectCard 
          label="Date"
          value={selectedDate}
          options={["24 Mars 2025", "25 Mars 2025"]}
          onChange={setSelectedDate}
        />
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label className="block text-sm text-gray-500 font-medium">Classe</label>
            <div className="mt-2 text-gray-900 font-medium">4e B</div>
        </div>
        <SelectCard 
          label="Trimestre"
          value={selectedTrimester}
          options={["Trimestre 1", "Trimestre 2", "Trimestre 3"]}
          onChange={setSelectedTrimester}
        />
        <SelectCard 
          label="Matière"
          value={selectedSubject}
          options={["Tout", "Mathématique", "Français", "Anglais"]}
          onChange={setSelectedSubject}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {devoirsData
          .filter(d => selectedSubject === 'Tout' || d.subject === selectedSubject)
          .map((devoir) => (
            <DevoirCard key={devoir.id} devoir={devoir} />
        ))}
      </div>
    </div>
  );
};

export default DevoirsPage; 