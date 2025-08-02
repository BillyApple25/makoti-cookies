
'use client';

export default function OurStory() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Unsere 
              <span className="text-amber-700" style={{ fontFamily: 'Pacifico, serif' }}>Geschichte</span>
            </h2>
            <div className="space-y-6 text-amber-800">
              <p className="text-lg">
                Alles begann 2019 in einer kleinen Küche in Berlin. INES, die Gründerin von Makoti Cookies, 
                hatte eine Leidenschaft für das Backen und den Traum, Menschen mit ihren hausgemachten Cookies 
                zu begeistern.
              </p>
              <p className="text-lg">
                Was als Hobby begann, wurde schnell zu etwas Größerem. Freunde und Familie konnten nicht genug 
                von den köstlichen Cookies bekommen, und so entstand die Idee, diese Leidenschaft mit der Welt 
                zu teilen.
              </p>
              <p className="text-lg">
                Heute, nach über 5 Jahren, ist Makoti Cookies zu einer beliebten Marke geworden, die für 
                Qualität, Frische und den authentischen Geschmack hausgemachter Cookies steht.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://readdy.ai/api/search-image?query=vintage%20photo%20style%20showing%20evolution%20of%20small%20bakery%2C%20before%20and%20after%20comparison%2C%20small%20home%20kitchen%20transforming%20into%20professional%20bakery%2C%20warm%20earth%20tones%20and%20amber%20sepia%20colors%2C%20nostalgic%20atmosphere%2C%20baking%20equipment%20evolution%2C%20family%20business%20growth%20story%2C%20artisanal%20cookie%20making%20journey%2C%20beige%20and%20brown%20color%20palette&width=600&height=600&seq=story002&orientation=squarish"
              alt="Unsere Geschichte"
              className="w-full h-96 object-cover object-top rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
