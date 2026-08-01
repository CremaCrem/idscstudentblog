import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { adminService, type AdminMetrics } from '../services/adminService';
import type { BlogPost } from '../services/blog';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'blogs' | 'approvals'>('blogs');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'deleteUser' | 'deleteBlog' | 'unpublish' | 'scanSuccess' | 'scanError', id?: string } | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [metricsData, blogsData, pendingData] = await Promise.all([
        adminService.getMetrics(),
        adminService.getBlogs({ limit: 50 }),
        adminService.getPendingUsers()
      ]);
      setMetrics(metricsData);
      setBlogs(blogsData.data);
      setPendingUsers(pendingData);
    } catch (err) {
      console.error('Failed to load admin data', err);
      setError('Failed to load dashboard data. Ensure you have admin privileges.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunScan = async () => {
    try {
      setIsScanning(true);
      await adminService.runHealthScan();
      setConfirmAction({ type: 'scanSuccess' });
    } catch (err) {
      console.error('Failed to trigger health scan', err);
      setConfirmAction({ type: 'scanError' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const updatedBlog = await adminService.togglePublish(id);
      setBlogs(blogs.map(b => b._id === id ? updatedBlog : b));
    } catch (err) {
      console.error('Failed to toggle publish status', err);
    }
  };

  const handleRecheck = async (id: string) => {
    try {
      const updatedBlog = await adminService.checkSingleLink(id);
      setBlogs(blogs.map(b => b._id === id ? updatedBlog : b));
    } catch (err) {
      console.error('Failed to recheck link', err);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmAction({ type: 'deleteBlog', id });
  };

  const handleApproveUser = (id: string) => {
    setConfirmAction({ type: 'approve', id });
  };

  const handleRejectUser = (id: string) => {
    setConfirmAction({ type: 'reject', id });
  };

  const handleDeleteUser = (id: string) => {
    setConfirmAction({ type: 'deleteUser', id });
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'scanSuccess' || confirmAction.type === 'scanError') {
      handleCloseModal();
      return;
    }

    setIsConfirming(true);
    const { type, id } = confirmAction;

    try {
      if (type === 'deleteBlog' && id) {
        await adminService.deleteBlog(id);
        setBlogs(blogs.filter(b => b._id !== id));
        adminService.getMetrics().then(setMetrics);
      } else if (type === 'approve' && id) {
        await adminService.approveUser(id);
        setPendingUsers(pendingUsers.filter(u => u._id !== id));
        adminService.getMetrics().then(setMetrics);
      } else if (type === 'reject' && id) {
        await adminService.rejectUser(id, rejectReason);
        setPendingUsers(pendingUsers.filter(u => u._id !== id));
      } else if (type === 'deleteUser' && id) {
        await adminService.deleteUser(id);
        setPendingUsers(pendingUsers.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(`Failed to execute ${type}`, err);
    } finally {
      setIsConfirming(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setConfirmAction(null);
    setRejectReason('');
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-6 py-12 text-center text-red-600">
        {error}
      </div>
    );
  }

  const metricCards = metrics ? [
    { label: "Total Active Blogs", value: metrics.totalBlogs },
    { label: "Total Registered Students", value: metrics.totalStudents },
    { label: "Verified Healthy Links", value: metrics.healthyLinks, color: "text-emerald-600" },
    { label: "Flagged / Dead Links", value: metrics.brokenLinks, color: "text-red-600" }
  ] : [];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="font-display font-bold text-3xl text-zinc-900 m-0 tracking-tight">IDSC Directory – Health & Moderation Panel</h1>
          <p className="text-zinc-600 mt-2 m-0">Admin panel to manage student submissions and monitor link health.</p>
        </div>
        <Button variant="primary" shape="pill" onClick={handleRunScan} disabled={isScanning}>
          {isScanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...</> : "Run Health Scan"}
        </Button>
      </header>

      <div className="flex border-b border-zinc-200 mb-8">
        <button 
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'blogs' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Submissions
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
          {pendingUsers.length > 0 && (
            <span className="bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold">{pendingUsers.length}</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metricCards.map((metric, i) => (
          <Card key={i} className="p-6">
            <div className={`font-display text-4xl font-bold leading-none mb-2 ${metric.color || 'text-zinc-900'}`}>{metric.value}</div>
            <div className="text-sm text-zinc-500 font-medium">{metric.label}</div>
          </Card>
        ))}
      </div>

      <section className="mb-12">
        {activeTab === 'blogs' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Student</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Blog Title & URL</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Tags</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Health Status</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Published</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(row => (
                    <tr key={row._id} className="last:border-b-0">
                      <td className="px-6 py-5 border-b border-zinc-200 align-top font-medium whitespace-nowrap">
                        {typeof row.authorId === 'object' && row.authorId !== null && 'username' in row.authorId ? row.authorId.username : 'Unknown'}
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div className="font-medium mb-1">{row.title}</div>
                        <a href={row.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 flex items-center gap-1 hover:underline hover:text-emerald-800 transition-colors">
                          {row.targetUrl} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {row.tags.map(tag => (
                            <Badge key={tag} variant="default">{tag}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        {row.lastHealthCheckStatus === 'healthy' && <Badge variant="health-healthy" dot>Healthy</Badge>}
                        {row.lastHealthCheckStatus === 'warning' && <Badge variant="health-warning" dot>Warning</Badge>}
                        {row.lastHealthCheckStatus === 'broken' && <Badge variant="health-broken" dot>Broken Link</Badge>}
                        {row.lastHealthCheckStatus === 'pending' && <Badge variant="default">Pending</Badge>}
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div 
                          onClick={() => handleTogglePublish(row._id)}
                          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${row.isPublished ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] left-[2px] transition-transform shadow-sm ${row.isPublished ? 'translate-x-5' : ''}`}></div>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleRecheck(row._id)}>Re-check</Button>
                          <Button variant="ghost" size="sm" className="!text-red-600 hover:!text-red-700" onClick={() => handleDelete(row._id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'approvals' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Full Name</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Student ID</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Account Details</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Registered At</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200 bg-stone-50 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map(user => (
                    <tr key={user._id} className="last:border-b-0">
                      <td className="px-6 py-5 border-b border-zinc-200 align-top font-medium whitespace-nowrap text-zinc-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top font-mono text-sm text-zinc-700 whitespace-nowrap">
                        {user.studentId}
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div className="font-medium text-zinc-800">@{user.username}</div>
                        <div className="text-sm text-zinc-500 mt-1">{user.email}</div>
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top text-sm text-zinc-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 border-b border-zinc-200 align-top">
                        <div className="flex gap-2">
                          <Button variant="primary" shape="pill" size="sm" onClick={() => handleApproveUser(user._id)}>Approve</Button>
                          <Button variant="outline" shape="pill" size="sm" onClick={() => handleRejectUser(user._id)}>Reject</Button>
                          <Button variant="ghost" size="sm" className="!text-red-600 hover:!text-red-700 ml-2" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No pending student registrations.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <ConfirmationModal
        isOpen={!!confirmAction}
        onClose={handleCloseModal}
        onConfirm={executeConfirmAction}
        title={
          confirmAction?.type === 'approve' ? 'Approve Registration' :
          confirmAction?.type === 'reject' ? 'Reject Registration' :
          confirmAction?.type === 'deleteUser' ? 'Delete Pending User' :
          confirmAction?.type === 'deleteBlog' ? 'Delete Blog Post' :
          confirmAction?.type === 'scanSuccess' ? 'Health Scan Started' :
          confirmAction?.type === 'scanError' ? 'Scan Failed' : ''
        }
        description={
          confirmAction?.type === 'approve' ? 'Approve this student registration? This will grant the student full access.' :
          confirmAction?.type === 'reject' ? 'Reject this registration? You may optionally provide a reason.' :
          confirmAction?.type === 'deleteUser' ? 'Are you sure you want to delete this pending registration permanently?' :
          confirmAction?.type === 'deleteBlog' ? 'Are you sure you want to permanently delete this blog post?' :
          confirmAction?.type === 'scanSuccess' ? 'Health scan started in the background. Refresh in a few moments.' :
          confirmAction?.type === 'scanError' ? 'Failed to trigger health scan.' : ''
        }
        confirmLabel={
          confirmAction?.type === 'approve' ? 'Approve' :
          confirmAction?.type === 'reject' ? 'Reject' :
          confirmAction?.type === 'scanSuccess' || confirmAction?.type === 'scanError' ? 'Dismiss' :
          'Delete'
        }
        variant={confirmAction?.type === 'approve' || confirmAction?.type === 'scanSuccess' ? 'default' : 'destructive'}
        isLoading={isConfirming}
        inputLabel={confirmAction?.type === 'reject' ? 'Rejection Reason (Optional)' : undefined}
        inputPlaceholder={confirmAction?.type === 'reject' ? 'E.g., Invalid student ID.' : undefined}
        onInputChange={confirmAction?.type === 'reject' ? setRejectReason : undefined}
        hideCancel={confirmAction?.type === 'scanSuccess' || confirmAction?.type === 'scanError'}
      />
    </div>
  );
};
