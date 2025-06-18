interface ProgressStepsProps {
    progress: number;
  }
  
  const ProgressSteps: React.FC<ProgressStepsProps> = ({ progress }) => {
    const steps = [
      { min: 0, max: 20, color: 'bg-red-400' },
      { min: 20, max: 40, color: 'bg-orange-400' },
      { min: 40, max: 60, color: 'bg-yellow-400' },
      { min: 60, max: 80, color: 'bg-green-300' },
      { min: 80, max: 100, color: 'bg-green-500' },
    ];
  
    return (
      <div className="flex justify-center items-center space-x-1">
        {steps.map((step, index) => {
          const isActive = progress >= step.max;
          const isPartial = progress > step.min && progress < step.max;
          const width = isPartial
            ? `${((progress - step.min) / (step.max - step.min)) * 100}%`
            : isActive
            ? '100%'
            : '0%';
  
          return (
            <div key={index} className="relative w-8 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`${step.color} h-full absolute left-0 top-0`}
                style={{ width, transition: 'width 0.5s ease' }}
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  export default ProgressSteps; 