
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useProducts } from '@/hooks/useProducts';
import { useAuthContext } from '@/components/AuthProvider';
import { ReviewService } from '@/services/firebase/reviewService';
import { FirebaseProduct } from '@/types/firebase';
import { QuickStarRating } from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';
import ProductReviews from '@/components/ProductReviews';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function ProductGrid() {
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const { user, isAuthenticated } = useAuthContext();
  const [visibleProducts, setVisibleProducts] = useState<number[]>([]);
  const [productRatings, setProductRatings] = useState<Record<string, { rating: number; reviewCount: number }>>({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FirebaseProduct | null>(null);
  const [userCanReviewProducts, setUserCanReviewProducts] = useState<string[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ⚡ Load product ratings - Version optimisée avec requête groupée
  useEffect(() => {
    const loadProductRatings = async () => {
      if (products.length === 0) {
        console.log('⏳ ProductGrid - Aucun produit chargé, skip ratings');
        return;
      }
      
      console.log('🌟 ProductGrid - Chargement optimisé des ratings pour', products.length, 'produits...');
      
      try {
        const productIds = products.map(p => p.id);
        console.log('📦 ProductGrid - IDs des produits:', productIds);
        
        // Utiliser la méthode optimisée pour récupérer tous les ratings d'un coup
        const ratingsMap = await ReviewService.getMultipleProductRatings(productIds);
        
        console.log('📊 ProductGrid - Ratings reçus:', ratingsMap);
        
        // Vérifier si on a des ratings non-zéro
        const hasRatings = Object.values(ratingsMap).some(r => r.reviewCount > 0);
        console.log('🎯 ProductGrid - A des ratings non-zéro:', hasRatings);
        
        // Debug ultra-détaillé
        if (hasRatings) {
          console.log('🎉 ProductGrid - RATINGS TROUVÉS! Détails:');
          Object.entries(ratingsMap).forEach(([productId, rating]) => {
            if (rating.reviewCount > 0) {
              const product = products.find(p => p.id === productId);
              console.log(`  ⭐ ${product?.name} (${productId}): ${rating.rating}★ (${rating.reviewCount} avis)`);
            }
          });
        } else {
          console.log('❌ ProductGrid - AUCUN RATING TROUVÉ!');
          console.log('🔍 ProductGrid - Vérifiez que les reviews existent dans Firestore');
        }
        
        setProductRatings(ratingsMap);
        
      } catch (error) {
        console.error('❌ ProductGrid - Erreur lors du chargement des ratings:', error);
        // Initialiser avec des valeurs par défaut en cas d'erreur
        const defaultRatings = products.reduce((acc, product) => {
          acc[product.id] = { rating: 0, reviewCount: 0 };
          return acc;
        }, {} as Record<string, { rating: number; reviewCount: number }>);
        setProductRatings(defaultRatings);
      }
    };

    loadProductRatings();
  }, [products]);

  // Load products user can review
  useEffect(() => {
    const loadUserReviewableProducts = async () => {
      if (isAuthenticated && user) {
        try {
          const reviewableProducts = await ReviewService.getProductsUserCanReview(user.uid);
          setUserCanReviewProducts(reviewableProducts);
        } catch (error) {
          console.error('Error loading reviewable products:', error);
        }
      }
    };

    loadUserReviewableProducts();
  }, [isAuthenticated, user]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleProducts((prev) => [...prev, index]);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products]);

  const handleAddToCart = async (e: React.MouseEvent, product: FirebaseProduct) => {
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

  const handleProductClick = async (product: FirebaseProduct) => {
    setSelectedProduct(product);
    setProductDetailModalOpen(true);
  };

  const handleReviewClick = async (e: React.MouseEvent, product: FirebaseProduct) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      // Could show login modal here
      alert('Sie müssen angemeldet sein, um Bewertungen zu hinterlassen.');
      return;
    }

    // Check if user can review this product
    if (userCanReviewProducts.includes(product.id)) {
      setSelectedProduct(product);
      setReviewModalOpen(true);
    } else {
      alert('Sie können nur Produkte bewerten, die Sie gekauft und erhalten haben.');
    }
  };

  const handleReviewSubmitted = async () => {
    console.log('🎉 ProductGrid - Review soumise, mise à jour en cours...');
    setReviewModalOpen(false);
    
    // Attendre un petit délai pour la synchronisation Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh product ratings
    if (selectedProduct) {
      try {
        console.log('🔄 ProductGrid - Rechargement du rating pour:', selectedProduct.name);
        const updatedRating = await ReviewService.getProductRating(selectedProduct.id);
        console.log('✅ ProductGrid - Nouveau rating:', updatedRating);
        
        setProductRatings(prev => ({
          ...prev,
          [selectedProduct.id]: updatedRating
        }));
      } catch (error) {
        console.error('❌ ProductGrid - Erreur refreshing rating:', error);
      }
    }

    // Refresh reviewable products
    if (user) {
      try {
        const reviewableProducts = await ReviewService.getProductsUserCanReview(user.uid);
        setUserCanReviewProducts(reviewableProducts);
        console.log('🔄 ProductGrid - Produits reviewables mis à jour:', reviewableProducts);
      } catch (error) {
        console.error('❌ ProductGrid - Erreur refreshing reviewable products:', error);
      }
    }

    // Reopen product detail modal to show updated reviews
    console.log('📖 ProductGrid - Réouverture du modal avec les nouvelles données');
    setProductDetailModalOpen(true);
  };



  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" message="Chargement des produits..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unsere <span className="text-amber-600 font-pacifico">Cookie-Auswahl</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Entdecken Sie unsere vielfältige Auswahl an handgebackenen Cookies - jeder mit seiner eigenen besonderen Note
          </p>
          


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {products.map((product, index) => {
            const rating = productRatings[product.id] || { rating: 0, reviewCount: 0 };
            const canReview = userCanReviewProducts.includes(product.id);
            
            // 🔍 DEBUG CONDITION D'AFFICHAGE
            if (index < 3) { // Log les 3 premiers produits
              console.log(`\n🖼️ PRODUIT ${index + 1}: "${product.name}"`);
              console.log(`   📦 ProductId: ${product.id}`);
              console.log(`   ⭐ Rating object:`, rating);
              console.log(`   📊 rating.rating: ${rating.rating}`);
              console.log(`   📈 rating.reviewCount: ${rating.reviewCount}`);
              console.log(`   🧮 Type de reviewCount: ${typeof rating.reviewCount}`);
              console.log(`   ✅ Condition (reviewCount > 0): ${rating.reviewCount > 0}`);
              console.log(`   🎨 Affichage: ${rating.reviewCount > 0 ? 'JAUNE' : 'GRIS'}`);
            }
            
            return (
              <div
                key={product.id}
                                 ref={(el) => { productRefs.current[index] = el; }}
                data-index={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  visibleProducts.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                onClick={() => handleProductClick(product)}
              >
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-64 object-cover object-center transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(product.name + ' cookie')}&width=400&height=300&seq=${product.id}&orientation=landscape`;
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                        Neu
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Bestseller
                      </span>
                    )}

                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                  
                  {/* ⭐ AFFICHAGE PROFESSIONNEL DES ÉTOILES */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <QuickStarRating
                      rating={rating.rating}
                      reviewCount={rating.reviewCount}
                      size="md"
                    />
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

        {/* No products message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Keine Produkte verfügbar.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productImage={selectedProduct.imageUrl}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          onReviewSubmitted={handleReviewSubmitted}
          userId={user?.uid || ''}
          userName={user?.displayName || 'Anonyme'}
          userEmail={user?.email || ''}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 transition-opacity ${
            productDetailModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => {
            setProductDetailModalOpen(false);
            setSelectedProduct(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.name}</h2>
                <button
                  onClick={() => {
                    setProductDetailModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(selectedProduct.name + ' cookie')}&width=400&height=300&seq=${selectedProduct.id}&orientation=landscape`;
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {selectedProduct.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Neu
                      </span>
                    )}
                    {selectedProduct.isBestseller && (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="mb-6">
                    {productRatings[selectedProduct.id]?.reviewCount > 0 ? (
                      <QuickStarRating 
                        rating={productRatings[selectedProduct.id].rating} 
                        reviewCount={productRatings[selectedProduct.id].reviewCount}
                        size="lg"
                      />
                    ) : (
                      <p className="text-gray-500">Noch keine Bewertungen</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-amber-600">
                      €{selectedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex gap-3">

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(e, selectedProduct);
                        }}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                      >
                        In den Warenkorb
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔧 Reviews Section - Version Directe et Simple */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Kundenbewertungen</h3>
                </div>

                {/* Affichage basé sur les données qu'on a déjà */}
                {productRatings[selectedProduct.id]?.reviewCount > 0 ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <QuickStarRating 
                        rating={productRatings[selectedProduct.id].rating} 
                        reviewCount={productRatings[selectedProduct.id].reviewCount}
                        size="lg"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Basiert auf {productRatings[selectedProduct.id].reviewCount} Bewertung{productRatings[selectedProduct.id].reviewCount !== 1 ? 'en' : ''}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      ✅ Dieses Produkt wurde bereits von Kunden bewertet und empfohlen!
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">⭐</div>
                    <p className="text-gray-600 mb-2">Noch keine Bewertungen für {selectedProduct.name}.</p>
                    <p className="text-sm text-gray-500">
                      Seien Sie der Erste, der dieses Produkt bewertet!
                    </p>
                  </div>
                )}

                {/* Messages pour utilisateurs non connectés */}
                {!isAuthenticated && (
                  <p className="text-sm text-amber-600 mt-4 text-center">
                    Melden Sie sich an, um eine Bewertung zu hinterlassen.
                  </p>
                )}

                {isAuthenticated && !userCanReviewProducts.includes(selectedProduct.id) && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Sie können nur Produkte bewerten, die Sie gekauft und erhalten haben.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
