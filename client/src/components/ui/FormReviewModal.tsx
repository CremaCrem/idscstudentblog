import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

export interface FormReviewField {
  label: string;
  value: string;
  isSensitive?: boolean;
}

export interface FormReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  fields: FormReviewField[];
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const FormReviewModal: React.FC<FormReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  fields,
  confirmLabel = 'Confirm & Submit',
  cancelLabel = 'Edit Information',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" 
        onClick={() => !isLoading && onClose()}
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="px-6 py-6">
          <h3 id="modal-title" className="text-xl font-semibold text-zinc-900 m-0 mb-2">
            {title}
          </h3>
          <p id="modal-description" className="text-sm text-zinc-500 m-0 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {fields.map((field, idx) => (
                <div key={idx} className="sm:col-span-1">
                  <dt className="text-xs font-medium text-zinc-500 mb-1">{field.label}</dt>
                  <dd className="text-sm font-medium text-zinc-900 break-words">
                    {field.isSensitive ? '••••••••' : (field.value || '—')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button
            ref={initialFocusRef}
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="font-medium"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[140px] font-medium"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
