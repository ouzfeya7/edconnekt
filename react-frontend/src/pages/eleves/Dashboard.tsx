"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../layouts/DashboardLayout';
import { useFilters } from '../../contexts/FilterContext';
import { 
  getCurrentStudentData, 
  getStudentAssignments, 
  getStudentStats,
  getEnrichedCourses,
  getStudentNotifications,
  getStudentAgendaEvents
} from '../../lib/mock-student-data';
import DashboardCourseCard from '../../components/course/DashboardCourseCard';
import StudentProgressionChart from "../../components/eleve/StudentProgressionChart";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Settings,
  Bell,
  MapPin,
  BookMarked,
  Package
} from 'lucide-react';

// Interface Student pour le dashboard (structure complète)
interface StudentProfile {
  id: number | string;
  name: string;
  imageUrl: string;
  ref: string;
  gender: string;
  birthDate: string;
  email: string;
  address: string;
  department: string;
  class: string;
  admissionDate: string;
  status: string;
  competence?: string;
}

function Dashboard() {
  const { user } = useUser();
  const { currentClasse } = useFilters();
  const navigate = useNavigate();

  // Utiliser les données synchronisées
  const studentAssignments = getStudentAssignments();
  const studentEvents = getStudentAgendaEvents();
  const studentStats = getStudentStats();
  const enrichedCourses = getEnrichedCourses(navigate);

  // Notifications importantes - synchronisées avec la messagerie
  const notifications = getStudentNotifications();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <div className="text-slate-600">Chargement des données de l'élève...</div>
        </div>
      </div>
    );
  }

  // Utiliser les données centralisées avec fallback sur les données utilisateur
  const centralStudentData = getCurrentStudentData();
  const student: StudentProfile = {
    ...centralStudentData,
    name: user.name || centralStudentData.name,
    email: user.email || centralStudentData.email,
    address: user.address || centralStudentData.address,
    department: user.classLabel || centralStudentData.department,
    class: user.classId || centralStudentData.class,
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête du dashboard compact */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-slate-200">
        {/* Effet de fond avec motifs plus visibles */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-500/10 rounded-full -translate-x-16 -translate-y-16"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={student.imageUrl} 
                alt={student.name}
                className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Bonjour, {user.name.split(' ')[0]} ! 👋
                </h1>
                <p className="text-slate-600 font-medium">Classe {user.classLabel || currentClasse} • {student.ref}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Voir mon profil"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            {/* Statistiques compactes en ligne */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">{studentStats.courses.total} cours</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">{studentStats.courses.active} en cours</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{studentStats.courses.completed} terminés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mes cours récents - mêmes cartes que MesCoursPage */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section cours */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/15 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Mes cours</h2>
              <button 
                onClick={() => navigate('/mes-cours')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors font-medium"
              >
                <span className="text-sm">Voir tout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {enrichedCourses.slice(0, 3).map((course) => (
                <DashboardCourseCard
                  key={course.id}
                  subject={course.subject}
                  teacher={course.teacher}
                  progress={course.progress}
                  status={course.status}
                  nextLessonDate={course.nextLessonDate}
                  onViewDetails={course.onViewDetails}
                  title={course.title}
                  time={course.time}
                  presentCount={course.presentCount}
                  remediationCount={course.remediationCount}
                />
              ))}
            </div>
          </div>

          {/* Graphique de progression */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section progression */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/15 rounded-full -translate-y-20 -translate-x-20"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-teal-500/15 rounded-full translate-y-14 translate-x-14"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10"></div>
            
            <div className="relative">
              <StudentProgressionChart />
            </div>
          </div>
        </div>

        {/* Barre latérale optimisée */}
        <div className="space-y-6">
          
          {/* Devoirs à faire */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section devoirs */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/15 rounded-full -translate-y-14 translate-x-14"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/15 rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="relative flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Devoirs à faire</h2>
              <button 
                onClick={() => navigate('/devoirs')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-800 transition-colors font-medium"
              >
                <span className="text-sm">Voir tout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative space-y-3">
              {studentAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex flex-col p-3 bg-white/60 rounded-lg border border-rose-200/70 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-600' :
                      assignment.status === 'overdue' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {assignment.status === 'completed' ? 
                        <CheckCircle className="w-3 h-3" /> : 
                        <AlertTriangle className="w-3 h-3" />
                      }
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{assignment.title}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{assignment.subject}</p>

                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-medium ${
                      assignment.status === 'completed' ? 'text-green-600' : 'text-gray-800'
                    }`}>
                      {assignment.dueDate}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {assignment.status === 'completed' ? 'Terminé' : 'En attente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notifications importantes */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section notifications */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/15 rounded-full -translate-y-14 translate-x-14"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/15 rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="relative flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-cyan-600" />
              <h2 className="text-xl font-semibold text-slate-800">Notifications</h2>
            </div>
            <div className="relative space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg border shadow-sm backdrop-blur-sm ${
                  notif.type === 'warning' ? 'bg-amber-50/70 border-amber-200/70' :
                  notif.type === 'info' ? 'bg-blue-50/70 border-blue-200/70' :
                  'bg-green-50/70 border-green-200/70'
                }`}>
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-full ${
                      notif.type === 'warning' ? 'bg-amber-200 text-amber-600' :
                      notif.type === 'info' ? 'bg-blue-200 text-blue-600' :
                      'bg-green-200 text-green-600'
                    }`}>
                      {notif.type === 'warning' && <AlertTriangle className="w-3 h-3" />}
                      {notif.type === 'info' && <BookMarked className="w-3 h-3" />}
                      {notif.type === 'success' && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prochains événements */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section événements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-violet-500/8 rounded-full -translate-y-12 -translate-x-12"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/6 rounded-full translate-y-16 translate-x-16"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-indigo-500/5 rounded-full"></div>
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Prochains événements</h3>
                <div className="space-y-3">
                  {studentEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className={`flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-violet-200/70 shadow-sm backdrop-blur-sm`}>
                      <div className={`p-2 bg-${event.color}-100 rounded-lg border border-${event.color}-200`}>
                        {event.type === 'evaluation' && <Calendar className={`w-4 h-4 text-${event.color}-600`} />}
                        {event.type === 'meeting' && <Users className={`w-4 h-4 text-${event.color}-600`} />}
                        {event.type === 'activity' && <MapPin className={`w-4 h-4 text-${event.color}-600`} />}
                      </div>
                      <div>
                        <p className={`font-medium text-${event.color}-800`}>{event.title}</p>
                        <p className={`text-sm text-${event.color}-600`}>{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/calendar')}
                  className="w-full mt-4 text-sm text-violet-600 hover:text-violet-800 flex items-center justify-center gap-1 transition-colors font-medium"
                >
                  <span>Voir mon agenda</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
          </div>

          {/* Widget fournitures */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 shadow-sm">
            {/* Motifs décoratifs pour la section fournitures */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/15 rounded-full -translate-y-14 translate-x-14"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/15 rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="relative flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Fournitures</h2>
            </div>
            <div className="relative space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-200/70 shadow-sm backdrop-blur-sm">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Fournitures de base</p>
                  <p className="text-sm text-blue-600">Vérifier la liste des fournitures nécessaires.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-200/70 shadow-sm backdrop-blur-sm">
                <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-indigo-800">Fournitures spécifiques</p>
                  <p className="text-sm text-indigo-600">Vérifier les fournitures spécifiques à votre matière.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/fournitures')}
              className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition-colors font-medium"
            >
              <span>Voir ma liste de fournitures</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
