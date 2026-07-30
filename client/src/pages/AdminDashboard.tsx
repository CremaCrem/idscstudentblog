import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import styles from './AdminDashboard.module.css';

const MOCK_METRICS = [
  { label: "Total Active Blogs", value: "124" },
  { label: "Total Registered Students", value: "89" },
  { label: "Verified Healthy Links", value: "118", color: "var(--color-success)" },
  { label: "Flagged / Dead Links", value: "6", color: "var(--color-error)" }
];

const MOCK_DATA = [
  { id: 1, student: "Alex K.", title: "Building a Decentralized Search Engine", url: "https://alexk.dev", tags: ["Software Engineering"], health: "healthy", published: true },
  { id: 2, student: "Maria S.", title: "Yield Prediction with CNNs", url: "https://marias.io", tags: ["Agriculture", "AI"], health: "healthy", published: true },
  { id: 3, student: "James T.", title: "Zero-Knowledge Proofs in Voting", url: "https://james.tech/zkp", tags: ["Information Technology"], health: "warning", published: true },
  { id: 4, student: "Elena R.", title: "Designing Tactile Interfaces", url: "https://elenar.design", tags: ["Design"], health: "broken", published: false }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="text-display" style={{ fontSize: '2rem' }}>Directory Health & Moderation</h1>
          <p className={styles.subtitle}>Admin panel to manage student submissions and monitor link health.</p>
        </div>
        <Button variant="primary" shape="pill">
          Run Health Scan
        </Button>
      </header>

      <div className={styles.metricsGrid}>
        {MOCK_METRICS.map((metric, i) => (
          <Card key={i} className={styles.metricCard}>
            <div className={styles.metricValue} style={{ color: metric.color }}>{metric.value}</div>
            <div className={styles.metricLabel}>{metric.label}</div>
          </Card>
        ))}
      </div>

      <section className={styles.tableSection}>
        <Card className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Blog Title & URL</th>
                  <th>Tags</th>
                  <th>Health Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.map(row => (
                  <tr key={row.id}>
                    <td className={styles.studentCell}>{row.student}</td>
                    <td>
                      <div className={styles.blogTitle}>{row.title}</div>
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className={styles.blogUrl}>
                        {row.url} <span>↗</span>
                      </a>
                    </td>
                    <td>
                      <div className={styles.tagList}>
                        {row.tags.map(tag => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td>
                      {row.health === 'healthy' && <Badge variant="health-healthy" dot>Healthy</Badge>}
                      {row.health === 'warning' && <Badge variant="health-warning" dot>Warning</Badge>}
                      {row.health === 'broken' && <Badge variant="health-broken" dot>Broken Link</Badge>}
                    </td>
                    <td>
                      <div className={`${styles.toggle} ${row.published ? styles.toggleOn : ''}`}>
                        <div className={styles.toggleKnob}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button variant="ghost" size="sm">Re-check</Button>
                        <Button variant="ghost" size="sm" style={{color: 'var(--color-error)'}}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
};
