import React, { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { tagApi } from '../../services/tagApi';
import { TagPill } from './TagPill';

interface AutocompleteComboboxProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export const AutocompleteCombobox: React.FC<AutocompleteComboboxProps> = ({
  selectedTags,
  onChange,
  maxTags = 5,
  placeholder = "Add tags... (Press Enter)"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce fetching suggestions
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await tagApi.getSuggestions(inputValue);
      // Filter out already selected tags
      const filtered = results.filter(tag => 
        !selectedTags.some(selected => selected.toLowerCase() === tag.toLowerCase())
      );
      setSuggestions(filtered);
      setIsDropdownOpen(true);
      setHighlightedIndex(-1);
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, selectedTags]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || selectedTags.length >= maxTags) return;
    
    // Prevent duplicates
    if (!selectedTags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...selectedTags, trimmed]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isDropdownOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTag(suggestions[highlightedIndex]);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isDropdownOpen) {
        setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isDropdownOpen) {
        setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-zinc-200 rounded-xl bg-white focus-within:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-800/20 transition-all min-h-[52px]">
        {selectedTags.map(tag => (
          <TagPill
            key={tag}
            label={tag}
            onRemove={() => removeTag(tag)}
          />
        ))}
        
        {selectedTags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() && suggestions.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder={selectedTags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-zinc-900 text-sm p-1"
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (inputValue.trim() || suggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-60 overflow-y-auto p-1">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`px-4 py-2 cursor-pointer text-sm transition-colors rounded-lg ${
                  highlightedIndex === index ? 'bg-emerald-50 text-emerald-800' : 'text-zinc-900 hover:bg-stone-50 hover:text-emerald-800'
                }`}
                onClick={() => addTag(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="text-emerald-800/60 mr-2">#</span>
                {suggestion}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-zinc-500 italic">
              Press Enter to add "{inputValue}"
            </div>
          )}
        </div>
      )}
      
      {/* Helper text */}
      <div className="mt-1 flex justify-between text-xs text-zinc-500">
        <span>{maxTags - selectedTags.length} tags remaining</span>
        {inputValue && !isDropdownOpen && <span>Press Enter to add</span>}
      </div>
    </div>
  );
};
