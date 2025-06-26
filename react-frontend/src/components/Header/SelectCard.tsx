import React from 'react';

type Option = string | { value: string; label: string };

interface SelectCardProps {
  label: string;
  value: string;
  options: Option[];
  onChange?: (value: string) => void;
  containerClassName?: string;
  displayTransformer?: (value: string) => string;
}

const SelectCard: React.FC<SelectCardProps> = ({
  label,
  value,
  options,
  onChange,
  containerClassName = "",
  displayTransformer = v => v,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const selectedOption = options.find(opt => {
        if (typeof opt === 'string') return opt === e.target.value;
        return opt.label === e.target.value;
      });
      if (selectedOption) {
        onChange(typeof selectedOption === 'string' ? selectedOption : selectedOption.value);
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${containerClassName}`}>
      <label className="block text-sm text-gray-500 font-medium">{label}</label>
      <div className="relative mt-2">
        <select 
          className="w-full appearance-none pr-8 py-1 text-gray-900 font-medium focus:outline-none bg-transparent"
          value={displayTransformer(value)}
          onChange={handleChange}
        >
          {options.map((option) => {
            const val = typeof option === 'string' ? option : option.value;
            const lbl = typeof option === 'string' ? option : option.label;
            return <option key={val} value={lbl}>{lbl}</option>;
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectCard; 