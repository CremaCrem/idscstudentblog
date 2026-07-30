import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import styles from './AuthPage.module.css';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username: identifier, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.visualPanel}>
        <div className={styles.visualContent}>
          <h2 className="text-display" style={{color: '#fff'}}>Welcome Back</h2>
          <p className={styles.visualDesc}>
            Access your student dashboard to manage your submitted technical blogs and track your verified links.
          </p>
        </div>
      </div>
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <h1 className={styles.formTitle}>Sign in to your account</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email or Username</label>
              <Input 
                type="text" 
                placeholder="student@university.edu" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button variant="primary" shape="pill" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <div className={styles.footer}>
            Don't have an account? <Link to="/register" className={styles.link}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
