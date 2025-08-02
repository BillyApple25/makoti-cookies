'use client';

export default function ServiceHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=professional%20cookie%20catering%20service%20display%2C%20elegant%20presentation%20of%20various%20cookies%20on%20tiered%20stands%2C%20event%20setup%2C%20corporate%20catering%2C%20beautiful%20arrangements%2C%20party%20dessert%20table%2C%20professional%20service%2C%20luxury%20presentation%2C%20high-end%20bakery%20service&width=1920&height=1080&seq=service-hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Unser
            <span className="text-amber-400" style={{ fontFamily: 'Pacifico, serif' }}> Service</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Von individuellen Bestellungen bis hin zu großen Events - wir bieten maßgeschneiderte Cookie-Lösungen für jeden Anlass
          </p>
          <button className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer">
            Jetzt Anfrage stellen
          </button>
        </div>
      </div>
    </section>
  );
}