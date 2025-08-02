
'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { useProducts } from '@/hooks/useProducts';
import { ReviewService } from '@/services/firebase/reviewService';
import StarRating from '@/components/StarRating';

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const [visibleProducts] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [productRatings, setProductRatings] = useState<{ [key: string]: { rating: number; reviewCount: number } }>({});

  // Load ratings for products
  const loadProductRatings = async () => {
    if (products.length === 0) return;
    
    const ratingsPromises = products.slice(0, 8).map(async (product) => {
      try {
        const rating = await ReviewService.getProductRating(product.id);
        return { productId: product.id, rating };
      } catch (error) {
        console.error(`Error loading rating for product ${product.id}:`, error);
        return { productId: product.id, rating: { rating: 0, reviewCount: 0 } };
      }
    });

    const ratings = await Promise.all(ratingsPromises);
    const ratingsMap = ratings.reduce((acc, { productId, rating }) => {
      acc[productId] = rating;
      return acc;
    }, {} as { [key: string]: { rating: number; reviewCount: number } });

    setProductRatings(ratingsMap);
  };

  // Load ratings when products are loaded
  useEffect(() => {
    loadProductRatings();
  }, [products]);

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
      console.log('Produit ajouté au panier avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erreur lors du chargement des produits: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Unsere <span className="text-amber-600 font-pacifico">Beliebtesten Cookies</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handgebacken mit Liebe und den besten Zutaten - jeder Bissen ein Genuss
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => {
            const rating = productRatings[product.id] || { rating: 0, reviewCount: 0 };
            return (
              <div 
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  visibleProducts.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover object-center transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(product.name + ' cookie')}&width=400&height=300&seq=${product.id}&orientation=landscape`;
                    }}
                  />
                  
                  {/* Badges */}
                  {product.isNew && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Neu
                    </div>
                  )}
                  {product.isBestseller && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Bestseller
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    {rating.reviewCount > 0 ? (
                      <StarRating 
                        rating={rating.rating} 
                        reviewCount={rating.reviewCount}
                        size="sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Noch keine Bewertungen</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">
                      €{product.price.toFixed(2)}
                    </span>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors font-semibold"
                    >
                      In den Warenkorb
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
