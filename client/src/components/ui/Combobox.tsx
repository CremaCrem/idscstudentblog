import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './Badge';
import { X } from 'lucide-react';

export interface ComboboxProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ options, selected, onChange, placeholder = 'Add tags...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selected.includes(opt)
  );

  const handleSelect = (option: string) => {
    onChange([...selected, option]);
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemove = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      const match = filteredOptions.find((opt) => opt.toLowerCase() === inputValue.toLowerCase());
      if (match) {
        handleSelect(match);
      } else if (!selected.includes(inputValue)) {
        setInputValue('');
      }
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="w-full rounded-xl border border-zinc-300 bg-white p-2 min-h-[52px] focus-within:ring-2 focus-within:ring-emerald-800 focus-within:border-emerald-800 transition-colors">
        <div className="flex flex-wrap gap-2 items-center">
          {selected.map((tag) => (
            <Badge key={tag} className="inline-flex items-center gap-1 pr-1">
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                className="text-zinc-400 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded ml-1 bg-transparent border-none cursor-pointer p-0"
                onClick={() => handleRemove(tag)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-zinc-900 px-2 py-1"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : ''}
          />
        </div>
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-zinc-200 max-h-60 overflow-y-auto z-50 p-1 list-none m-0">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="px-4 py-2 text-sm text-zinc-700 cursor-pointer rounded-lg hover:bg-stone-50 hover:text-emerald-800 transition-colors"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
