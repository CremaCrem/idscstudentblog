import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { userService, type PublicProfile } from '../services/userService';
import type { BlogPost } from '../services/blog';
import { BlogGridCard } from '../components/feed/BlogGridCard';
import { Loader2, Calendar } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getPublicProfile(username);
        setProfile(data.profile);
        setBlogs(data.blogs);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('User not found or profile is unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Profile Not Found</h1>
        <p className="text-zinc-500">{error}</p>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12">
      <header className="mb-12 pb-8 border-b border-zinc-200">
        <h1 className="font-display font-bold text-4xl text-zinc-900 tracking-tight mb-3">
          {profile.username}'s Portfolio
        </h1>
        <div className="flex items-center text-zinc-500 text-sm gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Joined {joinDate}
          </div>
          <div>•</div>
          <div>{blogs.length} Published Post{blogs.length !== 1 ? 's' : ''}</div>
        </div>
      </header>

      <section>
        {blogs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 border border-dashed border-zinc-200 rounded-2xl">
            This student hasn't published any blogs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map(post => (
              <BlogGridCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
