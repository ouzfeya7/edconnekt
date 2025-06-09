import AssignmentCard from "./AssignmentCard";

const AssignmentsSection = () => {
  // Données factices pour les cartes de devoirs/tâches
  const assignments = [
    {
      title: "Résoudre une équation du second degrés",
      subject: "Mathématique",
      time: "8H30 - 10H30",
      teacher: "Mouhamed Sall",
      teacherImage: "/avatar.png", // Assurez-vous que ce chemin est correct ou utilisez une URL
      presentCount: 20,
      absentCount: 0,
      onViewDetails: () => console.log("Voir détails pour équation 1"),
    },
    {
      title: "Résoudre une équation du second degrés",
      subject: "Mathématique",
      time: "11H00 - 12H00",
      teacher: "Mouhamed Sall",
      teacherImage: "/avatar.png",
      presentCount: 20,
      absentCount: 0,
      onViewDetails: () => console.log("Voir détails pour équation 2"),
    },
    {
      title: "Résoudre une équation du second degrés",
      subject: "Mathématique",
      time: "12H00 - 13H00", // Note: Le design montre 12H00-13H00 pour la 3ème carte, mais l'image crop montre une 3ème carte similaire aux autres.
                                  // J'utilise un horaire distinct pour la différencier.
      teacher: "Mouhamed Sall",
      teacherImage: "/avatar.png",
      presentCount: 20,
      absentCount: 0,
      onViewDetails: () => console.log("Voir détails pour équation 3"),
    },
  ];

  return (
    // La section globale a un padding et un fond blanc comme dans le design des cartes.
    // Le titre "Devoirs à faire" a été retiré pour correspondre au design.
    <section className="mt-3.5 w-full">
      {/* Le design n'a pas de titre de section ici, les cartes sont directement listées */}
      {/* <div className="flex flex-col justify-center p-2.5 w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex gap-8 items-center self-start text-base font-medium text-center text-sky-950">
            <h2 className="py-2.5 my-auto">Devoirs à faire</h2>
          </div>
          <div className="w-full max-md:max-w-full">
            <div className="flex shrink-0 h-0.5 bg-gray-200 max-md:max-w-full" />
          </div>
        </div>
      </div> */}

      {/* Utilisation d'une grille pour disposer les cartes, ou flex-wrap si la largeur des cartes est gérée par elles-mêmes */}
      <div className="flex flex-wrap gap-4 justify-between">
        {assignments.map((assignment, index) => (
          <AssignmentCard
            key={index}
            title={assignment.title}
            subject={assignment.subject}
            time={assignment.time}
            teacher={assignment.teacher}
            teacherImage={assignment.teacherImage}
            presentCount={assignment.presentCount}
            absentCount={assignment.absentCount}
            onViewDetails={assignment.onViewDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default AssignmentsSection;
