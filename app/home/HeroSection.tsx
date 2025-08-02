'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=warm%20cozy%20kitchen%20scene%20with%20freshly%20baked%20cookies%20cooling%20on%20wooden%20counter%2C%20soft%20natural%20lighting%20streaming%20through%20window%2C%20rustic%20home%20bakery%20atmosphere%2C%20chocolate%20chip%20cookies%20and%20oatmeal%20cookies%20arranged%20beautifully%2C%20vintage%20baking%20utensils%2C%20flour%20dusted%20surface%2C%20warm%20golden%20lighting%20creating%20inviting%20homemade%20feel%2C%20artisanal%20bakery%20aesthetic%2C%20comfortable%20domestic%20setting&width=1920&height=1080&seq=hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hausgemachte<br />
            <span className="text-amber-400" style={{ fontFamily: 'Pacifico, serif' }}>
              Cookies
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Entdecken Sie unsere köstlichen, handgebackenen Cookies mit Liebe und den besten Zutaten zubereitet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produkt">
              <button className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer">
                Jetzt entdecken
              </button>
            </Link>
            <Link href="/uber-uns">
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors whitespace-nowrap cursor-pointer">
                Unsere Geschichte
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}