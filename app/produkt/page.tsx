
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductHero from './ProductHero';
import ProductGrid from './ProductGrid';

export default function Produkt() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductHero />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
