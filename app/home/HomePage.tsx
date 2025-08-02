'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import MonthlySpecials from './MonthlySpecials';
import Testimonials from './Testimonials';
import AboutSection from './AboutSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <MonthlySpecials />
        <AboutSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
} 