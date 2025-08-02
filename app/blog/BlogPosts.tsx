
'use client';

import React, { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  readTime: string;
}

export default function BlogPosts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Die Kunst des perfekten Chocolate Chip Cookies',
      excerpt: 'Entdecken Sie die Geheimnisse für die perfekte Textur und den unwiderstehlichen Geschmack unserer beliebten Chocolate Chip Cookies.',
      category: 'Rezepte',
      date: '15. März 2024',
      author: 'Marie Schmidt',
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=250&fit=crop',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Saisonale Cookie-Kreationen für den Frühling',
      excerpt: 'Frische Frühlingsaromen in handgemachten Cookies - von Zitrone bis Erdbeere, entdecken Sie unsere saisonalen Spezialitäten.',
      category: 'Saisonal',
      date: '12. März 2024',
      author: 'Anna Weber',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=250&fit=crop',
      readTime: '4 min'
    },
    {
      id: 3,
      title: 'Cookie-Verpackung für besondere Anlässe',
      excerpt: 'Kreative Verpackungsideen für Ihre Cookie-Geschenke - von Geburtstagen bis zu Hochzeiten, machen Sie jeden Moment besonders.',
      category: 'Geschenke',
      date: '10. März 2024',
      author: 'Lisa Müller',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
      readTime: '3 min'
    },
    {
      id: 4,
      title: 'Die Geschichte der Makoti Cookies',
      excerpt: 'Erfahren Sie mehr über die Entstehung unserer Marke und die Leidenschaft, die hinter jedem handgemachten Cookie steckt.',
      category: 'Über uns',
      date: '8. März 2024',
      author: 'Tom Fischer',
      imageUrl: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=250&fit=crop',
      readTime: '6 min'
    },
    {
      id: 5,
      title: 'Cookies für Diabetiker - Gesunde Alternativen',
      excerpt: 'Zuckerfreie und diabetikerfreundliche Cookie-Optionen, die trotzdem unglaublich lecker schmecken.',
      category: 'Gesundheit',
      date: '5. März 2024',
      author: 'Dr. Sarah Klein',
      imageUrl: 'https://images.unsplash.com/photo-1590080962867-7cd7ad93c0e7?w=400&h=250&fit=crop',
      readTime: '7 min'
    },
    {
      id: 6,
      title: 'Cookie-Trends 2024: Was ist angesagt?',
      excerpt: 'Die neuesten Cookie-Trends des Jahres - von exotischen Geschmacksrichtungen bis zu innovativen Formen.',
      category: 'Trends',
      date: '2. März 2024',
      author: 'Max Richter',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=250&fit=crop',
      readTime: '5 min'
    }
  ];

  // Categories derived from posts  
  const categories = ['Alle', ...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = selectedCategory === 'Alle' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unser 
            <span className="text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Entdecken Sie Rezepte, Tipps und Geschichten rund um unsere handgemachten Cookies
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                  Weiterlesen →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No posts message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {selectedCategory === 'Alle' 
                ? 'Keine Blog-Posts verfügbar.' 
                : `Keine Posts in der Kategorie "${selectedCategory}" gefunden.`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}