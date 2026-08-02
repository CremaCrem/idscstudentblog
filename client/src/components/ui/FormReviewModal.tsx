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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="px-6 py-6 overflow-y-auto flex-1">
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
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
              <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm text-emerald-800">
                Agreed to Terms of Use and Privacy Policy{' '}
                <span className="font-semibold">(v1.0)</span>
              </span>
            </div>
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
