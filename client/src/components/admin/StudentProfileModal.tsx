import React, { useState, useEffect } from 'react';
import { adminService, type StudentProfileData } from '../../services/adminService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { Loader2, X, ArrowUpRight, Calendar, Mail, User as UserIcon, ShieldAlert, Hash } from 'lucide-react';
import type { BlogPost } from '../../services/blog';

interface StudentProfileModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ userId, isOpen, onClose }) => {
    const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmAction, setConfirmAction] = useState<{ type: 'deleteBlog' | 'unpublish', blogId?: string } | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (!isOpen || !userId) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await adminService.getUserProfile(userId);
                setProfileData(data);
            } catch (err: any) {
                console.error('Failed to load user profile', err);
                setError(err.response?.data?.error?.message || 'Failed to load user profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isOpen, userId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isConfirming) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, isConfirming]);

    if (!isOpen) return null;

    const handleTogglePublish = async (blogId: string) => {
        try {
            const updatedBlog = await adminService.togglePublish(blogId);
            setProfileData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    blogs: prev.blogs.map(b => b._id === blogId ? { ...b, isPublished: updatedBlog.isPublished } : b)
                };
            });
        } catch (err) {
            console.error('Failed to toggle publish status', err);
        }
    };

    const handleDeleteClick = (blogId: string) => {
        setConfirmAction({ type: 'deleteBlog', blogId });
    };

    const executeConfirmAction = async () => {
        if (!confirmAction?.blogId) return;

        setIsConfirming(true);
        try {
            if (confirmAction.type === 'deleteBlog') {
                await adminService.deleteBlog(confirmAction.blogId);
                setProfileData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        blogs: prev.blogs.filter(b => b._id !== confirmAction.blogId)
                    };
                });
            }
        } catch (err) {
            console.error(`Failed to execute ${confirmAction.type}`, err);
        } finally {
            setIsConfirming(false);
            setConfirmAction(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
            <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity" onClick={() => !isConfirming && onClose()}></div>
            
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-stone-50 shrink-0">
                    <h2 id="profile-modal-title" className="font-display font-bold text-xl text-zinc-900">Student Profile & Submissions</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64 text-red-600">
                            {error}
                        </div>
                    ) : profileData ? (
                        <div className="flex flex-col gap-8">
                            {/* Profile Hero Card */}
                            <div className="bg-stone-50 border border-zinc-200 rounded-xl p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-display font-bold text-2xl text-zinc-900">{profileData.user.fullName}</h3>
                                            <Badge variant="default" className="font-mono text-xs">{profileData.user.studentId}</Badge>
                                        </div>
                                        <div className="text-zinc-600 font-medium mb-4">@{profileData.user.username}</div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <span className="truncate">{profileData.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <UserIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <span className="font-mono text-xs">ID: {profileData.user._id}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <span>Registered: {new Date(profileData.user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {profileData.user.verifiedAt && (
                                                <div className="flex items-center gap-2 text-zinc-600">
                                                    <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>Verified: {new Date(profileData.user.verifiedAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-white border border-zinc-200 rounded-lg p-4 shrink-0 min-w-[120px]">
                                        <div className="text-3xl font-display font-bold text-zinc-900 mb-1">{profileData.blogs.length}</div>
                                        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Posts</div>
                                    </div>
                                </div>
                            </div>

                            {/* Submissions Section */}
                            <div>
                                <h4 className="font-display font-bold text-lg text-zinc-900 mb-4 flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-zinc-400" />
                                    Submitted Articles
                                </h4>
                                
                                {profileData.blogs.length === 0 ? (
                                    <div className="bg-stone-50 border border-zinc-200 border-dashed rounded-xl p-12 text-center">
                                        <div className="text-zinc-500 font-medium">No blogs posted yet</div>
                                        <p className="text-sm text-zinc-400 mt-1">This student hasn't submitted any links to the directory.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {profileData.blogs.map((blog: BlogPost) => (
                                            <div key={blog._id} className="bg-white border border-zinc-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-zinc-300 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <h5 className="font-medium text-zinc-900 truncate" title={blog.title}>{blog.title}</h5>
                                                        <div className="shrink-0 mt-0.5">
                                                            {blog.lastHealthCheckStatus === 'healthy' && <Badge variant="health-healthy" dot>Healthy</Badge>}
                                                            {blog.lastHealthCheckStatus === 'warning' && <Badge variant="health-warning" dot>Warning</Badge>}
                                                            {blog.lastHealthCheckStatus === 'broken' && <Badge variant="health-broken" dot>Broken</Badge>}
                                                            {blog.lastHealthCheckStatus === 'pending' && <Badge variant="default">Pending</Badge>}
                                                        </div>
                                                    </div>
                                                    <a href={blog.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 flex items-center gap-1 hover:underline hover:text-emerald-800 transition-colors truncate mb-3 w-fit max-w-full">
                                                        {blog.targetUrl} <ArrowUpRight className="w-3 h-3 shrink-0" />
                                                    </a>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs text-zinc-400 mr-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                                        {blog.tags.map(tag => (
                                                            <Badge key={tag} variant="default" className="!py-0.5 !text-[10px]">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-zinc-500">Published:</span>
                                                        <div 
                                                            onClick={() => handleTogglePublish(blog._id)}
                                                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${blog.isPublished ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                                                            role="switch"
                                                            aria-checked={blog.isPublished}
                                                        >
                                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] left-[2px] transition-transform shadow-sm ${blog.isPublished ? 'translate-x-5' : ''}`}></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-8 bg-zinc-200 hidden md:block"></div>
                                                    <Button variant="ghost" size="sm" className="!text-red-600 hover:!text-red-700" onClick={() => handleDeleteClick(blog._id)}>Delete</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeConfirmAction}
                title="Delete Blog Post"
                description="Are you sure you want to permanently delete this blog post?"
                confirmLabel="Delete"
                variant="destructive"
                isLoading={isConfirming}
            />
        </div>
    );
};
