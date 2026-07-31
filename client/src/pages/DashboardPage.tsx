import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SubmitModal } from '../components/blog/SubmitModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { ArrowUpRight, Plus, Loader2 } from 'lucide-react';
import { blogService, type BlogPost } from '../services/blog';

export const DashboardPage: React.FC = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getMyBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch user blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleDelete = (id: string) => {
    setDeleteBlogId(id);
  };

  const confirmDelete = async () => {
    if (!deleteBlogId) return;
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(deleteBlogId);
      setBlogs(blogs.filter(b => b._id !== deleteBlogId));
      setDeleteBlogId(null);
    } catch (error) {
      console.error('Failed to delete blog', error);
      // Removed window.alert, would normally use a toast here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-zinc-200 gap-4 sm:gap-0">
        <div>
          <h1 className="font-display font-bold tracking-tight m-0 text-3xl text-zinc-900">Student Dashboard</h1>
          <p className="text-zinc-600 mt-2 m-0">Manage your portfolio links and submissions.</p>
        </div>
        <Button variant="accent" shape="pill" onClick={() => setIsSubmitModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Submit New Blog
        </Button>
      </header>

      <section>
        <h2 className="font-semibold text-2xl text-zinc-900 m-0">Your Submissions</h2>
        <div className="flex flex-col gap-6 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-300 rounded-2xl">
              You haven't submitted any blogs yet.
            </div>
          ) : (
            blogs.map(post => (
              <Card key={post._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl text-zinc-900 m-0">{post.title}</h3>
                  <div className="flex gap-2 items-center">
                    {post.isPublished ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="default" className="bg-zinc-100 text-zinc-600 border-zinc-200">Unpublished</Badge>
                    )}
                    {post.lastHealthCheckStatus === 'healthy' && <Badge variant="health-healthy" dot>Healthy (200 OK)</Badge>}
                    {post.lastHealthCheckStatus === 'broken' && <Badge variant="health-broken" dot>Broken Link</Badge>}
                    {post.lastHealthCheckStatus === 'warning' && <Badge variant="health-warning" dot>Warning</Badge>}
                  </div>
                </div>
                <div>
                    <a href={post.targetUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-800 text-sm flex items-center gap-1 transition-colors">
                      {post.targetUrl} <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="default" className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-200 flex gap-3">
                  <Button variant="ghost" size="sm" className="!text-red-600 hover:!text-red-700" onClick={() => handleDelete(post._id)}>Remove</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      <SubmitModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        onSuccess={fetchMyBlogs}
      />

      <ConfirmationModal
        isOpen={!!deleteBlogId}
        onClose={() => setDeleteBlogId(null)}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description="This action is permanent and cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
