'use client';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: 'ri-phone-fill',
      title: 'Telefon',
      info: '+49 30 123 456 789',
      description: 'Mo-Fr: 9:00-18:00 Uhr',
      action: 'tel:+4930123456789'
    },
    {
      icon: 'ri-mail-fill',
      title: 'E-Mail',
      info: 'hallo@makoti-cookies.de',
      description: 'Wir antworten innerhalb 24h',
      action: 'mailto:hallo@makoti-cookies.de'
    },
    {
      icon: 'ri-map-pin-fill',
      title: 'Adresse',
      info: 'Bäckerstraße 12, 10115 Berlin',
      description: 'Abholung nach Terminvereinbarung',
      action: 'https://maps.google.com'
    },
    {
      icon: 'ri-time-fill',
      title: 'Öffnungszeiten',
      info: 'Mo-Fr: 9:00-18:00',
      description: 'Sa: 10:00-16:00, So: geschlossen',
      action: null
    }
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Kontaktinformationen
          </h2>
          <p className="text-lg text-gray-600">
            Verschiedene Wege, um mit uns in Kontakt zu treten
          </p>
        </div>

        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className={`${method.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{method.title}</h3>
                  {method.action ? (
                    <a 
                      href={method.action}
                      className="text-amber-600 hover:text-amber-700 font-medium text-lg cursor-pointer"
                    >
                      {method.info}
                    </a>
                  ) : (
                    <span className="text-gray-800 font-medium text-lg">{method.info}</span>
                  )}
                  <p className="text-gray-600 mt-1">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Folgen Sie uns
          </h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
              <i className="ri-facebook-fill text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
              <i className="ri-instagram-line text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
              <i className="ri-twitter-line text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
              <i className="ri-youtube-line text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}