
'use client';

export default function Values() {
  const values = [
    {
      icon: 'ri-heart-fill',
      title: 'Leidenschaft',
      description: 'Jeder Cookie wird mit Liebe und Hingabe gebacken'
    },
    {
      icon: 'ri-leaf-fill',
      title: 'Qualität',
      description: 'Nur die besten natürlichen Zutaten kommen in unsere Küche'
    },
    {
      icon: 'ri-community-fill',
      title: 'Gemeinschaft',
      description: 'Wir schaffen Momente der Freude und des Zusammenseins'
    },
    {
      icon: 'ri-award-fill',
      title: 'Exzellenz',
      description: 'Höchste Standards in jedem Aspekt unserer Arbeit'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-100 to-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Unsere 
            <span className="text-amber-700" style={{ fontFamily: 'Pacifico, serif' }}>Werte</span>
          </h2>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            Diese Grundprinzipien leiten uns bei allem, was wir tun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-amber-200">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-amber-700 to-yellow-600 text-white rounded-full mx-auto mb-6">
                <i className={`${value.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-4">{value.title}</h3>
              <p className="text-amber-800">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
