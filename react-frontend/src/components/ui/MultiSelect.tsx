import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, ChevronsUpDown, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsMessage?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner…',
  searchPlaceholder = 'Rechercher…',
  noResultsMessage = 'Aucun résultat',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, searchTerm]);

  const toggleValue = (val: string) => {
    if (selected.has(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (val: string) => onChange(value.filter(v => v !== val));

  const displayText = value.length === 0
    ? placeholder
    : `${value.length} sélectionné${value.length > 1 ? 's' : ''}`;

  return (
    <div className="relative w-full" ref={rootRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-left bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-300"
      >
        <div className="flex flex-wrap gap-1 items-center min-h-[22px]">
          {value.length === 0 ? (
            <span className="text-gray-500">{displayText}</span>
          ) : (
            value.map(v => {
              const opt = options.find(o => o.value === v);
              const label = opt?.label ?? v;
              return (
                <span key={v} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                  {label}
                  <X className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); removeValue(v); }} />
                </span>
              );
            })
          )}
        </div>
        <ChevronsUpDown className="w-4 h-4 ml-2 text-gray-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <ul className="py-1 overflow-y-auto max-h-60">
            {filtered.length > 0 ? (
              filtered.map((option) => {
                const active = selected.has(option.value);
                return (
                  <li
                    key={option.value}
                    onClick={() => toggleValue(option.value)}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 ${active ? 'bg-green-50' : ''}`}
                  >
                    <span className="truncate mr-2">{option.label}</span>
                    {active && <Check className="w-4 h-4 text-green-600" />}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-center text-gray-500">
                {noResultsMessage}
              </li>
            )}
          </ul>
          {value.length > 0 && (
            <div className="flex items-center justify-between p-2 border-t bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-white"
              >
                Effacer
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Appliquer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;


