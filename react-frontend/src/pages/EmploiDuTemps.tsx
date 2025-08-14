import React, { useEffect, useRef, useState } from 'react';
import { Download, Clock, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
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

// Créneaux horaires de 30 minutes
const timeSlots = [
    { time: '08:00', label: '08:00 - 08:30' },
    { time: '08:30', label: '08:30 - 09:00' },
    { time: '09:00', label: '09:00 - 09:30' },
    { time: '09:30', label: '09:30 - 10:00' },
    { time: '10:00', label: '10:00 - 10:30' },
    { time: '10:30', label: '10:30 - 11:00' },
    { time: '11:00', label: '11:00 - 11:30' },
    { time: '11:30', label: '11:30 - 12:00' },
    { time: '12:00', label: '12:00 - 12:30' },
    { time: '12:30', label: '12:30 - 13:00' }
];

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Détection simple de la matière à partir du titre
const getSubjectKeyFromTitle = (title: string): string => {
    const lower = (title || '').toLowerCase();
    if (lower.includes('english')) return 'english';
    if (lower.includes('vocabulary') || lower.includes('phonics') || lower.includes('grammar')) return 'language';
    if (lower.includes('hum') || lower.includes('islamic')) return 'humanities';
    if (lower.includes('communication') || lower.includes('lecture')) return 'literacy';
    if (lower.includes('epsa') || lower.includes('musique') || lower.includes('éducation environnementale') || lower.includes('eps')) return 'arts';
    if (lower.includes('stem')) return 'stem';
    if (lower.includes('community') || lower.includes('communaut') || lower.includes('arts scéniques')) return 'community';
    if (lower.includes('wellness')) return 'wellness';
    if (lower.includes('morning')) return 'briefing';
    return 'general';
};

// Couleurs PDF par matière (pastels)
const pdfFillColorBySubject: Record<string, [number, number, number]> = {
    briefing: [219, 234, 254],     // bleu clair
    english: [255, 237, 213],      // orange pastel
    language: [237, 233, 254],     // violet très clair
    literacy: [243, 232, 255],     // lavande
    arts: [254, 226, 226],         // rose clair
    stem: [220, 252, 231],         // vert clair
    community: [255, 247, 237],    // orange très pâle
    humanities: [187, 247, 208],   // vert menthe
    wellness: [224, 242, 254],     // bleu ciel
    general: [243, 244, 246],      // gris très clair
};

// Cours avec position et durée en créneaux (chaque créneau = 30 min)
const coursesData = {
    Lundi: [
        { startSlot: 0, duration: 2, time: '08:00 - 09:00', title: 'Morning briefing\nMorning Assembly', color: 'bg-blue-100 border-l-blue-500' },
        { startSlot: 2, duration: 2, time: '09:00 - 10:00', title: 'English language', color: 'bg-orange-100 border-l-orange-500' },
        { startSlot: 4, duration: 1, time: '10:00 - 10:30', title: 'Vocabulary', color: 'bg-purple-100 border-l-purple-500' },
        // Pause de 10:30 à 11:00 (slot 5)
        { startSlot: 6, duration: 2, time: '11:00 - 12:00', title: 'HUM/ islamic stadice', color: 'bg-green-100 border-l-green-500' },
        { startSlot: 8, duration: 1, time: '12:00 - 12:30', title: 'Conversation', color: 'bg-orange-100 border-l-orange-500' },
        { startSlot: 9, duration: 1, time: '12:30 - 13:00', title: 'Wellness', color: 'bg-orange-100 border-l-orange-500' }
    ],
    Mardi: [
        { startSlot: 0, duration: 2, time: '08:00 - 09:00', title: 'Morning briefing\nMorning Assembly', color: 'bg-blue-100 border-l-blue-500' },
        { startSlot: 2, duration: 1, time: '09:00 - 09:30', title: 'EPSA Musique / éducation environnementale', color: 'bg-red-100 border-l-red-500' },
        { startSlot: 3, duration: 1, time: '09:30 - 10:00', title: 'LC Communication orale', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 4, duration: 1, time: '10:00 - 10:30', title: 'LC Lecture CGP', color: 'bg-purple-100 border-l-purple-500' },
        // Pause de 10:30 à 11:00
        { startSlot: 6, duration: 1, time: '11:00 - 11:30', title: 'HUM/ islamic stadice', color: 'bg-green-100 border-l-green-500' },
        { startSlot: 7, duration: 1, time: '11:30 - 12:00', title: 'Lunch / LC acquisition globale', color: 'bg-yellow-100 border-l-yellow-500' },
        { startSlot: 8, duration: 1, time: '12:00 - 12:30', title: 'LC Production d\'écrits', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 9, duration: 1, time: '12:30 - 13:00', title: 'STEM Activités numériques', color: 'bg-red-100 border-l-red-500' }
    ],
    Mercredi: [
        { startSlot: 0, duration: 2, time: '08:00 - 09:00', title: 'Morning briefing\nMorning Assembly', color: 'bg-blue-100 border-l-blue-500' },
        { startSlot: 2, duration: 1, time: '09:00 - 09:30', title: 'EPSA EPS', color: 'bg-red-100 border-l-red-500' },
        { startSlot: 3, duration: 1, time: '09:30 - 10:00', title: 'Phonics', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 4, duration: 1, time: '10:00 - 10:30', title: 'Grammar', color: 'bg-blue-100 border-l-blue-500' },
        // Pause de 10:30 à 11:00
        { startSlot: 6, duration: 2, time: '11:00 - 12:00', title: 'HUM/ islamic stadice', color: 'bg-green-100 border-l-green-500' },
        { startSlot: 8, duration: 2, time: '12:00 - 13:00', title: 'STEM', color: 'bg-red-100 border-l-red-500' }
    ],
    Jeudi: [
        { startSlot: 0, duration: 2, time: '08:00 - 09:00', title: 'Morning briefing\nMorning Assembly', color: 'bg-blue-100 border-l-blue-500' },
        { startSlot: 2, duration: 1, time: '09:00 - 09:30', title: 'LC Lecture fluidité', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 3, duration: 1, time: '09:30 - 10:00', title: 'LC Communication orale', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 4, duration: 1, time: '10:00 - 10:30', title: 'STEM/ Activité géométrie', color: 'bg-red-100 border-l-red-500' },
        // Pause de 10:30 à 11:00
        { startSlot: 6, duration: 1, time: '11:00 - 11:30', title: 'HUM/ islamic stadice', color: 'bg-green-100 border-l-green-500' },
        { startSlot: 7, duration: 1, time: '11:30 - 12:00', title: 'HUM/ Géographie', color: 'bg-yellow-100 border-l-yellow-500' },
        { startSlot: 8, duration: 1, time: '12:00 - 12:30', title: 'LC Lecture compréhension', color: 'bg-purple-100 border-l-purple-500' },
        { startSlot: 9, duration: 1, time: '12:30 - 13:00', title: 'STEM Activité de mesure', color: 'bg-red-100 border-l-red-500' }
    ],
    Vendredi: [
        { startSlot: 0, duration: 2, time: '08:00 - 09:00', title: 'Morning briefing\nMorning Assembly', color: 'bg-blue-100 border-l-blue-500' },
        { startSlot: 2, duration: 2, time: '09:00 - 10:00', title: 'English fluency', color: 'bg-orange-100 border-l-orange-500' },
        { startSlot: 4, duration: 1, time: '10:00 - 10:30', title: 'Activités communautaires / arts scéniques', color: 'bg-red-100 border-l-red-500' },
        // Pause de 10:30 à 11:00
        { startSlot: 6, duration: 2, time: '11:00 - 12:00', title: 'HUM/ islamic stadice', color: 'bg-green-100 border-l-green-500' },
        { startSlot: 8, duration: 1, time: '12:00 - 12:30', title: 'storytelling', color: 'bg-orange-100 border-l-orange-500' },
        { startSlot: 9, duration: 1, time: '12:30 - 13:00', title: 'Wellness', color: 'bg-orange-100 border-l-orange-500' }
    ]
};

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

const EmploiDuTemps: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const calendarRef = useRef<FullCalendar>(null);
    // Vue figée sur la semaine type
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [viewingEvent, setViewingEvent] = useState<SchoolEvent | null>(null);
    const [events, setEvents] = useState<SchoolEvent[]>([]);
    
    const currentClasse = user?.classId || "CP2";
    const currentDate = new Date().toLocaleDateString('fr-FR');

    // Construire les événements à partir des données locales (semaine type)
    useEffect(() => {
        const getWeekStartMonday = (date: Date) => {
            const d = new Date(date);
            const day = d.getDay(); // 0=dimanche, 1=lundi
            const diff = (day === 0 ? -6 : 1) - day; // ajuster au lundi de la semaine courante
            d.setDate(d.getDate() + diff);
            d.setHours(0, 0, 0, 0);
            return d;
        };

        const monday = getWeekStartMonday(new Date());

        const dayNameToOffset: Record<string, number> = {
            'Lundi': 0,
            'Mardi': 1,
            'Mercredi': 2,
            'Jeudi': 3,
            'Vendredi': 4,
        };

        const getEndTime = (startSlot: number, duration: number): string => {
            const endIndex = startSlot + duration;
            if (endIndex < timeSlots.length) {
                return timeSlots[endIndex].time;
            }
            return '13:00';
        };

        const toIso = (baseDate: Date, time: string): string => {
            const [h, m] = time.split(':').map(Number);
            const d = new Date(baseDate);
            d.setHours(h, m, 0, 0);
            return d.toISOString();
        };

        const getSubjectKeyFromTitle = (title: string): string => {
            const lower = title.toLowerCase();
            if (lower.includes('english')) return 'english';
            if (lower.includes('vocabulary') || lower.includes('phonics') || lower.includes('grammar')) return 'language';
            if (lower.includes('hum') || lower.includes('islamic')) return 'humanities';
            if (lower.includes('communication') || lower.includes('lecture')) return 'literacy';
            if (lower.includes('epsa') || lower.includes('musique') || lower.includes('éducation environnementale') || lower.includes('eps')) return 'arts';
            if (lower.includes('stem')) return 'stem';
            if (lower.includes('community') || lower.includes('communaut') || lower.includes('arts scéniques')) return 'community';
            if (lower.includes('wellness')) return 'wellness';
            if (lower.includes('morning')) return 'briefing';
            return 'general';
        };

        const built: SchoolEvent[] = Object.entries(coursesData).flatMap(([dayName, slots]) => {
            const offset = dayNameToOffset[dayName];
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + offset);

            return slots.map((course, idx) => {
                const startTime = timeSlots[course.startSlot].time;
                const endTime = getEndTime(course.startSlot, course.duration);
                const subjectKey = getSubjectKeyFromTitle(course.title);
                return {
                    id: `${dayName}-${idx}`,
                    title: course.title,
                    start: toIso(dayDate, startTime),
                    end: toIso(dayDate, endTime),
                    allDay: false,
                    category: 'activite',
                    targetAudience: ['Élèves'],
                    className: `event-${subjectKey}`,
                } as SchoolEvent;
            });
        });

        setEvents(built);
    }, []);

    const handleExportPdf = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `EMPLOI DU TEMPS YKA ${currentClasse.toUpperCase()}`;
            const startY = addPdfHeader(doc, currentClasse, title);



            // Créer la structure de données pour le PDF de manière simplifiée
            const tableColumns = ["Horaires", ...days];
            
            // Créer directement les lignes du tableau avec les cours
            const tableRows: string[][] = [];
            
            // Pour chaque créneau horaire
            timeSlots.slice(0, 10).forEach((slot, slotIndex) => {
                const row = [slot.label];
                
                // Pour chaque jour
                days.forEach(day => {
                    const dayKey = day as keyof typeof coursesData;
                    const daySchedule = coursesData[dayKey];
                    
                    // Trouver le cours qui commence à ce slot
                    const courseAtSlot = daySchedule.find(course => course.startSlot === slotIndex);
                    
                    if (courseAtSlot) {
                        // Si un cours commence à ce slot, l'afficher (coloration via didParseCell)
                        row.push(`${courseAtSlot.title.replace('\n', ' ')}`);
                    } else {
                        // Vérifier si ce slot fait partie d'un cours qui a commencé avant
                        const ongoingCourse = daySchedule.find(course => 
                            course.startSlot < slotIndex && 
                            course.startSlot + course.duration > slotIndex
                        );
                        
                        if (ongoingCourse) {
                            // Slot fait partie d'un cours en cours, cellule vide pour le PDF
                            row.push('');
                        } else {
                            // Pas de cours à ce slot
                            row.push('');
                        }
                    }
                });
                
                tableRows.push(row);
            });

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: startY,
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 8,
                    cellPadding: 3,
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    textColor: [30, 58, 138], // #1E3A8A
                },
                headStyles: {
                    fillColor: [230, 230, 230],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 9,
                },
                columnStyles: {
                    0: { cellWidth: 25, fontStyle: 'bold', halign: 'left', fillColor: [248, 250, 252] },
                    1: { cellWidth: 44, halign: 'center' },
                    2: { cellWidth: 44, halign: 'center' },
                    3: { cellWidth: 44, halign: 'center' },
                    4: { cellWidth: 44, halign: 'center' },
                    5: { cellWidth: 44, halign: 'center' },
                },
                didParseCell: (data) => {
                    const { section, row, column, cell } = data;
                    if (section === 'body' && column.index > 0) {
                        const slotIndex = row.index; // correspond à timeSlots.slice(0,10)
                        const dayIndex = column.index - 1; // 0..4 => Lundi..Vendredi
                        const dayKey = days[dayIndex] as keyof typeof coursesData;
                        const courseCovering = coursesData[dayKey].find(c => c.startSlot <= slotIndex && (c.startSlot + c.duration) > slotIndex);
                        if (courseCovering) {
                            const subjectKey = getSubjectKeyFromTitle(courseCovering.title);
                            const fill = pdfFillColorBySubject[subjectKey] || pdfFillColorBySubject.general;
                            cell.styles.fillColor = [fill[0], fill[1], fill[2]] as [number, number, number];
                            cell.styles.textColor = [30, 58, 138] as [number, number, number];
                            // Mettre en gras uniquement sur la première case (début du cours)
                            if (courseCovering.startSlot === slotIndex) {
                                cell.styles.fontStyle = 'bold';
                            }
                        }
                    }
                }
            });

            const finalY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY || startY + 100;
            doc.setFontSize(8);
            doc.setFont("times", 'italic');
            doc.text(`Document généré le ${currentDate}`, 25, finalY + 15);

            doc.save(`Emploi_du_Temps_${currentClasse}_${currentDate.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
        }
    };

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