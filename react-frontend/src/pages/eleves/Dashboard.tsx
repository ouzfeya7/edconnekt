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
  BookMarked
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
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* En-tête du dashboard compact */}
      <div className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={student.imageUrl} 
              alt={student.name}
              className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Bonjour, {user.name.split(' ')[0]} ! 👋
              </h1>
              <p className="text-gray-600">Classe {user.classLabel || currentClasse} • {student.ref}</p>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voir mon profil"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Statistiques compactes en ligne */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{studentStats.courses.total} cours</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{studentStats.courses.active} en cours</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">{studentStats.courses.completed} terminés</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mes cours récents - mêmes cartes que MesCoursPage */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Mes cours</h2>
              <button 
                onClick={() => navigate('/mes-cours')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-sm">Voir tout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <StudentProgressionChart />
          </div>
        </div>

        {/* Barre latérale optimisée */}
        <div className="space-y-6">
          
          {/* Devoirs à faire */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Devoirs à faire</h2>
              <button 
                onClick={() => navigate('/devoirs')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-sm">Voir tout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {studentAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-200">
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg border ${
                  notif.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  notif.type === 'info' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Prochains événements</h3>
            <div className="space-y-3">
              {studentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className={`flex items-center gap-3 p-3 bg-${event.color}-50 rounded-lg`}>
                  <div className={`p-2 bg-${event.color}-200 rounded-lg`}>
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
              className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Voir mon agenda</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
