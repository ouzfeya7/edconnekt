import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useResources } from '../contexts/ResourceContext';
import { useEffect, useState } from 'react';
import { User, BookOpen, Book, Target, Paperclip, FileText, Video, Award, MessageCircle, Download, Play } from 'lucide-react';
import { useUser } from '../layouts/DashboardLayout'; // Import useUser

interface Comment {
  user: string;
  text: string;
  date: string;
}

const fakeDetailsData = {
  author: 'M. Ibrahima Diouf',
  class: 'CP',
  objectifs: [
    "Comprendre les bases du développement durable",
    "Savoir identifier les enjeux environnementaux locaux",
    "Développer l’esprit critique sur la consommation"
  ],
  attachments: [
    { type: 'pdf', label: 'Document pédagogique', url: '#', fileName: 'ressource.pdf' },
    { type: 'video', label: 'Vidéo explicative', url: '#', fileName: 'video.mp4' }
  ],
  competences: [
    "Lecture et compréhension de documents",
    "Travail en groupe",
    "Expression orale"
  ],
  initialComments: [
    { user: 'Fatou', text: 'Super ressource, merci !', date: '22/07/2024' },
    { user: 'Moussa', text: 'Très utile pour la classe.', date: '21/07/2024' }
  ]
};

const RessourceDetailPage = () => {
  const { resourceId } = useParams();
  const id = resourceId;
  const navigate = useNavigate();
  const location = useLocation();
  const { resources } = useResources();
  const { user } = useUser(); // Get logged in user
  const resource = resources.find(r => r.id === Number(id));

  const [hasRedirected, setHasRedirected] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(fakeDetailsData.initialComments); // Manage comments in state

  useEffect(() => {
    if (!resource || hasRedirected) return;

    let paid: number[] = [];
    const paidResourcesString = localStorage.getItem('paidResources');
    if (paidResourcesString) {
      paid = paidResourcesString.split(',').map(Number).filter(item => !isNaN(item));
    }

    if (resource.isPaid && !paid.includes(Number(id))) {
      if (!location.pathname.startsWith('/paiement')) {
        navigate(`/paiement/${id}`);
        setHasRedirected(true);
      }
    }
  }, [id, resource, navigate, location.pathname, hasRedirected]);

  if (!resource) {
    return <div className="p-8 text-center text-gray-600">Ressource introuvable.</div>;
  }

  const handleCommentSubmit = () => {
    if (newComment.trim() && resource) {
      const newCommentObj = { user: user?.name || 'Utilisateur', text: newComment.trim(), date: new Date().toLocaleDateString() };
      setComments(prev => [...prev, newCommentObj]); // Add new comment to state
      setNewComment(''); // Clear input after submission
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 md:p-8 w-full">
      {/* En-tête */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-start px-4 md:px-12 pt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <img src={resource.imageUrl} alt={resource.title} className="w-full max-w-xs md:max-w-sm h-auto object-cover rounded-xl shadow mb-4 md:mb-0" />
        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-7 h-7 text-orange-500" /> {resource.title}</h1>
          <div className="flex flex-wrap gap-4 items-center text-gray-700 text-sm">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {fakeDetailsData.author}</span>
            <span className="flex items-center gap-1"><Book className="w-4 h-4" /> Classe : {fakeDetailsData.class}</span>
            <span className="flex items-center gap-1"><Paperclip className="w-4 h-4" /> Matière : {resource.subject}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">Objectifs :</span>
          </div>
          <ul className="list-disc list-inside ml-6 text-gray-700 text-sm">
            {fakeDetailsData.objectifs.map((obj, i) => <li key={i}>{obj}</li>)}
          </ul>

          {/* Description déplacée ici */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><Book className="w-6 h-6 text-blue-500" /> Description</h2>
            <p className="text-gray-700 text-base leading-relaxed">{resource.description}</p>
          </div>

          {/* Pièces jointes déplacées ici */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Paperclip className="w-6 h-6 text-purple-500" /> Pièces jointes</h2>
            <div className="flex flex-wrap gap-4">
              {fakeDetailsData.attachments.map((att, i) => (
                <div key={i} className="flex flex-col items-center gap-2 bg-gray-100 rounded-lg p-4 flex-1">
                  {att.type === 'pdf' ? <FileText className="w-8 h-8 text-red-500" /> : <Video className="w-8 h-8 text-indigo-500" />}
                  <div className="font-medium text-gray-700">{att.label}</div>
                  <button className="mt-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold flex items-center gap-2 hover:bg-orange-600 transition w-full">
                    {att.type === 'pdf' ? <Download className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {att.type === 'pdf' ? 'Télécharger le PDF' : 'Regarder la vidéo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compétences */}
      <div className="w-full px-4 md:px-12 mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><Award className="w-6 h-6 text-emerald-500" /> Compétences développées</h2>
        <ul className="list-disc list-inside ml-6 text-gray-700 text-base">
          {fakeDetailsData.competences.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* Commentaires */}
      <div className="w-full px-4 md:px-12 mt-8 mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><MessageCircle className="w-6 h-6 text-blue-400" /> Commentaires</h2>
        <div className="flex flex-col gap-3">
          {comments.slice().reverse().map((com, i) => (
            <div key={i} className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-700 mr-2">{com.user} :</span>
              <span className="text-gray-600 flex-1">{com.text}</span>
              <span className="text-gray-500 text-xs">{com.date}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCommentSubmit();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RessourceDetailPage;
