import React, { useState, useRef, useEffect } from 'react';
import styles from './Combobox.module.css';
import { Badge } from './Badge';

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
        // Allow custom tags if desired, or just clear
        setInputValue('');
      }
      e.preventDefault();
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputContainer}>
        <div className={styles.tags}>
          {selected.map((tag) => (
            <Badge key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.removeTag}
                onClick={() => handleRemove(tag)}
              >
                ×
              </button>
            </Badge>
          ))}
          <input
            type="text"
            className={styles.input}
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
        <ul className={styles.dropdown}>
          {filteredOptions.map((option) => (
            <li
              key={option}
              className={styles.dropdownItem}
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
