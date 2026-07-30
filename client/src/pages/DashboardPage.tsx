import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Combobox } from '../components/ui/Combobox';
import styles from './DashboardPage.module.css';

const MOCK_MY_POSTS = [
  { id: 1, title: "Building a Decentralized Search Engine", url: "https://alexk.dev/decentralized-search", tag: "Software Engineering", status: "published", health: "healthy" }
];

export const DashboardPage: React.FC = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tagOptions = ['Artificial Intelligence', 'Information Technology', 'Agriculture', 'Design', 'Software Engineering'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="text-display" style={{ fontSize: '2rem' }}>Student Dashboard</h1>
          <p className={styles.subtitle}>Manage your portfolio links and submissions.</p>
        </div>
        <Button variant="accent" shape="pill" onClick={() => setIsSubmitModalOpen(true)}>
          + Submit New Blog
        </Button>
      </header>

      <section className={styles.content}>
        <h2 className="text-section-head">Your Submissions</h2>
        <div className={styles.grid}>
          {MOCK_MY_POSTS.map(post => (
            <Card key={post.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <div className={styles.badges}>
                  <Badge variant="default">{post.tag}</Badge>
                  <Badge variant="health-healthy" dot>Healthy (200 OK)</Badge>
                </div>
              </div>
              <div className={styles.cardBody}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className={styles.url}>
                  {post.url} <span>↗</span>
                </a>
              </div>
              <div className={styles.cardFooter}>
                <Button variant="outline" size="sm">Edit Details</Button>
                <Button variant="ghost" size="sm" style={{color: 'var(--color-error)'}}>Remove</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Your Blog">
        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Blog Target URL</label>
            <Input type="url" placeholder="https://yourdomain.com/blog-post" />
            <p className={styles.helpText}>We will attempt to scrape the title and image automatically.</p>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Custom Title (Optional)</label>
            <Input type="text" placeholder="Override scraped title" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Genre Tags</label>
            <Combobox 
              options={tagOptions} 
              selected={selectedTags} 
              onChange={setSelectedTags} 
              placeholder="Search or add tags..."
            />
          </div>

          <div className={styles.formActions}>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Submit Link</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
