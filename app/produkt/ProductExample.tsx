'use client';

import React, { useState, useEffect } from 'react';
import { QuickStarRating } from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';
import { ReviewService } from '@/services/firebase/reviewService';
import { useAuthContext } from '@/components/AuthProvider';
import { FirebaseProduct, Review } from '@/types/firebase';

interface ProductExampleProps {
  product: FirebaseProduct;
}

const ProductExample: React.FC<ProductExampleProps> = ({ product }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [productRating, setProductRating] = useState({ rating: 0, reviewCount: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canUserReview, setCanUserReview] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les données du produit
  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      
      try {
        // Charger la note moyenne
        const rating = await ReviewService.getProductRating(product.id);
        setProductRating(rating);

        // Charger les reviews
        const productReviews = await ReviewService.getReviewsByProductId(product.id);
        setReviews(productReviews);

        // Vérifier si l'utilisateur peut laisser un avis
        if (isAuthenticated && user) {
          const reviewableProducts = await ReviewService.getProductsUserCanReview(user.uid);
          setCanUserReview(reviewableProducts.includes(product.id));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données produit:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [product.id, isAuthenticated, user]);

  const handleReviewSubmitted = async () => {
    // Actualiser les données après soumission d'un avis
    try {
      const updatedRating = await ReviewService.getProductRating(product.id);
      const updatedReviews = await ReviewService.getReviewsByProductId(product.id);
      
      setProductRating(updatedRating);
      setReviews(updatedReviews);
      setCanUserReview(false); // L'utilisateur ne peut plus reviewer après avoir soumis
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header du produit */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* 🌟 Affichage de la note */}
            <div className="mb-6">
              <QuickStarRating
                rating={productRating.rating}
                reviewCount={productRating.reviewCount}
                size="lg"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-amber-600">
                €{product.price.toFixed(2)}
              </span>
              
              {/* Bouton d'avis */}
              {isAuthenticated && canUserReview && (
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  ⭐ Laisser un avis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section des avis */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Avis clients ({productRating.reviewCount})
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun avis pour le moment
            </h3>
            <p className="text-gray-500">
              Soyez le premier à partager votre expérience !
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.userName}
                      </h4>
                      <QuickStarRating
                        rating={review.rating}
                        reviewCount={0}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    {review.createdAt && new Date(review.createdAt.seconds * 1000).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed ml-13">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'avis */}
      {isAuthenticated && user && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          productId={product.id}
          productName={product.name}
          productImage={product.imageUrl}
          userId={user.uid}
          userName={user.displayName || 'Anonyme'}
          userEmail={user.email || ''}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default ProductExample; 