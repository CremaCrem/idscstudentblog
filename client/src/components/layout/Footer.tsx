import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.text}>
          © {new Date().getFullYear()} Student Blog Showcase. Built for decentralized learning.
        </div>
      </div>
    </footer>
  );
};
