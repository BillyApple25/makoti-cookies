'use client';

export default function ProductHero() {
  return (
    <section className="relative min-h-96 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=beautiful%20display%20of%20various%20artisanal%20cookies%20arranged%20on%20rustic%20wooden%20shelves%2C%20different%20types%20and%20flavors%2C%20chocolate%20chip%2C%20oatmeal%2C%20butter%20cookies%2C%20professional%20bakery%20display%2C%20warm%20golden%20lighting%2C%20appetizing%20presentation%2C%20variety%20of%20textures%20and%20colors%2C%20premium%20quality%20cookies&width=1920&height=600&seq=prod-hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Unsere
            <span className="text-amber-400" style={{ fontFamily: 'Pacifico, serif' }}> Produkte</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Entdecken Sie unsere vielfältige Auswahl an handgebackenen Cookies, die jeden Geschmack treffen
          </p>
        </div>
      </div>
    </section>
  );
}