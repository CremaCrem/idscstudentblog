import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { FormReviewModal } from '../components/ui/FormReviewModal';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setFieldErrors({ username: "Username can only contain alphanumeric characters and underscores (no spaces)." });
      return;
    }

    setGlobalError(null);
    setFieldErrors({});
    setIsReviewModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);

    try {
      await register({ fullName, studentId, username, email, password });
      setIsPending(true);
      setIsReviewModalOpen(false);
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const errors: Record<string, string> = {};
        err.details.forEach((d: { field: string, issue: string }) => {
          errors[d.field] = d.issue;
        });
        setFieldErrors(errors);
      }
      setGlobalError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="hidden md:flex flex-1 relative flex-col justify-center p-16 overflow-hidden bg-gradient-to-br from-emerald-800 to-[#022c22]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display font-bold text-5xl text-white m-0 tracking-tight">Join IDSC Pulse</h2>
          <p className="text-white/80 text-lg mt-6 leading-relaxed m-0">
            Create an account to submit your personal engineering blog, increase your visibility, and connect with peers.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          {isPending ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
              <svg className="w-16 h-16 text-emerald-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-emerald-900 mb-4 m-0">Registration Received</h2>
              <p className="text-emerald-800 leading-relaxed text-sm m-0 mb-6">
                Your Full Name and Student ID are being reviewed by an IDSC administrator against the official IDSC student roster. You will receive access to publish your write-ups once your account is approved.
              </p>
              <Button variant="primary" shape="pill" onClick={() => navigate('/login')} className="w-full">
                Return to Login
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-semibold text-2xl text-zinc-900 mb-8 text-center m-0">Create an account</h1>
              <form className="flex flex-col gap-5" onSubmit={handleInitialSubmit}>
                {globalError && <div className="bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium text-center">{globalError}</div>}
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-900">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="Juan dela Cruz" 
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                    }}
                    disabled={loading}
                    required
                    error={!!fieldErrors.fullName}
                  />
                  {fieldErrors.fullName && <div className="text-red-600 text-xs mt-1">{fieldErrors.fullName}</div>}
                  <p className="text-xs text-zinc-500 m-0 mt-0.5">Your legal name as registered with IDSC</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-900">Student ID Number</label>
                  <Input 
                    type="text" 
                    placeholder="2021-00123" 
                    value={studentId}
                    onChange={e => {
                      setStudentId(e.target.value);
                      if (fieldErrors.studentId) setFieldErrors({ ...fieldErrors, studentId: '' });
                    }}
                    disabled={loading}
                    required
                    error={!!fieldErrors.studentId}
                  />
                  {fieldErrors.studentId && <div className="text-red-600 text-xs mt-1">{fieldErrors.studentId}</div>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-900">Username</label>
                  <Input 
                    type="text" 
                    placeholder="alex_k" 
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: '' });
                    }}
                    disabled={loading}
                    required
                    error={!!fieldErrors.username}
                  />
                  {fieldErrors.username && <div className="text-red-600 text-xs mt-1">{fieldErrors.username}</div>}
                  <p className="text-xs text-zinc-500 m-0 mt-0.5">Only alphanumeric characters and underscores</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-900">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="student@university.edu" 
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    disabled={loading}
                    required
                    error={!!fieldErrors.email}
                  />
                  {fieldErrors.email && <div className="text-red-600 text-xs mt-1">{fieldErrors.email}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-900">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                    }}
                    disabled={loading}
                    required
                    error={!!fieldErrors.password}
                  />
                  {fieldErrors.password && <div className="text-red-600 text-xs mt-1">{fieldErrors.password}</div>}
                </div>
                <Button variant="primary" shape="pill" className="mt-4 w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Register'}
                </Button>
              </form>
              <div className="mt-8 text-center text-sm text-zinc-500">
                Already have an account? <Link to="/login" className="text-emerald-800 font-medium hover:underline">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <FormReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleConfirmRegistration}
        title="Review Registration"
        description="Please confirm your details before submitting your registration. Your full name and student ID must exactly match IDSC records."
        fields={[
          { label: 'Full Name', value: fullName },
          { label: 'Student ID', value: studentId },
          { label: 'Username', value: username },
          { label: 'Email Address', value: email },
          { label: 'Password', value: password, isSensitive: true }
        ]}
        isLoading={loading}
      />
    </div>
  );
};
