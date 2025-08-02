'use client';

import { useState } from 'react';

export default function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState('alle');
  
  const categories = [
    { id: 'alle', name: 'Alle Beiträge', icon: 'ri-file-list-3-fill' },
    { id: 'rezepte', name: 'Rezepte', icon: 'ri-book-open-fill' },
    { id: 'tipps', name: 'Back-Tipps', icon: 'ri-lightbulb-fill' },
    { id: 'trends', name: 'Trends', icon: 'ri-trend-up-fill' },
    { id: 'geschichte', name: 'Geschichten', icon: 'ri-story-fill' },
    { id: 'gesundheit', name: 'Gesundheit', icon: 'ri-heart-pulse-fill' }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kategorien</h2>
          <p className="text-gray-600">Finden Sie Artikel zu Ihren Interessen</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'bg-amber-50 text-gray-700 hover:bg-amber-100'
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}