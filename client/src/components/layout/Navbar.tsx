import React from 'react';
import { Link } from 'react-router';
import styles from './Navbar.module.css';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  // Mock authentication state for now
  const isAuthenticated = false;

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.brand}>
            student.blogs <span className={styles.arrow}>↗</span>
          </Link>
        </div>
        
        <nav className={styles.center}>
          <Link to="/about" className={styles.navLink}>About</Link>
          <Link to="/" className={styles.navLink}>Explore Topics</Link>
          <Link to="/" className={styles.navLink}>Latest Posts</Link>
        </nav>

        <div className={styles.right}>
          {isAuthenticated ? (
            <div className={styles.authGroup}>
              <Button variant="accent" shape="pill" size="sm">+ New Post</Button>
              <div className={styles.avatar}>A</div>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link to="/login" className={styles.loginLink}>Log In</Link>
              <Button asChild variant="accent" shape="pill" size="sm">
                <Link to="/login">Submit Blog</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
