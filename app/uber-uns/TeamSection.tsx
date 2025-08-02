
'use client';

export default function TeamSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-800 to-yellow-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-100 mb-6">
            Wer bin
            <span className="text-amber-200" style={{ fontFamily: 'Pacifico, serif' }}> ich</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <img 
                  src="https://readdy.ai/api/search-image?query=professional%20female%20baker%20CEO%20smiling%20warmly%2C%20elegant%20business%20portrait%2C%20confident%20leadership%20expression%2C%20warm%20earth%20tones%20background%2C%20modern%20professional%20headshot%2C%20skilled%20artisan%20appearance%2C%20friendly%20approachable%20demeanor%2C%20natural%20lighting%2C%20high%20quality%20portrait%20photography%20style&width=300&height=400&seq=ceo001&orientation=portrait"
                  alt="INES - Gründerin"
                  className="w-full h-80 object-cover object-top rounded-2xl shadow-lg mx-auto"
                />
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">INES</h3>
                  <p className="text-amber-700 font-medium text-lg">Gründerin & CEO</p>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <blockquote className="text-lg md:text-xl text-amber-900 italic leading-relaxed">
                    "Es ist mir eine Freude, Ihnen diesen süßen Trost als Nachtisch oder Dessert anbieten zu können. 
                    Ich habe meinen Weg gefunden und jeder Moment, den ich mit der Kreation dieser Köstlichkeiten 
                    verbringe, ist ein reines Vergnügen."
                  </blockquote>
                  
                  <div className="text-amber-800 space-y-4">
                    <p>
                      Bevor ich mit der Herstellung der Makoti Cookies begann, war ich im Vertrieb tätig. Es war 
                      schwierig, einen Job in der Stadt zu finden, der zu den idealen Arbeitszeiten für meine Kinder 
                      passte.
                    </p>
                    <p>
                      Meine Leidenschaft für das Backen hat mich dazu gebracht, nicht mehr zu versuchen, mich in einer 
                      Welt zurechtzufinden, in der man fast dafür kritisiert wird, dass man Kinder hat.
                    </p>
                    <p>
                      Ich hörte auf mein Herz und ging das Risiko ein, meine eigene Cookiesfirma zu gründen. 
                      So begann mein Abenteuer in der Welt des köstlichen Mehls. Meine Cookies sind außer knusprig 
                      und innen zart schmelzend, sie sind Wunder, die nach einem anstrengenden Tag neue Kraft geben.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
