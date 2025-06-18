import ProgressIndicator from "../../ui/ProgressIndicator";

const ProgressColumn = () => {
  // Different progress patterns for each student
  const progressPatterns = [
    [1, 2, 3, 4, 0],
    [1, 2, 0, 0, 0],
    [1, 2, 0, 0, 0],
  ];

  return (
    <div className="w-36 bg-gray-50">
      <div className="gap-2.5 self-stretch p-2.5 w-36 max-w-full text-sm font-medium leading-none text-gray-800 whitespace-nowrap bg-gray-50 border-t border-b border-solid border-b-[color:var(--Foundation-Green-G50,#E8EDF0)] border-t-[color:var(--Foundation-Green-G50,#E8EDF0)]">
        Progression
      </div>

      {progressPatterns.map((pattern, index) => (
        <div key={index} className="flex gap-1 items-start px-2.5 py-4 mt-1.5">
          <ProgressIndicator level={pattern[0]} />
          <ProgressIndicator level={pattern[1]} />
          <ProgressIndicator level={pattern[2]} />
          <ProgressIndicator level={pattern[3]} />
          <ProgressIndicator level={pattern[4]} />
        </div>
      ))}
    </div>
  );
};

export default ProgressColumn;
