import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <header className="text-center mb-20 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-5xl font-bold font-display text-zinc-900 tracking-tight">Decentralized by Design</h1>
        <p className="text-xl max-w-3xl mx-auto text-zinc-600 mt-6 leading-relaxed">
          The IDSC Student Showcase Hub is a directory, not a content host. We believe in empowering students to own their content, host it on their personal domains, and share it with the world.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card className="p-8 text-left">
          <div className="text-4xl mb-6">🌐</div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Zero Content Hosting</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            This hub stores only links and metadata. By clicking a post, readers are driven directly to your personal portfolio or blog, increasing your own traffic and visibility.
          </p>
        </Card>
        
        <Card className="p-8 text-left">
          <div className="text-4xl mb-6">🏷️</div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Topic Tagging</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            Categorize your work with genre tags like AI, AgriTech, or IT. This helps peers, professors, and recruiters discover your specific expertise quickly.
          </p>
        </Card>

        <Card className="p-8 text-left">
          <div className="text-4xl mb-6">⚡</div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Automated Link Verification</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            Our built-in health check engine regularly pings submitted URLs to ensure the directory remains clean and free of dead links or connection timeouts.
          </p>
        </Card>
      </div>

      <div className="bg-stone-50 border border-zinc-200 rounded-3xl p-16 text-center">
        <h2 className="font-display text-3xl font-bold text-zinc-900 mb-4 mt-0">Ready to share your work?</h2>
        <p className="text-lg text-zinc-600 mb-8 m-0">Join the community of student writers and engineers today.</p>
        <Button asChild variant="accent" size="lg" shape="pill">
          <Link to="/login">Share Your Write-Up URL</Link>
        </Button>
      </div>
    </div>
  );
};
