'use client';

interface PricingPackage {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  color: string;
  popular?: boolean;
}

export default function ServicePricing() {
  const packages: PricingPackage[] = [
    {
      name: 'Basis Paket',
      price: '3.00',
      unit: 'pro Cookie',
      description: 'Perfekt für kleinere Bestellungen',
      features: [
        'Mindestbestellung: 12 Cookies',
        'Standard Verpackung',
        'Lieferung innerhalb 2-3 Tagen',
        'Grundauswahl an Sorten'
      ],
      color: 'bg-gray-100'
    },
    {
      name: 'Premium Paket',
      price: '2.50',
      unit: 'pro Cookie',
      description: 'Ideal für mittelgroße Events',
      features: [
        'Mindestbestellung: 25 Cookies',
        'Elegante Geschenkverpackung',
        'Lieferung innerhalb 2-3 Tagen',
        'Alle Sorten verfügbar',
        'Persönliche Beratung'
      ],
      color: 'bg-amber-50',
      popular: true
    },
    {
      name: 'Business Paket',
      price: '2.00',
      unit: 'pro Cookie',
      description: 'Für große Events und Firmen',
      features: [
        'Mindestbestellung: 50 Cookies',
        'Individuelle Verpackung',
        'Express-Lieferung möglich',
        'Personalisierte Cookies',
        'Dedicated Account Manager',
        'Alle Sorten verfügbar'
      ],
      color: 'bg-amber-100'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unsere 
            <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>Preise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparente Preise für alle Ihre Cookie-Bedürfnisse - von kleinen Bestellungen bis zu großen Events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${pkg.color} ${
                pkg.popular 
                  ? 'ring-2 ring-amber-600 ring-offset-2 transform scale-105' 
                  : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Beliebt
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{pkg.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-amber-600">€{pkg.price}</span>
                  <span className="text-gray-600 ml-2">{pkg.unit}</span>
                </div>
                
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <i className="ri-check-line text-amber-600 mr-3 text-lg"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-full font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-600 hover:text-white'
                }`}>
                  Jetzt bestellen
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Brauchen Sie eine individuelle Lösung? Kontaktieren Sie uns für ein persönliches Angebot.
          </p>
          <button className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold">
            Individuelle Beratung
          </button>
        </div>
      </div>
    </section>
  );
}