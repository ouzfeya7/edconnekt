import React, { useState } from 'react';
import { useAuth } from './authentification/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  Circle, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowRight,
  PenTool,
  BookOpen,
  FolderOpen,
  Ruler,
  Palette,
  Briefcase,
  Monitor,
  Droplets
} from 'lucide-react';

// Types pour les fournitures
interface Fourniture {
  id: number;
  nom: string;
  description: string;
  categorie: 'Écriture & Correction' | 'Papeterie & Cahiers' | 'Classement & Organisation' | 'Géométrie & Mathématiques' | 'Arts plastiques & Loisirs créatifs' | 'Trousse & Accessoires' | 'Fournitures numériques' | 'Hygiène & Divers';
  quantite: number;
  estAchete: boolean;
}

// Données mock initiales
const fournituresData: Fourniture[] = [
  {
    id: 1,
    nom: "Stylos bleus",
    description: "Stylos à bille bleue, 10 pièces",
    categorie: "Écriture & Correction",
    quantite: 2,
    estAchete: true
  },
  {
    id: 2,
    nom: "Cahier 96 pages",
    description: "Cahier à grands carreaux, 96 pages",
    categorie: "Papeterie & Cahiers",
    quantite: 5,
    estAchete: false
  },
  {
    id: 3,
    nom: "Règle 20cm",
    description: "Règle en plastique transparent, 20cm",
    categorie: "Géométrie & Mathématiques",
    quantite: 1,
    estAchete: false
  },
  {
    id: 4,
    nom: "Crayons de couleur",
    description: "Boîte de 12 crayons de couleur",
    categorie: "Arts plastiques & Loisirs créatifs",
    quantite: 1,
    estAchete: false
  },
  {
    id: 5,
    nom: "Mouchoirs en papier",
    description: "Paquet de 100 mouchoirs",
    categorie: "Hygiène & Divers",
    quantite: 2,
    estAchete: false
  },
  {
    id: 6,
    nom: "Classeur A4",
    description: "Classeur à anneaux, format A4",
    categorie: "Classement & Organisation",
    quantite: 1,
    estAchete: true
  },
  {
    id: 7,
    nom: "Trousse",
    description: "Trousse pour stylos et crayons",
    categorie: "Trousse & Accessoires",
    quantite: 1,
    estAchete: false
  },
  {
    id: 8,
    nom: "Clé USB 8GB",
    description: "Clé USB pour sauvegarder les documents",
    categorie: "Fournitures numériques",
    quantite: 1,
    estAchete: false
  }
];

// Composant Modal pour CRUD
interface FournitureModalProps {
  isOpen: boolean;
  onClose: () => void;
  fourniture?: Fourniture | null;
  onSave: (fourniture: Omit<Fourniture, 'id'>) => void;
}

function FournitureModal({ isOpen, onClose, fourniture, onSave }: FournitureModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: 'Écriture & Correction' as const,
    quantite: 1,
    estAchete: false
  });

  React.useEffect(() => {
    if (fourniture) {
      setFormData({
        nom: fourniture.nom,
        description: fourniture.description,
        categorie: fourniture.categorie,
        quantite: fourniture.quantite,
        estAchete: fourniture.estAchete
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        categorie: 'Écriture & Correction',
        quantite: 1,
        estAchete: false
      });
    }
  }, [fourniture]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {fourniture ? 'Modifier la fourniture' : 'Ajouter une fourniture'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la fourniture *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value as any})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                required
              >
                <option value="Écriture & Correction">Écriture & Correction</option>
                <option value="Papeterie & Cahiers">Papeterie & Cahiers</option>
                <option value="Classement & Organisation">Classement & Organisation</option>
                <option value="Géométrie & Mathématiques">Géométrie & Mathématiques</option>
                <option value="Arts plastiques & Loisirs créatifs">Arts plastiques & Loisirs créatifs</option>
                <option value="Trousse & Accessoires">Trousse & Accessoires</option>
                <option value="Fournitures numériques">Fournitures numériques</option>
                <option value="Hygiène & Divers">Hygiène & Divers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantité *
              </label>
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({...formData, quantite: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              <Save className="w-4 h-4" />
              {fourniture ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Page principale
function FournituresPage() {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFourniture, setEditingFourniture] = useState<Fourniture | null>(null);
  const [fournitures, setFournitures] = useState<Fourniture[]>(fournituresData);
  const [fournitureToDelete, setFournitureToDelete] = useState<Fourniture | null>(null);

  const isEnseignant = roles.includes('enseignant') || roles.includes('directeur');
  const isParent = roles.includes('parent') || roles.includes('espaceFamille');
  const isEleve = roles.includes('eleve');

  // Actions CRUD pour l'enseignant
  const ajouterFourniture = (fourniture: Omit<Fourniture, 'id'>) => {
    const nouvelleFourniture: Fourniture = {
      ...fourniture,
      id: Date.now(),
      estAchete: false
    };
    setFournitures(prev => [nouvelleFourniture, ...prev]);
  };

  const modifierFourniture = (id: number, fourniture: Omit<Fourniture, 'id'>) => {
    setFournitures(prev => 
      prev.map(f => f.id === id ? { ...fourniture, id, estAchete: f.estAchete } : f)
    );
  };

  const supprimerFourniture = (id: number) => {
    setFournitures(prev => prev.filter(f => f.id !== id));
    setFournitureToDelete(null);
  };

  const toggleAchete = (id: number) => {
    setFournitures(prev => 
      prev.map(f => f.id === id ? { ...f, estAchete: !f.estAchete } : f)
    );
  };

  // Gestion de la confirmation de suppression
  const handleDeleteClick = (fourniture: Fourniture) => {
    setFournitureToDelete(fourniture);
  };

  const handleConfirmDelete = () => {
    if (fournitureToDelete) {
      supprimerFourniture(fournitureToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setFournitureToDelete(null);
  };

  // Filtrage des fournitures
  const filteredFournitures = fournitures.filter((fourniture) => {
    const matchesSearch = fourniture.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fourniture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = !filterCategorie || fourniture.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  // Statistiques
  const totalFournitures = fournitures.length;
  const fournituresAchetees = fournitures.filter(f => f.estAchete).length;
  const fournituresManquantes = totalFournitures - fournituresAchetees;

  // Gestion du modal
  const handleOpenModal = (fourniture?: Fourniture) => {
    setEditingFourniture(fourniture || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFourniture(null);
  };

  const handleSaveFourniture = (fourniture: Omit<Fourniture, 'id'>) => {
    if (editingFourniture) {
      modifierFourniture(editingFourniture.id, fourniture);
    } else {
      ajouterFourniture(fourniture);
    }
    handleCloseModal();
  };

  // Helper to get category style
  const getCategoryStyle = (categorie: Fourniture['categorie']) => {
    switch (categorie) {
      case 'Écriture & Correction':
        return { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', icon: <PenTool className="w-5 h-5" /> };
      case 'Papeterie & Cahiers':
        return { bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', icon: <BookOpen className="w-5 h-5" /> };
      case 'Classement & Organisation':
        return { bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', icon: <FolderOpen className="w-5 h-5" /> };
      case 'Géométrie & Mathématiques':
        return { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700', icon: <Ruler className="w-5 h-5" /> };
      case 'Arts plastiques & Loisirs créatifs':
        return { bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-700', icon: <Palette className="w-5 h-5" /> };
      case 'Trousse & Accessoires':
        return { bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700', icon: <Briefcase className="w-5 h-5" /> };
      case 'Fournitures numériques':
        return { bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', textColor: 'text-cyan-700', icon: <Monitor className="w-5 h-5" /> };
      case 'Hygiène & Divers':
        return { bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', icon: <Droplets className="w-5 h-5" /> };
      default:
        return { bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700', icon: <Package className="w-5 h-5" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        {/* Header avec bouton d'ajout pour l'enseignant */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEnseignant ? 'Gestion des fournitures' : 'Fournitures scolaires'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEnseignant 
                    ? 'Gérez la liste des fournitures pour votre classe'
                    : 'Liste des fournitures nécessaires pour l\'année scolaire'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Statistiques compactes */}
              {!isEnseignant && (
                <div className="flex gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">{totalFournitures}</div>
                    <div className="text-xs text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">{fournituresAchetees}</div>
                    <div className="text-xs text-green-600">Achetées</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-lg font-bold text-amber-700">{fournituresManquantes}</div>
                    <div className="text-xs text-amber-600">Manquantes</div>
                  </div>
                </div>
              )}
              
              {/* Bouton d'ajout pour l'enseignant */}
              {isEnseignant && (
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une fourniture
                </button>
              )}
            </div>
          </div>

          {/* Filtres avec design amélioré */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une fourniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              <option value="Écriture & Correction">Écriture & Correction</option>
              <option value="Papeterie & Cahiers">Papeterie & Cahiers</option>
              <option value="Classement & Organisation">Classement & Organisation</option>
              <option value="Géométrie & Mathématiques">Géométrie & Mathématiques</option>
              <option value="Arts plastiques & Loisirs créatifs">Arts plastiques & Loisirs créatifs</option>
              <option value="Trousse & Accessoires">Trousse & Accessoires</option>
              <option value="Fournitures numériques">Fournitures numériques</option>
              <option value="Hygiène & Divers">Hygiène & Divers</option>
            </select>
          </div>
        </div>

        {/* Liste des fournitures */}
        <div className="bg-white min-h-screen p-8">
          {filteredFournitures.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">Aucune fourniture trouvée</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                {searchTerm 
                  ? `Aucune fourniture ne correspond à "${searchTerm}". Essayez de modifier votre recherche.`
                  : "Il n'y a pas encore de fournitures dans la liste."
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFournitures.map((fourniture) => {
                const categoryStyle = getCategoryStyle(fourniture.categorie);
                return (
                  <div key={fourniture.id} className="group flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${categoryStyle.bgColor} ${categoryStyle.borderColor} rounded-lg`}>
                        {categoryStyle.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{fourniture.nom}</h3>
                        <p className="text-gray-600 mt-1">{fourniture.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`text-xs px-3 py-1 rounded-full ${categoryStyle.bgColor} ${categoryStyle.borderColor} ${categoryStyle.textColor} font-medium`}>
                            {fourniture.categorie}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Quantité: {fourniture.quantite}
                          </span>
                          {!isEnseignant && (
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              fourniture.estAchete 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {fourniture.estAchete ? 'Acheté' : 'À acheter'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[90px]">
                      <div className="font-semibold text-gray-900 text-lg">Quantité: {fourniture.quantite}</div>
                      {!isEnseignant && (
                        <div className="text-sm text-gray-500 mt-1">
                          {fourniture.estAchete ? 'Acheté' : 'À acheter'}
                        </div>
                      )}
                      {isEnseignant && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleOpenModal(fourniture)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(fourniture)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter/modifier (enseignant seulement) */}
      {isEnseignant && (
        <FournitureModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fourniture={editingFourniture}
          onSave={handleSaveFourniture}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {fournitureToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Confirmation de suppression</h2>
              <button onClick={handleCancelDelete} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer la fourniture "{fournitureToDelete.nom}"? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FournituresPage; 