import React from "react";
import StudentNameColumn from "./StudentNameColumn";
import SubjectColumn from "./SubjectColumn";
import ProgressColumn from "./ProgressColumn";
import ActionColumn from "./ActionColumn";

interface StudentTableProps {
  selectedSubject: string;
}

// Mock de la fonction onAction pour éviter les erreurs, car elle n'est pas utilisée pour le moment.
const mockOnAction = (action: string, studentId: number) => {
    console.log(`Action: ${action}, Student ID: ${studentId}`);
};

const StudentTable: React.FC<StudentTableProps> = ({
    selectedSubject,
}) => {
    // Cette variable est utilisée pour simuler le changement de colonnes
    // en fonction de la matière sélectionnée. La logique complète sera
    // implémentée lorsque les données réelles seront disponibles.
    console.log(selectedSubject); 

    return (
        <div className="flex flex-nowrap overflow-x-auto w-full pb-4">
            <StudentNameColumn />
            {/* DateColumn a été supprimé comme demandé */}

            {/* Ces colonnes sont pour l'instant statiques, mais seront
                rendues dynamiques en fonction de `selectedSubject` */}
            <SubjectColumn
                title="Langage"
                values={[ "75", "88", "71" ]}
                isAlternate={false}
            />
            <SubjectColumn
                title="Conte"
                values={[ "79", "53", "01" ]}
                isAlternate={true}
            />
            <SubjectColumn
                title="Vocabulaire"
                values={[ "68", "14", "72" ]}
                isAlternate={false}
                width="110px"
            />
            <SubjectColumn
                title="Lecture"
                values={[ "80", "60", "65" ]}
                isAlternate={true}
                width="110px"
            />
            <SubjectColumn
                title="Graphisme"
                values={[ "72", "40", "63" ]}
                isAlternate={false}
                width="110px"
            />

            <ProgressColumn />
            <ActionColumn onAction={mockOnAction} />
            
        </div>
    );
};

export default StudentTable;
