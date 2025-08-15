import React, { useRef, useState } from 'react';
import { Download, Clock, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { Table } from 'jspdf-autotable';
import { useUser } from '../layouts/DashboardLayout';
import { ActionCard } from '../components/ui/ActionCard';
import schoolLogo from '../assets/logo-yka-1.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
// Supprime l'entête de navigation et le contrôle de vue
import EventDetailsModal from '../components/agenda/EventDetailsModal';
import { SchoolEvent } from '../components/agenda/agenda_data';
import { useLessons } from '../hooks/useLessons';
import { LessonRead } from '../api/timetable-service/api';
import AppLoader from '../components/ui/AppLoader';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: Table;
}

const schoolInfo = {
    name: "Yenne Kids' Academy",
    address: "Kel, Rte de Toubab Dialaw, Yenne BP 20000, Dakar, Senegal",
    phone1: "+221 77 701 52 52",
    phone2: "+221 33 871 27 82",
    email: "hello@yennekidsacademy.com",
    website: "www.yennekidsacademy.com",
    academicYear: "2023-2024"
};

// Les variables pour les données statiques sont supprimées car elles ne sont plus utilisées.

const addPdfHeader = (doc: jsPDF, classe: string, title: string) => {
    // Logo
    doc.addImage(schoolLogo, 'PNG', 25, 15, 30, 30);

    // School Info
    doc.setFontSize(14);
    doc.setFont("times", 'bold');
    doc.text(schoolInfo.name, 65, 22);
    
    doc.setFontSize(8);
    doc.setFont("times", 'normal');
    doc.text(schoolInfo.address, 65, 28);
    doc.text(`Tél: ${schoolInfo.phone1} / ${schoolInfo.phone2}`, 65, 32);
    doc.text(`Email: ${schoolInfo.email} | Site: ${schoolInfo.website}`, 65, 36);
    doc.text(`Année Scolaire: ${schoolInfo.academicYear}`, 65, 40);

    // Title
    doc.setFontSize(16);
    doc.setFont("times", 'bold');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
    
    // Class Subtitle
    doc.setFontSize(12);
    doc.setFont("times", 'normal');
    doc.text(`Classe: ${classe.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, 62, { align: 'center' });

    // Header Line
    doc.setDrawColor(0);
    doc.line(25, 70, doc.internal.pageSize.getWidth() - 25, 70);
    
    return 80; // Return the start Y position for the content
};

// Fonction pour mapper les données de l'API au format des événements du calendrier
const mapLessonToEvent = (lesson: LessonRead): SchoolEvent => {
    // Des hypothèses sont faites ici sur la façon de récupérer le titre et la couleur.
    // Cela devra être ajusté lorsque nous aurons les vrais IDs de matière, etc.
    const subjectTitle = `Matière ${lesson.subject_id}`; // À remplacer
    const subjectKey = 'general'; // À remplacer par une logique de mapping

    return {
        id: lesson.id,
        title: subjectTitle,
        start: lesson.date, // L'API devrait retourner des dates ISO
        // Note: L'API ne fournit pas de `end_time`, cela devra être géré
        // soit par l'API, soit en calculant côté client si une durée est dispo.
        // Pour l'instant, on peut mettre une durée par défaut.
        end: new Date(new Date(lesson.date).getTime() + 60 * 60 * 1000).toISOString(),
        allDay: false,
        category: 'activite',
        targetAudience: ['Élèves'],
        className: `event-${subjectKey}`,
        extendedProps: {
            teacherId: lesson.teacher_id,
            roomId: lesson.room_id,
            classId: lesson.class_id,
            status: lesson.status,
        }
    };
};

const EmploiDuTemps: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const calendarRef = useRef<FullCalendar>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [viewingEvent, setViewingEvent] = useState<SchoolEvent | null>(null);
    
    const currentClasse = user?.classId || "CP2"; // À utiliser pour filtrer

    // Appel au hook pour récupérer les leçons
    const { data: lessons, isLoading, isError, error } = useLessons({
        // classId: currentClasse // Temporairement retiré pour éviter l'erreur 422
        // On pourra ajouter des filtres de date plus tard
    });

    // Transformer les données pour le calendrier
    const events = React.useMemo(() => {
        if (!Array.isArray(lessons)) return [];
        return lessons.map(mapLessonToEvent);
    }, [lessons]);

    const handleExportPdf = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `EMPLOI DU TEMPS YKA ${currentClasse.toUpperCase()}`;
            addPdfHeader(doc, currentClasse, title);

            // TODO: La logique d'exportation PDF doit être mise à jour pour utiliser
            // les données de l'API (`lessons`) plutôt que `coursesData`.
            // C'est une tâche complexe qui est laissée pour plus tard.
            alert("La fonction d'exportation PDF n'est pas encore mise à jour avec les nouvelles données.");

        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
        }
    };

    if (isLoading) {
        return <AppLoader />;
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Erreur lors de la récupération de l'emploi du temps: {error?.message}
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-4 md:p-6">
            {/* En-tête du planning */}
            <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/8"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/12 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <Clock className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    Emploi du Temps YKA {currentClasse.toUpperCase()}
                                </h1>
                                {/* Semaine type: pas d'affichage de dates */}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/calendar')}
                                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                title={t('back_to_agenda', 'Retour à l\'agenda')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline font-semibold">{t('back_to_agenda', 'Agenda')}</span>
                            </button>
                            <ActionCard
                                icon={<Download className="w-5 h-5 text-orange-500" />}
                                label="Télécharger en PDF"
                                onClick={handleExportPdf}
                                className="bg-orange-50 hover:bg-orange-100 border border-orange-200 shadow-sm"
                            />
                        </div>
                    </div>
                    {/* Navigation supprimée pour une semaine type */}
                </div>
            </div>

            {/* Styles d'événement par matière avec bon contraste */}
            <style>{`
                /* Palette matières */
                .event-briefing { background-color: rgba(59, 130, 246, 0.10) !important; border-color: #3b82f6 !important; color: #1E3A8A !important; }
                .event-english { background-color: rgba(245, 158, 11, 0.12) !important; border-color: #f59e0b !important; color: #1E3A8A !important; }
                .event-language { background-color: rgba(139, 92, 246, 0.12) !important; border-color: #8b5cf6 !important; color: #1E3A8A !important; }
                .event-literacy { background-color: rgba(192, 132, 252, 0.12) !important; border-color: #c084fc !important; color: #1E3A8A !important; }
                .event-arts { background-color: rgba(244, 63, 94, 0.10) !important; border-color: #f43f5e !important; color: #1E3A8A !important; }
                .event-stem { background-color: rgba(16, 185, 129, 0.12) !important; border-color: #10b981 !important; color: #1E3A8A !important; }
                .event-community { background-color: rgba(249, 115, 22, 0.12) !important; border-color: #f97316 !important; color: #1E3A8A !important; }
                .event-humanities { background-color: rgba(34, 197, 94, 0.12) !important; border-color: #22c55e !important; color: #1E3A8A !important; }
                .event-wellness { background-color: rgba(14, 165, 233, 0.12) !important; border-color: #0ea5e9 !important; color: #1E3A8A !important; }
                .event-general { background-color: rgba(107, 114, 128, 0.10) !important; border-color: #6b7280 !important; color: #1E3A8A !important; }

                .fc .fc-timegrid-event[class*='event-'],
                .fc .fc-daygrid-event[class*='event-'],
                .fc-event[class*='event-'] {
                    border-left-width: 4px !important;
                    border-left-style: solid !important;
                    font-weight: 600 !important;
                }
                /* S'assurer que tout le contenu interne hérite d'une couleur lisible */
                .fc .fc-timegrid-event .fc-event-main,
                .fc .fc-timegrid-event .fc-event-title,
                .fc .fc-timegrid-event .fc-event-time,
                .fc .fc-timegrid-event .fc-event-title-container,
                .fc-event[class*='event-'] .fc-event-main,
                .fc-event[class*='event-'] * {
                    color: #1E3A8A !important;
                }
                .fc .fc-timegrid-event {
                    border-radius: 8px !important;
                }
            `}</style>

            {/* Calendrier dynamique hebdomadaire - rendu directement sur la page */}
            <FullCalendar
                key={i18n.language}
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={'timeGridWeek'}
                headerToolbar={false}
                locale={i18n.language === 'fr' ? frLocale : enLocale}
                firstDay={1}
                weekends={false}
                slotMinTime={'08:00:00'}
                slotMaxTime={'13:00:00'}
                slotDuration={'00:30:00'}
                allDaySlot={false}
                height={"80vh"}
                expandRows={true}
                nowIndicator={true}
                events={events}
                displayEventTime={false}
                eventClick={(clickInfo) => {
                    setViewingEvent(clickInfo.event.toPlainObject({ collapseExtendedProps: true }) as SchoolEvent);
                    setIsDetailsOpen(true);
                }}
                dayHeaderFormat={{ weekday: 'long' }}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
                buttonText={{ today: "Aujourd'hui", week: 'Semaine', day: 'Jour' }}
            />

            {/* Détails de l'événement */}
            <EventDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                event={viewingEvent}
            />
        </div>
    );
};

export default EmploiDuTemps; 