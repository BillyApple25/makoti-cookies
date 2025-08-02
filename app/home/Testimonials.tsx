'use client';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Mueller',
      role: 'Stammkundin',
      content: 'Die besten Cookies, die ich je probiert habe! Der Geschmack ist einfach unglaublich und man merkt, dass sie mit Liebe gemacht sind.',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Sarah+Mueller&background=f59e0b&color=fff&size=100'
    },
    {
      id: 2,
      name: 'Michael Weber',
      role: 'Cookie-Liebhaber',
      content: 'Makoti Cookies sind zu meiner wöchentlichen Tradition geworden. Die Qualität ist konstant hervorragend und der Service ist fantastisch.',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Michael+Weber&background=3b82f6&color=fff&size=100'
    },
    {
      id: 3,
      name: 'Lisa Schmidt',
      role: 'Food-Bloggerin',
      content: 'Als Food-Bloggerin habe ich viele Cookies probiert, aber diese sind etwas ganz Besonderes. Die Textur und der Geschmack sind perfekt!',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Lisa+Schmidt&background=ef4444&color=fff&size=100'
    },
    {
      id: 4,
      name: 'Thomas Bauer',
      role: 'Büro-Team',
      content: 'Wir bestellen regelmäßig für unser Büro. Die Cookies sind immer frisch und alle Kollegen lieben sie. Absolute Empfehlung!',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Thomas+Bauer&background=10b981&color=fff&size=100'
    },
    {
      id: 5,
      name: 'Anna Richter',
      role: 'Mutter von 3 Kindern',
      content: 'Meine Kinder sind begeistert von den Cookies! Endlich etwas Süßes, das nicht nur gut schmeckt, sondern auch qualitativ hochwertig ist.',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Anna+Richter&background=8b5cf6&color=fff&size=100'
    },
    {
      id: 6,
      name: 'Robert Klein',
      role: 'Event-Planer',
      content: 'Für unsere Events bestellen wir immer bei Makoti Cookies. Die Gäste sind jedes Mal begeistert von der Qualität und dem Geschmack.',
      rating: 5,
      imageUrl: 'https://ui-avatars.com/api/?name=Robert+Klein&background=f97316&color=fff&size=100'
    }
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Was unsere 
            <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>Kunden</span>
            sagen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Authentische Bewertungen von Cookie-Liebhabern, die unsere handgemachten Leckereien probiert haben
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}