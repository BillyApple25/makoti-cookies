'use client';

export default function BlogHero() {
  return (
    <section className="relative min-h-96 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=cozy%20reading%20corner%20with%20cookie%20recipes%20books%2C%20baking%20journal%2C%20warm%20lighting%2C%20coffee%20cup%2C%20scattered%20cookie%20ingredients%2C%20vintage%20cookbook%20collection%2C%20writing%20desk%2C%20inspirational%20baking%20atmosphere%2C%20creative%20workspace&width=1920&height=600&seq=blog-hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Unser 
            <span className="text-amber-400" style={{ fontFamily: 'Pacifico, serif' }}>Blog</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Entdecken Sie Rezepte, Back-Tipps und die neuesten Trends aus der Welt der Cookies
          </p>
        </div>
      </div>
    </section>
  );
}