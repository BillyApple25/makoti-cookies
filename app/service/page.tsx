'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceHero from './ServiceHero';
import ServiceOfferings from './ServiceOfferings';
import ProcessSteps from './ProcessSteps';
import ServicePricing from './ServicePricing';

export default function Service() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ServiceHero />
        <ServiceOfferings />
        <ProcessSteps />
        <ServicePricing />
      </main>
      <Footer />
    </div>
  );
}