'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from './AboutHero';
import OurStory from './OurStory';
import TeamSection from './TeamSection';
import Values from './Values';

export default function UberUns() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <OurStory />
        <Values />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}