import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  return (
    <div className={styles.canvas}>
      <div className={styles.inner}>
        <div className={`app-frame ${styles.frame}`}>
          <Navbar />
          <main className={styles.main}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
