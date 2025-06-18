import React from "react";

interface Homework {
  subject: string;
  title: string;
  dueDate: string;
  status: "completed" | "pending";
}

const homeworkData: Homework[] = [
  { subject: "Mathématiques", title: "Exercices sur les intégrales", dueDate: "2025-04-25", status: "pending" },
  { subject: "Physique", title: "Rapport sur les circuits électriques", dueDate: "2025-04-23", status: "completed" },
  { subject: "Anglais", title: "Lecture : Chapitre 4", dueDate: "2025-04-27", status: "pending" },
];

const HomeworkList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Liste des devoirs</h2>
      <ul className="space-y-4">
        {homeworkData.map((homework, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow ${homework.status === "completed" ? "bg-green-100" : "bg-yellow-100"}`}
          >
            <h3 className="text-lg font-semibold">{homework.subject}</h3>
            <p>{homework.title}</p>
            <p className="text-sm text-gray-500">À rendre : {homework.dueDate}</p>
            <p
              className={`text-sm font-medium ${
                homework.status === "completed" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {homework.status === "completed" ? "Terminé" : "En attente"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeworkList;
