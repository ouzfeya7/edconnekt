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

// Données d'exemple pour l'emploi du temps YKA CP2
const scheduleData = [
    {
        time: "08:15 - 08:45",
        monday: "Morning briefing\nMorning Assembly",
        tuesday: "Morning briefing\nMorning Assembly", 
        wednesday: "Morning briefing\nMorning Assembly",
        thursday: "Morning briefing\nMorning Assembly",
        friday: "Morning briefing\nMorning Assembly",
        color: "bg-blue-100"
    },
    {
        time: "08:45 - 10:00",
        monday: "English language",
        tuesday: "EPSA Musique / éducation environnementale",
        wednesday: "EPSA EPS",
        thursday: "LC Lecture fluidité",
        friday: "English fluency",
        color: "bg-orange-100"
    },
    {
        time: "10:00 - 10:30",
        monday: "Vocabulary",
        tuesday: "LC Communication orale\n\nLC Lecture CGP",
        wednesday: "Phonics\n\nGrammar",
        thursday: "LC Communication orale\n\nSTEM/ Activité géométrie",
        friday: "Activités communautaires / arts scéniques",
        color: "bg-purple-100"
    },
    {
        time: "10:30 - 11:00",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        color: "bg-gray-100",
        isPause: true
    },
    {
        time: "11:00 - 12:00",
        monday: "HUM/ islamic stadice",
        tuesday: "HUM/ islamic stadice",
        wednesday: "HUM/ islamic stadice",
        thursday: "HUM/ islamic stadice",
        friday: "HUM/ islamic stadice",
        color: "bg-green-100"
    },
    {
        time: "12:00 - 13:00",
        monday: "Conversation\n\nWellness",
        tuesday: "Lunch / LC acquisition globale\n\nLC Production d'écrits\n\nSTEM Activités numériques",
        wednesday: "STEM",
        thursday: "HUM/ Géographie\n\nLC Lecture compréhension\n\nSTEM Activité de mesure",
        friday: "storytelling\n\nWellness\n\nSongs / poems",
        color: "bg-yellow-100"
    }
];

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

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

            // Préparer les données pour le tableau PDF
            const tableColumns = ["Horaires", ...days];
            const tableRows = scheduleData.map(slot => {
                if (slot.isPause) {
                    return [slot.time, "PAUSE", "PAUSE", "PAUSE", "PAUSE", "PAUSE"];
                }
                return [
                    slot.time,
                    slot.monday || "-",
                    slot.tuesday || "-", 
                    slot.wednesday || "-",
                    slot.thursday || "-",
                    slot.friday || "-"
                ];
            });

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: startY,
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 9,
                    cellPadding: 3,
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [230, 230, 230], // Gris clair
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 10,
                },
                columnStyles: {
                    0: { cellWidth: 25, fontStyle: 'bold', halign: 'left' }, // Horaires
                    1: { cellWidth: 45, halign: 'center' }, // Lundi
                    2: { cellWidth: 45, halign: 'center' }, // Mardi
                    3: { cellWidth: 45, halign: 'center' }, // Mercredi
                    4: { cellWidth: 45, halign: 'center' }, // Jeudi
                    5: { cellWidth: 45, halign: 'center' }, // Vendredi
                },
                didDrawCell: (data) => {
                    // Colorer et styliser la ligne PAUSE
                    if (data.section === 'body' && data.row.index === 3) { // Index de la pause
                        doc.setFillColor(240, 240, 240);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        
                        // Redessiner les bordures de la cellule
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(0.1);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
                        
                        // Réécrire le texte PAUSE en gras et centré (sauf pour la colonne horaires)
                        if (data.column.index > 0 && data.cell.text[0] === 'PAUSE') {
                            doc.setTextColor(0, 0, 0);
                            doc.setFont('times', 'bold');
                            doc.text('PAUSE', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 2, { 
                                align: 'center' 
                            });
                        }
                        // Pour la colonne horaires, afficher l'horaire normalement
                        else if (data.column.index === 0) {
                            doc.setTextColor(0, 0, 0);
                            doc.setFont('times', 'bold');
                            doc.text(data.cell.text[0], data.cell.x + 3, data.cell.y + data.cell.height / 2 + 2);
                        }
                    }
                },
                didDrawPage: () => {
                    // S'assurer que le texte PAUSE est visible et centré
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('times', 'bold');
                }
            });

            // Ajouter une note en bas
            const finalY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY || startY + 100;
            doc.setFontSize(8);
            doc.setFont("times", 'italic');
            doc.text(`Document généré le ${currentDate}`, 25, finalY + 15);
            doc.text("EPSA = Éducation Physique Sportive et Artistique | LC = Langues et Communication | HUM = Humanités | STEM = Sciences et Mathématiques", 25, finalY + 25);

            doc.save(`Emploi_du_Temps_${currentClasse}_${currentDate.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
        }
    };

    return (
        <div className="bg-white min-h-screen p-4 md:p-6">
            {/* En-tête du planning avec design moderne */}
            <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-slate-200">
                {/* Effet de fond avec motifs décoratifs */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/8"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/12 rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-500/8 rounded-full -translate-x-16 -translate-y-16"></div>
                
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

            {/* Emploi du temps avec design amélioré */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200/50 rounded-xl shadow-sm">
                {/* Motifs décoratifs pour la section emploi du temps */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/6 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/8 rounded-full translate-y-16 -translate-x-16"></div>
                <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-teal-500/5 rounded-full"></div>
                
                <div className="relative p-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                {/* En-tête avec dégradé moderne */}
                                <thead>
                                    <tr className="bg-gradient-to-r from-emerald-100 to-cyan-100 text-slate-800 border-b-2 border-slate-300">
                                        <th className="p-4 text-left font-semibold border-r-2 border-slate-300">
                                            Horaires
                                        </th>
                                        {days.map(day => (
                                            <th key={day} className="p-4 text-center font-semibold border-r-2 border-slate-300 last:border-r-0">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Corps du tableau avec couleurs modernes */}
                                <tbody>
                                    {scheduleData.map((slot, index) => (
                                        <tr key={index} className={`border-b-2 border-slate-300 ${
                                            slot.isPause 
                                                ? 'bg-gradient-to-r from-slate-100/80 to-slate-50/80' 
                                                : 'hover:bg-gradient-to-r hover:from-white/90 hover:to-blue-50/30 transition-all duration-200'
                                        }`}>
                                            {/* Horaires avec style amélioré */}
                                            <td className="p-4 font-semibold text-slate-800 border-r-2 border-slate-300 bg-gradient-to-r from-slate-50 to-white">
                                                {slot.time}
                                            </td>
                                    
                                            {/* Lundi */}
                                            <td className={`p-4 border-r-2 border-slate-300 ${
                                                slot.isPause 
                                                    ? 'text-center font-semibold text-slate-600' 
                                                    : 'text-slate-700'
                                            }`}>
                                                {slot.isPause ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                        <span>PAUSE</span>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        {slot.monday.split('\n').map((line, i) => (
                                                            <div key={i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-200/30' : ''} font-medium`}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Mardi */}
                                            <td className={`p-4 border-r-2 border-slate-300 ${
                                                slot.isPause 
                                                    ? 'text-center font-semibold text-slate-600' 
                                                    : 'text-slate-700'
                                            }`}>
                                                {slot.isPause ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                        <span>PAUSE</span>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        {slot.tuesday.split('\n').map((line, i) => (
                                                            <div key={i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-200/30' : ''} font-medium`}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Mercredi */}
                                            <td className={`p-4 border-r-2 border-slate-300 ${
                                                slot.isPause 
                                                    ? 'text-center font-semibold text-slate-600' 
                                                    : 'text-slate-700'
                                            }`}>
                                                {slot.isPause ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                        <span>PAUSE</span>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        {slot.wednesday.split('\n').map((line, i) => (
                                                            <div key={i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-200/30' : ''} font-medium`}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Jeudi */}
                                            <td className={`p-4 border-r-2 border-slate-300 ${
                                                slot.isPause 
                                                    ? 'text-center font-semibold text-slate-600' 
                                                    : 'text-slate-700'
                                            }`}>
                                                {slot.isPause ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                        <span>PAUSE</span>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        {slot.thursday.split('\n').map((line, i) => (
                                                            <div key={i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-200/30' : ''} font-medium`}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Vendredi */}
                                            <td className={`p-4 ${
                                                slot.isPause 
                                                    ? 'text-center font-semibold text-slate-600' 
                                                    : 'text-slate-700'
                                            }`}>
                                                {slot.isPause ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                        <span>PAUSE</span>
                                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        {slot.friday.split('\n').map((line, i) => (
                                                            <div key={i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-200/30' : ''} font-medium`}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Légende avec design moderne */}
                    <div className="relative mt-6 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-500/6 rounded-full translate-y-8 -translate-x-8"></div>
                        
                        <div className="relative">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                Légende des abréviations
                                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 rounded-lg shadow-sm">
                                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                    <div className="text-sm">
                                        <strong className="text-slate-800">EPSA :</strong>
                                        <span className="text-slate-600 ml-1">Éducation Physique Sportive et Artistique</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg shadow-sm">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <div className="text-sm">
                                        <strong className="text-slate-800">LC :</strong>
                                        <span className="text-slate-600 ml-1">Langues et Communication</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-lg shadow-sm">
                                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                    <div className="text-sm">
                                        <strong className="text-slate-800">HUM :</strong>
                                        <span className="text-slate-600 ml-1">Humanités</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50 rounded-lg shadow-sm">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <div className="text-sm">
                                        <strong className="text-slate-800">STEM :</strong>
                                        <span className="text-slate-600 ml-1">Sciences et Mathématiques</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmploiDuTemps; 