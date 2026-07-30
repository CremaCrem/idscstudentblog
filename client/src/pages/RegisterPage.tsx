import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import styles from './AuthPage.module.css';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setFieldErrors({ username: "Username can only contain alphanumeric characters and underscores (no spaces)." });
      return;
    }

    setGlobalError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/dashboard');
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
    <div className={styles.container}>
      <div className={styles.visualPanel}>
        <div className={styles.visualContent}>
          <h2 className="text-display" style={{color: '#fff'}}>Join the Showcase</h2>
          <p className={styles.visualDesc}>
            Create an account to submit your personal engineering blog, increase your visibility, and connect with peers.
          </p>
        </div>
      </div>
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <h1 className={styles.formTitle}>Create an account</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            {globalError && <div className={styles.errorMessage}>{globalError}</div>}
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
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
              {fieldErrors.username && <div className={styles.fieldError}>{fieldErrors.username}</div>}
              <p style={{fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '2px'}}>Only alphanumeric characters and underscores</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
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
              {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
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
              {fieldErrors.password && <div className={styles.fieldError}>{fieldErrors.password}</div>}
            </div>
            <Button variant="primary" shape="pill" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
          <div className={styles.footer}>
            Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
