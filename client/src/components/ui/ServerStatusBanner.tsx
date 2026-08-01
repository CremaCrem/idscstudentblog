import React from 'react';

export const ServerStatusBanner: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 mb-8 p-4 bg-zinc-900 border border-black rounded-xl text-white shadow-lg flex items-center gap-4">
            <div className="flex-shrink-0 animate-spin">
                <svg className="w-5 h-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <div>
                <h4 className="text-sm font-semibold tracking-wide">Connecting to server instance...</h4>
                <p className="text-xs text-zinc-400 mt-1">Waking up free-tier backend (this may take up to 45s).</p>
            </div>
        </div>
    );
};
