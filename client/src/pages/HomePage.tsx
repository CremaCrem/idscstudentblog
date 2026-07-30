import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import styles from './HomePage.module.css';

const MOCK_POSTS = [
  { id: 1, title: "Building a Decentralized Search Engine", author: "Alex K", tag: "Software Engineering", readTime: "5 min", date: "Aug 10", featured: true, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, title: "Yield Prediction with CNNs", author: "Maria S", tag: "Agriculture", readTime: "8 min", date: "Aug 09", image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Zero-Knowledge Proofs in Voting", author: "James T", tag: "Information Technology", readTime: "6 min", date: "Aug 08", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Designing Tactile Interfaces", author: "Elena R", tag: "Design", readTime: "4 min", date: "Aug 07", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" }
];

export const HomePage: React.FC = () => {
  const featured = MOCK_POSTS[0];
  const others = MOCK_POSTS.slice(1);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className="text-display">Student Blog Directory</h1>
        <p className={styles.subtitle}>Discover technical logs, capstone research, and engineering write-ups from university students.</p>
      </header>

      {/* Tag Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterTabs}>
          <Badge variant="default" className={styles.activeTab}>View All</Badge>
          <Badge variant="default">Artificial Intelligence</Badge>
          <Badge variant="default">Information Technology</Badge>
          <Badge variant="default">Agriculture</Badge>
          <Badge variant="default">Design</Badge>
          <Badge variant="default">Software Engineering</Badge>
        </div>
      </div>

      <section className={styles.featuredSection}>
        <Card hoverEffect className={styles.featuredCard}>
          <div className={styles.featuredImageWrapper}>
            <img src={featured.image} alt="Featured" className={styles.featuredImage} />
            <div className={`glass-overlay ${styles.featuredOverlay}`}>
              <Badge variant="default">[{featured.tag}]</Badge>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <div className={styles.featuredMeta}>{featured.author} • {featured.date} • {featured.readTime} read</div>
            </div>
          </div>
        </Card>
        
        <div className={styles.latestList}>
          <h3 className={styles.listHeader}>Latest Posts</h3>
          <div className={styles.listGrid}>
            {others.map(post => (
              <Card key={post.id} hoverEffect className={styles.listCard}>
                <div className={styles.listCardImageWrapper}>
                  <img src={post.image} alt={post.title} />
                </div>
                <div className={styles.listCardContent}>
                  <div className={styles.listCardMeta}>
                    <span>{post.author}</span>
                    <Badge variant="default">{post.tag}</Badge>
                  </div>
                  <h4 className={styles.listCardTitle}>{post.title}</h4>
                  <div className={styles.listCardAction}>Read post <span className={styles.arrow}>↗</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* 3-Column Content Grid */}
      <section className={styles.gridSection}>
        <h3 className="text-section-head" style={{marginBottom: '1.5rem'}}>More from the community</h3>
        <div className={styles.grid}>
           {MOCK_POSTS.map(post => (
              <Card key={`grid-${post.id}`} hoverEffect className={styles.gridCard}>
                <div className={styles.gridImageWrapper}>
                  <img src={post.image} alt={post.title} />
                  <div className={styles.gridAuthorTag}>
                    <Badge variant="default">{post.author} • {post.tag}</Badge>
                  </div>
                </div>
                <div className={styles.gridContent}>
                  <h4 className={styles.gridTitle}>{post.title}</h4>
                  <p className={styles.gridDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                  <div className={styles.gridAction}>Read post <span>↗</span></div>
                </div>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};
