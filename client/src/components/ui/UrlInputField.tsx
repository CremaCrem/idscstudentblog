import React, { useState } from 'react';
import { Input } from './Input';
import { Link2 } from 'lucide-react';

interface UrlInputFieldProps {
    value: string;
    onChange: (val: string) => void;
    onPasteScrapeTrigger?: (val: string) => void;
    disabled?: boolean;
}

export const UrlInputField: React.FC<UrlInputFieldProps> = ({
    value,
    onChange,
    onPasteScrapeTrigger,
    disabled = false
}) => {
    const [error, setError] = useState<string | null>(null);

    const validateUrl = (url: string) => {
        if (!url) return true;
        try {
            new URL(url);
            setError(null);
            return true;
        } catch (e) {
            setError('Please enter a valid HTTP/HTTPS URL');
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);
        if (error) validateUrl(val);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        onChange(pastedText);
        if (validateUrl(pastedText) && onPasteScrapeTrigger) {
            onPasteScrapeTrigger(pastedText);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (validateUrl(val) && val && onPasteScrapeTrigger) {
            onPasteScrapeTrigger(val);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-zinc-900 mb-1.5">
                Target URL
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-4 w-4 text-zinc-400" />
                </div>
                <Input
                    type="url"
                    className="pl-10"
                    placeholder="https://example.com/my-blog-post"
                    value={value}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required
                />
            </div>
            {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
        </div>
    );
};
