
const DateColumn = () => {
  // Array of 10 identical dates for each student
  const dates = Array(3).fill("2 Mars 2025");

  return (
    <div className="w-36 text-sm leading-none text-gray-600 bg-gray-50 ">
      <div className="gap-2.5 self-stretch p-2.5 w-full text-sm font-medium leading-none text-gray-800 bg-gray-50 border-t border-b border-solid border-b-[color:var(--Foundation-Green-G50,#E8EDF0)] border-t-[color:var(--Foundation-Green-G50,#E8EDF0)] min-h-10">
        Date de naissance
      </div>

      {dates.map((date, index) => (
        <div key={index} className="gap-2.5 self-stretch p-2.5 mt-1.5 w-full">
          {date}
        </div>
      ))}
    </div>
  );
};

export default DateColumn;
