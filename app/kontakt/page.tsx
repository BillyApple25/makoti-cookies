'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import LocationMap from './LocationMap';

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ContactHero />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <ContactForm />
          <ContactInfo />
        </div>
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}