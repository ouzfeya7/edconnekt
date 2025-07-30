import React, { useState, useEffect } from 'react';
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
import ClassNameCard from '../components/Header/ClassNameCard';
import ChildSelectorCard from '../components/parents/ChildSelectorCard';
import { StudentNote } from '../lib/notes-data';
import jsPDF from 'jspdf';
import schoolLogo from '../assets/logo-yka-1.png';
import { mockParentData } from '../lib/mock-parent-data';

// Types pour les fournitures
type CategorieFourniture = 'Écriture & Correction' | 'Papeterie & Cahiers' | 'Classement & Organisation' | 'Géométrie & Mathématiques' | 'Arts plastiques & Loisirs créatifs' | 'Trousse & Accessoires' | 'Fournitures numériques' | 'Hygiène & Divers';

interface Fourniture {
  id: number;
  nom: string;
  description: string;
  categorie: CategorieFourniture;
  quantite: number;
  estAchete: boolean;
}

// Interface pour les enfants des parents
interface Child {
  studentId: string;
  firstName: string;
  lastName: string;
  classId: string;
}

// Composant Modal pour CRUD
interface FournitureModalProps {
  isOpen: boolean;
  onClose: () => void;
  fourniture?: Fourniture | null;
  onSave: (fourniture: Omit<Fourniture, 'id'>) => void;
}

function FournitureModal({ isOpen, onClose, fourniture, onSave }: FournitureModalProps) {
  const [formData, setFormData] = useState<Omit<Fourniture, 'id'>>({
    nom: '',
    description: '',
    categorie: 'Écriture & Correction' as CategorieFourniture,
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
        categorie: 'Écriture & Correction' as CategorieFourniture,
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
                onChange={(e) => setFormData({...formData, categorie: e.target.value as CategorieFourniture})}
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
  const [fournituresParClasse, setFournituresParClasse] = useState<{ [classId: string]: Fourniture[] }>({ 
    cp1: [
      {
        id: 1,
        nom: 'Cahier de brouillon 96 pages',
        quantite: 5,
        categorie: 'Papeterie & Cahiers' as CategorieFourniture,
        description: 'Cahier à petits carreaux pour les exercices',
        estAchete: false
      },
      {
        id: 2,
        nom: 'Stylos bleus',
        quantite: 10,
        categorie: 'Écriture & Correction' as CategorieFourniture,
        description: 'Stylos à bille bleue pour l\'écriture',
        estAchete: true
      },
      {
        id: 3,
        nom: 'Crayons de papier HB',
        quantite: 12,
        categorie: 'Écriture & Correction' as CategorieFourniture,
        description: 'Crayons de papier pour le dessin et l\'écriture',
        estAchete: false
      },
      {
        id: 4,
        nom: 'Gomme blanche',
        quantite: 3,
        categorie: 'Écriture & Correction' as CategorieFourniture,
        description: 'Gommes pour effacer les erreurs',
        estAchete: true
      },
      {
        id: 5,
        nom: 'Règle en plastique 20cm',
        quantite: 2,
        categorie: 'Géométrie & Mathématiques' as CategorieFourniture,
        description: 'Règle pour tracer des lignes droites',
        estAchete: false
      },
      {
        id: 6,
        nom: 'Trousse avec fermeture éclair',
        quantite: 1,
        categorie: 'Trousse & Accessoires' as CategorieFourniture,
        description: 'Trousse pour ranger les fournitures',
        estAchete: true
      },
      {
        id: 7,
        nom: 'Ciseaux à bouts ronds',
        quantite: 1,
        categorie: 'Arts plastiques & Loisirs créatifs' as CategorieFourniture,
        description: 'Ciseaux de sécurité pour les activités manuelles',
        estAchete: false
      },
      {
        id: 8,
        nom: 'Colle en bâton',
        quantite: 4,
        categorie: 'Arts plastiques & Loisirs créatifs' as CategorieFourniture,
        description: 'Colle pour les travaux manuels',
        estAchete: true
      },
      {
        id: 9,
        nom: 'Feuilles de papier A4',
        quantite: 100,
        categorie: 'Papeterie & Cahiers' as CategorieFourniture,
        description: 'Papier blanc pour les exercices et dessins',
        estAchete: false
      },
      {
        id: 10,
        nom: 'Cahier de texte',
        quantite: 1,
        categorie: 'Papeterie & Cahiers' as CategorieFourniture,
        description: 'Cahier pour noter les devoirs',
        estAchete: true
      }
    ] as Fourniture[]
  });
  const [fournitureToDelete, setFournitureToDelete] = useState<Fourniture | null>(null);

  // Utiliser les enfants du dashboard parent et ajouter classId
  const parentChildren = mockParentData.children.map(child => ({
    ...child,
    classId: 'cp1' // Par défaut CP1, mais on peut adapter selon les données réelles
  }));

  // État pour la classe sélectionnée (enseignant)
  const [selectedClass, setSelectedClass] = useState<string>('cp1'); // Default to cp1
  const [selectedChildId, setSelectedChildId] = useState<string>(parentChildren[0]?.studentId || ''); // Pour les parents

  const isEnseignant = roles.includes('enseignant') || roles.includes('directeur');
  const isParent = roles.includes('parent') || roles.includes('espaceFamille');
  const isEleve = roles.includes('eleve');

  // Déterminer la classe à afficher
  const getCurrentClass = () => {
    if (isEnseignant) {
      return selectedClass;
    } else if (isParent && selectedChildId) {
      const selectedChild = parentChildren.find(child => child.studentId === selectedChildId);
      return selectedChild?.classId || 'cp1';
    }
    return 'cp1'; // Par défaut
  };

  const currentClass = getCurrentClass();

  // Initialisation automatique de la classe sélectionnée
  useEffect(() => {
    if (isEnseignant && selectedClass && !(selectedClass in fournituresParClasse)) {
      setFournituresParClasse(prev => ({ ...prev, [selectedClass]: [] }));
    }
  }, [selectedClass, isEnseignant, fournituresParClasse]);

  // Actions CRUD pour l'enseignant
  const ajouterFourniture = (fourniture: Omit<Fourniture, 'id'>) => {
    const nouvelleFourniture: Fourniture = {
      ...fourniture,
      id: Date.now(),
      estAchete: false
    };
    setFournituresParClasse(prev => ({
      ...prev,
      [selectedClass]: [...(prev[selectedClass] || []), nouvelleFourniture]
    }));
  };

  const modifierFourniture = (id: number, fourniture: Omit<Fourniture, 'id'>) => {
    setFournituresParClasse(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass]?.map(f => f.id === id ? { ...fourniture, id, estAchete: f.estAchete } : f) || []
    }));
  };

  const supprimerFourniture = (id: number) => {
    setFournituresParClasse(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass]?.filter(f => f.id !== id) || []
    }));
    setFournitureToDelete(null);
  };

  const toggleAchete = (id: number) => {
    setFournituresParClasse(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass]?.map(f => f.id === id ? { ...f, estAchete: !f.estAchete } : f) || []
    }));
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
  const currentFournitures = fournituresParClasse[currentClass] || [];
  const filteredFournitures = currentFournitures.filter((fourniture) => {
    const matchesSearch = fourniture.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fourniture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = !filterCategorie || fourniture.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  // Statistiques
  const totalFournitures = fournituresParClasse[currentClass]?.length || 0;
  const fournituresAchetees = fournituresParClasse[currentClass]?.filter(f => f.estAchete).length || 0;
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
  const getCategoryStyle = (categorie: CategorieFourniture) => {
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

  const schoolInfo = {
    name: "Yenne Kids' Academy",
    address: "Kel, Rte de Toubab Dialaw, Yenne BP 20000, Dakar, Senegal",
    phone1: "+221 77 701 52 52",
    phone2: "+221 33 871 27 82",
    email: "hello@yennekidsacademy.com",
    website: "www.yennekidsacademy.com",
    academicYear: "2023-2024"
  };

  const addPdfHeader = (doc: any, classe: string, title: string) => {
    // Logo
    try {
      doc.addImage(schoolLogo, 'PNG', 25, 15, 30, 30);
    } catch (e) {}
    // School Info
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text(schoolInfo.name, 65, 22);
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.text(schoolInfo.address, 65, 28);
    doc.text(`Tél: ${schoolInfo.phone1} / ${schoolInfo.phone2}`, 65, 32);
    doc.text(`Email: ${schoolInfo.email} | Site: ${schoolInfo.website}`, 65, 36);
    doc.text(`Année Scolaire: ${schoolInfo.academicYear}`, 65, 40);
    // Main Title
    let currentY = 55;
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 7;
    // Class subtitle
    if (classe) {
      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text(`Classe: ${classe.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
      currentY += 7;
    }
    // Header Line
    doc.setDrawColor(0);
    doc.line(25, currentY, doc.internal.pageSize.getWidth() - 25, currentY);
    return currentY + 10;
  };

  // Fonction d'export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = 'Liste des fournitures scolaires';
    const classe = isEnseignant ? selectedClass : '';
    let y = addPdfHeader(doc, classe, title);
    doc.setFontSize(12);
    doc.setLineWidth(0.1);
    fournituresParClasse[currentClass]?.forEach((fourniture, idx) => {
      // Puce
      doc.setFont('times', 'bold');
      doc.text('•', 18, y);
      // Nom en gras
      doc.text(fourniture.nom, 24, y);
      doc.setFont('times', 'normal');
      // Détails en dessous, indentés
      let details = `Quantité : ${fourniture.quantite}  |  Catégorie : ${fourniture.categorie}`;
      if (fourniture.description) details += `  |  ${fourniture.description}`;
      y += 6;
      doc.setFontSize(10);
      doc.text(details, 28, y);
      y += 10;
      // Saut de page si besoin
      if (y > 270 && idx < fournituresParClasse[currentClass]?.length - 1) {
        doc.addPage();
        y = addPdfHeader(doc, classe, title);
      }
      doc.setFontSize(12);
    });
    doc.save('fournitures.pdf');
  };

  if (isEnseignant && !selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow border text-center">
          <h2 className="text-2xl font-bold mb-2">Veuillez sélectionner une classe</h2>
          <p className="text-gray-600">Choisissez une classe à droite du titre pour gérer les fournitures.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        {/* Header avec bouton d'ajout pour l'enseignant */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 w-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{isEnseignant ? 'Gestion des fournitures' : 'Fournitures scolaires'}</h1>
                <p className="text-gray-600 text-sm truncate">{isEnseignant ? 'Gérez la liste des fournitures pour votre classe' : 'Liste des fournitures nécessaires pour l\'année scolaire'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              {isEnseignant && (
                <div className="min-w-[180px] w-48">
                  <ClassNameCard
                    className={selectedClass}
                    onClassChange={setSelectedClass}
                    isEditable={true}
                  />
                </div>
              )}
              {isParent && (
                <div className="min-w-[180px] w-48">
                  <ChildSelectorCard
                    children={parentChildren as any}
                    selectedChildId={selectedChildId}
                    onSelectChild={setSelectedChildId}
                  />
                </div>
              )}
              
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
              
              <div className="flex gap-2 md:gap-3">
                {isEnseignant && (
                  <>
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center justify-center gap-2 px-6 py-3 h-12 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition w-full md:w-auto min-w-[160px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Exporter en PDF
                    </button>
                    <button
                      onClick={() => handleOpenModal()}
                      className="flex items-center justify-center gap-2 px-6 py-3 h-12 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition w-full md:w-auto min-w-[160px]"
                    >
                      <Plus className="w-5 h-5" /> Ajouter une fourniture
                    </button>
                  </>
                )}
                {!isEnseignant && (
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center gap-2 px-6 py-3 h-12 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition w-full md:w-auto min-w-[160px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Exporter en PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtres avec design amélioré */}
          <div className="flex gap-4 mt-6">
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
                      {/* Bouton marquer comme acheté/non pour parent/élève */}
                      {!isEnseignant && (
                        <button
                          onClick={() => toggleAchete(fourniture.id)}
                          className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                          title={fourniture.estAchete ? "Marquer comme non acheté" : "Marquer comme acheté"}
                        >
                          {fourniture.estAchete ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-green-600 transition-colors" />
                          )}
                        </button>
                      )}
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