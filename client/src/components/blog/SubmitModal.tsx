import React, { useState, useRef, useEffect } from 'react';
import { X, Save, UploadCloud, Link2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UrlInputField } from '../ui/UrlInputField';
import { ThumbnailPreview } from '../ui/ThumbnailPreview';
import { AutocompleteCombobox } from '../ui/AutocompleteCombobox';
import { scraperService } from '../../services/scraper';
import { blogService } from '../../services/blog';
import { uploadService } from '../../services/upload';
import { BlogGridCard } from '../feed/BlogGridCard';
import { useAuth } from '../../contexts/AuthContext';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [targetUrl, setTargetUrl] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const [isScraping, setIsScraping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [thumbnailMode, setThumbnailMode] = useState<'url' | 'file'>('url');
    const [step, setStep] = useState<'input' | 'preview'>('input');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);
    const { user } = useAuth();

    // Reset state on close or successful submit
    useEffect(() => {
        if (!isOpen) {
            setTargetUrl('');
            setTitle('');
            setThumbnailUrl('');
            setCloudinaryPublicId('');
            setTags([]);
            setError(null);
            setStep('input');
            setThumbnailMode('url');
            setIsDragging(false);
            dragCounter.current = 0;
        }
    }, [isOpen]);

    // Escape to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleFileSelect = async (file: File) => {
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File exceeds 5MB limit.');
            return;
        }
        // Validate type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('File is not an allowed image format (PNG, JPG, WEBP).');
            return;
        }

        setError(null);
        setIsUploading(true);
        try {
            const response = await uploadService.uploadThumbnail(file);
            setThumbnailUrl(response.url);
            setCloudinaryPublicId(response.publicId);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    if (!isOpen) return null;

    const handleScrape = async (url: string) => {
        setTargetUrl(url);
        setIsScraping(true);
        setError(null);
        try {
            const data = await scraperService.scrapeUrl(url);
            if (data.title && !title) setTitle(data.title);
            if (data.thumbnailUrl && !thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
        } catch (err: any) {
            console.error('Scrape failed', err);
        } finally {
            setIsScraping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 'input') {
            setStep('preview');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await blogService.createBlog({
                targetUrl,
                title,
                thumbnailUrl,
                cloudinaryPublicId: cloudinaryPublicId || undefined,
                tags,
                isPublished: true,
            });
            onSuccess();
            onClose(); // state resets automatically via useEffect
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to submit post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isBusy = isSubmitting || isScraping || isUploading;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="submit-modal-title"
        >
            <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} />
            <form 
                onSubmit={handleSubmit}
                className="relative w-full max-w-2xl bg-stone-50 border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-white">
                    <h2 id="submit-modal-title" className="text-xl font-semibold text-zinc-900">Share Your Article or Research</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-700 transition-colors"
                        disabled={isBusy}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {step === 'input' ? (
                        <>
                            <UrlInputField
                                value={targetUrl}
                                onChange={setTargetUrl}
                                onPasteScrapeTrigger={handleScrape}
                                disabled={isBusy}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-900 mb-1.5">
                                            Title
                                        </label>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter or scraped title..."
                                            disabled={isBusy}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-medium text-zinc-900">
                                                Thumbnail Image (Optional)
                                            </label>
                                            <div className="flex items-center gap-1 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode('url')}
                                                    disabled={isBusy}
                                                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${thumbnailMode === 'url'
                                                            ? 'bg-emerald-800 text-white'
                                                            : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
                                                        }`}
                                                >
                                                    URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode('file')}
                                                    disabled={isBusy}
                                                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${thumbnailMode === 'file'
                                                            ? 'bg-emerald-800 text-white'
                                                            : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
                                                        }`}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </div>

                                        {thumbnailMode === 'url' ? (
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Link2 className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <Input
                                                    value={thumbnailUrl}
                                                    onChange={(e) => {
                                                        setThumbnailUrl(e.target.value);
                                                        setCloudinaryPublicId(''); // Clear on manual URL entry
                                                    }}
                                                    placeholder="https://.../image.png"
                                                    disabled={isBusy}
                                                    className="pl-10"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                onDragEnter={handleDragEnter}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isDragging
                                                        ? 'border-emerald-800 bg-emerald-50/50'
                                                        : 'border-zinc-300 hover:border-emerald-800/50 bg-white'
                                                    }`}
                                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                                                ) : (
                                                    <UploadCloud className="w-7 h-7 text-zinc-400 pointer-events-none" />
                                                )}
                                                <p className="text-sm text-zinc-600 text-center pointer-events-none">
                                                    {isUploading ? 'Uploading...' : (
                                                        <>
                                                            Drop an image here, or{' '}
                                                            <span className="text-emerald-800 font-medium hover:underline">browse files</span>
                                                        </>
                                                    )}
                                                </p>
                                                <p className="text-xs text-zinc-400 pointer-events-none">PNG, JPG, WEBP up to 5MB</p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    className="hidden"
                                                    disabled={isBusy}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileSelect(file);
                                                        // Reset file input so same file can be selected again
                                                        if (e.target) e.target.value = '';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-900 mb-1.5">
                                            Genre Tags (Max 5)
                                        </label>
                                        <AutocompleteCombobox
                                            selectedTags={tags}
                                            onChange={setTags}
                                            maxTags={5}
                                            placeholder="Add tags... (Press Enter)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-900 mb-1.5">
                                        Cover Preview
                                    </label>
                                    <ThumbnailPreview src={thumbnailUrl} isLoading={isScraping || isUploading} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center max-w-md mx-auto w-full">
                            <p className="text-sm text-zinc-500 mb-4 text-center">Live IDSC Pulse Preview — Inspect how your write-up will appear in the directory.</p>
                            <div className="w-full pointer-events-none">
                                <BlogGridCard
                                    post={{
                                        _id: 'preview',
                                        targetUrl,
                                        title,
                                        thumbnailUrl,
                                        tags,
                                        isPublished: true,
                                        authorId: { _id: 'preview', username: user?.username || 'You' },
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString()
                                    } as any}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 bg-white">
                    {step === 'input' ? (
                        <>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!targetUrl || !title || isBusy}
                                className="min-w-[120px]"
                            >
                                Review Submission
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button type="button" variant="outline" onClick={() => setStep('input')} disabled={isBusy}>
                                Edit Details
                            </Button>
                            <Button
                                type="submit"
                                variant="accent"
                                disabled={isBusy}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? 'Publishing...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Confirm & Publish to IDSC Feed
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

