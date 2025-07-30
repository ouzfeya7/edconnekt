import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../contexts/FilterContext';
import { mockRemediations, RemediationSession } from '../../lib/mock-data';
import { mockParentData } from '../../lib/mock-parent-data';
import RemediationCard from '../../components/course/RemediationCard';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import { Search, X } from 'lucide-react';

const ParentRemediationPage = () => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();
  const navigate = useNavigate();

  // États pour gérer les données de remédiation
  const [remediations, setRemediations] = useState<RemediationSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la sélection d'enfant
  const parentChildren = mockParentData.children;
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.studentId || '');
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [interventionFilter, setInterventionFilter] = useState<string>('all');

  useEffect(() => {
    // Simuler le chargement des données
    setLoading(true);
    
    // Filtrer les remédiations pour la classe actuelle
    const remediationsForClass = mockRemediations.filter(rem => rem.classId === currentClasse);
    setRemediations(remediationsForClass);
    
    setLoading(false);
  }, [currentClasse]);

  return (
        <div className="min-h-screen bg-white p-6">
      {/* Header avec style décolé des bords */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 mb-8">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/6 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-orange-500/5 rounded-full -translate-x-16 -translate-y-16"></div>
        
        {/* Contenu du header */}
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                {t('remediation_follow_up', 'Suivi des remédiations')}
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                {t('remediation_description', 'Suivez les progrès de votre enfant et intervenez si nécessaire')}
              </p>
            </div>
            
            {/* Statistiques rapides */}
            <div className="flex gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50">
                <div className="text-2xl font-bold text-orange-600">
                  {remediations.length}
                </div>
                <div className="text-xs text-slate-600">
                  {t('total_remediations', 'Remédiations')}
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50">
                <div className="text-2xl font-bold text-green-600">
                  {remediations.filter(rem => rem.status === 'completed').length}
                </div>
                <div className="text-xs text-slate-600">
                  {t('completed_sessions', 'Terminées')}
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50">
                <div className="text-2xl font-bold text-blue-600">
                  {remediations.filter(rem => rem.status === 'upcoming').length}
                </div>
                <div className="text-xs text-slate-600">
                  {t('upcoming_sessions', 'À venir')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">{t('loading', 'Chargement...')}</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Section des outils de suivi */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                {t('follow_up_tools', 'Outils de suivi')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sélection de l'enfant */}
                <ChildSelectorCard 
                  children={parentChildren} 
                  selectedChildId={selectedChildId}
                  onSelectChild={(id) => {
                    setSelectedChildId(id);
                    // Recharger les remédiations pour l'enfant sélectionné
                    const remediationsForChild = mockRemediations.filter(rem => 
                      rem.classId === currentClasse && 
                      rem.students.some(student => student.id === id)
                    );
                    setRemediations(remediationsForChild);
                  }}
                />
                
                {/* Carte de statut global */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('global_progress', 'Progrès global')}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {remediations.filter(rem => rem.status === 'completed').length}/{remediations.length}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Carte d'intervention parentale */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('parent_intervention', 'Intervention')}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {remediations.filter(rem => rem.students.some(s => s.parentNotified)).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Carte de prochaine session */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('next_session', 'Prochaine session')}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {remediations.filter(rem => rem.status === 'upcoming').length > 0 ? 'Prévue' : 'Aucune'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section des interventions requises */}
            {(() => {
              const interventionsRequired = remediations.filter(remediation => {
                if (remediation.status !== 'completed') return false;
                const selectedStudent = remediation.students.find(s => s.id === selectedChildId);
                return selectedStudent?.parentNotified || 
                  remediation.pdiIntegration.alertsGenerated.some(alert => 
                    alert.toLowerCase().includes('intervention') || 
                    alert.toLowerCase().includes('parent')
                  ) ||
                  selectedStudent?.competenceAcquired === false;
              });

              return interventionsRequired.length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    {t('interventions_required', 'Interventions requises')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interventionsRequired
                      .sort((a, b) => {
                        // Trier par urgence (urgent > requested > optional)
                        const selectedStudentA = a.students.find(s => s.id === selectedChildId);
                        const selectedStudentB = b.students.find(s => s.id === selectedChildId);
                        const urgencyA = selectedStudentA?.competenceAcquired === false ? 0 : 1;
                        const urgencyB = selectedStudentB?.competenceAcquired === false ? 0 : 1;
                        if (urgencyA !== urgencyB) return urgencyA - urgencyB;
                        
                        // Puis par date (plus récent en premier)
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                      })
                      .map((remediation) => {
                        const selectedStudent = remediation.students.find(s => s.id === selectedChildId);
                        const requiresIntervention = selectedStudent?.parentNotified || 
                          remediation.pdiIntegration.alertsGenerated.some(alert => 
                            alert.toLowerCase().includes('intervention') || 
                            alert.toLowerCase().includes('parent')
                          );
                        
                        let interventionType: 'urgent' | 'requested' | 'optional' = 'optional';
                        if (selectedStudent?.competenceAcquired === false) {
                          interventionType = 'urgent';
                        } else if (requiresIntervention) {
                          interventionType = 'requested';
                        }
                        
                        const teacherMessage = selectedStudent ? 
                          `${selectedStudent.name} a participé à cette session. ${selectedStudent.competenceAcquired ? 'Des progrès notables ont été observés.' : 'Des difficultés persistent et une intervention parentale est recommandée.'}` : 
                          'Session terminée.';
                        
                        return (
                          <RemediationCard
                            key={`intervention-${remediation.id}`}
                            remediation={remediation}
                            isParentView={true}
                            teacherMessage={teacherMessage}
                            requiresIntervention={true}
                            interventionType={interventionType}
                            onClick={() => {
                              navigate(`/remediation/${remediation.id}`);
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Section des remédiations */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                {t('remediation_sessions', 'Sessions de remédiation')}
              </h2>
                
                {/* Section de recherche et filtres */}
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Barre de recherche */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Rechercher par titre, matière, compétence..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-base"
                        />
                      </div>
                    </div>
                    
                    {/* Filtres */}
                    <div className="flex flex-wrap gap-3">
                      {/* Filtre par statut */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="in_progress">En cours</option>
                        <option value="upcoming">À venir</option>
                        <option value="completed">Terminées</option>
                      </select>
                      
                      {/* Filtre par matière */}
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="all">Toutes les matières</option>
                        <option value="Français">Français</option>
                        <option value="Mathématiques">Mathématiques</option>
                      </select>
                      
                      {/* Filtre par intervention */}
                      <select
                        value={interventionFilter}
                        onChange={(e) => setInterventionFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="all">Toutes les interventions</option>
                        <option value="urgent">Intervention urgente</option>
                        <option value="requested">Intervention demandée</option>
                        <option value="optional">Intervention suggérée</option>
                      </select>
                      
                      {/* Bouton de réinitialisation */}
                      {(searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' || interventionFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setSubjectFilter('all');
                            setInterventionFilter('all');
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                        >
                          <X className="w-4 h-4" />
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Grille des cartes de remédiation */}
                {remediations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remediations
                      .filter((remediation) => {
                        // Filtre par recherche
                        if (searchTerm) {
                          const searchLower = searchTerm.toLowerCase();
                          const titleMatch = remediation.title.toLowerCase().includes(searchLower);
                          const subjectMatch = remediation.subject.toLowerCase().includes(searchLower);
                          const skillMatch = remediation.skillToAcquire.toLowerCase().includes(searchLower);
                          const themeMatch = remediation.theme.toLowerCase().includes(searchLower);
                          
                          if (!titleMatch && !subjectMatch && !skillMatch && !themeMatch) {
                            return false;
                          }
                        }
                        
                        // Filtre par statut
                        if (statusFilter !== 'all' && remediation.status !== statusFilter) {
                          return false;
                        }
                        
                        // Filtre par matière
                        if (subjectFilter !== 'all' && remediation.subject !== subjectFilter) {
                          return false;
                        }
                        
                        // Filtre par intervention (seulement pour les sessions terminées)
                        if (interventionFilter !== 'all') {
                          const selectedStudent = remediation.students.find(s => s.id === selectedChildId);
                          const requiresIntervention = remediation.status === 'completed' && (
                            selectedStudent?.parentNotified || 
                            remediation.pdiIntegration.alertsGenerated.some(alert => 
                              alert.toLowerCase().includes('intervention') || 
                              alert.toLowerCase().includes('parent')
                            )
                          );
                          
                          let interventionType: 'urgent' | 'requested' | 'optional' = 'optional';
                          if (remediation.status === 'completed') {
                            if (selectedStudent?.competenceAcquired === false) {
                              interventionType = 'urgent';
                            } else if (requiresIntervention) {
                              interventionType = 'requested';
                            }
                          }
                          
                          if (interventionType !== interventionFilter) {
                            return false;
                          }
                        }
                        
                        return true;
                      })
                      .sort((a, b) => {
                        // Trier par statut d'abord (en cours > à venir > terminées)
                        const statusOrder = { 'in_progress': 0, 'upcoming': 1, 'completed': 2 };
                        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
                        
                        if (statusDiff !== 0) return statusDiff;
                        
                        // Puis par date (plus récent en premier)
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                      })
                      .map((remediation) => {
                        // Trouver l'élève sélectionné dans cette remédiation
                        const selectedStudent = remediation.students.find(s => s.id === selectedChildId);
                        
                        // Déterminer si une intervention est requise (seulement pour les sessions terminées)
                        const requiresIntervention = remediation.status === 'completed' && (
                          selectedStudent?.parentNotified || 
                          remediation.pdiIntegration.alertsGenerated.some(alert => 
                            alert.toLowerCase().includes('intervention') || 
                            alert.toLowerCase().includes('parent')
                          )
                        );
                        
                        // Déterminer le type d'intervention (seulement pour les sessions terminées)
                        let interventionType: 'urgent' | 'requested' | 'optional' = 'optional';
                        if (remediation.status === 'completed') {
                          if (selectedStudent?.competenceAcquired === false) {
                            interventionType = 'urgent';
                          } else if (requiresIntervention) {
                            interventionType = 'requested';
                          }
                        }
                        
                        // Message de l'enseignant (adapté selon le statut)
                        let teacherMessage = '';
                        if (remediation.status === 'upcoming') {
                          teacherMessage = 'Session programmée pour votre enfant.';
                        } else if (remediation.status === 'in_progress') {
                          teacherMessage = 'Session en cours. Votre enfant participe activement.';
                        } else if (remediation.status === 'completed') {
                          teacherMessage = selectedStudent ? 
                            `${selectedStudent.name} a participé à cette session. ${selectedStudent.competenceAcquired ? 'Des progrès notables ont été observés.' : 'Des difficultés persistent et une intervention parentale est recommandée.'}` : 
                            'Session terminée.';
                        }
                        
                        return (
                          <RemediationCard
                            key={remediation.id}
                            remediation={remediation}
                            isParentView={true}
                            teacherMessage={teacherMessage}
                            requiresIntervention={requiresIntervention}
                            interventionType={interventionType}
                            onClick={() => {
                              navigate(`/remediation/${remediation.id}`);
                            }}
                          />
                        );
                      })}
                  </div>
               ) : (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-slate-800 mb-2">
                     {t('no_remediations', 'Aucune remédiation')}
                   </h3>
                   <p className="text-slate-600">
                     {t('no_remediations_description', 'Aucune session de remédiation n\'est prévue pour le moment.')}
                   </p>
                 </div>
               )}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default ParentRemediationPage; 