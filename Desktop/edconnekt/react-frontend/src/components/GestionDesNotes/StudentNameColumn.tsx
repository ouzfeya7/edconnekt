
const StudentNameColumn = () => {
  const students = [
    { id: 1, name: "Khadija Ndiaye", image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8cd5d04111d9b90783d45463dc53bf4bf03fab10?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    { id: 2, name: "Maty Diop", image: "https://cdn.builder.io/api/v1/image/assets/TEMP/2b68eb1f2c9d7d53f1336322dad2dec958347753?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    { id: 3, name: "Mouhamed Fall", image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
   ];

  return (
    <div className="flex flex-col w-[184px]">
      <div className="gap-2.5 self-stretch p-2.5 w-full text-sm font-medium leading-none text-gray-800 bg-gray-50 border-t border-b border-solid border-b-[color:var(--Foundation-Green-G50,#E8EDF0)] border-t-[color:var(--Foundation-Green-G50,#E8EDF0)] min-h-10">
        Prénom et Nom
      </div>

      {students.map((student, index) => (
        <div
          key={student.id}
          className={`flex gap-3.5 items-center ${index === 0 ? "px-2" : index === 1 ? "self-start px-2" : index === 9 ? "py-1" : "px-1.5"} py-1 mt-1.5`}
        >
          <span className="self-stretch my-auto text-base font-medium text-sky-950">
            {student.id}
          </span>
          <img
            src={student.image}
            className="object-contain overflow-hidden shrink-0 self-stretch my-auto w-8 rounded-lg aspect-square"
            alt={`${student.name} avatar`}
          />
          <span className="self-stretch my-auto text-sm leading-none text-gray-600">
            {student.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StudentNameColumn;
