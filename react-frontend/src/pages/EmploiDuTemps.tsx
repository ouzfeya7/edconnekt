import React, { useState } from 'react';
import { Download, Clock, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
import { useUser } from '../layouts/DashboardLayout';
import { ActionCard } from '../components/ui/ActionCard';
import schoolLogo from '../assets/logo-yka-1.png';

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
    const [selectedWeek] = useState("Semaine du 13 - 17 Janvier 2025");
    
    const currentClasse = user?.classId || "CP2";
    const currentDate = new Date().toLocaleDateString('fr-FR');

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
                        // Si un cours commence à ce slot, l'afficher
                        row.push(`${courseAtSlot.title.replace('\n', ' ')} (${courseAtSlot.time})`);
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
                            row.push('-');
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
                    1: { cellWidth: 45, halign: 'center' },
                    2: { cellWidth: 45, halign: 'center' },
                    3: { cellWidth: 45, halign: 'center' },
                    4: { cellWidth: 45, halign: 'center' },
                    5: { cellWidth: 45, halign: 'center' },
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
                                <p className="text-slate-600 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {selectedWeek}
                                </p>
                            </div>
                        </div>
                        <ActionCard
                            icon={<Download className="w-5 h-5 text-orange-500" />}
                            label="Télécharger en PDF"
                            onClick={handleExportPdf}
                            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Grille de l'emploi du temps avec style moderne */}
            <div className="bg-white from-slate-50 to-white rounded-xl p-6 shadow-lg border border-slate-200">
                {/* En-tête avec les jours */}
                <div className="grid grid-cols-6 gap-4 mb-6">
                    <div></div> {/* Colonne vide pour les horaires */}
                    {days.map(day => (
                        <div key={day} className="text-center">
                            <h3 className="text-slate-700 font-semibold text-lg">{day}</h3>
                        </div>
                    ))}
                </div>

                {/* Grille avec horaires et cours */}
                <div className="relative">
                    {/* Grille de base */}
                    <div className="grid grid-cols-6 gap-2">
                        {/* Colonne des horaires */}
                        <div className="space-y-0">
                            {timeSlots.map((slot) => (
                                <div key={slot.time} className="flex items-start justify-center relative pt-1" style={{ height: '72px' }}>
                                    <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm font-medium border border-slate-300" style={{ fontFamily: 'Montserrat' }}>
                                        {slot.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Colonnes des jours */}
                        {days.map(day => (
                            <div key={day} className="relative" style={{ height: `${timeSlots.length * 72}px` }}>
                                {/* Grille de positionnement absolu pour chaque cours */}
                                {coursesData[day as keyof typeof coursesData].map((course, index) => {
                                    const topPosition = course.startSlot * 72 + (course.startSlot > 0 ? 4 : 0); // +4px d'offset sauf pour le premier
                                    const height = course.duration * 72 - 8; // Hauteur uniforme pour même durée
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`absolute left-0 right-0 p-2 rounded-lg border-l-4 shadow-sm ${course.color} flex flex-col justify-start overflow-hidden`}
                                            style={{
                                                top: `${topPosition}px`,
                                                height: `${height}px`,
                                                minHeight: '56px'
                                            }}
                                        >
                                            <div className="text-xs font-medium opacity-75 mb-1 break-words" style={{ color: '#1E3A8A', fontFamily: 'Montserrat' }}>
                                                {course.time}
                                            </div>
                                            <div className="text-sm font-semibold leading-tight break-words hyphens-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', color: '#1E3A8A', fontFamily: 'Montserrat' }}>
                                                {course.title.split('\n').map((line, i) => (
                                                    <div key={i} className="break-words" style={{ color: '#1E3A8A', fontFamily: 'Montserrat' }}>{line}</div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    
                    {/* Barre de PAUSE qui s'étend sur toutes les colonnes */}
                    <div
                        className="absolute bg-white border border-slate-300 border-l-4 border-l-slate-400 rounded-lg flex items-center justify-center shadow-sm"
                        style={{
                            top: '360px', // Position du slot 5 (10:30) avec 72px par slot
                            left: 'calc(16.6667% + 0rem)', // Début après la colonne des horaires
                            right: '0rem', // Marge droite pour aligner avec les cartes
                            height: '64px', // -8px pour le gap comme les autres cartes (72-8=64)
                            zIndex: 10
                        }}
                    >
                        <span className="font-bold text-lg tracking-wider" style={{ color: '#1E3A8A', fontFamily: 'Montserrat' }}>PAUSE</span>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default EmploiDuTemps; 