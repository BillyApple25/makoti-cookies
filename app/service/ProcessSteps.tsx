'use client';

export default function ProcessSteps() {
  const steps = [
    {
      number: '01',
      title: 'Anfrage stellen',
      description: 'Kontaktieren Sie uns mit Ihren Wünschen und Anforderungen',
      icon: 'ri-phone-fill'
    },
    {
      number: '02',
      title: 'Beratung',
      description: 'Wir beraten Sie persönlich und erstellen ein maßgeschneidertes Angebot',
      icon: 'ri-chat-3-fill'
    },
    {
      number: '03',
      title: 'Produktion',
      description: 'Unsere Bäcker stellen Ihre Cookies frisch und nach Ihren Wünschen her',
      icon: 'ri-hammer-fill'
    },
    {
      number: '04',
      title: 'Lieferung',
      description: 'Pünktliche Lieferung oder Abholung zum gewünschten Termin',
      icon: 'ri-truck-fill'
    }
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unser 
            <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>Prozess</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            So einfach funktioniert die Zusammenarbeit mit uns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${step.icon} text-2xl text-white`}></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}