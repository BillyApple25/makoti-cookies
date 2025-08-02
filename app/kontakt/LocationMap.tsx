'use client';

export default function LocationMap() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Besuchen Sie uns
          </h2>
          <p className="text-lg text-gray-600">
            Finden Sie uns im Herzen von Berlin
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.6842384935895!2d13.3777747!3d52.5194817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c655f20989%3A0x26bbfb4e84674c63!2sBrandenburger%20Tor!5e0!3m2!1sde!2sde!4v1635789876543!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-map-pin-fill text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Adresse</h3>
                <p className="text-gray-600">Bäckerstraße 12<br />10115 Berlin</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-subway-fill text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Öffentliche Verkehrsmittel</h3>
                <p className="text-gray-600">U-Bahn: Brandenburger Tor<br />S-Bahn: Unter den Linden</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-car-fill text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Parken</h3>
                <p className="text-gray-600">Parkhaus Unter den Linden<br />2 Minuten Fußweg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}