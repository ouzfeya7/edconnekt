import React from 'react';
import { Calendar, BookOpen, TrendingUp, Award, Clock, FileText } from 'lucide-react';

interface StudentTrimestrielleCardsProps {
  studentName: string;
  classLabel: string;
  currentTrimestre: number;
}

interface TrimestreData {
  numero: number;
  titre: string;
  periode: string;
  statut: 'complete' | 'en-cours' | 'a-venir';
  moyenneGenerale?: number;
  rang?: number;
  totalEleves?: number;
  commentaireGeneral?: string;
  matieresFfortes?: string[];
  matieresAmeliorations?: string[];
  presenceTotal?: number;
  presenceAbsences?: number;
  evaluationsTotal?: number;
  evaluationsReussies?: number;
}

const StudentTrimestrielleCards: React.FC<StudentTrimestrielleCardsProps> = ({
  studentName,
  classLabel,
  currentTrimestre
}) => {
  // Données fictives pour les trimestres
  const trimestres: TrimestreData[] = [
    {
      numero: 1,
      titre: "Premier Trimestre",
      periode: "Septembre - Décembre",
      statut: currentTrimestre > 1 ? 'complete' : 'en-cours',
      moyenneGenerale: currentTrimestre > 1 ? 14.5 : undefined,
      rang: currentTrimestre > 1 ? 8 : undefined,
      totalEleves: 25,
      commentaireGeneral: currentTrimestre > 1 ? "Excellent début d'année ! L'élève montre une grande motivation et de bonnes capacités d'adaptation. Les bases sont solides dans toutes les matières." : "Trimestre en cours...",
      matieresFfortes: currentTrimestre > 1 ? ["Mathématiques", "Français"] : undefined,
      matieresAmeliorations: currentTrimestre > 1 ? ["Sciences", "Histoire"] : undefined,
      presenceTotal: currentTrimestre > 1 ? 65 : Math.floor(65 * (currentTrimestre === 1 ? 0.7 : 1)),
      presenceAbsences: currentTrimestre > 1 ? 3 : Math.floor(3 * (currentTrimestre === 1 ? 0.7 : 1)),
      evaluationsTotal: currentTrimestre > 1 ? 12 : Math.floor(12 * (currentTrimestre === 1 ? 0.7 : 1)),
      evaluationsReussies: currentTrimestre > 1 ? 10 : Math.floor(10 * (currentTrimestre === 1 ? 0.7 : 1))
    },
    {
      numero: 2,
      titre: "Deuxième Trimestre",
      periode: "Janvier - Mars",
      statut: currentTrimestre > 2 ? 'complete' : currentTrimestre === 2 ? 'en-cours' : 'a-venir',
      moyenneGenerale: currentTrimestre > 2 ? 15.2 : undefined,
      rang: currentTrimestre > 2 ? 6 : undefined,
      totalEleves: 25,
      commentaireGeneral: currentTrimestre > 2 ? "Progression remarquable ! L'élève a su tirer parti des conseils du premier trimestre et s'épanouit dans ses apprentissages." : currentTrimestre === 2 ? "Trimestre en cours..." : "À venir",
      matieresFfortes: currentTrimestre > 2 ? ["Mathématiques", "Sciences", "Arts"] : undefined,
      matieresAmeliorations: currentTrimestre > 2 ? ["Histoire", "Géographie"] : undefined,
      presenceTotal: currentTrimestre > 2 ? 58 : currentTrimestre === 2 ? Math.floor(58 * 0.6) : undefined,
      presenceAbsences: currentTrimestre > 2 ? 2 : currentTrimestre === 2 ? Math.floor(2 * 0.6) : undefined,
      evaluationsTotal: currentTrimestre > 2 ? 11 : currentTrimestre === 2 ? Math.floor(11 * 0.6) : undefined,
      evaluationsReussies: currentTrimestre > 2 ? 10 : currentTrimestre === 2 ? Math.floor(10 * 0.6) : undefined
    },
    {
      numero: 3,
      titre: "Troisième Trimestre",
      periode: "Avril - Juin",
      statut: currentTrimestre > 3 ? 'complete' : currentTrimestre === 3 ? 'en-cours' : 'a-venir',
      moyenneGenerale: currentTrimestre > 3 ? 15.8 : undefined,
      rang: currentTrimestre > 3 ? 4 : undefined,
      totalEleves: 25,
      commentaireGeneral: currentTrimestre > 3 ? "Excellente fin d'année ! L'élève a confirmé ses progrès et est prêt pour l'année suivante. Félicitations pour cette belle année scolaire !" : currentTrimestre === 3 ? "Trimestre en cours..." : "À venir",
      matieresFfortes: currentTrimestre > 3 ? ["Mathématiques", "Français", "Sciences"] : undefined,
      matieresAmeliorations: currentTrimestre > 3 ? ["Éducation Physique"] : undefined,
      presenceTotal: currentTrimestre > 3 ? 52 : currentTrimestre === 3 ? Math.floor(52 * 0.5) : undefined,
      presenceAbsences: currentTrimestre > 3 ? 1 : currentTrimestre === 3 ? Math.floor(1 * 0.5) : undefined,
      evaluationsTotal: currentTrimestre > 3 ? 10 : currentTrimestre === 3 ? Math.floor(10 * 0.5) : undefined,
      evaluationsReussies: currentTrimestre > 3 ? 9 : currentTrimestre === 3 ? Math.floor(9 * 0.5) : undefined
    }
  ];

  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case 'complete':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          statusColor: 'bg-green-100 text-green-800',
          statusIcon: Award,
          statusText: 'Terminé'
        };
      case 'en-cours':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          statusColor: 'bg-blue-100 text-blue-800',
          statusIcon: Clock,
          statusText: 'En cours'
        };
      default:
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          statusColor: 'bg-gray-100 text-gray-600',
          statusIcon: Calendar,
          statusText: 'À venir'
        };
    }
  };

  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return 'text-green-600 bg-white border border-green-200';
    if (moyenne >= 14) return 'text-blue-600 bg-white border border-blue-200';
    if (moyenne >= 12) return 'text-yellow-600 bg-white border border-yellow-200';
    if (moyenne >= 10) return 'text-orange-600 bg-white border border-orange-200';
    return 'text-red-600 bg-white border border-red-200';
  };

  return (
    <div className="space-y-6">

      {/* Cartes des trimestres */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {trimestres.map((trimestre) => {
          const config = getStatutConfig(trimestre.statut);
          const StatusIcon = config.statusIcon;

          return (
            <div
              key={trimestre.numero}
              className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${config.iconColor} bg-white rounded-lg shadow-sm`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{trimestre.titre}</h3>
                    <p className="text-sm text-gray-600">{trimestre.periode}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.statusColor}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.statusText}
                </div>
              </div>

              {/* Contenu de la carte */}
              {trimestre.statut !== 'a-venir' ? (
                <div className="space-y-4">
                  {/* Moyenne et rang */}
                  {trimestre.moyenneGenerale && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Moyenne générale</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold px-2 py-1 rounded ${getMoyenneColor(trimestre.moyenneGenerale)}`}>
                          {trimestre.moyenneGenerale.toFixed(1)}/20
                        </div>
                        {trimestre.rang && (
                          <div className="text-xs text-gray-500 mt-1">
                            Rang: {trimestre.rang}/{trimestre.totalEleves}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statistiques */}
                  <div className="grid grid-cols-2 gap-3">
                    {trimestre.presenceTotal && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">Présence</div>
                        <div className="font-bold text-gray-800">
                          {trimestre.presenceTotal - (trimestre.presenceAbsences || 0)}/{trimestre.presenceTotal}
                        </div>
                        <div className="text-xs text-gray-500">
                          {trimestre.presenceAbsences} absence{(trimestre.presenceAbsences || 0) > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                    
                    {trimestre.evaluationsTotal && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">Évaluations</div>
                        <div className="font-bold text-gray-800">
                          {trimestre.evaluationsReussies}/{trimestre.evaluationsTotal}
                        </div>
                        <div className="text-xs text-gray-500">réussies</div>
                      </div>
                    )}
                  </div>

                  {/* Points forts et améliorations */}
                  {trimestre.matieresFfortes && trimestre.matieresFfortes.length > 0 && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xs text-green-600 font-medium mb-2">✓ Points forts</div>
                      <div className="flex flex-wrap gap-1">
                        {trimestre.matieresFfortes.map((matiere, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {matiere}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {trimestre.matieresAmeliorations && trimestre.matieresAmeliorations.length > 0 && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xs text-orange-600 font-medium mb-2">📈 À améliorer</div>
                      <div className="flex flex-wrap gap-1">
                        {trimestre.matieresAmeliorations.map((matiere, index) => (
                          <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            {matiere}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commentaire */}
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-2">Commentaire général</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{trimestre.commentaireGeneral}</p>
                  </div>

                  {/* Action - Voir le bulletin */}
                  {trimestre.statut === 'complete' && (
                    <button className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                      <FileText className="w-4 h-4" />
                      Télécharger le bulletin
                    </button>
                  )}
                </div>
              ) : (
                /* Vue pour trimestre à venir */
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Trimestre à venir</p>
                  <p className="text-sm text-gray-400 mt-1">Les résultats seront disponibles à la fin de la période</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentTrimestrielleCards; 