import React from 'react';
import { 
  BookOpen, PlayCircle, FileText, AlertCircle, Users, Target, 
  Download, Clock, CheckCircle, HelpCircle 
} from 'lucide-react';

const HelpDocumentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Guide d'utilisation - Séances PDI</h2>
        <p className="text-slate-600 mt-1">Documentation complète pour maîtriser l'interface des séances PDI</p>
      </div>

      {/* Table des matières */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Table des matières
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="#getting-started" className="text-blue-600 hover:text-blue-800 text-sm">1. Prise en main rapide</a>
          <a href="#workflow" className="text-blue-600 hover:text-blue-800 text-sm">2. Workflow des séances</a>
          <a href="#creating-session" className="text-blue-600 hover:text-blue-800 text-sm">3. Créer une séance</a>
          <a href="#managing-students" className="text-blue-600 hover:text-blue-800 text-sm">4. Gérer les élèves</a>
          <a href="#observations" className="text-blue-600 hover:text-blue-800 text-sm">5. Saisir les observations</a>
          <a href="#reports" className="text-blue-600 hover:text-blue-800 text-sm">6. Générer et partager les rapports</a>
          <a href="#history" className="text-blue-600 hover:text-blue-800 text-sm">7. Consulter l'historique</a>
          <a href="#tips" className="text-blue-600 hover:text-blue-800 text-sm">8. Conseils et bonnes pratiques</a>
        </div>
      </div>

      {/* 1. Prise en main rapide */}
      <div id="getting-started" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <PlayCircle className="text-emerald-600" size={24} />
          1. Prise en main rapide
        </h3>
        <div className="space-y-4">
          <p className="text-slate-700">
            L'interface PDI vous permet de gérer efficacement vos séances de Programme de Développement Individuel. 
            Voici les éléments essentiels :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-emerald-600 mb-2"><Clock size={20} /></div>
              <h4 className="font-medium text-slate-800">Séances en cours</h4>
              <p className="text-sm text-slate-600">Gérez vos séances actives et créez-en de nouvelles</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-blue-600 mb-2"><FileText size={20} /></div>
              <h4 className="font-medium text-slate-800">Historique</h4>
              <p className="text-sm text-slate-600">Consultez vos rapports passés et téléchargez-les</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-violet-600 mb-2"><Users size={20} /></div>
              <h4 className="font-medium text-slate-800">Élèves</h4>
              <p className="text-sm text-slate-600">Suivez la progression et les difficultés</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Workflow des séances */}
      <div id="workflow" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="text-blue-600" size={24} />
          2. Workflow des séances PDI
        </h3>
        <div className="space-y-4">
          <p className="text-slate-700">
            Chaque séance PDI suit un processus en 4 étapes clairement identifiées :
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <h4 className="font-medium text-slate-800">Programmée</h4>
              </div>
              <p className="text-sm text-slate-600">Séance créée et planifiée. Prête à démarrer.</p>
            </div>
            <div className="flex-1 min-w-64 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <h4 className="font-medium text-blue-800">En cours</h4>
              </div>
              <p className="text-sm text-blue-700">Saisie des observations en temps réel.</p>
            </div>
            <div className="flex-1 min-w-64 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <h4 className="font-medium text-orange-800">Terminée</h4>
              </div>
              <p className="text-sm text-orange-700">Révision et génération du rapport PDF.</p>
            </div>
            <div className="flex-1 min-w-64 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                <h4 className="font-medium text-emerald-800">Publiée</h4>
              </div>
              <p className="text-sm text-emerald-700">Rapport partagé avec les parents. Séance figée.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Créer une séance */}
      <div id="creating-session" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <PlayCircle className="text-emerald-600" size={24} />
          3. Créer une nouvelle séance
        </h3>
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-medium text-emerald-800 mb-2">Étapes de création :</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-700">
              <li>Cliquez sur <strong>"Nouvelle séance"</strong> dans l'onglet "Séances en cours"</li>
              <li>Sélectionnez la <strong>classe</strong> concernée</li>
              <li>Choisissez la <strong>date</strong> qui convient à votre planning</li>
              <li>Ajoutez des <strong>observations générales</strong> si nécessaire</li>
              <li>Cliquez sur <strong>"Créer la séance"</strong></li>
            </ol>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-amber-600" size={16} />
              <h4 className="font-medium text-amber-800">Règle importante :</h4>
            </div>
            <p className="text-sm text-amber-700">
              Une seule séance PDI par classe et par semaine est autorisée. Le système vous alertera en cas de doublon.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Gérer les élèves */}
      <div id="managing-students" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          4. Gérer les élèves en difficulté
        </h3>
        <div className="space-y-4">
          <p className="text-slate-700">
            L'interface propose deux vues pour gérer efficacement vos élèves :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle size={16} />
                Vue "En difficulté"
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>Affiche uniquement les élèves avec score &lt; 70%</li>
                <li>Code couleur par niveau de gravité</li>
                <li>Alertes automatiques visibles</li>
                <li>Focus sur l'urgence pédagogique</li>
              </ul>
              <div className="mt-3 text-xs text-red-600">
                <strong>Code couleur :</strong><br/>
                🔴 &lt;30% - Critique | 🟠 30-49% - Urgent | 🟡 50-69% - Attention
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Users size={16} />
                Vue "Liste complète"
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Tous les élèves avec leurs scores</li>
                <li>Observations éditables pour chacun</li>
                <li>Sauvegarde automatique (toutes les 2s)</li>
                <li>Vue d'ensemble de la classe</li>
              </ul>
              <div className="mt-3 text-xs text-blue-600">
                <strong>💾 Autosave :</strong> Vos modifications sont sauvegardées automatiquement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Saisir les observations */}
      <div id="observations" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="text-violet-600" size={24} />
          5. Saisir les observations
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Observations individuelles :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li>Cliquez sur "Liste complète" pour voir tous les élèves</li>
                <li>Tapez directement dans les zones de texte</li>
                <li>Sauvegarde automatique après 2 secondes</li>
                <li>Indicateur visuel de l'état de sauvegarde</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Observations générales :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li>Renseignées lors de la création de séance</li>
                <li>Modifiables dans la vue détaillée</li>
                <li>Apparaissent dans le rapport final</li>
                <li>Contexte global de la séance</li>
              </ul>
            </div>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <h4 className="font-medium text-violet-800 mb-2">💡 Conseil :</h4>
            <p className="text-sm text-violet-700">
              Soyez précis et constructif dans vos observations. Elles serviront de base aux parents 
              pour comprendre les difficultés et les axes d'amélioration de leur enfant.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Générer et partager les rapports */}
      <div id="reports" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Download className="text-emerald-600" size={24} />
          6. Générer et partager les rapports
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">1. Révision</h4>
              <p className="text-sm text-orange-700">
                Vérifiez toutes les données saisies dans la vue détaillée avant génération.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">2. Génération</h4>
              <p className="text-sm text-blue-700">
                Cliquez sur "Générer le rapport" pour créer le PDF avec prévisualisation.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">3. Publication</h4>
              <p className="text-sm text-emerald-700">
                Publiez pour partager avec les parents. La séance devient non-modifiable.
              </p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-amber-600" size={16} />
              <h4 className="font-medium text-amber-800">Important :</h4>
            </div>
            <p className="text-sm text-amber-700">
              Une fois publié, le rapport est figé. Toute modification ultérieure nécessite l'accord de la direction.
            </p>
          </div>
        </div>
      </div>

      {/* 7. Consulter l'historique */}
      <div id="history" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="text-blue-600" size={24} />
          7. Consulter l'historique
        </h3>
        <div className="space-y-4">
          <p className="text-slate-700">
            L'onglet "Historique & rapports" vous permet de :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>Rechercher par classe ou date</li>
              <li>Filtrer par statut (Terminés/Publiés)</li>
              <li>Filtrer par période (Semaine/Mois/Trimestre)</li>
              <li>Voir les statistiques consolidées</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>Télécharger les rapports PDF</li>
              <li>Retourner aux détails d'une séance</li>
              <li>Consulter les rapports partagés</li>
              <li>Suivre les évolutions dans le temps</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 8. Conseils et bonnes pratiques */}
      <div id="tips" className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="text-emerald-600" size={24} />
          8. Conseils et bonnes pratiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-emerald-800">✅ Bonnes pratiques :</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                <li>Créez vos séances à l'avance selon votre planning</li>
              <li>Saisissez les observations dès la fin de séance</li>
              <li>Vérifiez la vue "En difficulté" régulièrement</li>
              <li>Générez les rapports dans la semaine</li>
              <li>Consultez l'historique pour suivre les progrès</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-red-800">❌ À éviter :</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>Créer plusieurs séances pour la même classe/semaine</li>
              <li>Publier sans avoir vérifié les observations</li>
              <li>Laisser des observations vides pour les élèves en difficulté</li>
              <li>Attendre trop longtemps avant de générer les rapports</li>
              <li>Oublier de publier les rapports aux parents</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">🎯 Objectif pédagogique :</h4>
          <p className="text-sm text-blue-700">
            L'interface PDI vise à simplifier le suivi individualisé des élèves tout en maintenant 
            une communication transparente avec les familles. Chaque fonctionnalité contribue à 
            l'amélioration continue de l'accompagnement pédagogique.
          </p>
        </div>
      </div>

      {/* Contact et support */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <HelpCircle className="text-slate-600" size={20} />
          Besoin d'aide supplémentaire ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700">Support technique :</h4>
            <p className="text-sm text-slate-600">
              Pour tout problème technique ou question sur l'utilisation de l'interface, 
              contactez l'équipe support à <strong>support@edconnekt.com</strong>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700">Support pédagogique :</h4>
            <p className="text-sm text-slate-600">
              Pour des questions sur les méthodes PDI ou l'accompagnement des élèves, 
              adressez-vous à votre coordinateur pédagogique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocumentation;
