import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  url?: string;
}

export const useSEO = ({ title, description, url }: SEOProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Update Open Graph and Twitter title
    const ogTitle = document.getElementById('meta-og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const twitterTitle = document.getElementById('meta-twitter-title');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    // Update Description
    if (description) {
      const metaDescription = document.getElementById('meta-description');
      if (metaDescription) metaDescription.setAttribute('content', description);
      
      const ogDescription = document.getElementById('meta-og-description');
      if (ogDescription) ogDescription.setAttribute('content', description);
      
      const twitterDescription = document.getElementById('meta-twitter-description');
      if (twitterDescription) twitterDescription.setAttribute('content', description);
    }

    // Update URL
    if (url) {
      const ogUrl = document.getElementById('meta-og-url');
      if (ogUrl) ogUrl.setAttribute('content', url);
    }
  }, [title, description, url]);
};
