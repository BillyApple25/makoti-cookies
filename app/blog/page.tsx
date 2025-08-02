
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogHero from './BlogHero';
import BlogPosts from './BlogPosts';

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogHero />
        <BlogPosts />
      </main>
      <Footer />
    </div>
  );
}