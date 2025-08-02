'use client';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
  imageUrl: string;
}

export default function ServiceOfferings() {
  const services: Service[] = [
    {
      title: 'Event-Catering',
      description: 'Perfekte Cookie-Auswahl für Ihre Veranstaltungen, Hochzeiten und Feiern',
      icon: 'ri-calendar-event-fill',
      features: ['Mindestbestellung: 50 Cookies', 'Individuelle Verpackung', 'Termingerechte Lieferung', 'Beratung vor Ort'],
      imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop'
    },
    {
      title: 'Firmen-Bestellungen',
      description: 'Regelmäßige Lieferungen für Büros, Meetings und Firmenveranstaltungen',
      icon: 'ri-building-fill',
      features: ['Mengenrabatte verfügbar', 'Wöchentliche Lieferungen', 'Rechnung auf Firma', 'Individuelle Auswahl'],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop'
    },
    {
      title: 'Personalisierte Cookies',
      description: 'Maßgeschneiderte Cookies mit Ihrem Logo oder besonderen Designs',
      icon: 'ri-brush-fill',
      features: ['Logo-Cookies möglich', 'Spezielle Formen', 'Individuelle Farben', 'Minimum 25 Stück'],
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop'
    },
    {
      title: 'Geschenk-Service',
      description: 'Wunderschön verpackte Cookie-Geschenke für jeden Anlass',
      icon: 'ri-gift-fill',
      features: ['Elegante Geschenkboxen', 'Persönliche Grußkarten', 'Direktversand möglich', 'Saisonale Verpackungen'],
      imageUrl: 'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?w=500&h=300&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unsere 
            <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wir bieten maßgeschneiderte Cookie-Lösungen für jeden Bedarf und jeden Anlass
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-amber-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title}
                    className="w-full h-64 md:h-full object-cover object-top"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-amber-600 text-white rounded-full mb-4">
                    <i className={`${service.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <i className="ri-check-line text-amber-600 mr-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold whitespace-nowrap cursor-pointer">
                    Mehr erfahren
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}