import { jsPDF } from 'jspdf';
import { CellHookData, UserOptions } from 'jspdf-autotable';

export const getPdfTableStyles = (doc: jsPDF): Partial<UserOptions> => ({
    theme: 'grid',
    headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
    },
    styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
    },
    didDrawCell: (data: CellHookData) => {
        if (data.section === 'body' && data.column.index >= 2) { // Competence columns
            const cellText = data.cell.text[0];
            if (cellText && typeof cellText === 'string' && cellText.endsWith('%')) {
                const grade = parseInt(cellText, 10);
                if (!isNaN(grade)) {
                    let textColor: [number, number, number] = [0, 0, 0]; // Default black
                    if (grade >= 75) textColor = [5, 150, 105]; // Green for success
                    else if (grade >= 50) textColor = [249, 115, 22]; // Orange for warning
                    else textColor = [220, 38, 38]; // Red for failure
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    doc.setFont(doc.getFont().fontName, 'bold');
                }
            }
        }
    },
    willDrawCell: () => {
        doc.setTextColor(0, 0, 0);
        doc.setFont(doc.getFont().fontName, 'normal');
    }
}); 