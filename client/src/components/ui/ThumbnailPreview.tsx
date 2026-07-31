import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ThumbnailPreviewProps {
    src?: string | null;
    alt?: string;
    isLoading?: boolean;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ src, alt = "Thumbnail preview", isLoading = false }) => {
    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : null}
            
            {src ? (
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback on broken image
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.classList.add('broken-image-fallback');
                    }}
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2 p-6 text-center">
                    <ImageIcon className="w-12 h-12 stroke-1" />
                    <span className="text-sm">No image available. Provide a URL or upload a file for preview.</span>
                </div>
            )}
            
            {/* Fallback container for broken images */}
            <div className="absolute inset-0 hidden items-center justify-center flex-col text-zinc-500 space-y-2 bg-stone-50/90 backdrop-blur-sm peer-[.broken-image-fallback]:flex">
                 <ImageIcon className="w-12 h-12 stroke-1 text-zinc-400" />
                 <span className="text-sm font-medium">Image failed to load</span>
            </div>
        </div>
    );
};
