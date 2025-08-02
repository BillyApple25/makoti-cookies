
'use client';

export default function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=cozy%20home%20bakery%20kitchen%20with%20warm%20earth%20tones%2C%20wooden%20countertops%20covered%20with%20fresh%20baked%20cookies%2C%20baking%20ingredients%20scattered%20around%2C%20flour%20in%20the%20air%2C%20vintage%20baking%20tools%2C%20rustic%20charm%2C%20homemade%20atmosphere%2C%20artisanal%20cookie%20making%20process%2C%20golden%20brown%20amber%20lighting%2C%20intimate%20family%20kitchen%20setting%2C%20warm%20beige%20and%20brown%20color%20palette&width=1920&height=1080&seq=about-hero002&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-yellow-800/70"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-amber-100">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Über
            <span className="text-amber-200" style={{ fontFamily: 'Pacifico, serif' }}> uns</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Die Geschichte von Makoti Cookies begann mit einer einfachen Idee: die besten hausgemachten Cookies zu backen und Menschen glücklich zu machen.
          </p>
        </div>
      </div>
    </section>
  );
}
