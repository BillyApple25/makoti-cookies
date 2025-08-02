'use client';

export default function ContactHero() {
  return (
    <section className="relative min-h-96 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=welcoming%20bakery%20storefront%20with%20warm%20lighting%2C%20customer%20service%20counter%2C%20friendly%20atmosphere%2C%20contact%20information%20display%2C%20cozy%20interior%2C%20professional%20service%20area%2C%20inviting%20entrance%2C%20modern%20bakery%20design&width=1920&height=600&seq=contact-hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-amber-400" style={{ fontFamily: 'Pacifico, serif' }}>Kontakt</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Wir freuen uns auf Ihre Nachricht! Kontaktieren Sie uns für Bestellungen, Fragen oder einfach nur zum Plaudern über Cookies.
          </p>
        </div>
      </div>
    </section>
  );
}