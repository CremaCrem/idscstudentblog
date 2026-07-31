import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  hideCancel?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
  inputLabel,
  inputPlaceholder,
  onInputChange,
  hideCancel = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-focus the cancel button when modal opens to prevent accidental confirmation
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
      setInputValue(''); // Reset input when closed
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    if (variant !== 'destructive' && !isLoading) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onInputChange) {
      onInputChange(val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" 
        onClick={handleBackdropClick}
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="px-6 py-6">
          <h3 id="modal-title" className="text-xl font-semibold text-zinc-900 m-0 mb-2">
            {title}
          </h3>
          <p id="modal-description" className="text-sm text-zinc-600 leading-relaxed m-0">
            {description}
          </p>

          {inputLabel && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                {inputLabel}
              </label>
              <textarea
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-colors focus:outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-stone-50">
          {!hideCancel && (
            <Button 
              ref={initialFocusRef}
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button 
            ref={hideCancel ? initialFocusRef : undefined}
            variant={variant === 'destructive' ? 'destructive' : 'accent'}
            onClick={() => onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
