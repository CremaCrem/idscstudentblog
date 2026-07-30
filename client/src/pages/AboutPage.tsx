import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import styles from './AboutPage.module.css';
import { Link } from 'react-router';

export const AboutPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className="text-display">Decentralized by Design</h1>
        <p className={styles.subtitle}>
          The Student Blog Showcase Hub is a directory, not a content host. We believe in empowering students to own their content, host it on their personal domains, and share it with the world.
        </p>
      </header>

      <div className={styles.pillars}>
        <Card className={styles.pillarCard}>
          <div className={styles.iconWrapper}>🌐</div>
          <h3 className={styles.pillarTitle}>Zero Content Hosting</h3>
          <p className={styles.pillarDesc}>
            This hub stores only links and metadata. By clicking a post, readers are driven directly to your personal portfolio or blog, increasing your own traffic and visibility.
          </p>
        </Card>
        
        <Card className={styles.pillarCard}>
          <div className={styles.iconWrapper}>🏷️</div>
          <h3 className={styles.pillarTitle}>Topic Tagging</h3>
          <p className={styles.pillarDesc}>
            Categorize your work with genre tags like AI, AgriTech, or IT. This helps peers, professors, and recruiters discover your specific expertise quickly.
          </p>
        </Card>

        <Card className={styles.pillarCard}>
          <div className={styles.iconWrapper}>⚡</div>
          <h3 className={styles.pillarTitle}>Automated Link Verification</h3>
          <p className={styles.pillarDesc}>
            Our built-in health check engine regularly pings submitted URLs to ensure the directory remains clean and free of dead links or connection timeouts.
          </p>
        </Card>
      </div>

      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to share your work?</h2>
        <p className={styles.ctaDesc}>Join the community of student writers and engineers today.</p>
        <Button asChild variant="accent" size="lg" shape="pill">
          <Link to="/login">Submit Your Blog</Link>
        </Button>
      </div>
    </div>
  );
};
