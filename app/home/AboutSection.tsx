'use client';

import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Warum 
              <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}> Makoti </span>
              Cookies?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Seit über 5 Jahren backen wir mit Leidenschaft und Liebe die besten Cookies. 
              Jedes Rezept ist sorgfältig entwickelt und verwendet nur die hochwertigsten Zutaten.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full mr-4">
                  <i className="ri-heart-fill text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Mit Liebe gebacken</h3>
                  <p className="text-gray-600">Jeder Cookie wird von Hand gefertigt und mit Sorgfalt gebacken</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full mr-4">
                  <i className="ri-leaf-fill text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Natürliche Zutaten</h3>
                  <p className="text-gray-600">Nur die besten und frischesten Zutaten finden ihren Weg in unsere Küche</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full mr-4">
                  <i className="ri-time-fill text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Täglich frisch</h3>
                  <p className="text-gray-600">Alle Cookies werden täglich frisch gebacken für maximale Qualität</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/uber-uns">
                <button className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer">
                  Mehr über uns
                </button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://readdy.ai/api/search-image?query=professional%20baker%20woman%20in%20apron%20kneading%20cookie%20dough%20in%20bright%20modern%20kitchen%2C%20flour%20on%20wooden%20counter%2C%20baking%20tools%20around%2C%20warm%20natural%20lighting%2C%20homemade%20bakery%20atmosphere%2C%20artisanal%20cookie%20making%20process%2C%20ingredients%20like%20chocolate%20chips%20and%20oats%20visible%2C%20cozy%20domestic%20setting%2C%20skilled%20craftsperson%20at%20work&width=600&height=600&seq=about001&orientation=squarish"
              alt="Cookie-Herstellung"
              className="w-full h-96 object-cover object-top rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">5+</div>
                <div className="text-sm">Jahre Erfahrung</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}