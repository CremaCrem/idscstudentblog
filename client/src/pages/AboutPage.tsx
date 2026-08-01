import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router';
import { Globe, Compass, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <header className="text-center mb-20 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-5xl font-bold font-display text-zinc-900 tracking-tight">The Technical Pulse of IDSC Student Engineering</h1>
        <p className="text-xl max-w-3xl mx-auto text-zinc-600 mt-6 leading-relaxed">
          IDSC Pulse acts as a central index of student-authored technical work, designed to showcase the engineering depth and research capabilities of our BSIT students.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card className="p-8 text-left">
          <div className="text-zinc-900 mb-6 bg-zinc-100 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Globe className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Decentralized Student Portfolios</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            IDSC Pulse acts as an index/directory, not a content host. By cataloging external portfolio links, it drives 100% direct web traffic back to student-owned domains.
          </p>
        </Card>
        
        <Card className="p-8 text-left">
          <div className="text-zinc-900 mb-6 bg-zinc-100 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Discipline & Domain Indexing</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            Categorize technical write-ups using domain tags like AI, Cybersecurity, or Cloud Development, making specialized work easily discoverable by peers, faculty, and industry.
          </p>
        </Card>

        <Card className="p-8 text-left">
          <div className="text-zinc-900 mb-6 bg-zinc-100 w-14 h-14 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-4 mt-0">Automated Directory Verification</h3>
          <p className="text-zinc-600 leading-relaxed text-sm m-0">
            A periodic automated link health verification engine continuously audits submitted portfolios, maintaining high directory integrity and eliminating dead endpoints.
          </p>
        </Card>
      </div>

      <div className="bg-stone-50 border border-zinc-200 rounded-3xl p-16 text-center">
        <h2 className="font-display text-3xl font-bold text-zinc-900 mb-4 mt-0">Ready to showcase your technical work?</h2>
        <p className="text-lg text-zinc-600 mb-8 m-0">Join the IDSC community and submit your portfolio or technical article link today.</p>
        <Button asChild variant="accent" size="lg" shape="pill">
          <Link to="/login">Share Your Write-Up URL</Link>
        </Button>
      </div>
    </div>
  );
};
